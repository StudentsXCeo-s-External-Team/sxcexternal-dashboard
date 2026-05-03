import { getServerAdmin } from "@/lib/server-auth";
import { ok, unauthorized } from "@/lib/response";

export async function GET() {
  const admin = await getServerAdmin();
  if (!admin) return unauthorized();
  return ok(admin);
}
