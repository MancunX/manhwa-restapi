export class ComicTypeResponse {
  id: string;
  slug: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ComicTypeCreateRequest {
  name: string;
}

export class ComicTypeUpdateRequest {
  id: string;
  name: string;
}

export class ComicTypeDeleteRequest {
  id: string;
}
