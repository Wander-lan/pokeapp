import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PokemonService } from './pokemon.service';
import { PokemonDetailRaw } from '../models/pokemon.model';
import { of } from 'rxjs';

describe('PokemonService', () => {
  let service: PokemonService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokemonService]
    });

    service = TestBed.inject(PokemonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Tests getPokemonDetailRaw
  it('deve retornar os detalhes brutos de um Pokémon', () => {
    const mockResponse: PokemonDetailRaw = {
      name: 'pikachu',
      id: 25,
      sprites: {
        front_default: 'front.png',
        other: {
          'official-artwork': {
            front_default: 'official.png'
          }
        }
      },
      types: [],
      abilities: [],
      height: 4,
      weight: 60,
      base_experience: 112,
      stats: [
        {
          base_stat: 50,
          stat: { name: 'speed' }
        }
      ]
    };

    service.getPokemonDetailRaw('pikachu').subscribe(detail => {
      expect(detail).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/pikachu');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  // Tests getPokemonSpecies with fallback
  it('deve retornar dados da espécie com fallback em caso de erro', () => {
    service.getPokemonSpecies('missingno').subscribe(species => {
      expect(species.habitat?.name).toBe('unknown');
      expect(species.gender_rate).toBe(-1);
    });

    const req = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-species/missingno');
    req.error(new ErrorEvent('Erro'));
  });

  // Tests getPokemonList
  it('deve retornar a lista de Pokémon com nomes', () => {
    const mockApiResponse = {
      results: [
        { name: 'bulbasaur' },
        { name: 'charmander' }
      ]
    };

    const detailBulbasaur = {
      name: 'bulbasaur',
      id: 1,
      sprites: { front_default: 'bulba.png' },
      types: [{ type: { name: 'grass' } }]
    };

    const speciesBulbasaur = {
      habitat: { name: 'forest' }
    };

    const detailCharmander = {
      name: 'charmander',
      id: 4,
      sprites: { front_default: 'char.png' },
      types: [{ type: { name: 'fire' } }]
    };

    const speciesCharmander = {
      habitat: { name: 'mountain' }
    };

    service.getPokemonList(2, 0).subscribe(list => {
      expect(list.length).toBe(2);
      expect(list[0].name).toBe('bulbasaur');
      expect(list[1].name).toBe('charmander');
    });

    const listReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon?limit=2&offset=0');
    listReq.flush(mockApiResponse);

    // bulbasaur
    const bulbaDetail = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    bulbaDetail.flush(detailBulbasaur);

    const bulbaSpecies = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-species/bulbasaur');
    bulbaSpecies.flush(speciesBulbasaur);

    // charmander
    const charDetail = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/charmander');
    charDetail.flush(detailCharmander);

    const charSpecies = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-species/charmander');
    charSpecies.flush(speciesCharmander);
  });


  // Tests getBasicPokemonData
  it('deve retornar dados básicos de um Pokémon', () => {
    const detailResponse = {
      name: 'squirtle',
      id: 7,
      sprites: {
        front_default: 'squirtle.png'
      },
      types: [{ type: { name: 'water' } }]
    };

    const speciesResponse = {
      habitat: { name: 'sea' }
    };

    service.getBasicPokemonData('squirtle').subscribe(data => {
      expect(data.name).toBe('squirtle');
      expect(data.image).toBe('squirtle.png');
      expect(data.habitat).toBe('sea');
      expect(data.types).toEqual(['water']);
    });

    const detailReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/squirtle');
    detailReq.flush(detailResponse);

    const speciesReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-species/squirtle');
    speciesReq.flush(speciesResponse);
  });

  // Tests getPokemonDetail
  it('deve retornar detalhes completos de um Pokémon', () => {
    const rawDetail = {
      name: 'bulbasaur',
      id: 1,
      sprites: {
        other: { 'official-artwork': { front_default: 'bulba.png' } },
      },
      height: 7,
      weight: 69,
      base_experience: 64,
      types: [{ type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'overgrow' } }],
      stats: [{ base_stat: 45, stat: { name: 'hp' } }]
    };

    const species = {
      habitat: { name: 'forest' },
      gender_rate: 1,
      flavor_text_entries: [
        { flavor_text: 'A seed is planted...', language: { name: 'en' } }
      ]
    };

    const weaknesses = ['fire', 'ice'];

    spyOn(service, 'getPokemonWeaknesses').and.returnValue(of(weaknesses));

    service.getPokemonDetail('bulbasaur').subscribe(pokemon => {
      expect(pokemon.name).toBe('bulbasaur');
      expect(pokemon.highResImage).toBe('bulba.png');
      expect(pokemon.habitat).toBe('forest');
      expect(pokemon.weaknesses).toEqual(['fire', 'ice']);
      expect(pokemon.stats?.[0].stat.name).toBe('hp');
    });

    const rawReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon/bulbasaur');
    rawReq.flush(rawDetail);

    const speciesReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-species/bulbasaur');
    speciesReq.flush(species);
  });

  // Tests getPokemonWeaknesses
  it('deve retornar as fraquezas de um tipo', () => {
    const typeUrl = 'https://pokeapi.co/api/v2/type/fire';

    const types = [{ type: { name: 'fire', url: typeUrl } }];

    const fireTypeResponse = {
      damage_relations: {
        double_damage_from: [
          { name: 'water' },
          { name: 'rock' },
          { name: 'ground' }
        ]
      }
    };

    service.getPokemonWeaknesses(types).subscribe(result => {
      expect(result).toContain('water');
      expect(result).toContain('rock');
      expect(result).toContain('ground');
    });

    const req = httpMock.expectOne(typeUrl);
    req.flush(fireTypeResponse);
  });

  // Tests getPokemonEvolutionChain
  it('deve retornar a cadeia de evolução', () => {
    const speciesResponse = {
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' }
    };

    const evolutionChain = {
      chain: {
        species: { name: 'bulbasaur' },
        evolves_to: [
          {
            species: { name: 'ivysaur' },
            evolves_to: [
              {
                species: { name: 'venusaur' },
                evolves_to: []
              }
            ]
          }
        ]
      }
    };

    const basicData = {
      name: 'bulbasaur', id: 1, image: '', habitat: '', types: []
    };

    spyOn(service, 'getBasicPokemonData').and.callFake(name => of({ ...basicData, name }));

    service.getPokemonEvolutionChain('bulbasaur').subscribe(chain => {
      expect(chain.length).toBe(3);
      expect(chain.map(c => c.name)).toEqual(['bulbasaur', 'ivysaur', 'venusaur']);
    });

    const speciesReq = httpMock.expectOne('https://pokeapi.co/api/v2/pokemon-species/bulbasaur');
    speciesReq.flush(speciesResponse);

    const evoReq = httpMock.expectOne('https://pokeapi.co/api/v2/evolution-chain/1/');
    evoReq.flush(evolutionChain);
  });
});
