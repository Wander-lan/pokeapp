import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { PokemonService } from '../services/pokemon.service';
import { FavoriteService } from '../services/favorite.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];

  limit = 4;
  offset = 0;
  loading = false;

  constructor(
    private pokemonService: PokemonService,
    private router: Router,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit() {
    this.loadPokemons();
  }

  goToDetail(pokemon: any) {
    this.router.navigate(['/pokemon', pokemon.name]);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }

  loadPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons(this.limit, this.offset).subscribe((data) => {
      this.pokemons = [...this.pokemons, ...data]; // mantém os anteriores
      this.offset += this.limit;
      this.loading = false;
    });
  }

  isFavorite(name: string): boolean {
    return this.favoriteService.isFavorite(name);
  }

  toggleFavorite(name: string) {
    this.favoriteService.toggleFavorite(name);
  }
}
