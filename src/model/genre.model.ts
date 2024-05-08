export class CreateGenreRequest {
  name: string;
}

export class GenreResponse {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UpdateGenreRequest {
  id: string;
  name?: string;
}
