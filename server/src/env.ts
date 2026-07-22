import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  databasePath: process.env.DATABASE_PATH ?? "./data.sqlite",
  jwtSecret: required("JWT_SECRET", "dev-secret-change-me"),
  tokenEncryptionKey: required("TOKEN_ENCRYPTION_KEY", "0".repeat(64)),
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  openaiModel: process.env.OPENAI_MODEL || "gpt-5.1",
  providers: {
    shopify: {
      clientId: process.env.SHOPIFY_CLIENT_ID ?? "",
      clientSecret: process.env.SHOPIFY_CLIENT_SECRET ?? "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    },
  },
};
