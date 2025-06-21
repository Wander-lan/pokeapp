import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss'],
})
export class PokemonCardComponent {
  @Input() pokemon!: any;

  constructor(
    private favoriteService: FavoriteService,
    private router: Router,
  ) {}

  get habitatBackground(): string {
    const path = this.pokemon?.habitat
      ? `/assets/media/habitat-${this.pokemon.habitat}.png`
      : `/assets/media/habitat-unknown.png`;

    return `url('${path}')`;
  }

  goToDetail(pokemon: any) {
    this.router.navigate(['/pokemon', pokemon.name]);
  }

  isFavorite(name: string): boolean {
    return this.favoriteService.isFavorite(name);
  }

  toggleFavorite(name: string) {
    this.favoriteService.toggleFavorite(name);
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A77A',
      fire: '#EE8130',
      water: '#6390F0',
      electric: '#F7D02C',
      grass: '#7AC74C',
      ice: '#96D9D6',
      fighting: '#C22E28',
      poison: '#A33EA1',
      ground: '#E2BF65',
      flying: '#A98FF3',
      psychic: '#F95587',
      bug: '#A6B91A',
      rock: '#B6A136',
      ghost: '#735797',
      dragon: '#6F35FC',
      dark: '#705746',
      steel: '#B7B7CE',
      fairy: '#D685AD',
      unknown: '#AAAAAA'
    };

    return typeColors[type.toLowerCase()] || '#666';
  }
}
