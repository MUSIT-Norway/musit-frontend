export type SavedFile = {
  id: string;
  fid: string;
  title: string;
  fileType: string;
  owner: { ownerId: string; ownerType: string };
  collection: string;
  path: string;
  version: number;
  published: boolean;
  createdStamp: { date: string; by: string };
  documentDetails: { number: number };
};

export type ErrorSaving = {
  error: { status: number; response?: any };
  file: File;
};

export type ErrorLoading = {
  error: { status: number; response?: any };
  files: Array<string>;
};

export function isErrorLoading(
  fileOrError: SavedFile | ErrorLoading
): fileOrError is ErrorLoading {
  return (fileOrError as ErrorLoading).error !== undefined;
}

export function isErrorSaving(
  fileOrError: SavedFile | ErrorSaving
): fileOrError is ErrorSaving {
  return (fileOrError as ErrorSaving).error !== undefined;
}
