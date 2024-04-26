import {Comment} from "./Comment";
export interface Feedback {
  id?: number;
  spotId: number;
  comments: Comment[];
}
