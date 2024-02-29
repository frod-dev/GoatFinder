import { Component, Input, OnInit, inject } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-full-view-player',
  templateUrl: './full-view-player.component.html',
  styleUrls: ['./full-view-player.component.scss'],
})
export class FullViewPlayerComponent  implements OnInit {

  @Input() player: Player;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  esFavorito() {
    let user = this.user();
    let player = this.player;

    if (user.favorites === "" || user.favorites === undefined) {
      return false;

    } else {
      if (user.favorites.includes(player.id)) {
        return true;
      } else {
        return false;
      }
    }
  }


  // Añadir a favoritos
  async addFav() {
    let user = this.user();
    let player = this.player;
    let path = 'users/' + user.uid;

    if (user.favorites === "" || user.favorites === undefined) {
      user.favorites = player.id;

    } else {
      if (user.favorites.includes("-")) {
        let favList = user.favorites.split("-");
        favList.push(player.id);
        user.favorites = favList.join("-");
      } else {
        let favList = [user.favorites];
        favList.push(player.id);
        user.favorites = favList.join("-");
      }
    }

    this.firebaseService.updateDocument(path, {favorites: user.favorites}).then(async res => {
      this.utilsService.saveInLocalStorage('user', user);
    });
  }

  // Eliminar de favoritos
  async delFav() {
    let user = this.user();
    let player = this.player;
    let path = 'users/' + user.uid;

    if (user.favorites.includes("-")) {

      let favList = user.favorites.split("-");
      let index = favList.indexOf(player.id);
      favList.splice(index,1);
      user.favorites = favList.join("-");

    } else {
      user.favorites = "";
    }


    this.firebaseService.updateDocument(path, {favorites: user.favorites}).then(async res => {
      this.utilsService.saveInLocalStorage('user', user);
    });
  }

}
