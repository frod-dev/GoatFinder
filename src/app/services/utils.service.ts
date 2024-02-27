import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  modalController = inject(ModalController);
  router = inject(Router);

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

  // Modal
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalController.dismiss(data);
  }

  // Routing
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // LocalStorage POST
  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  // LocalStorage GET
  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }
  
}
