export type Video = {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  isOutput: boolean;
  s3Key: string;
  s3Bucket: string;
  createdAt: string;
};

export type Project = {
  id: string;
  prompt: string;
  code: string;
  createdAt: string;
  updatedAt: string;
  videos: Video[];
};

export type PaginationData = {
  total: number;
  page: number;
  limit: number;
  pages: number;
};

export type ProjectsResponse = {
  data: Project[];
  pagination: PaginationData;
};

export type User = {
  id: string;
  username: string;
  email: string;
  plan?: string;
};

export type UserResponse = {
  user: User;
};
