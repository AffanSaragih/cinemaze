export interface BaseMovie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  overview?: string;
  backdropUrl?: string;
  releaseDate?: string;
  genreIds?: number[];
  isTrending?: boolean;
  index?: number;
  isDisabled?: boolean;
  trailerPreview?: string;
  trailerKey?: string;
}

export interface MovieWithCasts extends BaseMovie {
  casts: Cast[];
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profileUrl: string;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profileUrl: string;
}

export interface MovieDetail extends BaseMovie {
  genre: string[];
  ageLimit: number;
  casts?: Cast[];
}
