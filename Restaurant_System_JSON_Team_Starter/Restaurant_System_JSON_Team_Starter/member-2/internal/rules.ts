import 'server-only';
import { store } from '@/shared/storage';
import { readSession } from '@/shared/auth/devSession';
import { RuleError } from '@/shared/auth/permissions';
import type * as T from '@/shared/types';

export const now = () => new Date().toISOString();
export const money = (sen: number) => `RM ${(sen / 100).toFixed(2)}`;
export function requireText(value: unknown, label: string, max: number) {
  if (typeof value !== 'string' || value.trim().length === 0 || value.trim().length > max)
    throw new RuleError(`${label} must have 1 to ${max} characters.`);
  return value.trim();
}
export function requireQuantity(quantity: number) {
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99)
    throw new RuleError('Quantity must be a whole number between 1 and 99.');
  return quantity;
}
export function validateNote(note: unknown) {
  if (typeof note !== 'string' || note.length > 250) throw new RuleError('The special request must be 250 characters or fewer.');
  return note.trim();
}
export async function getCartAccess(cartId: string): Promise<T.Cart> {
  if (typeof cartId !== 'string' || !cartId.trim()) throw new RuleError('Choose a cart first.');
  const cart = await store.get('carts', cartId);
  if (!cart) throw new RuleError('Cart was not found. Please start a new cart.');
  const session = await readSession();
  if (session.role === 'owner' || session.role === 'root_admin') throw new RuleError('Use a customer account or guest checkout.');
  if (cart.customerId && cart.customerId !== session.profileId) throw new RuleError('You cannot access another customer cart.');
  return cart;
}
export async function eligibleRestaurant(restaurantId: string) {
  const restaurant = await store.get('restaurants', restaurantId);
  if (!restaurant || restaurant.status !== 'active' || !restaurant.isOpen)
    throw new RuleError('This restaurant is currently not taking new orders.');
  return restaurant;
}
export async function getOrderAccess(order: T.Order, guestToken: string | null) {
  const session = await readSession();
  if (session.role === 'owner' && session.profileId) {
    const restaurant = await store.get('restaurants', order.restaurantId);
    if (restaurant?.ownerId === session.profileId) return 'owner';
  }
  if (session.role === 'customer' && session.profileId === order.customerId) return 'customer';
  // A guest's checkout request ID is generated with crypto.randomUUID() by the browser.
  // It acts as the local prototype tracking secret. Never reveal it in public order lists.
  if (order.customerId === null && guestToken && guestToken === order.checkoutRequestId) return 'guest';
  throw new RuleError('You cannot access this order.');
}
export async function requireOwnerOfOrder(order: T.Order) {
  const session = await readSession();
  const restaurant = await store.get('restaurants', order.restaurantId);
  if (session.role !== 'owner' || !session.profileId || restaurant?.ownerId !== session.profileId)
    throw new RuleError('You can only manage orders for your own restaurants.');
}
export async function getOrderOrError(id: string) {
  const order = await store.get('orders', id);
  if (!order) throw new RuleError('Order was not found.');
  return order;
}
