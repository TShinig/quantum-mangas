import { json, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => [{ title: "Quantum Mangás" }];

interface MangaTag {
  id: string;
  type: string;
  attributes: {
    name: {
      en: string;
    };
    description: Record<string, unknown>;
    group: string;
    version: number;
  };
  relationships: any[];
}

interface MangaAttributes {
  title: {
    en: string;
  };
  altTitles: Array<Record<string, string>>;
  description: {
    [key: string]: string;
  };
  isLocked: boolean;
  links: Record<string, string>;
  originalLanguage: string;
  lastVolume: string | null;
  lastChapter: string | null;
  publicationDemographic: string | null;
  status: string;
  year: number | null;
  contentRating: string;
  tags: MangaTag[];
  state: string;
  chapterNumbersResetOnNewVolume: boolean;
  createdAt: string;
  updatedAt: string;
  version: number;
  availableTranslatedLanguages: string[];
  latestUploadedChapter: string;
}

interface MangaRelationship {
  id: string;
  type: string;
  related?: string;
}

interface MangaData {
  id: string;
  type: string;
  attributes: MangaAttributes;
  relationships: MangaRelationship[];
}

interface MangaDexResult {
  result: string;
  response: string;
  data: MangaData[];
}

export const loader = async () => {
  const BASE_URL = 'https://api.mangadex.org';

  // BASE_IMAGE_URL 'https://uploads.mangadex.org';
  // https://uploads.mangadex.org/covers/${MANGA_ID}/${COVER_FILENAME}
	
  const response = await fetch(`${BASE_URL}/manga`);
  const result:MangaDexResult = await response.json();

  /**
    const BASE_AUTHOR = await fetch(`${BASE_URL}/author`);
    const BASE_GROUP = await fetch(`${BASE_URL}/group`);
    const BASE_COVER = await fetch(`${BASE_URL}/cover`);
    const BASE_CHAPTER = await fetch(`${BASE_URL}/chapter`);
    const BASE_STATISTICS = await fetch(`${BASE_URL}/statistics`);
  */
  
  const items = await Promise.all(result.data.map(async item => {
    //? Cover

    const coverRelationship = item.relationships.find(r => r.type === 'cover_art');
    let coverUrl = `https://placehold.co/600x400/png`;

    if (coverRelationship) {
      const coverResponse = await fetch(`${BASE_URL}/cover/${coverRelationship.id}`);
      const coverResult = await coverResponse.json();
      const coverFilename = coverResult.data.attributes.fileName;

      coverUrl = `https://uploads.mangadex.org/covers/${item.id}/${coverFilename}`;
    }

    //? Tags

    //? Status

    //? Author -> Fetch na API

    //? Caps

    return {
      id: item.id,
      title: item.attributes.title.en,
      coverUrl,
    }
  }))

  return json(items);
};

export default function Index() {
  const items = useLoaderData<typeof loader>();

  return (
    <main>
      <ul className="grid grid-cols-3">
        {items.map(({id, title, coverUrl}) => (
          <li key={id}>
            <h2>{title}</h2>
            <img src={coverUrl} alt={title} />
          </li>
        ))}
      </ul>
    </main>
  );
}
