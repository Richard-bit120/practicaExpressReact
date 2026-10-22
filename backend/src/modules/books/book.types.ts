export interface IBookCreateInput {
  title: string;
  isbn?: string;
  year?: number;
  authorId: number;
  genreId: number;
  shelfId: number;
  sagaId?: number | null;
}

export interface IBookUpdateInput {
  title?: string;
  isbn?: string;
  year?: number;
  authorId?: number;
  genreId?: number;
  shelfId?: number;
  sagaId?: number | null;
}

export interface IBookFilters {
  genreId?: string;
  authorId?: string;
  sagaId?: string;
  year?: string;
}