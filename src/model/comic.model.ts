export class CreateComicRequest {
  slug: string;
  name: string;
  image: string | null;
  synopsis: string;
  author: string;
  artist: string;
  release: string;
  status: 'ongoing' | 'complete';
  genreId: string[];
  comicTypeId: string;
}

export class ComicResponse {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  synopsis: string;
  author: string;
  artist: string;
  release: number;
  status: 'ongoing' | 'complete';
  genreId: string[];
  comicTypeId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ComicUpdateRequest {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  synopsis: string;
  author: string;
  artist: string;
  release: string;
  status: 'ongoing' | 'complete';
  genreId: string[];
  comicTypeId: string;
}
