import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, badRequest, notFound, serverError } from "@/lib/response";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  role_type: z.enum(["executive", "management", "associate"]).optional(),
  position: z.string().optional().nullable(),
  department: z.string().optional().nullable(),
  photo_url: z.string().url("Invalid photo URL").optional().nullable(),
  period: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  social_url: z.string().url("Invalid social URL").optional().nullable(),
  sort_order: z.number().int().optional(),
});

type Context = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Context) {
  const { id } = await params;
  const { data, error } = await supabase
    .from("members")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return notFound("Member not found");
  return ok(data);
}

export const PUT = withAuth(async (request, { params }) => {
  const { id } = await params;
  const body = await request.json();
  const result = updateSchema.safeParse(body);
  if (!result.success) return badRequest(result.error.errors[0].message);

  const { data, error } = await supabase
    .from("members")
    .update(result.data)
    .eq("id", id)
    .select()
    .single();

  if (error) return serverError(error.message);
  return ok(data);
});

export const DELETE = withAuth(async (_request, { params }) => {
  const { id } = await params;
  const { error } = await supabase.from("members").delete().eq("id", id);
  if (error) return serverError(error.message);
  return ok({ deleted: true });
});
