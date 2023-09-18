import axios from "axios";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const href = url.searchParams.get("url");

  if (!href) return new Response("Invalid href", { status: 400 });

  const { data: page } = await axios.get(href);

  const titleMatch = page.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";

  const descriptionMatch = page.match(
    /<meta name="description" content="(.*?)"/,
  );
  const description = descriptionMatch ? descriptionMatch[1] : "";

  const imageMatch = page.match(/<meta property="og:image" content="(.*?)"/);
  const imageUrl = imageMatch ? imageMatch[1] : "";

  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: { url: imageUrl },
      },
    }),
  );
}
