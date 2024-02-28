import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Player } from 'src/app/models/player.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  ngOnInit() {
  }

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }


  // Tomar/Seleccionar Foto
  async takeImage() {
    let user = this.user();
    let path = 'users/' + user.uid;
    
    const dataUrl = (await this.utilsService.takePicture('Foto de perfil')).dataUrl;

    const loading = await this.utilsService.loading();
    await loading.present();
    
    let imagePath = "img/users/" + user.uid + "/profile";
    user.image = await this.firebaseService.uploadImage(imagePath, dataUrl);

    this.firebaseService.updateDocument(path, {image: user.image}).then(async res => {
      this.utilsService.saveInLocalStorage('user', user);

      this.utilsService.presentToast({
        message: "Imagen actualizada exitosamente",
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

}
