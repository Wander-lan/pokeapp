import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private toastController: ToastController) {}

  async showError(message: string = 'Ocorreu um erro inesperado') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger',
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  async showSuccess(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success',
      position: 'bottom',
      cssClass: 'custom-toast'
    });
    toast.present();
  }
}