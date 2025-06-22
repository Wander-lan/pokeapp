import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, of, switchMap, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) {}

  private handleError<T>(operation = 'operação', fallback: T): (error: any) => Observable<T> {
    return (error: any): Observable<T> => {
      console.error(`Erro em ${operation}:`, error);
      return of(fallback);
    };
  }

  // Get habitats info by name or ID
  getPokemonSpecies(nameOrId: string | number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${nameOrId}`).pipe(
      catchError(this.handleError('buscar espécie', { habitat: { name: 'unknown' } }))
    );
  }

  // Get pokemon weakness info
  getPokemonWeaknesses(types: any[]): Observable<string[]> {
    const typeRequests: Observable<any>[] = types.map(t =>
      this.http.get<any>(t.type.url).pipe(
        catchError(this.handleError(`fraquezas do tipo ${t.type.name}`, { damage_relations: { double_damage_from: [] } }))
      )
    );

    return forkJoin(typeRequests).pipe(
      map(typeDataArray => {
        const weaknesses = typeDataArray.flatMap(typeData =>
          typeData.damage_relations.double_damage_from.map((d: any) => d.name)
        );
        return Array.from(new Set(weaknesses));
      })
    );
  }

  // Get basic pokemon details by name
  getPokemonDetailRaw(name: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${name}`).pipe(
      catchError(this.handleError(`detalhes de ${name}`, {
        name, id: 0, sprites: { front_default: '' }, types: [], abilities: [], height: 0, weight: 0, base_experience: 0
      }))
    );
  }
  

  // Get complete pokemon details (to be shown in the page of each pokemon)
  getPokemonDetail(name: string): Observable<any> {
    return this.getPokemonDetailRaw(name).pipe(
      switchMap((detail) =>
        forkJoin([
          of(detail),
          this.getPokemonSpecies(name),
          this.getPokemonWeaknesses(detail.types)
        ]).pipe(
          map(([detail, species, weaknesses]) => ({
            name: detail.name,
            id: detail.id,
            highResImage: detail.sprites.other['official-artwork'].front_default,
            height: detail.height,
            weight: detail.weight,
            base_experience: detail.base_experience,
            sprites: detail.sprites,
            types: detail.types.map((t: any) => t.type.name),
            abilities: detail.abilities.map((a: any) => a.ability.name),
            habitat: species.habitat?.name || 'unknown',
            genderRate: species.gender_rate,
            weaknesses
          }))
        )
      )
    );
  }

  // Get minimal pokemon info (for cards and lists)
  getBasicPokemonData(name: string): Observable<any> {
    return forkJoin([
      this.getPokemonDetailRaw(name),
      this.getPokemonSpecies(name).pipe(
        catchError(this.handleError('buscar espécie', { habitat: { name: 'unknown' } }))
      )
    ]).pipe(
      map(([detail, species]) => ({
        name: detail.name,
        id: detail.id,
        image: detail.sprites.front_default,
        habitat: species.habitat?.name || 'unknown',
        types: detail.types.map((t: any) => t.type.name)
      }))
    );
  }

  // Get all pokemon (the 151 limit is for the original ones)
  getPokemonList(limit: number = 151, offset: number = 0): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/pokemon?limit=${limit}&offset=${offset}`).pipe(
      map((response) => response.results),
      mergeMap((results: any[]) =>
        forkJoin(
          results.map(pokemon => this.getBasicPokemonData(pokemon.name))
        )
      ),
      map(results => results.filter(p => p !== null))
    );
  }

  // Get favorite pokemon list
  getFavoritePokemonList(names: string[]): Observable<any[]> {
    if (names.length === 0) return of([]);

    return forkJoin(
      names.map(name => this.getBasicPokemonData(name))
    ).pipe(
      map(results => results.filter(p => p !== null))
    );
  }
}
