import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Quantum Mangás" }];

export const loader = async () => {
  const BASE_URL = 'https://api.mangadex.org';
	
  // BASE_IMAGE_URL 'https://uploads.mangadex.org';
	
  const BASE_MANGA = await fetch(`${BASE_URL}/manga`);
	const BASE_AUTHOR = await fetch(`${BASE_URL}/author`);
	const BASE_GROUP = await fetch(`${BASE_URL}/group`);
	const BASE_COVER = await fetch(`${BASE_URL}/cover`);
	const BASE_CHAPTER = await fetch(`${BASE_URL}/chapter`);
	const BASE_STATISTICS = await fetch(`${BASE_URL}/statistics`);

  return json(
    {
      BASE_MANGA,
      BASE_AUTHOR,
      BASE_GROUP,
      BASE_COVER,
      BASE_CHAPTER,
      BASE_STATISTICS 
    }
  );
};

export default function Index() {
  const {
    BASE_MANGA,
    BASE_AUTHOR,
    BASE_GROUP,
    BASE_COVER,
    BASE_CHAPTER,
    BASE_STATISTICS 
  } = useLoaderData<typeof loader>();

  return (
    <main>
      <div className="whitespace-pre">
        { JSON.stringify(BASE_MANGA, null, 2) }
        { JSON.stringify(BASE_AUTHOR, null, 2) }
        { JSON.stringify(BASE_GROUP, null, 2) }
        { JSON.stringify(BASE_COVER, null, 2) }
        { JSON.stringify(BASE_CHAPTER, null, 2) }
        { JSON.stringify(BASE_STATISTICS, null, 2) }
      </div>
    </main>
  );
}
