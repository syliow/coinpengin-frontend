/**
 * API Response Types
 */

/** Generic API error response */
export interface ApiError {
  message: string;
  stack?: string;
}

/** Auth response (login/register) */
export interface AuthResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
}

/** Wishlist update response */
export interface WishlistResponse {
  message: string;
  wishlist?: string[];
}

/** Generic success message response */
export interface MessageResponse {
  message: string;
}
