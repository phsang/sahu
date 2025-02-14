import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShMessageBoxService {
  private messageBoxSubject = new BehaviorSubject<{
    title: string,
    message?: string,
    type: 'success' | 'error' | 'info' | 'warning',
    visible: boolean,
    closeText?: string,
    closeCallback?: () => void,
    okText?: string,
    okCallback?: () => void,
  } | null>(null);
  messageBox$ = this.messageBoxSubject.asObservable();

  showMessage(
    { title, message, type = 'info', closeText, closeCallback, okText, okCallback, }: {
      title: string,
      message?: string,
      type?: 'success' | 'error' | 'info' | 'warning',
      closeText?: string,
      closeCallback?: () => void,
      okText?: string,
      okCallback?: () => void,
    }) {
    this.messageBoxSubject.next({
      title,
      message,
      type,
      visible: true,
      closeText,
      closeCallback,
      okText,
      okCallback,
    });
  }

  closeMessage() {
    this.messageBoxSubject.next(null);
  }
}
