import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-product',
  templateUrl: './add-update-product.component.html',
  styleUrls: ['./add-update-product.component.scss'],
})
export class AddUpdateProductComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),

    image: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    team: new FormControl('', [Validators.required, Validators.minLength(4)]),
    position: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required, Validators.min(0.1)]),

    age: new FormControl('', [Validators.required, Validators.min(16)]),
    height: new FormControl('', [Validators.required, Validators.min(1.4)]),
    country: new FormControl('', [Validators.required, Validators.minLength(4)]),

    matches: new FormControl('', [Validators.required, Validators.min(0)]),
    goals: new FormControl('', [Validators.required, Validators.min(0)]),
    assists: new FormControl('', [Validators.required, Validators.min(0)]),
    yellows: new FormControl('', [Validators.required, Validators.min(0)]),
    reds: new FormControl('', [Validators.required, Validators.min(0)])
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

}
