import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { FavoriteService } from '../../services/favorite.service';
import { PokemonService } from '../../services/pokemon.service';
import { MessageService } from '../../services/message.service';

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
  favoritePokemons: any[] = [];

  loading = false;

  constructor(
    private favoriteService: FavoriteService,
    private pokemonService: PokemonService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading = true;
    const favoriteNames = this.favoriteService.getFavorites();

    this.pokemonService.getFavoritePokemonList(favoriteNames).subscribe({
      next: (data) => {
        this.favoritePokemons = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.messageService.showError('Erro ao carregar seus favoritos.');
      }
    });
  }
}
