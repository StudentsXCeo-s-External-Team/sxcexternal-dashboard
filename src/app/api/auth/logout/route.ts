import { createSupabaseServerClient } from "@/lib/supabase-server";
import { ok } from "@/lib/response";

export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return ok({ message: "Logged out successfully" });
}
