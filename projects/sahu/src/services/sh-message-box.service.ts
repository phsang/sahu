import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShMessageBoxService {
  private messageBoxSubject = new BehaviorSubject<{
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    visible: boolean,
    okCallback?: () => void,
    okText?: string
  } | null>(null);
  messageBox$ = this.messageBoxSubject.asObservable();

  showMessage(
    { title, message, type = 'info', okCallback, okText }: {
      title: string,
      message: string,
      type?: 'success' | 'error' | 'info' | 'warning',
      okCallback?: () => void,
      okText?: string
    }) {
    this.messageBoxSubject.next({
      title,
      message,
      type,
      visible: true,
      okCallback,
      okText
    });
  }

  closeMessage() {
    this.messageBoxSubject.next(null);
  }
}
