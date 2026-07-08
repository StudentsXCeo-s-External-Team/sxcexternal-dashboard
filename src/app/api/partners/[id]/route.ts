import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, badRequest, notFound, serverError } from "@/lib/response";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  logo_url: z.string().url().optional(),
  partner_type: z.enum(["corporate", "media", "community"]).optional(),
  website_url: z.string().url().optional().nullable(),
  sort_order: z.number().int().optional(),
  is_published: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { data, error } = await supabase.from("partners").select("*").eq("id", id).single();
    if (error || !data) return notFound("Partner not found");
    return ok(data);
  } catch {
    return serverError();
  }
}

export const PUT = withAuth(async (request, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateSchema.safeParse(body);
    if (!result.success) return badRequest(result.error.errors[0].message);

    const { data, error } = await supabase
      .from("partners")
      .update({ ...result.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return serverError(error.message);
    if (!data) return notFound("Partner not found");
    return ok(data);
  } catch {
    return serverError();
  }
});

export const DELETE = withAuth(async (_request, { params }) => {
  try {
    const { id } = await params;
    const { error } = await supabase.from("partners").delete().eq("id", id);
    if (error) return serverError(error.message);
    return ok({ message: "Partner deleted successfully" });
  } catch {
    return serverError();
  }
});
