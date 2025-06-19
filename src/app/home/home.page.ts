import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  pokemons: any[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.pokemonService.getPokemons().subscribe((data) => {
      this.pokemons = data;
    });
  }
}
