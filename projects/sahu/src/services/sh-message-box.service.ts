import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShMessageBoxService {
  private messageBoxSubject = new BehaviorSubject<{ title: string, message: string, type: 'success' | 'error' | 'info' | 'warning', visible: boolean } | null>(null);
  messageBox$ = this.messageBoxSubject.asObservable();

  showMessage(title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') {
    console.log('showMessage', title);
    this.messageBoxSubject.next({ title, message, type, visible: true });
  }

  closeMessage() {
    this.messageBoxSubject.next(null);
  }
}