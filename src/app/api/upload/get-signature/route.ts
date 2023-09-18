import cloudinary, { cloudinaryConfig } from "@/lib/cloudinary";

export async function GET() {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    cloudinaryConfig.api_secret!,
  );

  return new Response(JSON.stringify({ timestamp, signature }));
}
