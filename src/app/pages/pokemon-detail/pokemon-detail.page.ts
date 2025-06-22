import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.page.html',
  styleUrls: ['./pokemon-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
  ]
})
export class PokemonDetailPage implements OnInit {
  pokemon: any = null;
  types: string[] = [];
  abilities: string[] = [];
  weaknesses: string[] = [];

  loading = false;

  constructor(private route: ActivatedRoute, private pokemonService: PokemonService) { }

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    this.loading = true;

    if (name) {
      this.pokemonService.getPokemonDetail(name).subscribe(data => {
        this.pokemon = data;
        this.types = data.types;
        this.abilities = data.abilities;
        this.weaknesses = data?.weaknesses || [];
        this.loading = false;
      });
    }
  }

  getTypeColor(type: string): string {
    const colors: Record<string, string> = {
      fire: '#F08030',
      water: '#6890F0',
      grass: '#78C850',
      electric: '#F8D030',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dark: '#705848',
      dragon: '#7038F8',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
      normal: '#A8A878'
    };
    return colors[type] || '#A8A878';
  }
}
