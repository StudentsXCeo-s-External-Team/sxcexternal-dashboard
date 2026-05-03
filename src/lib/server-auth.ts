import { createSupabaseServerClient, isAdminEmail } from "./supabase-server";

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
}

export async function getServerAdmin(): Promise<AdminUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email || !isAdminEmail(user.email)) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name ?? null,
  };
}
