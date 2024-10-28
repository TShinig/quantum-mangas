import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { Mangadex } from "~/api/mangadex/index.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { chapterId } = params;

  if (!chapterId) {
    throw new Error("ID do capítulo não foi encontrado");
  }

  const chapterImages = await Mangadex().getChapterImages(chapterId);

  return chapterImages;
};

export default function ChapterFullScreen() {
  const chapterImages = useLoaderData<typeof loader>();

  return (
    <div className="fixed inset-0 bg-cream dark:bg-black bg-opacity-90 overflow-auto z-50">
      <Link to={-1} className="fixed top-4 right-4 text-white text-3xl bg-neutral-800 p-2 rounded-full z-50">
        X
      </Link>

      <div className="flex flex-col items-center p-6 space-y-4">
        {chapterImages.map((url: string, index: number) => (
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
