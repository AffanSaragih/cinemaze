export interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
  video: boolean;
}

export interface TmdbCredits {
  id: number;
  cast: TmdbCast[];
  crew: TmdbCrew[]; // Tetap disimpan, tidak harus dipakai
}

export interface TmdbCast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
}

export interface TmdbCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}
