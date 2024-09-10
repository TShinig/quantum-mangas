import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
import { Mangadex } from "~/api/mangadex/index.server";

export const loader = async ({params}: LoaderFunctionArgs) => {
  let chapterId = params.id;
  // Pegar a API, achar o mangá e passar para link.

  const result = await Mangadex().getMangas();
  const items = await Promise.all(result.map(async item => {   
    return {
      id: item.id,
      title: item.attributes.title.en,
      coverUrl: item.coverUrl,
      authorName: item.authorName,
      tags: item.tags,
      status: item.status,
      latestChapter: item.latestChapter,
      format: item.format,
      description: item.description,
      chapterId,
    };
  }))

  return json(items);
}

export default function Page() {
  const data = useLoaderData<typeof loader>();

  return (
    <>
      {data.map(({ coverUrl, title, authorName, status, tags, format, description, chapterId }) => (
      <div className="bg-neutral-900 min-h-screen text-gray-100">
          <div className="relative">
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-[50vh] object-cover"
            />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 w-full p-4">
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>
          </div>
        
          <div className="p-6 space-y-4">
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
              <p className="mt-2">{description.pt_br || description.en}</p>
            </div>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Capítulos</h2>
          <ul className="space-y-2">
              <li key={chapterId}>
                <a
                  href={`/capitulo/${chapterId}`}
                  className="block bg-neutral-800 hover:bg-neutral-700 p-4 rounded-lg transition-colors"
                >
                  <div className="flex justify-between">
                    <span>{title}</span>
                  </div>
                </a>
              </li>
          </ul>
        </div>
      </div>
      ))}
    </>
  )
}