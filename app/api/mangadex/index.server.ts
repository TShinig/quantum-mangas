import type { CoverArtResponse, MangaDexResult } from "./types";

export function Mangadex() {
  const BASE_URL = 'https://api.mangadex.org';

  async function getMangas() {
    const response = await fetch(`${BASE_URL}/manga`);
    const result: MangaDexResult = await response.json();

    const items = await Promise.all(result.data.map(async item => {
      const coverId = item.relationships.find(r => r.type === 'cover_art')?.id;
      const coverUrl = await getCover({coverId, mangaId: item.id});
      const tags = item.attributes.tags.map(tag => tag.attributes.name.en);
      const status = item.attributes.status;
      const latestChapter = item.attributes.lastChapter || "Não foi encontrado capítulos";
      const authorId = item.relationships.find((r) => r.type === 'author')?.id;
      const authorName = authorId ? await getAuthor(authorId) : 'Desconhecido';

      return {
        ...item,
        coverUrl,
        authorName,
        tags,
        status,
        latestChapter,
      }
    }));

    return items;
  }

  async function getCover({coverId, mangaId}: {coverId?: string, mangaId: string}) {
    try {
      if (coverId) {
        const response = await fetch(`${BASE_URL}/cover/${coverId}`);
        const result: CoverArtResponse = await response.json();
        const fileName = result.data.attributes.fileName

        return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
      }
    } catch (err) {}

    return `https://source.unsplash.com/random`; 
  }

  async function getAuthor(authorId: string) {
    try {
      const response = await fetch(`${BASE_URL}/author/${authorId}`);
      const result = await response.json();

      return result.data.attributes.name;
    } catch (err) {
      return 'Desconhecido';
    }
  }


  return {
    getMangas,
  };
}