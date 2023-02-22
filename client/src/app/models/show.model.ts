import { Band } from "./band.model";
import { MusicVenue } from "./musicVenue.model";

export interface Show {
  showId: number;
  showDate: Date;
  dayOfWeek: string;
  notes: string;
  story: string;
  onWatchlist: boolean;
  band: Band;
  musicVenue: MusicVenue;
}
