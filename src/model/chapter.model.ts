export class ChapterResponse {
  id: string;
  slug: string;
  name: string;
  content: string;
  comicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ChapterCreateRequest {
  name: string;
  content: string;
}

export class ChapterUpdateRequest {
  id: string;
  name: string;
  content: string;
}
