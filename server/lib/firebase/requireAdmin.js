import admin from "./admin.js";

const ADMIN_UIDS = (process.env.ADMIN_UIDS || "")
  .split(",")
  .map((uid) => uid.trim())
  .filter(Boolean);

export async function requireAdmin(request) {
  const authorization = request.get("authorization");

  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice(7)
    : null;

  if (!token) {
    return { authorized: false, status: 401 };
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    if (!ADMIN_UIDS.includes(decoded.uid)) {
      return { authorized: false, status: 403 };
    }

    return {
      authorized: true,
      uid: decoded.uid,
    };
  } catch (err) {
    console.error("fiebase token verification failed:", err.message);
    return { authorized: false, status: 401 };
  }
}
