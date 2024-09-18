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
    <main className="bg-neutral-900 text-sm text-gray-300">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {items.map(({ id, title, coverUrl, authorName, tags, status, latestChapter }) => (
          <li key={id}>
            <Link to={`/manga/${id}`} className="bg-[rgba(47,44,51,0.5)] shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex h-full">
              <img
                src={coverUrl}
                alt={title}
                className="w-1/3 h-auto object-cover"
              />
              <div className="p-4 w-2/3 space-y-1">
                <h2 className="text-lg font-semibold mb-2 text-gray-100">{title}</h2>
                <p>
                  <strong>Autor:</strong> {authorName}
                </p>
                <p>
                  <strong>Status:</strong> {status}
                </p>
                <p>
                  <strong>Último Capítulo:</strong> {latestChapter}
                </p>
                <p>
                  <strong>Tags:</strong> {tags.slice(0, 3).join(', ')}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
