import { withAuth } from "@/lib/withAuth";
import { uploadImage } from "@/lib/cloudinary";
import { created, badRequest, serverError } from "@/lib/response";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const POST = withAuth(async (request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string | null) ?? "cms";

    if (!file) return badRequest("No file provided");

    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest(
        `Invalid file type "${file.type}". Allowed: JPEG, PNG, WebP, GIF`
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return badRequest("File too large. Max size is 5MB");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadImage(buffer, folder);

    return created({ url });
  } catch {
    return serverError();
  }
});

// Required for CORS preflight
export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
