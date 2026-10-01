import  type { Song } from './entities/Song.ts'; // Extensión .ts obligatoria en ESM nativo
import songArray from './data/song.json' with { type: 'json' }; // Atributo obligatorio para JSON
import { FilterBuilder } from './filterBuilder.ts';

export interface Filter {
    [x:string]: any;
}

export interface SongFilter extends Filter {
    releaseYear: number;
    durationMs: number;
    isExplicit: boolean;
}

export type Condition<T> = (builder: FilterBuilder<T>, filterValue: any) => FilterBuilder<T>;
export type Conditions<T> = Record<string, Condition<T>>;

const songConditions: Conditions<Song> = {
    releaseYear: (builder: FilterBuilder<Song>, filterValue: number) => builder.where(songArray, { filterValue }),
};

function main(): void {

    const filteredSongs: Song[] = [];
  songArray?.forEach((song: Song) => {
    console.log(`Song Title: ${song.title}`);
    console.log(`Album: ${song.album}`);
    console.log(`Release Year: ${song.releaseYear}`);
    console.log(`Duration (ms): ${song.durationMs}`);
    console.log(`Explicit: ${song.isExplicit}`);
    console.log(`Spotify URL: ${song.spotifyUrl}`);
    console.log('---------------------------');
  });
}

main();