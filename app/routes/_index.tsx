import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async () => {
  const BASE_URL = 'https://api.mangadex.org'
  const BASE_IMAGE_URL = 'https://uploads.mangadex.org'
  
  const result = await fetch(`${BASE_URL}/manga`);
  console.log(result.data);

  const items = [
    { id: 1, title: 'title' },
    { id: 2, title: 'description' },
  ];

  return json({ items, result });
}

export default function Index() {
  const { items, result } = useLoaderData();

  return (
    <main>
      <div className="whitespace-pre">
        { JSON.stringify(result, null, 2) }
      </div>
      {items.map(({ id, title }) => (
        <div key={id}>
          <h2>{title}</h2>
        </div>
      ))}
    </main>
  );
}
