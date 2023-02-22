import { MovieCastMember } from "./movieCastMember.model";

export interface Movie {
  movieId: number;
  name: string;
  year: number;
  description: string;
  lastSeenDate: Date;
  isFavorite: boolean;
  onWatchlist: boolean;
  movieCast: MovieCastMember[];
}
