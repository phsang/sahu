import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ShMessageBoxService {
  private messageBoxSubject = new BehaviorSubject<{ title: string, message: string, type: 'success' | 'error' | 'info' | 'warning', visible: boolean, okCallback?: () => void } | null>(null);
  messageBox$ = this.messageBoxSubject.asObservable();

  showMessage({ title, message, type = 'info', okCallback }: { title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning', okCallback?: () => void }) {
    this.messageBoxSubject.next({ title, message, type, visible: true, okCallback });
  }

  closeMessage() {
    this.messageBoxSubject.next(null);
  }
}
