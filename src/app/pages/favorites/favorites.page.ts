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

  constructor(
    private favoriteService: FavoriteService,
    private pokemonService: PokemonService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    const favoriteNames = this.favoriteService.getFavorites();
    const requests = favoriteNames.map(name =>
      this.pokemonService.getPokemonDetail(name)
    );

    Promise.all(requests.map(req => req.toPromise())).then(results => {
      this.pokemons = results.map(pokemon => ({
        name: pokemon.name,
        image: pokemon.sprites.front_default
      }));
    });
  }
}
