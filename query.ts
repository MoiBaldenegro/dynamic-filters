import  type { Song } from './entities/Song.ts'; // Extensión .ts obligatoria en ESM nativo
import songArray from './data/song.json' with { type: 'json' }; // Atributo obligatorio para JSON
import { createFilterBuilder, IFilterBuilder } from './filterBuilder.ts';

export interface Filter {
    [x:string]: any;
}

export interface SongFilter extends Filter {
    releaseYear: number;
    durationMs: number;
    isExplicit: boolean;
}

const filterByReleaseYear: SongFilter = {
    releaseYear: 2020,
    durationMs: 242253,
    isExplicit: false,
};

export type Condition<T> = (builder: IFilterBuilder<T>, filterValue: any, key: keyof T) => IFilterBuilder<T>;
export type Conditions<T> = {
    [K in keyof T]?: Condition<T>;
};

const equalCondition: Condition<Song> = (builder, filterValue, key) => {
    return builder.where(key, (itemValue, targetValue) => itemValue === targetValue, filterValue);
}

const isMinorCondition: Condition<Song> = (builder, filterValue, key) => {
    return builder.where(key, (itemValue, targetValue) => itemValue < targetValue, filterValue);
}

const songConditions: Conditions<Song> = {
    releaseYear: isMinorCondition,
};

function build<t>(queryBuilder: IFilterBuilder<t>, filter: Filter, conditions: Conditions<t>){

    const query: IFilterBuilder<t> = Object
        .keys(filter)
        .filter((key) => filter[key] !== undefined && conditions[key as keyof t])
        .reduce((builder, key) => {
        const condition = conditions[key as keyof t];
        return condition ? condition(builder, filter[key], key as keyof t) : builder;
    }, queryBuilder);

    return query;

}

             
function main(): void {

    const queryBuilder: IFilterBuilder<Song> = createFilterBuilder(songArray as Song[]);
    const filteredSongs: Song[] = build(queryBuilder, filterByReleaseYear, songConditions).build();
    console.log(`Filtered Songs: ${filteredSongs.length}`);
    filteredSongs.forEach((song: Song) => {
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