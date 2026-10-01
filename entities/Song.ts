export interface Song {
  id: string;
  title: string;
  album: string;
  releaseYear: number;
  durationMs: number;
  isExplicit: boolean;
  spotifyUrl: string;
}
