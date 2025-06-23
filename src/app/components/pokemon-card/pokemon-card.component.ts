import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

import { FavoriteService } from 'src/app/services/favorite.service';

import { getTypeColor } from 'src/app/utils/pokemon-utils';

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

  getColorForType(type: string): string {
    return getTypeColor(type);
  }
}
