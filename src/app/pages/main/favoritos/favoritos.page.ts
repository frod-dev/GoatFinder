import { Component, OnInit, inject } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePlayerComponent } from 'src/app/shared/components/add-update-player/add-update-player.component';
import { orderBy, where } from "firebase/firestore";
import { FullViewPlayerComponent } from 'src/app/shared/components/full-view-player/full-view-player.component';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  players: Player[] = [];
  searchedPlayer: any;
  loading: boolean = false;
  searchHide: boolean = true;

  ngOnInit() {
  }


  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getFavoritos();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getFavoritos();
      event.target.complete();
    }, 2000);
  }


  // Obtener jugadores
  getFavoritos() {
    let path = "jugadores";

    this.loading = true;

    let user = this.user();
    let favoriteIds = user.favorites ? user.favorites.split("-") : [];

    if (favoriteIds.length === 0) {
      setTimeout(() => {
        this.loading = false;
      }, 2000);
      this.searchedPlayer = [];
      return;
    }

    let query = (
      orderBy('value', 'desc'),
      where('id', 'in', favoriteIds)
    );

    let sub = this.firebaseService.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        let filteredPlayers = res.filter(player => favoriteIds.includes(player.id));

        this.players = res;
        this.searchedPlayer = filteredPlayers;
        this.loading = false;
        this.searchHide = false;
        sub.unsubscribe();
      }
    });
  }

  // Modal para ver datos de jugador
  async fullViewPlayer(player?: Player) {
    let success = await this.utilsService.presentModal({
      component: FullViewPlayerComponent,
      cssClass: 'full-view-modal',

      componentProps: { player }
    });
    this.getFavoritos();
  }

  // Searchbar
  searchPlayer(event) {
    const query = event.target.value.toLowerCase();

    this.searchedPlayer = this.players.filter((player: any) => {
      return player.name.toLowerCase().includes(query);
    });
  }

}
