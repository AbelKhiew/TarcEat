# TarcEat · Module 4/5 源代码中文讲解

> 本讲解对应当前 `TarcEat-main(2).zip` 的 JSON Development Stage。主要代码放在 `member-2/`。这不是已经部署的 Supabase 版本。

## 1. 你需要先认识的三个地方

```text
app/cart/page.tsx                             → Next.js 的 /cart 网址
member-2/module-5-checkout/screens/CartView.tsx → 顾客看到的界面
member-2/module-5-checkout/functions/addCartItem.ts → 真正处理购物车数据的函数
shared/storage/json/                          → 组长提供的 JSON 数据库操作
```

**Frontend / UI（`.tsx`）：** 给用户看按钮、输入框、订单卡片，收集输入并调用 function。

**Backend / Business Function（`.ts`）：** 验证数据、检查权限、计算价格和读写 JSON。每一个业务 function 单独一个文件，符合团队规则。

**Database（`data/*.json`）：** 开发阶段的本地数据。未来 Supabase 会替换 `shared/storage`，但 function 的输入输出尽量保持一致。

`'use client'` 表示 React Client Component，负责 button click、input state、`useEffect` 等；`'use server'` 表示 Next.js Server Function，代码只在服务器端执行，浏览器不能直接读取 JSON 文件。

## 2. Module 5 — 从空的购物车开始

### 2.1 `createCart.ts` — Create

```ts
await eligibleRestaurant(input.restaurantId);
const session = await readSession();
return store.create('carts', {
  id: randomUUID(),
  customerId: session.role === 'customer' ? session.profileId : null,
  restaurantId: input.restaurantId,
  mode: input.mode,
  tableToken: input.mode === 'dine_in' ? input.tableToken : null,
  lines: [],
  updatedAt: now(),
});
```

意思是：先确认餐厅可以接单；如果是 Dine-in，还要确认 Table QR 属于这个餐厅。然后建立新的购物车。`randomUUID()` 产生不容易猜到的 cart ID。

### 2.2 `addCartItem.ts` — Add

```ts
const item = await store.get('menuItems', input.itemId);
if (!item || item.restaurantId !== cart.restaurantId || item.archivedAt || !item.isAvailable)
  throw new RuleError('This menu item is unavailable at the selected restaurant.');
```

这段非常重要：客户不能偷偷把其他餐厅的 Menu Item 加入现在的 Cart，也不能加入 Sold Out 的食物。

接下来代码检查 `quantity` 是 1–99 的整数、`note` 不超过 250 字。如果同一食物与同一备注已经在 Cart，就把数量加上去，否则建立新的 `CartLine`。最后调用 `store.update('carts', ...)` 保存。

### 2.3 `getCart.ts` — Read

通过 `getCartAccess(cartId)` 读取 Cart；如果 Customer 已登录，只允许读取属于自己的 Cart。Guest Demo 用不可预测的 Cart ID 作为引用。

### 2.4 `updateCartItem.ts` — Update

将正确 `lineId` 的 Quantity 和 Special Request 替换，并再次验证输入值；不能提交 `0`、负数或过大数量。

### 2.5 `removeCartItem.ts` / `clearCart.ts` — Delete

Remove Item 使用 `.filter()` 只删除选中的 `lineId`；Clear Cart 将 `lines` 设为空数组。这两个动作只影响购物车，**不会删除已经创建的订单**。

### 2.6 `previewCheckout.ts` — Pricing

`previewCheckout` 调用 `priceCart(cart, input)`。

在 `member-2/internal/pricing.ts`，服务器重新读取每个 Menu Item 的真实 `priceSen`。不能相信前端传进来的价格，因为 Browser 数据可以被修改。

**计算方式**（按你们目标文件确认版）：

```text
Subtotal = Σ(unit price × quantity)
Discount = eligible voucher discount (one voucher maximum)
Tax = round((Subtotal − Discount) × Tax Rate)
Delivery Fee = restaurant's delivery fee (delivery only)
Grand Total = Subtotal − Discount + Tax + Delivery Fee
```

例如：2 × RM18.00 + 1 × RM6.00 = RM42.00，即 4200 sen；如果 Tax = 6%，那么 tax = 252 sen，Dine-in 总计 = 4452 sen（RM44.52）。

**为什么用 sen？** JavaScript 小数可能产生浮点误差。RM18.00 用整数 `1800` 存储，金额计算会比较稳。

## 3. Module 4 — 下单与处理

### 3.1 `submitOrder.ts` — Create Order

这是你最重要的一个函数，执行逻辑如下：

```text
Customer presses Place Order
  ↓
Check checkoutRequestId
  ↓
Has the same request already created an Order?
  ├─ Yes → return existing Order (prevents double submission)
  └─ No → continue
  ↓
Validate contact / delivery / pickup / payment method
  ↓
Call priceCart() to re-check prices and voucher
  ↓
For Dine-in: find or create open Table Visit
  ↓
Save Order (status = Pending)
  ↓
Save Order Items (copy item name and price)
  ↓
Pickup/Delivery: save simulated payment
  ↓
Record voucher use if applicable
  ↓
Clear cart and show Order Tracking
```

