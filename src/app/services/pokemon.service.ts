import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, of, switchMap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  // Get all pokemons (the 151 limit is for the original ones)
  getPokemons(limit: number = 151, offset: number = 0): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`).pipe(
      map((response) => response.results),
      mergeMap((results: any[]) =>
        forkJoin(
          results.map((pokemon: any, index: number) => {
            const id = offset + index + 1;
            const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

            return forkJoin([
              this.getPokemonDetail(pokemon.name),
              this.getPokemonSpecies(pokemon.name)
            ]).pipe(
              map(([detail, speciesData]) => ({
                name: pokemon.name,
                id,
                image,
                habitat: speciesData.habitat?.name || 'unknown',
                types: detail.types.map((t: any) => t.type.name)
              })),
              catchError(err => {
                console.error(`Erro ao carregar dados do Pokémon ${pokemon.name}`, err);
                return of(null);
              })
            );
          })
        )
      ),
      map(results => results.filter(p => p !== null)) // remove null values
    );
  }

  // Get habitats info by name or ID
  getPokemonSpecies(nameOrId: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${nameOrId}`).pipe(
      catchError(err => {
        console.error(`Erro ao buscar espécie do Pokémon ${nameOrId}`, err);
        return of({ habitat: { name: 'unknown' } });
      })
    );
  }

  // Get info about a specific pokemon by name
  getPokemonDetail(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${name}`).pipe(
      catchError(err => {
        console.error(`Erro ao buscar detalhes do Pokémon ${name}`, err);
        return of({
          name,
          id: 0,
          sprites: { front_default: '' },
          types: []
        });
      })
    );
  }

  // Get favorite pokemons info
  getFavoritePokemons(names: string[]): Observable<any[]> {
    if (names.length === 0) {
      return of([]);
    }
    
    return forkJoin(
      names.map(name =>
        forkJoin([
          this.getPokemonDetail(name),
          this.getPokemonSpecies(name)
        ]).pipe(
          map(([detail, species]) => ({
            name: detail.name,
            id: detail.id,
            image: detail.sprites.front_default,
            habitat: species.habitat?.name || 'unknown',
            types: detail.types.map((t: any) => t.type.name)
          })),
          catchError(err => {
            console.error(`Erro ao carregar Pokémon favorito ${name}`, err);
            return of(null);
          })
        )
      )
    ).pipe(
      map(results => results.filter(p => p !== null))
    );
  }
}
