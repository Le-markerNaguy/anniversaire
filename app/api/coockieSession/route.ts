import { SessionOptions } from "iron-session";

// Define the type for your session data and export it
export interface IronSessionData {
  adminId?: string; // Or any other data you want to store
  // Add other session data properties here
}

// This is the key used to encrypt the session cookie.
// It should be at least 32 characters long and kept secret.
// We recommend storing it in an environment variable.
if (!process.env.SESSION_SECRET) {
  console.warn("SESSION_SECRET environment variable is not set. Session cookies will not be encrypted securely.");
}

export const sessionOptions: SessionOptions = {
  cookieName: "admin_session", // You can name your session cookie
  password: process.env.SESSION_SECRET || "this_is_a_default_very_insecure_password", // Use env var for password
  cookieOptions: {
    secure: process.env.NODE_ENV === "developpement", // Use secure cookie in production
    httpOnly: true, // Recommended for security
    sameSite: "lax", // Recommended for most cases
    path: "/",
  },
};

// The declare module block is still needed to extend iron-session's types
declare module "iron-session" {
  interface IronSessionData {
    adminId?: string; // Or any other data you want to store
    // Add other session data properties here
  }}