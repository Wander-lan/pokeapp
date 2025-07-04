import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, mergeMap, Observable, of, switchMap, catchError } from 'rxjs';

import { PokemonBasic, PokemonDetail, PokemonDetailRaw, PokemonSpecies } from '../models/pokemon.model';
import { POKEMON_LIMIT } from '../constants/pokemon.constants';

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
  getPokemonSpecies(nameOrId: string | number): Observable<PokemonSpecies> {
    return this.http.get<any>(`${this.baseUrl}/pokemon-species/${nameOrId}`).pipe(
      catchError(this.handleError('buscar espécie', { 
        habitat: { name: 'unknown' },
        gender_rate: -1,
        flavor_text_entries: [],
        evolution_chain: { url: '' }
      } as PokemonSpecies))
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
  getPokemonDetailRaw(nameOrId: string | number): Observable<PokemonDetailRaw> {
    return this.http.get<any>(`${this.baseUrl}/pokemon/${nameOrId}`).pipe(
      catchError(this.handleError(`detalhes de ${nameOrId}`, {
        name: '',
        id: 0,
        sprites: {
          front_default: '',
          other: {
            'official-artwork': {
              front_default: ''
            }
          }
        },
        types: [],
        abilities: [],
        height: 0,
        weight: 0,
        base_experience: 0,
        stats: [
          {
            base_stat: 0,
            stat: {
              name: ''
            }
          }
        ]
      } as PokemonDetailRaw))
    );
  }
  

  // Get complete pokemon details (to be shown in the page of each pokemon)
  getPokemonDetail(name: string): Observable<PokemonDetail> {
    return this.getPokemonDetailRaw(name).pipe(
      switchMap((detail) =>
        forkJoin([
          of(detail),
          this.getPokemonSpecies(name),
          this.getPokemonWeaknesses(detail.types)
        ]).pipe(
          map(([detail, species, weaknesses]) => {

            // Search for portuguese or english description of the pokemon
            const descriptionEntry = species.flavor_text_entries.find(
              (entry) => entry.language.name === 'pt'
            ) || species.flavor_text_entries.find(
              (entry) => entry.language.name === 'en'
            );

            const description = descriptionEntry?.flavor_text?.replace(/\f/g, ' ') || 'Descrição indisponível.';

            return {
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
              weaknesses,
              description,
              stats: detail.stats
            };
          })
        )
      )
    );
  }

  // Get minimal pokemon info (for cards and lists)
  getBasicPokemonData(name: string): Observable<PokemonBasic> {
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
  getPokemonList(limit: number = POKEMON_LIMIT, offset: number = 0): Observable<PokemonBasic[]> {
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
  getFavoritePokemonList(names: string[]): Observable<PokemonBasic[]> {
    if (names.length === 0) return of([]);

    return forkJoin(
      names.map(name => this.getBasicPokemonData(name))
    ).pipe(
      map(results => results.filter(p => p !== null))
    );
  }

  // Get a pokemon evolution chain
  getPokemonEvolutionChain(nameOrId: string | number): Observable<PokemonBasic[]> {
    return this.getPokemonSpecies(nameOrId).pipe(
      switchMap(species => {
        if (!species.evolution_chain?.url) return of([]);

        return this.http.get<any>(species.evolution_chain.url).pipe(
          map(chainData => {
            const evolutionNames: string[] = [];

            let current = chainData.chain;
            while (current) {
              evolutionNames.push(current.species.name);
              current = current.evolves_to?.[0]; // Get the first evolutive line
            }

            return evolutionNames;
          }),
          switchMap(names => forkJoin(names.map(name => this.getBasicPokemonData(name)))),
          catchError(this.handleError('carregar cadeia de evolução', []))
        );
      })
    );
  }
}
