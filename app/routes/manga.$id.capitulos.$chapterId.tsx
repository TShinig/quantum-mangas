import { useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { chapterId } = params;
  
  const chapterResponse = await fetch(`https://api.mangadex.org/chapter/${chapterId}`);
  const chapterData = await chapterResponse.json();

  if (!chapterData || chapterData.errors) {
    throw new Error("Erro ao buscar dados do capítulo");
  }

  const contentResponse = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
  const imageData = await contentResponse.json();

  if (!imageData || imageData.result !== "ok") {
    throw new Error("Erro ao buscar imagens do capítulo");
  }

  const imageUrls = imageData.chapter.data.map((fileName: string) =>
    `${imageData.baseUrl}/data/${imageData.chapter.hash}/${fileName}`
  );

  return json({ imageUrls });
};

export default function ChapterFullScreen() {
  const { imageUrls } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 overflow-auto z-50">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-4 right-4 text-white text-3xl bg-neutral-800 p-2 rounded-full z-50"
      >
        X
      </button>

      <div className="flex flex-col items-center p-6 space-y-4">
        {imageUrls.map((url: string, index: number) => (
          <img
            key={index}
            src={url}
            alt={`Page ${index + 1}`}
            className="w-full h-auto object-cover"
          />
        ))}
      </div>
    </div>
  );
}
