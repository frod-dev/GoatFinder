import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {

  pages = [
    {
      title: 'Inicio',
      url: '/main/home',
      icon: 'football-outline'
    },
    {
      title: 'Perfil',
      url: '/main/profile',
      icon: 'person-outline'
    },
    {
      title: 'Favoritos',
      url: '/main/favoritos',
      icon: 'star-outline'
    }
  ]

  firebaseService = inject(FirebaseService);
  utilsService = inject(UtilsService);
  router = inject(Router);

  currentPath: string = '';

  ngOnInit() {
    this.router.events.subscribe((event: any) => {
      if (event?.url) this.currentPath = event.url;
    })
  }

  user(): User {
    return this.utilsService.getFromLocalStorage('user');
  }

  
  // Cerrar sesión
  signOut() {
    this.firebaseService.signOut()
  }

}
