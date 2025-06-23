import { TestBed } from '@angular/core/testing';
import { FavoriteService } from './favorite.service';

describe('FavoriteService', () => {
  let service: FavoriteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoriteService);

    //Clean the storage before the tests
    localStorage.clear();
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('getFavorites deve retornar lista vazia se não houver favoritos', () => {
    expect(service.getFavorites()).toEqual([]);
  });

  it('getFavorites deve retornar lista do localStorage', () => {
    localStorage.setItem('favoritePokemons', JSON.stringify(['pikachu', 'charizard']));
    expect(service.getFavorites()).toEqual(['pikachu', 'charizard']);
  });

  it('isFavorite deve retornar true se o Pokémon estiver nos favoritos', () => {
    localStorage.setItem('favoritePokemons', JSON.stringify(['pikachu']));
    expect(service.isFavorite('pikachu')).toBeTrue();
  });

  it('isFavorite deve retornar false se o Pokémon não estiver nos favoritos', () => {
    localStorage.setItem('favoritePokemons', JSON.stringify(['bulbasaur']));
    expect(service.isFavorite('charmander')).toBeFalse();
  });

  it('toggleFavorite deve adicionar um Pokémon se ele não estiver na lista', () => {
    service.toggleFavorite('squirtle');
    expect(service.getFavorites()).toContain('squirtle');
  });

  it('toggleFavorite deve remover um Pokémon se ele estiver na lista', () => {
    localStorage.setItem('favoritePokemons', JSON.stringify(['eevee']));
    service.toggleFavorite('eevee');
    expect(service.getFavorites()).not.toContain('eevee');
  });

  it('toggleFavorite deve funcionar corretamente com múltiplos Pokémon', () => {
    service.toggleFavorite('pidgey');
    service.toggleFavorite('rattata');
    expect(service.getFavorites()).toEqual(['pidgey', 'rattata']);

    service.toggleFavorite('pidgey');
    expect(service.getFavorites()).toEqual(['rattata']);
  });
});
