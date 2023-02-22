import { ThoughtCategory } from "./thoughtCategory.model";
import { Timeline } from "./timeline.model";
import { ThoughtDetail } from "./thoughtDetail.model";

export interface Thought {
  thoughtId: number;
  description: string;
  thoughtCategoryId: number;
  thoughtCategory: ThoughtCategory;
  thoughtDetail: ThoughtDetail;
  isQuote: boolean;
  timeline: Timeline;
}
