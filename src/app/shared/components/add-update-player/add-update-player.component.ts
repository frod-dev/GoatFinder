import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Player } from 'src/app/models/player.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-player',
  templateUrl: './add-update-player.component.html',
  styleUrls: ['./add-update-player.component.scss'],
})
export class AddUpdatePlayerComponent  implements OnInit {

  @Input() player: Player;
  user = {} as User;

  form = new FormGroup({
    id: new FormControl(''),

    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    team: new FormControl('', [Validators.required, Validators.minLength(4)]),
    position: new FormControl('', [Validators.required]),
    value: new FormControl(null, [Validators.required, Validators.min(0.1)]),

    age: new FormControl(null, [Validators.required, Validators.min(16)]),
    height: new FormControl(null, [Validators.required, Validators.min(1.4)]),
    country: new FormControl('', [Validators.required, Validators.minLength(4)]),

    matches: new FormControl(null, [Validators.required, Validators.min(0)]),
    goals: new FormControl(null, [Validators.required, Validators.min(0)]),
    assists: new FormControl(null, [Validators.required, Validators.min(0)]),
    yellows: new FormControl(null, [Validators.required, Validators.min(0)]),
    reds: new FormControl(null, [Validators.required, Validators.min(0)])
  })

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user');
    if (this.player) {
      this.form.setValue(this.player);
    }
  }

  // Tomar/Seleccionar Foto
  async takeImage() {
    const dataUrl = (await this.utilsService.takePicture('Imagen del Jugador')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.form.valid) {
      if (this.player) {
        this.updatePlayer();
      } else {
        this.createPlayer();
      }
    }
  }

  // String->Number convert
  setNumberInput() {
    let {value, age, height, matches, goals, assists, yellows, reds} = this.form.controls;

    if (value.value) value.setValue(parseFloat(value.value));
    if (age.value) age.setValue(parseFloat(age.value));
    if (height.value) height.setValue(parseFloat(height.value));
    if (matches.value) matches.setValue(parseFloat(matches.value));
    if (goals.value) goals.setValue(parseFloat(goals.value));
    if (assists.value) assists.setValue(parseFloat(assists.value));
    if (yellows.value) yellows.setValue(parseFloat(yellows.value));
    if (reds.value) reds.setValue(parseFloat(reds.value));
  }

  //Create
  async createPlayer() {
      let path = "jugadores";

      const loading = await this.utilsService.loading();
      await loading.present();

      // Subir foto y obtener URL
      let dataUrl = this.form.value.image;
      let imagePath = "img/jugadores/" + Date.now();
      let imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl);
      this.form.controls.image.setValue(imageUrl);

      this.firebaseService.addDocument(path, this.form.value).then(async res => {
        this.utilsService.dismissModal({ success: true });

        this.utilsService.presentToast({
          message: "Jugador ojeado exitosamente",
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

  // Update
  async updatePlayer() {
      let path = "jugadores/" + this.player.id;

      const loading = await this.utilsService.loading();
      await loading.present();

      // Subir foto y obtener URL si esta cambia
      if (this.form.value.image !== this.player.image) {
        let dataUrl = this.form.value.image;
        let imagePath = await this.firebaseService.getFilePath(this.player.image);
        let imageUrl = await this.firebaseService.uploadImage(imagePath, dataUrl);
        this.form.controls.image.setValue(imageUrl);
      }

      this.firebaseService.updateDocument(path, this.form.value).then(async res => {
        this.utilsService.dismissModal({ success: true });

        this.utilsService.presentToast({
          message: "Datos editados exitosamente",
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
