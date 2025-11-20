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

export interface ServiceResponse<T> {
  results: T[];
  isSuccess: boolean;
  errorMessage?: string;
}

