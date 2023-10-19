import axios from "axios";

export async function uploadToCloudinary(file: File) {
  try {
    const {
      data: { timestamp, signature },
    } = await axios.get("/api/upload/get-signature");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp);

    const { data } = await axios.post(
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!,
      formData,
    );

    return {
      success: 1,
      file: {
        url: data.url as string,
        public_id: data.public_id as string,
        width: data.width as number,
        height: data.height as number,
      },
    };
  } catch (error) {
    console.error(error);
    return { success: 0, file: null };
  }
}
