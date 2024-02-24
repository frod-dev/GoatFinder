import { Injectable, inject } from '@angular/core';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);

  // Loading
  loading() {
    return this.loadingController.create({
      spinner: 'circles',
      cssClass: 'custom-loading',
      message: 'Accediendo...',
      mode: 'ios'
    })
  }

  // Toast
  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }
  
}
