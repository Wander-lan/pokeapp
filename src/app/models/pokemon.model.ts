export interface PokemonBasic {
  name: string;
  id: number;
  image: string;
  habitat: string;
  types: string[];
}

export interface PokemonDetail {
  name: string;
  id: number;
  highResImage: string;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  };
  types: string[];
  abilities: string[];
  habitat: string;
  genderRate: number;
  weaknesses: string[];
}

export interface PokemonSpecies {
  habitat: {
    name: string;
  } | null;
  gender_rate: number;
}

export interface PokemonDetailRaw {
  name: string;
  id: number;
  height: number;
  weight: number;
  base_experience: number;
  sprites: {
    front_default: string;
    other: {
      ['official-artwork']: {
        front_default: string;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
    };
  }[];
}