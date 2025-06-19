import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private storageKey = 'favoritePokemons';

  getFavorites(): string[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  isFavorite(name: string): boolean {
    return this.getFavorites().includes(name);
  }

  toggleFavorite(name: string): void {
    let favorites = this.getFavorites();

    if (favorites.includes(name)) {
      favorites = favorites.filter(p => p !== name);
    } else {
      favorites.push(name);
    }

    localStorage.setItem(this.storageKey, JSON.stringify(favorites));
  }
}
