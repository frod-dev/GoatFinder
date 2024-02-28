import { Component, OnInit, inject } from '@angular/core';
import { Player } from 'src/app/models/player.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdatePlayerComponent } from 'src/app/shared/components/add-update-player/add-update-player.component';
import { orderBy } from "firebase/firestore";
import { FullViewPlayerComponent } from 'src/app/shared/components/full-view-player/full-view-player.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  players: Player[] = [];
  searchedPlayer: any;
  loading: boolean = false;

  ngOnInit() {
  }


  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  ionViewWillEnter() {
    this.getPlayers();
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getPlayers();
      event.target.complete();
    }, 2000);
  }


  // Obtener jugador
  getPlayers() {
    let path = "jugadores";

    this.loading = true;

    let query = (
      orderBy('value', 'desc')
    );

    let sub = this.firebaseService.getCollectionData(path, query).subscribe({
      next: (res: any) => {
        console.log(res);
        this.players = res;
        this.searchedPlayer = this.players;
        this.loading = false;
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
    this.getPlayers();
  }

  // Modal para agregar/editar jugador
  async addUpdatePlayer(player?: Player) {
    let success = await this.utilsService.presentModal({
      component: AddUpdatePlayerComponent,
      cssClass: 'add-update-modal',

      componentProps: { player }
    });

    if (success) {
      this.getPlayers();
    }
  }

  // Borrar jugador
  async deletePlayer(player: Player) {
    let path = "jugadores/" + player.id;

    const loading = await this.utilsService.loading();
    await loading.present();

    
    let imagePath = await this.firebaseService.getFilePath(player.image);
    await this.firebaseService.deleteFile(imagePath);

    this.firebaseService.deleteDocument(path).then(async res => {

      this.players = this.players.filter(p => p.id !== player.id);

      this.utilsService.presentToast({
        message: "Jugador eliminado exitosamente",
        duration: 1500,
        color: 'success',
        position: 'top',
        icon: 'checkmark-circle-outline'
      });

    }).catch(er => {
      console.log(er);
      this.utilsService.presentToast({
        message: er.message,
        duration: 1500,
        color: 'danger',
        position: 'top',
        icon: 'alert-circle-outline'
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

  // Alerta borrado
  async confirmDelete(player: Player) {
    this.utilsService.presentAlert({
      header: 'Eliminar a ' + player.name,
      message: 'Quieres eliminar este jugador?',
      buttons: [
        {
          text: 'Cancelar',
          cssClass: 'cancel-button',
        }, {
          text: 'Eliminar',
          cssClass: 'delete-button',
          handler: () => {
            this.deletePlayer(player);
          }
        }
      ]
    });
  }

  // Searchbar
  searchPlayer(event) {
    const query = event.target.value.toLowerCase();

    this.searchedPlayer = this.players.filter((player: any) => {
      return player.name.toLowerCase().includes(query);
    });
  }

}
