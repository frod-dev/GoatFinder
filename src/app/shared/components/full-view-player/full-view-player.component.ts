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
  user = {} as User;

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);

  ngOnInit() {
    this.user = this.utilsService.getFromLocalStorage('user');
  }

}
