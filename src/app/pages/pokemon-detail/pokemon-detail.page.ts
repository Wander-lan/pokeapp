import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PokemonService } from '../../services/pokemon.service';
import { MessageService } from 'src/app/services/message.service';

import { PokemonBasic, PokemonDetail } from 'src/app/models/pokemon.model';


import { getTypeColor } from 'src/app/utils/pokemon-utils';
import { POKEMON_LIMIT } from '../../constants/pokemon.constants';

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
  pokemon: PokemonDetail | null = null;
  types: string[] = [];
  abilities: string[] = [];
  weaknesses: string[] = [];
  genderLabel = '';

  evolutions: PokemonBasic[] = [];

  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pokemonService: PokemonService,
    private messageService: MessageService
  ) { }

  pokemonId: number = 0;
  pokemonLimit = POKEMON_LIMIT;

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    this.loading = true;

    if (name) {
      this.pokemonService.getPokemonDetail(name).subscribe({
        next: (data) => {
          this.pokemon = data;
          this.pokemonId = data.id;
          this.types = data.types;
          this.abilities = data.abilities;
          this.weaknesses = data?.weaknesses || [];
          this.setGenderRate(data.genderRate);

          this.pokemonService.getPokemonEvolutionChain(this.pokemon!.name).subscribe({
            next: (data) => {
              this.evolutions = data;
              this.loading = false;
            },
            error: (err) => {
              console.log('Erro ao carregar os detalhes. Tente novamente mais tarde.');
              this.loading = false;
            }
          });
        },
        error: (err) => {
          this.loading = false;
          this.messageService.showError('Erro ao carregar os detalhes. Tente novamente mais tarde.');
        }
      });

    } else {
      this.messageService.showError('Erro ao acessar a rota.');
    }
  }

  getColorForType(type: string): string {
    return getTypeColor(type);
  }

  setGenderRate(rate: number): void {
    if (rate === -1) {
      this.genderLabel = 'Sem Gênero';
    } else if (rate === 0) {
      this.genderLabel = '♂️';
    } else if (rate === 8) {
      this.genderLabel = '♀️';
    } else {
      const femalePercent = (rate / 8) * 100;
      const malePercent = 100 - femalePercent;
      this.genderLabel = `♂️ ${malePercent}% / ♀️ ${femalePercent}%`;
    }
  }

  getStatPercentage(statValue: number): number {
    const maxStat = 200;
    return Math.min(100, (statValue / maxStat) * 100);
  }

  get habitatBackground(): string {
    const path = this.pokemon?.habitat
      ? `/assets/media/habitat-${this.pokemon.habitat}.png`
      : `/assets/media/habitat-unknown.png`;

    return `url('${path}')`;
  }

  goToPrevious() {
    if (this.pokemonId > 1) {
      this.loadPokemonById(this.pokemonId - 1);
    }
  }

  goToNext() {
    if (this.pokemonId < POKEMON_LIMIT) {
      this.loadPokemonById(this.pokemonId + 1);
    }
  }

  loadPokemonById(id: number) {
    this.pokemonService.getPokemonDetailRaw(id).subscribe(detail => {
      const name = detail.name;
      this.router.navigate(['/pokemon', name]);
    });
  }
}
