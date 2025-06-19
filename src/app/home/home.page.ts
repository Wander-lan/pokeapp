import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PokemonService } from '../services/pokemon.service';

import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    PokemonCardComponent
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  displayedPokemons: any[] = [];

  limit = 151;
  offset = 0;

  currentPage = 1;
  pageSize = 8;
  totalPages = 1;

  loading = false;

  constructor(
    private pokemonService: PokemonService,
  ) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons(this.limit, this.offset).subscribe((data) => {
      this.pokemons = [...this.pokemons, ...data]; // mantém os anteriores
      this.totalPages = Math.ceil(this.pokemons.length / this.pageSize);
      this.setPage(this.currentPage);
      this.loading = false;
    });
  }

   setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedPokemons = this.pokemons.slice(start, end);
  }
}
