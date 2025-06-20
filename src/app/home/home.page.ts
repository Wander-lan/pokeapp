import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { PokemonService } from '../services/pokemon.service';

import { PokemonCardComponent } from '../components/pokemon-card/pokemon-card.component';
import { PaginationComponent } from '../components/pagination/pagination.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    PokemonCardComponent,
    PaginationComponent
  ],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];
  displayedPokemons: any[] = [];
  filteredPokemons: any[] = [];

  limit = 151;
  offset = 0;

  currentPage = 1;
  pageSize = 18;
  totalPages = 1;

  loading = false;

  searchQuery: string = '';

  constructor(
    private pokemonService: PokemonService,
  ) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons(this.limit, this.offset).subscribe((data) => {
      this.pokemons = [...data]; // mantém os anteriores
      this.applySearchFilter();
      this.loading = false;
    });
  }

  onSearchChange() {
    this.currentPage = 1;
    this.applySearchFilter();
  }

  applySearchFilter() {
    const query = this.searchQuery.toLowerCase().trim();

    if (query === '') {
      this.filteredPokemons = this.pokemons;
    } else {
      this.filteredPokemons = this.pokemons.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.id.toString().includes(query)
      );
    }

    this.totalPages = Math.ceil(this.filteredPokemons.length / this.pageSize);
    this.setPage(this.currentPage);
  }


  setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedPokemons = this.filteredPokemons.slice(start, end);
  }
}
