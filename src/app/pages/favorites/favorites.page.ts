import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { FavoriteService } from '../../services/favorite.service';
import { PokemonService } from '../../services/pokemon.service';

import { PokemonCardComponent } from '../../components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    RouterModule,
    PokemonCardComponent
  ]
})
export class FavoritesPage implements OnInit {
  pokemons: any[] = [];

  loading = false;

  constructor(
    private favoriteService: FavoriteService,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    const favoriteNames = this.favoriteService.getFavorites();

    this.pokemonService.getFavoritePokemons(favoriteNames).subscribe(pokemons => {
      this.pokemons = pokemons;
    });
    this.loading = false;
  }
}
