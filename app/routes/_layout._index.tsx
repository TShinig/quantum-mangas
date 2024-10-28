import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Mangadex } from "~/api/mangadex/index.server";

export const meta: MetaFunction = () => [{ title: "Quantum Mangás" }];

export const loader = async () => {
  const result = await Mangadex().getMangas();

  const items = result.map(item => ({
    id: item.id,
    title: item.attributes.title.en,
    coverUrl: item.coverUrl || "https://via.placeholder.com/800x1000",
    authorName: item.authorName || "Desconhecido",
    tags: item.tags.slice(0, 3),
    status: item.status,
    latestChapter: item.latestChapter || "Não foi encontrado capítulos",
  }));

  return json(items);
};

// Modularizar a renderização de cada mangá
function MangaCard({ id, title, coverUrl, authorName, tags, status, latestChapter }: any) {
  return (
    <li key={id}>
      <Link to={`/manga/${id}`} className="hover:shadow-lg transition-shadow duration-300">
        <Card className="p-4 w-full space-y-1">
          <img src={coverUrl} alt={title} className="w-full h-auto object-cover" />
          <CardHeader>{title}</CardHeader>
          <CardContent>
            <p><strong>Autor:</strong> {authorName}</p>
            <p><strong>Status:</strong> {status}</p>
            <p><strong>Último Capítulo:</strong> {latestChapter}</p>
            <p><strong>Tags:</strong> {tags.join(', ')}</p>
          </CardContent>
        </Card>
      </Link>
    </li>
  );
}

export default function Index() {
  const items = useLoaderData<typeof loader>();

  return (
    <main className="bg-cream dark:bg-neutral-900 text-sm text-gray-800 dark:text-gray-300">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {items.map(item => (
          <MangaCard key={item.id} {...item} />
        ))}
      </ul>
    </main>
  );
}