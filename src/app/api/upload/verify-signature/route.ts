import cloudinary, { cloudinaryConfig } from "@/lib/cloudinary";

interface ReqBody {
  public_id: string;
  version: string;
  signature: string;
}

export async function POST(req: Request) {
  const { public_id, version, signature }: ReqBody = await req.json();

  const expectedSignature = cloudinary.utils.api_sign_request(
    { public_id, version },
    cloudinaryConfig.api_secret!,
  );

  if (expectedSignature === signature) {
    // safe to write to database
    // write to database
  }
}
