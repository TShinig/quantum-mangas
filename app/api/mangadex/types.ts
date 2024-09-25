export interface MangaDexMangasResult {
  result: string;
  response: string;
  data: MangaData[];
}

export interface MangaDexMangaResult {
  result: string;
  response: string;
  data: MangaData;
}

export interface CoverArtResponse {
  result: string;
  response: string;
  data: CoverArt;
  limit: number;
  offset: number;
  total: number;
}

export interface AuthorResponse {
  result: string;
  response: string;
  data: Author[];
  limit: number;
  offset: number;
  total: number;
}

interface MangaData {
  id: string;
  type: string;
  attributes: MangaAttributes;
  relationships: MangaRelationship[];
}

interface MangaRelationship {
  id: string;
  type: string;
  related?: string;
}

interface MangaAttributes {
  title: {
    en: string;
  };
  altTitles: Record<string, string>[];
  description: Record<string, string>;
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

interface MangaTag {
  id: string;
  type: string;
  attributes: {
    name: {
      en: string;
    };
    description: Record<string, string>;
    group: string;
    version: number;
  };
  relationships: {
    id: string,
    type: string,
    related?: string,
  }[];
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

interface Author {
  id: string;
  type: string;
  attributes: AuthorAttributes;
  relationships: AuthorRelationship[];
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

interface AuthorRelationship {
  id: string;
  type: string;
}

/*

interface ChapterAttributes {
  volume: string;
  chapter: string;
  title: string;
  translatedLanguage: string;
  externalUrl: string | null;
  publishAt: string;
  readableAt: string;
  createdAt: string;
  updatedAt: string;
  pages: number;
  version: number;
}

interface ChapterRelationship {
  id: string;
  type: string;
}

interface Chapter {
  id: string;
  type: string;
  attributes: ChapterAttributes;
  relationships: Relationship;
}

interface ChapterResponse {
  result: string;
  response: string;
  data: Chapter[];
  limit: number;
  offset: number;
  total: number;
}
*/