export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Thought {
  id: number;
  description: string;
  textType: string;
}

export interface ThoughtBucket {
  id: number;
  thoughtModuleId: number;
  description: string;
  parentId?: number;
  sortOrder: number;
  showOnDashboard: boolean;
}

export interface ThoughtDetail {
  id: number;
  description: string;
  thoughtId: number;
  sortOrder: number;
}

export interface ThoughtWebsiteLink {
  thoughtId: number;
  websiteLinkId: number;
}

export interface ServiceResponse<T> {
  results: T[];
  isSuccess: boolean;
  errorMessage?: string;
}
