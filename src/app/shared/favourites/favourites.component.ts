import { Component, OnInit } from '@angular/core';

import { strings_es } from '../../../assets/strings/strings-es';
import { FavouriteService } from '../../services/favourite.service';
import { FavouriteData } from '../../models/verse-data.interface';

@Component({
  selector: 'app-favourites',
  standalone: false,
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit {
  protected readonly s = strings_es;
  vFavourites: FavouriteData[] = [];

  constructor(private favouriteSrv: FavouriteService) {}

  ngOnInit() { this.fetchFavourites(); }

  fetchFavourites = () => this.favouriteSrv.loadAllFavourites().then(data => this.vFavourites = data);
}
