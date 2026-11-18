import type * as M from './models';
export interface RegisterAccountInput { fullName: string; email: string; phone: string; password: string; }
export interface SignInInput { email: string; password: string; accountType: 'owner' | 'customer' | 'root_admin'; }
export type RestaurantApplicationInput = Pick<M.RestaurantApplication, 'restaurantName' | 'address' | 'contactPhone' | 'bio'>;
export type RestaurantUpdateInput = Pick<M.Restaurant, 'name' | 'address' | 'phone' | 'bio' | 'isOpen' | 'taxRateBps' | 'deliveryFeeSen'>;
export type CategoryInput = Pick<M.Category, 'name'>;
export type MenuItemInput = Pick<M.MenuItem, 'categoryId' | 'name' | 'description' | 'priceSen' | 'imageUrl' | 'isAvailable'>;
export interface TableInput { tableNumber: number; }
export interface TableBatchInput { startNumber: number; count: number; }
export interface TableContext { table: M.RestaurantTable; restaurant: M.Restaurant; visit: M.TableVisit | null; }
export interface CartInput { restaurantId: M.ID; mode: M.OrderMode; tableToken: string | null; }
export interface AddCartLineInput { itemId: M.ID; quantity: number; note: string; }
export interface UpdateCartLineInput { quantity: number; note: string; }
export interface CheckoutInput { cartId: M.ID; checkoutRequestId: M.ID; contactName: string; contactPhone: string | null; deliveryAddress: string | null; pickupTime: string | null; paymentMethod: M.PaymentMethod; voucherCode: string | null; customerVoucherId: M.ID | null; }
export interface CheckoutPreview { subtotalSen: M.MoneySen; discountSen: M.MoneySen; taxSen: M.MoneySen; deliveryFeeSen: M.MoneySen; totalSen: M.MoneySen; }
export interface SubmitOrderOutput { order: M.Order; guestTrackingToken: string | null; }
export interface OrderDetails { order: M.Order; items: M.OrderItem[]; }
export interface TrackingInput { orderId: M.ID; guestTrackingToken: string | null; }
export interface CancellationInput extends TrackingInput { reason: string; }
export interface TableInvoice extends CheckoutPreview { visit: M.TableVisit; orders: M.Order[]; items: M.OrderItem[]; }
export type ProfileUpdateInput = Pick<M.Profile, 'fullName' | 'phone' | 'address'>;
export type VoucherInput = Omit<M.Voucher, 'id' | 'createdBy' | 'archivedAt'>;
export interface VoucherPreviewInput { restaurantId: M.ID; subtotalSen: M.MoneySen; voucherCode: string | null; customerVoucherId: M.ID | null; }
export interface VoucherPreview { voucherId: M.ID; discountSen: M.MoneySen; remainingUses: number | null; }
export interface RestaurantContext { restaurant: M.Restaurant; canAcceptNewOrders: boolean; }
export interface CompletionPointsInput { orderId: M.ID; }
export interface RecordVoucherUseInput { orderId: M.ID; voucherId: M.ID; customerVoucherId: M.ID | null; }
