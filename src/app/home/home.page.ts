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

  limit = 4;
  offset = 0;
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
      this.offset += this.limit;
      this.loading = false;
    });
  }
}
