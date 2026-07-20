import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { env } from "./env.js";

const ALGO = "aes-256-gcm";
const key = Buffer.from(env.tokenEncryptionKey, "hex");

if (key.length !== 32) {
  throw new Error("TOKEN_ENCRYPTION_KEY must be a 64-character hex string (32 bytes) for AES-256");
}

// OAuth access/refresh tokens are stored at rest encrypted with this, never in plaintext --
// the API never returns raw tokens to the frontend either, only connection status.
export function encryptToken(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(".");
}

export function decryptToken(payload: string): string {
  const [ivHex, authTagHex, dataHex] = payload.split(".");
  const decipher = createDecipheriv(ALGO, key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]);
  return decrypted.toString("utf8");
}
