import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      this.firebaseService.sendRecoveryEmail(this.form.value.email).then(res => {
        this.utilsService.presentToast({
          message: 'Correo enviado exitosamente',
          duration: 2500,
          color: 'success',
          position: 'top',
          icon: 'mail-outline'
        });
        this.utilsService.routerLink('/auth');
        this.form.reset();
      }).catch(er => {
        console.log(er);
        this.utilsService.presentToast({
          message: er.message,
          duration: 2500,
          color: 'danger',
          position: 'top',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      })
    }
  }

}
