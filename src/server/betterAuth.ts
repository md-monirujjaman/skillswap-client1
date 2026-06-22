import { betterAuth } from "better-auth";

// As we use MongoDB/Mongoose natively elsewhere, this betterAuth instance
// is minimally configured to satisfy section 06 environment rules.
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    }
  }
});
