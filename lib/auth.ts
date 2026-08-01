import crypto from "crypto";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.SESSION_SECRET || "wishey_super_secret_session_key_2026_x89f";

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  exp: number;
}

/**
 * Generates a 128-bit cryptographically secure UUID v4 (36 chars)
 */
export function generateSecureId(): string {
  return crypto.randomUUID();
}

/**
 * Hashes a plaintext password using PBKDF2 with salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies password against salt:hash or raw password for legacy users
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash.includes(":")) {
    // Fallback for legacy plain text entries during transition
    return password === storedHash;
  }
  const [salt, originalHash] = storedHash.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), Buffer.from(hash, "hex"));
}

/**
 * Creates a signed session token
 */
export function createSessionToken(payload: Omit<SessionPayload, "exp">, expiresInSeconds: number = 86400): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: SessionPayload = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

/**
 * Verifies a signed session token
 */
export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encodedPayload, signature] = parts;
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(encodedPayload)
      .digest("base64url");

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

import { cookies } from "next/headers";

/**
 * Extracts and verifies session token from HTTP Request cookies or next/headers
 */
export async function verifySession(request?: Request): Promise<{
  authenticated: boolean;
  user?: { id: string; name: string; email: string; role: string };
  message?: string;
}> {
  try {
    let token: string | undefined;

    if (request) {
      const cookieHeader = request.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/wishey_session=([^;]+)/);
        if (match) {
          token = match[1];
        }
      }

      if (!token) {
        const authHeader = request.headers.get("authorization");
        if (authHeader && authHeader.startsWith("Bearer ")) {
          token = authHeader.substring(7);
        }
      }
    } else {
      // Fallback for Server Components & Server Actions using next/headers
      const cookieStore = await cookies();
      token = cookieStore.get("wishey_session")?.value;
    }

    if (!token) {
      return { authenticated: false, message: "No session token provided" };
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return { authenticated: false, message: "Invalid or expired session token" };
    }

    const foundUsers = await db
      .select({ id: users.id, name: users.name, email: users.email, role: users.role })
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (foundUsers.length === 0) {
      return { authenticated: false, message: "User account no longer exists" };
    }

    return { authenticated: true, user: foundUsers[0] };
  } catch (error) {
    console.error("verifySession error:", error);
    return { authenticated: false, message: "Session verification error" };
  }
}

/**
 * Extracts and verifies admin session from HTTP Request cookies or Authorization header
 */
export async function verifyAdminSession(request: Request): Promise<{
  authorized: boolean;
  user?: { id: string; name: string; email: string; role: string };
  message?: string;
}> {
  const result = await verifySession(request);
  if (!result.authenticated || !result.user) {
    return { authorized: false, message: result.message || "Unauthorized access" };
  }

  if (result.user.role !== "admin") {
    return { authorized: false, message: "Admin privileges required" };
  }

  return { authorized: true, user: result.user };
}
