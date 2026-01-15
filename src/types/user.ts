/**
 * User Types
 */

/** User data from backend */
export interface User {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  token?: string;
}

/** User registration data */
export interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

/** User login credentials */
export interface LoginCredentials {
  email: string;
  password: string;
}

/** User with wishlist (from GET /api/users/get) */
export interface UserWithWishlist extends User {
  wishlist: import('./coin').CoinMarketData[];
}

/** Wishlist update data */
export interface WishlistUpdateData {
  coin: string;
  coin_id: string;
  user_email: string;
}
