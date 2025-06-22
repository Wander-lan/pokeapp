import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { PokemonDetail } from 'src/app/models/pokemon.model';

import { getTypeColor } from 'src/app/utils/pokemon-utils';

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

  getColorForType(type: string): string {
    return getTypeColor(type);
  }
}
