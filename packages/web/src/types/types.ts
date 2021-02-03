export enum Sentiment {
  POSITIVE = 2,
  NEUTRAL = 1,
  MIXED = 0,
  NEGATIVE = -1,
}
export interface FacebookComment {
  message?: string;
  likeCount: number;
  id: string;
  sentiment?: Sentiment;
}

export interface FacebookPost {
  message?: string;
  likeCount: number;
  id: string;
  postSentiment?: Sentiment;
  // average of comments sentiment from -1 to 1
  overallSentiment?: number;
  // TODO add shares and commentCount
}

export interface FacebookPage {
  id: string;
  pageAccessToken?: string;
  name: string;
  pictureUrl: string;
}

export interface User {
  name?: string;
  email?: string;
  image?: string;
  facebookAccessToken?: string;
  facebookPages?: FacebookPage[];
}
