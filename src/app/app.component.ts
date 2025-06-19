import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonicModule,
    RouterOutlet
],
})
export class AppComponent {
  constructor(
    private router: Router,
  ) {}

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToFavorites() {
    this.router.navigate(['/favorites']);
  }
}
