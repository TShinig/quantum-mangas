import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Mangadex } from "~/api/mangadex/index.server";

interface Chapter {
  id: string;
  title: string;
  publishDate: string;
}

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const mangaId = params.id;

  if (!mangaId) {
    throw new Error("Manga não encontrado");
  }

  const manga = await Mangadex().getManga(mangaId);
  const chapters = await Mangadex().getChapters(mangaId);

  return json({
    id: manga.id,
    title: manga.attributes.title.en,
    coverUrl: manga.coverUrl,
    authorName: manga.authorName,
    tags: manga.tags,
    status: manga.status,
    format: manga.format,
    description: manga.description,
    chapters: chapters.map((chapter: Chapter) => ({
      id: chapter.id,
      title: chapter.title,
      publishDate: chapter.publishDate,
    })),
  });
};

export default function Page() {
  const {
    title,
    coverUrl,
    authorName,
    tags,
    status,
    format,
    description,
    chapters,
  } = useLoaderData<typeof loader>();
  const [isExpanded, setIsExpanded] = useState(false);

  const isDescriptionLong = description.split(" ").length >= 80;

  return (
    <main>
      <section className="relative">
        <img
          src={coverUrl}
          alt={title}
          className="h-[50vh] w-full object-cover object-center"
        />
        <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-4">
          <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
      </section>

      <section className="space-y-4 p-6">
        <div className="flex justify-between">
          <p>
            <strong>Formato:</strong> {format}
          </p>
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>Autor:</strong> {authorName}
          </p>
        </div>
        <div>
          <strong>Tags:</strong> {tags.join(", ")}
        </div>
        <div>
          <strong>Descrição:</strong>
          <p className={!isExpanded ? "line-clamp-2" : undefined}>
            {description}
          </p>
          {isDescriptionLong && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 underline"
            >
              {isExpanded ? "Mostrar menos" : "Mostrar mais"}
            </button>
          )}
        </div>
      </section>

      <section className="p-6">
        <h2 className="mb-4 text-2xl font-semibold">Capítulos</h2>
        <ul className="space-y-2">
          {chapters.map(({ id, title, publishDate }: Chapter) => (
            <li key={id}>
              <Link to={`capitulos/${id}`} className="h-full w-full">
                <Card className="flex h-full w-full rounded-lg bg-slate-200 p-4 transition-colors duration-500 hover:bg-neutral-300 dark:bg-neutral-800">
                  <CardContent className="flex h-full w-full items-center justify-between">
                    <span>{title}</span>
                    <span>{new Date(publishDate).toLocaleDateString()}</span>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
