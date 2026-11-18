export type ID = string;
export type ISODate = string;
export type MoneySen = number;
export type Role = 'root_admin' | 'owner' | 'customer';
export type RestaurantStatus = 'active' | 'suspended' | 'archived';
export type OrderMode = 'dine_in' | 'pickup' | 'delivery';
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentMethod = 'counter' | 'online_banking' | 'e_wallet' | 'card';
export type CancellationStatus = 'none' | 'requested' | 'approved' | 'rejected';
export interface Profile { id: ID; fullName: string; email: string; phone: string; address: string | null; role: Role; isActive: boolean; createdAt: ISODate; }
export interface RestaurantApplication { id: ID; applicantOwnerId: ID; restaurantName: string; address: string; contactPhone: string; bio: string; status: 'pending' | 'approved' | 'rejected'; approvedRestaurantId: ID | null; reviewReason: string | null; reviewedBy: ID | null; createdAt: ISODate; reviewedAt: ISODate | null; }
export interface Restaurant { id: ID; ownerId: ID; name: string; address: string; phone: string; bio: string; status: RestaurantStatus; isOpen: boolean; taxRateBps: number; deliveryFeeSen: MoneySen; createdAt: ISODate; }
export interface Category { id: ID; restaurantId: ID; name: string; }
export interface MenuItem { id: ID; restaurantId: ID; categoryId: ID; name: string; description: string; priceSen: MoneySen; imageUrl: string | null; isAvailable: boolean; archivedAt: ISODate | null; }
export interface RestaurantTable { id: ID; restaurantId: ID; tableNumber: number; qrToken: string; }
/** Table occupancy is derived from its open visit, not maintained independently. */
export interface TableVisit { id: ID; restaurantId: ID; tableId: ID; status: 'open' | 'closed'; openedAt: ISODate; closedAt: ISODate | null; }
export interface CartLine { id: ID; itemId: ID; quantity: number; note: string; }
export interface Cart { id: ID; customerId: ID | null; restaurantId: ID; mode: OrderMode; tableToken: string | null; lines: CartLine[]; updatedAt: ISODate; }
export interface Order { id: ID; restaurantId: ID; customerId: ID | null; visitId: ID | null; checkoutRequestId: ID; mode: OrderMode; contactName: string; contactPhone: string | null; deliveryAddress: string | null; pickupTime: string | null; subtotalSen: MoneySen; discountSen: MoneySen; taxSen: MoneySen; deliveryFeeSen: MoneySen; totalSen: MoneySen; voucherId: ID | null; status: OrderStatus; paymentStatus: PaymentStatus; paymentMethod: PaymentMethod; cancellationStatus: CancellationStatus; cancellationReason: string | null; createdAt: ISODate; completedAt: ISODate | null; archivedAt: ISODate | null; }
export interface OrderItem { id: ID; orderId: ID; itemId: ID; itemName: string; quantity: number; unitPriceSen: MoneySen; lineTotalSen: MoneySen; note: string; }
export interface Voucher { id: ID; restaurantId: ID | null; createdBy: ID; code: string; discountSen: MoneySen; minimumSpendSen: MoneySen; pointsCost: number; expiresAt: ISODate; claimEnabled: boolean; isUsable: boolean; totalUseLimit: number | null; perCustomerUseLimit: number | null; usesPerClaim: number; archivedAt: ISODate | null; }
export interface CustomerVoucher { id: ID; customerId: ID; voucherId: ID; claimedAt: ISODate; pointsSpent: number; useLimit: number; usesCount: number; status: 'usable' | 'exhausted' | 'disabled' | 'expired'; }
export interface VoucherRedemption { id: ID; voucherId: ID; customerVoucherId: ID | null; customerId: ID; orderId: ID; redeemedAt: ISODate; reversedAt: ISODate | null; }
export interface LoyaltyAccount { id: ID; customerId: ID; pointsBalance: number; }
export interface LoyaltyTransaction { id: ID; customerId: ID; orderId: ID | null; customerVoucherId: ID | null; type: 'opening_balance' | 'order_completion' | 'voucher_claim' | 'adjustment'; pointsDelta: number; createdAt: ISODate; }
export interface PaymentRecord { id: ID; orderId: ID | null; visitId: ID | null; method: PaymentMethod; status: PaymentStatus; isSimulated: boolean; amountSen: MoneySen; paidAt: ISODate | null; refundedAt: ISODate | null; }
export interface Receipt { id: ID; receiptNumber: string; orderId: ID | null; visitId: ID | null; paymentId: ID; orderIds: ID[]; subtotalSen: MoneySen; discountSen: MoneySen; taxSen: MoneySen; deliveryFeeSen: MoneySen; totalSen: MoneySen; issuedAt: ISODate; }
export interface SessionContext { profileId: ID | null; role: Role | null; selectedRestaurantId: ID | null; }
export interface MockDatabase { schemaVersion: number; profiles: (Profile & { passwordHash?: string })[]; restaurantApplications: RestaurantApplication[]; restaurants: Restaurant[]; categories: Category[]; menuItems: MenuItem[]; tables: RestaurantTable[]; visits: TableVisit[]; carts: Cart[]; orders: Order[]; orderItems: OrderItem[]; vouchers: Voucher[]; customerVouchers: CustomerVoucher[]; voucherRedemptions: VoucherRedemption[]; loyaltyAccounts: LoyaltyAccount[]; loyaltyTransactions: LoyaltyTransaction[]; paymentRecords: PaymentRecord[]; receipts: Receipt[]; }
