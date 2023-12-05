import cloudinary, { cloudinaryConfig } from "@/lib/cloudinary";

export async function GET() {
  console.time();
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp },
      cloudinaryConfig.api_secret!,
    );
    console.timeEnd();
    return new Response(JSON.stringify({ timestamp, signature }));
  } catch (error) {
    console.timeEnd();
    return new Response("Something went wrong", { status: 500 });
  }
}
