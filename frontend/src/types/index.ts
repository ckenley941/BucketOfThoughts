export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Thought {
  id: number;
  description: string;
  textType: string;
  showOnDashboard: boolean;
  thoughtDate?: string;
  bucket: ThoughtBucket;
  details?: ThoughtDetail[];
  websiteLinks?: ThoughtWebsiteLink[];
}

export type RecentThoughtStatus = 'Added' | 'Viewed' | 'Random' | string | number;

export interface RecentThought extends Thought {
  status: RecentThoughtStatus;
}

export interface ThoughtModule {
  id: number;
  description: string;
}

export interface ThoughtBucket {
  id: number;
  thoughtModuleId: number;
  /** Set on read from API projection (ThoughtModule.Description) */
  moduleDescription?: string;
  description: string;
  parentId?: number;
  /** Set on read from API projection (parent ThoughtBucket.Description) */
  parentDescription?: string | null;
  sortOrder: number;
  showOnDashboard: boolean;
}

export interface JsonDetail {
  keys: string[];
  json: string;
}

export interface ThoughtDetail {
  id: number;
  description: string;
  thoughtId: number;
  sortOrder: number;
  textType: string;
  jsonDetail?: JsonDetail;
}

export interface ThoughtWebsiteLink {
  thoughtId: number;
  websiteLinkId: number;
  websiteUrl: string;
  description?: string;
  sortOrder: number;
}

export interface RelatedThought {
  id: number;
  parentThoughtId: number;
  relatedThoughtId: number;
  sortOrder: number;
  relatedThought?: Thought;
}

export interface ServiceResponse<T> {
  results: T[];
  isSuccess: boolean;
  errorMessage?: string;
}
