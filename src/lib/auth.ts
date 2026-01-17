import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_here";

export async function isAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;

    if (!token) {
      return false;
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const adminRoles = ["ADMIN", "MANAGER", "EDITOR"];
    return payload && typeof payload.role === "string" && adminRoles.includes(payload.role.toUpperCase());
  } catch (error) {
    return false;
  }
}
