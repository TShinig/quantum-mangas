import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Mangadex } from "~/api/mangadex/index.server";

export const meta: MetaFunction = () => [{ title: "Quantum Mangás" }];

export const loader = async () => {
  const result = await Mangadex().getMangas();

  const items = await Promise.all(result.map(async item => {   
    return {
      id: item.id,
      title: item.attributes.title.en,
      coverUrl: item.coverUrl,
      authorName: item.authorName,
      tags: item.tags,
      status: item.status,
      latestChapter: item.latestChapter
    };
  }))

  return json(items);
};

export default function Index() {
  const items = useLoaderData<typeof loader>();

  return (
    <>
      <nav className="bg-neutral-900 text-gray-100 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png" className="h-8 w-8" />
            <div className="text-white text-lg font-bold">
              Quantum Mangás
            </div>
          </div>
          <div className="flex items-center space-x-12">
            <Link to="/">Inicio</Link>
            <Link to="/obras">Obras</Link>
            <Link to="/listas">Listas</Link>
            <img src="https://vulcannovel.com.br/wp-content/uploads/2023/07/capa_vulcan_o_unico_fazendeiro_da_torre.png" className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </nav>

      <main className="f bg-neutral-900">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {items.map(({ id, title, coverUrl, authorName, tags, status, latestChapter }) => (
            <Link to={`/manga/${id}`} key={id}>
              <li
                className="bg-[rgba(47,44,51,0.5)] shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex"
              >
                <img
                  src={coverUrl}
                  alt={title}
                  className="w-1/3 h-auto object-cover"
                />
                <div className="p-4 w-2/3">
                  <h2 className="text-lg font-semibold mb-2 text-gray-100">{title}</h2>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>Autor:</strong> {authorName}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>Status:</strong> {status}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>Último Capítulo:</strong> {latestChapter}
                  </p>
                  <p className="text-sm text-gray-300 mb-1">
                    <strong>Tags:</strong> {tags.slice(0, 3).join(', ')}
                  </p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </main>
    </>
  );
}
