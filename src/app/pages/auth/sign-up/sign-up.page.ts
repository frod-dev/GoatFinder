import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    uid: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  ngOnInit() {
  }

  async submit() {
    if (this.form.valid) {
      const loading = await this.utilsService.loading();
      await loading.present();

      this.firebaseService.signUp(this.form.value as User).then(async res => {
        await this.firebaseService.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        this.setUserInfo(uid);
      }).catch(er => {
        console.log(er);
        this.utilsService.presentToast({
          message: er.message,
          duration: 2500,
          color: 'danger',
          position: 'top',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  async setUserInfo(uid: string) {
    if (this.form.valid) {
      let path = 'users/' + uid;
      let name = this.form.value.name;
      delete this.form.value.password;

      this.firebaseService.setDocument(path, this.form.value).then(async res => {
        this.utilsService.saveInLocalStorage('user', this.form.value);
        this.utilsService.routerLink('/main/home');
        this.form.reset();

        this.utilsService.presentToast({
          message: "Bienvenido/a " + name,
          duration: 2500,
          color: 'success',
          position: 'top',
          icon: 'person-circle-outline'
        });
      }).catch(er => {
        console.log(er);
        this.utilsService.presentToast({
          message: er.message,
          duration: 2500,
          color: 'danger',
          position: 'top',
          icon: 'alert-circle-outline'
        });
      });
    }
  }

}
