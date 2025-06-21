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

  selectedTypes: string[] = [];
  selectedHabitats: string[] = [];

  allTypes: string[] = [];
  allHabitats: string[] = [];
  isFilterOpen = false;

  constructor(
    private pokemonService: PokemonService,
  ) {}

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.loading = true;
    this.pokemonService.getPokemons(this.limit, this.offset).subscribe((data) => {
      this.pokemons = [...data];
      this.allTypes = this.getUniqueValues(data.flatMap(p => p.types));
      this.allHabitats = this.getUniqueValues(data.map(p => p.habitat));
      this.applySearchFilter();
      this.loading = false;
    });
  }

  getUniqueValues(arr: string[]): string[] {
    return Array.from(new Set(arr)).sort();
  }

  onSearchChange() {
    this.applySearchFilter();
  }

  applySearchFilter() {
    const query = this.searchQuery.toLowerCase().trim();

    this.filteredPokemons = this.pokemons.filter(p => {
      const matchesQuery = p.name.toLowerCase().includes(query) || p.id.toString().includes(query);
      const matchesType = this.selectedTypes.length ? p.types.some((t: string) => this.selectedTypes.includes(t)) : true;
      const matchesHabitat = this.selectedHabitats.length ? this.selectedHabitats.includes(p.habitat) : true;

      return matchesQuery && matchesType && matchesHabitat;
    });

    this.totalPages = Math.ceil(this.filteredPokemons.length / this.pageSize);
    
    this.currentPage = 1;
    this.setPage(this.currentPage);
    if (this.isFilterOpen) this.closeFilterModal();
  }

  openFilterModal() {
    this.isFilterOpen = true;
  }

  closeFilterModal() {
    this.isFilterOpen = false;
  }

  handleModalDismiss() {
    document.activeElement && (document.activeElement as HTMLElement).blur();
    this.isFilterOpen = false;
  }

  clearFilters() {
    this.selectedTypes = [];
    this.selectedHabitats = [];
    this.searchQuery = '';
    this.applySearchFilter();
    this.closeFilterModal();
  }

  hasActiveFilters(): boolean {
    return this.selectedTypes.length > 0 || this.selectedHabitats.length > 0;
  }

  setPage(page: number) {
    this.currentPage = page;
    const start = (page - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayedPokemons = this.filteredPokemons.slice(start, end);
  }
}
