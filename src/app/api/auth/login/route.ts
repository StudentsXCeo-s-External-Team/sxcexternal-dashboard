import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { comparePassword, signToken, setAuthCookie } from "@/lib/auth";
import { ok, badRequest, unauthorized, serverError } from "@/lib/response";

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return badRequest(result.error.errors[0].message);
    }

    const { email, password } = result.data;

    const { data: admin, error } = await supabase
      .from("admins")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !admin) {
      return unauthorized("Invalid email or password");
    }

    const isValid = await comparePassword(password, admin.password_hash);
    if (!isValid) {
      return unauthorized("Invalid email or password");
    }

    const token = await signToken({
      id: admin.id,
      email: admin.email,
      name: admin.name,
    });

    await setAuthCookie(token);

    return ok({ id: admin.id, email: admin.email, name: admin.name });
  } catch {
    return serverError();
  }
}
