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
    console.log(data);

    return {
      success: 1,
      file: { url: data.url, width: data.width, height: data.height },
    };
  } catch (error) {
    console.error(error);
    return { success: 0 };
  }
}
