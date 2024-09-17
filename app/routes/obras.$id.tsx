import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, Link, Outlet, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Mangadex } from "~/api/mangadex/index.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const mangaId = params.id;
  
  const result = await Mangadex().getMangas();
  const manga = result.find((item) => item.id === mangaId);

  if (!manga) {
    throw new Error("Manga não encontrado");
  }
  
  const chaptersResponse = await fetch(`https://api.mangadex.org/chapter?manga=${mangaId}`);
  const chaptersData = await chaptersResponse.json();

  const chapters = chaptersData.data.map((chapter: any) => ({
    id: chapter.id,
    volume: chapter.attributes.volume,
    chapter: chapter.attributes.chapter,
    title: chapter.attributes.title || `Capítulo ${chapter.attributes.chapter}`,
    publishDate: chapter.attributes.publishAt,
  }));

  return json({
    id: manga.id,
    title: manga.attributes.title.en,
    coverUrl: manga.coverUrl,
    authorName: manga.authorName,
    tags: manga.tags,
    status: manga.status,
    format: manga.format,
    description: manga.description,
    chapters,
  });
};

export default function Page() {
  const data = useLoaderData<typeof loader>();

  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 0;
  const toggleExpansion = () => { setIsExpanded(!isExpanded); };
  const description = data.description.pt_br || data.description.en || "Não possui descrição.";
  const slicedDescription = description.slice(0, maxLength);

  return (
    <div className="bg-neutral-900 min-h-screen text-gray-100">
      <nav className="bg-neutral-900 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png" className="h-8 w-8" />
            <div className="text-white text-lg font-bold">
              Quantum Mangás
            </div>
          </div>
          <div className="flex items-center space-x-12">
            <a href="#" className="text-gray-300 hover:text-white">Início</a>
            <a href="#" className="text-gray-300 hover:text-white">Obras</a>
            <a href="#" className="text-gray-300 hover:text-white">Listas</a>
            <img src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png" className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </nav>
      <div className="relative">
        <img
          src={data.coverUrl}
          alt={data.title}
          className="w-full h-[50vh] object-cover object-[50%_20%]"
        />
        <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 w-full p-4">
          <h1 className="text-3xl font-bold">{data.title}</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex justify-between">
          <p>
            <strong>Formato:</strong> {data.format}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Autor:</strong> {data.authorName}
          </p>
        </div>
        <div>
          <strong>Tags:</strong> {data.tags.join(", ")}
        </div>
        <div>
          <strong>Descrição:</strong> {data.description.pt_br || data.description.en || "Não possui descrição."}
          {isExpanded ? description : slicedDescription}
          {description.length > maxLength && (
            <>
              {isExpanded ? "" : "..."}{" "}
              <button
                onClick={toggleExpansion}
                className="text-blue-400 ml-2 hover:text-blue-200 transition-colors duration-300 font-semibold underline"
              >
                {isExpanded ? "Mostrar menos" : "Mostrar mais"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Capítulos</h2>
        <ul className="space-y-2">
          {data.chapters.map((chapter:any) => (
            <Link to={`capitulos/${chapter.id}`} key={chapter.id} className="block bg-neutral-800 hover:bg-neutral-700 p-4 rounded-lg transition-colors">
              <li>
                  <div className="flex justify-between">
                    <span>{chapter.title}</span>
                    <span>{new Date(chapter.publishDate).toLocaleDateString()}</span>
                  </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
      <Outlet />
    </div>
  );
}