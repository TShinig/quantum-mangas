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

interface CoverArt {
  id: string;
  type: string;
  attributes: {
    description: string;
    volume: string;
    fileName: string;
    locale: string;
    createdAt: string;
    updatedAt: string;
    version: number;
  };
  relationships: {
    id: string;
    type: string;
  }[];
}

interface CoverArtResponse {
  result: string;
  response: string;
  data: CoverArt[];
  limit: number;
  offset: number;
  total: number;
}

interface Author {
  id: string;
  type: string;
  attributes: AuthorAttributes;
  relationships: Relationship[];
}

interface AuthorAttributes {
  name: string;
  imageUrl: string | null;
  biography: Record<string, string>;
  twitter: string | null;
  pixiv: string | null;
  melonBook: string | null;
  fanBox: string | null;
  booth: string | null;
  namicomi?: string | null;
  nicoVideo: string | null;
  skeb: string | null;
  fantia: string | null;
  tumblr: string | null;
  youtube: string | null;
  weibo: string | null;
  naver: string | null;
  website: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
}

interface Relationship {
  id: string;
  type: string;
}

interface AuthorResponse {
  result: string;
  response: string;
  data: Author[];
  limit: number;
  offset: number;
  total: number;
}


export const loader = async () => {
  const BASE_URL = 'https://api.mangadex.org';

  // BASE_IMAGE_URL 'https://uploads.mangadex.org';
  // https://uploads.mangadex.org/covers/${MANGA_ID}/${COVER_FILENAME}

  const response = await fetch(`${BASE_URL}/manga`);
  const result: MangaDexResult = await response.json();

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
    let coverUrl = `https://source.unsplash.com/random`;

    if (coverRelationship) {
      const coverResponse = await fetch(`${BASE_URL}/cover/${coverRelationship.id}`);
      const coverResult = await coverResponse.json();
      const coverFilename = coverResult.data.attributes.fileName;

      coverUrl = `https://uploads.mangadex.org/covers/${item.id}/${coverFilename}`;
    }

    const tags = item.attributes.tags.map(tag => tag.attributes.name.en);
    const status = item.attributes.status;
    const latestChapter = item.attributes.lastChapter || "Ainda não há capítulos";

    // Pegar Autor

    return {
      id: item.id,
      title: item.attributes.title.en,
      coverUrl,
      tags,
      status,
      latestChapter
    }
  }))

  return json(items);
};

export default function Index() {
  const items = useLoaderData<typeof loader>();

  return (
    <main className="f">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {items.map(({ id, title, coverUrl, tags, status, latestChapter }) => (
          <li
            key={id}
            className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex"
          >
            <img
              src={coverUrl}
              alt={title}
              className="w-1/3 h-auto object-cover"
            />
            <div className="p-4 w-2/3">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Autor:</strong> 'authorName'
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Status:</strong> {status}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Último Capítulo:</strong> {latestChapter}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                <strong>Tags:</strong> {tags.join(', ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