为什么要 `checkoutRequestId`？假设用户网络慢、连续按两次 Place Order：如果每次都创建新订单，厨房就会收到两张相同订单。用一个 Request ID，第二次可以返回之前的 Order。

**为什么复制 `itemName` 和 `unitPriceSen` 到 `orderItems`？** 因为 Restaurant Owner 以后可能改 Menu Price。旧订单收据仍应保留当时的价格。

### 3.2 `listRestaurantOrders.ts` / `getOrder.ts` — Read

- `listRestaurantOrders`：先调用 `ownedRestaurant(restaurantId)`，确认 Owner 真的拥有该餐厅才返回订单列表。
- `getOrder`：允许 Restaurant Owner、下单的 Customer，或者持有 Guest Tracking Token 的 Guest 查询指定订单。不给陌生人公开订单资料。

### 3.3 `updateOrderStatus.ts` — Update

```ts
if ((order.status === 'pending' && status === 'preparing') ||
    (order.status === 'preparing' && status === 'ready')) {
  return store.update('orders', order.id, { status });
}
```

只允许：`Pending → Preparing → Ready`。Pickup/Delivery 最后调用 `completeTakeawayOrder`；Dine-in 需要整张桌子一起 Finish/Paid。取消请求还没审核时，不允许直接去 Preparing。

### 3.4 `requestCancellation.ts` 和 `decideCancellation.ts`

Customer 只能在 Pending 阶段发出 Cancellation Request，不能直接将订单删除。Owner 决定 Approve / Reject。

Approve 时：订单改为 Cancelled；如果之前是模拟付款，记录模拟退款；如果用了 Voucher，标记这次兑换已撤销。Reject 时，订单仍为 Pending，Owner 可继续准备。

### 3.5 `getTableInvoice.ts` / `finishTableVisit.ts`

Dine-in 最特殊的规则是：**同一张 Table 的同一次 Visit，可以有多张 Order，但只生成一张合并 Invoice**。

`getTableInvoice(tableToken)` 会寻找当前 Open Visit 的所有非 Cancelled Orders，将 Subtotal、Tax、Discount 等相加。

Owner 确认收款后按 `Finish / Paid`：

- 必须所有剩余订单是 Ready。
- 所有 Cancellation Requests 必须处理完。
- 保存 Table Payment Record。
- 将相关订单改为 Completed。
- 将 Visit 改为 Closed（桌子恢复 Available）。
- 每个有资格的 Registered Customer 只获得一次 Loyalty Points。
- 创建一张 Receipt。再次按 Finish/Paid 返回同一张 Receipt，避免重复积分。

### 3.6 `completeTakeawayOrder.ts`

Pickup / Delivery 走模拟付款，Owner 将 Ready 订单设为 Completed，生成 Receipt，并在有资格时授予积分。

### 3.7 `archiveOrder.ts` — Delete in CRUD

这是 **Soft Delete**：将 `archivedAt` 设置为时间，而不是把旧订单从 JSON 硬删除。这样保留订单、收据及积分历史，更适合餐厅系统。

## 4. Unique Feature — Order Alert

现在 `KitchenQueue.tsx` 每 4 秒调用 `listRestaurantOrders`，比较之前见过的订单 ID：

- 如果有新的 `Pending` 订单，就显示闪烁 Banner。
- 如果 Owner 之前按过 Enable sound，会使用 Web Audio 播放短音。
- 切换餐厅时，旧餐厅订单记录会清空，以免错误提示。
- 不需要手动 Refresh 页面。

**重要：** 这是 JSON 阶段的 Demo Polling，不是真正的 Supabase Realtime。
真正 Unique Feature 要在之后连接 Supabase 时改成 `postgres_changes` 的 INSERT subscription，配合安全的 RLS。对应代码示例在 `member-2/SUPABASE_REALTIME_LATER.md`。

## 5. 怎样解释给 Lecturer？

可以用下面这一小段简单英文：

> I am responsible for Module 4, Multi-Channel Order Fulfillment, and Module 5, Shopping Cart and Checkout. Module 5 allows customers to add, update and remove food items before checkout. The server calculates the final total using the current menu price. When the customer confirms checkout, Module 4 creates a Pending order. Restaurant owners can update the order status, review cancellation requests and complete orders. For dine-in, multiple orders from the same table visit are combined into one invoice. My unique feature is the Real-Time Order Alert Engine. In the current JSON prototype, I demonstrate the notification interface with polling. The final version will use Supabase Realtime.

## 6. 你要知道的限制

本地 JSON 数据仓库每个文件单独写入，并不是完整 Database Transaction；跨文件的 Order/Payment/Visit/Points 仍需要未来的 Supabase Transaction / RPC。当前还不能声称真实 Supabase 运行、真实 Online Payment 或实际 UAT 已完成。
