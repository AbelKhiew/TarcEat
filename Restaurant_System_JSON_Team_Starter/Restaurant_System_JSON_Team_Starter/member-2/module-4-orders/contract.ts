import type * as T from "@/shared/types";

/** Strict completed-module contract. Scaffold implementations are intentionally not assigned here yet. */
export interface OrdersService {
  /** Return the signed-in customer order history; Module 6 delegates to this function. */
  listMyOrders(): Promise<T.ServiceResult<T.Order[]>>;
  /** Only order creator. Validate current catalog, restaurant, table and voucher; use request ID to prevent duplicates. */
  submitOrder(input: T.CheckoutInput): Promise<T.ServiceResult<T.SubmitOrderOutput>>;
  /** Owner access restricted to owned restaurants. */
  listRestaurantOrders(restaurantId: T.ID): Promise<T.ServiceResult<T.Order[]>>;
  /** Check signed-in customer/owner or guest tracking token. */
  getOrder(input: T.TrackingInput): Promise<T.ServiceResult<T.OrderDetails>>;
  /** Validate transition. Dine-in completion uses finishTableVisit; cancellation uses review. */
  updateOrderStatus(orderId: T.ID, status: T.OrderStatus): Promise<T.ServiceResult<T.Order>>;
  /** Only Pending; owner approval required. */
  requestCancellation(input: T.CancellationInput): Promise<T.ServiceResult<T.Order>>;
  /** Owner decides; approve records simulated refund when applicable and reverses voucher use. */
  decideCancellation(orderId: T.ID, approved: boolean): Promise<T.ServiceResult<T.Order>>;
  /** Expose whole current table bill without personal customer contact information. */
  getTableInvoice(tableToken: string): Promise<T.ServiceResult<T.TableInvoice>>;
  /** One Finish / Paid. Complete remaining Ready orders, close visit, award points once and create one receipt atomically. Retry returns existing receipt. */
  finishTableVisit(visitId: T.ID): Promise<T.ServiceResult<T.Receipt>>;
  /** Complete eligible pickup/delivery order and award points once. */
  completeTakeawayOrder(orderId: T.ID): Promise<T.ServiceResult<T.Order>>;
  /** Authorised receipt read; preserve snapshot totals. */
  getReceipt(receiptId: T.ID): Promise<T.ServiceResult<T.Receipt>>;
  /** Archive eligible completed/cancelled orders, never erase history. */
  archiveOrder(orderId: T.ID): Promise<T.ServiceResult<T.Order>>;
}
