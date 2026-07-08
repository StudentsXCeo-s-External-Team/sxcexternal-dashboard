import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { withAuth } from "@/lib/withAuth";
import { ok, badRequest, notFound, serverError } from "@/lib/response";

const updateEventSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional().nullable(),
  location: z.string().optional().nullable(),
  registration_url: z.string().url().optional().nullable(),
  is_published: z.boolean().optional(),
});

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params;
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return error.code === "PGRST116" ? notFound("Event not found") : serverError(error.message);
    if (!data) return notFound("Event not found");
    return ok(data);
  } catch {
    return serverError();
  }
}

export const PUT = withAuth(async (request, { params }) => {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = updateEventSchema.safeParse(body);
    if (!result.success) {
      return badRequest(result.error.errors[0].message);
    }

    const { data, error } = await supabase
      .from("events")
      .update({ ...result.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) return error.code === "PGRST116" ? notFound("Event not found") : serverError(error.message);
    if (!data) return notFound("Event not found");
    return ok(data);
  } catch {
    return serverError();
  }
});

export const DELETE = withAuth(async (_request, { params }) => {
  try {
    const { id } = await params;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) return serverError(error.message);
    return ok({ message: "Event deleted successfully" });
  } catch {
    return serverError();
  }
});
