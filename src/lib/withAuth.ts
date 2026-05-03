import { NextRequest } from "next/server";
import { unauthorized } from "./response";
import { getServerAdmin, AdminUser } from "./server-auth";

type RouteContext = { params: Promise<Record<string, string>> };

type AuthHandler = (
  request: NextRequest,
  context: RouteContext,
  admin: AdminUser
) => Promise<Response>;

export function withAuth(handler: AuthHandler) {
  return async (request: NextRequest, context: RouteContext) => {
    const admin = await getServerAdmin();
    if (!admin) return unauthorized();
    return handler(request, context, admin);
  };
}
