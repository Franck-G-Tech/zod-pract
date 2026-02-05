// convex/auth.config.ts
const authConfig = {
  providers: [
    {
      // Obtén este dominio desde Clerk -> JWT Templates -> Convex
      domain: "https://primary-turtle-76.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
}; 
export default authConfig;