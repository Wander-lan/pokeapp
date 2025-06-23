import { TestBed } from '@angular/core/testing';
import { MessageService } from './message.service';
import { ToastController, ToastOptions } from '@ionic/angular';

describe('MessageService', () => {
  let service: MessageService;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;

  beforeEach(() => {
    const toastSpy = jasmine.createSpyObj('ToastController', ['create']);

    TestBed.configureTestingModule({
      providers: [
        MessageService,
        { provide: ToastController, useValue: toastSpy }
      ]
    });

    service = TestBed.inject(MessageService);
    toastControllerSpy = TestBed.inject(ToastController) as jasmine.SpyObj<ToastController>;
  });

  it('deve ser criado corretamente', () => {
    expect(service).toBeTruthy();
  });

  it('showError deve chamar ToastController.create com os parâmetros esperados', async () => {
    const presentSpy = jasmine.createSpy('present');
    toastControllerSpy.create.and.resolveTo({ present: presentSpy } as any);

    await service.showError('Erro de teste');

    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Erro de teste',
      duration: 3000,
      color: 'danger',
      position: 'bottom',
      cssClass: 'custom-toast'
    }));
    expect(presentSpy).toHaveBeenCalled();
  });

  it('showError deve usar mensagem padrão se nenhuma for passada', async () => {
    const presentSpy = jasmine.createSpy('present');
    toastControllerSpy.create.and.resolveTo({ present: presentSpy } as any);

    await service.showError();

    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Ocorreu um erro inesperado',
      color: 'danger'
    }));
    expect(presentSpy).toHaveBeenCalled();
  });

  it('showSuccess deve chamar ToastController.create com os parâmetros esperados', async () => {
    const presentSpy = jasmine.createSpy('present');
    toastControllerSpy.create.and.resolveTo({ present: presentSpy } as any);

    await service.showSuccess('Sucesso!');

    expect(toastControllerSpy.create).toHaveBeenCalledWith(jasmine.objectContaining({
      message: 'Sucesso!',
      duration: 3000,
      color: 'success',
      position: 'bottom',
      cssClass: 'custom-toast'
    }));
    expect(presentSpy).toHaveBeenCalled();
  });
});
