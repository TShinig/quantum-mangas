import type { CoverArtResponse, MangaDexMangasResult, MangaDexMangaResult } from "./types";

export function Mangadex() {
  const BASE_URL = 'https://api.mangadex.org';

  async function getMangas() {
    const response = await fetch(`${BASE_URL}/manga`);
    const result: MangaDexMangasResult = await response.json();

    const items = await Promise.all(result.data.map(async item => {
      const coverId = item.relationships.find(r => r.type === 'cover_art')?.id;
      const coverUrl = await getCover({coverId, mangaId: item.id});
      const tags = item.attributes.tags.map(tag => tag.attributes.name.en);
      const status = item.attributes.status;
      const latestChapter = item.attributes.lastChapter || "Não foi encontrado capítulos";
      const authorId = item.relationships.find((r) => r.type === 'author')?.id;
      const authorName = authorId ? await getAuthor(authorId) : 'Desconhecido';
      const description = item.attributes.description;
      const format = item.type;

      return {
        ...item,
        coverUrl,
        authorName,
        tags,
        status,
        latestChapter,
        description,
        format,
      }
    }));

    return items;
  }

  async function getManga(mangaId: string) {
    const response = await fetch(`${BASE_URL}/manga/${mangaId}`);
    const result: MangaDexMangaResult = await response.json();

      const item = result.data;
      const coverId = item.relationships.find(r => r.type === 'cover_art')?.id;
      const coverUrl = await getCover({coverId, mangaId: item.id});
      const tags = item.attributes.tags.map(tag => tag.attributes.name.en);
      const status = item.attributes.status;
      const latestChapter = item.attributes.lastChapter || "Não foi encontrado capítulos";
      const authorId = item.relationships.find((r) => r.type === 'author')?.id;
      const authorName = authorId ? await getAuthor(authorId) : 'Desconhecido';
      const description = item.attributes.description.pt_br ?? item.attributes.description.en ?? "Não possui descrição.";
      const format = item.type;

      return {
        ...item,
        coverUrl,
        authorName,
        tags,
        status,
        latestChapter,
        description,
        format,
      }
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

  async function getChapters(mangaId: string) {
    const chaptersResponse = await fetch(`https://api.mangadex.org/chapter?manga=${mangaId}`);
    const chaptersData = await chaptersResponse.json();

    const chapters = chaptersData.data.map((chapter: any) => ({
      id: chapter.id,
      volume: chapter.attributes.volume,
      chapter: chapter.attributes.chapter,
      title: chapter.attributes.title || `Capítulo ${chapter.attributes.chapter}`,
      publishDate: chapter.attributes.publishAt,
    }));

    return chapters;
  }

  async function getChapterImages(chapterId: string | undefined) {
    const contentResponse = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
    const imageData = await contentResponse.json();

    const imageUrls = imageData.chapter.data.map((fileName: string) =>
      `${imageData.baseUrl}/data/${imageData.chapter.hash}/${fileName}`
    );

    return imageUrls;
  }

  return {
    getMangas,
    getManga,
    getChapters,
    getChapterImages
  };
}