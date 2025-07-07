import { TmdbCast, TmdbCrew } from '@/types/tmdb';
import { Cast, Crew } from '@/types/movie';

export function normalizeCast(cast: TmdbCast): Cast {
  return {
    id: cast.id,
    name: cast.name,
    character: cast.character,
    profileUrl: `https://image.tmdb.org/t/p/w500${cast.profile_path}`,
  };
}

export function normalizeCrew(crew: TmdbCrew): Crew {
  return {
    id: crew.id,
    name: crew.name,
    job: crew.job,
    department: crew.department,
    profileUrl: `https://image.tmdb.org/t/p/w500${crew.profile_path}`,
  };
}
