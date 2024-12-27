import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShMessageBoxService } from '../../services/sh-message-box.service';

@Component({
  selector: 'sh-message-box',
  templateUrl: './sh-message-box.component.html',
  styleUrls: ['./sh-message-box.component.scss']
})
export class ShMessageBoxComponent implements OnDestroy {
  msgIcon: string = '';
  @Output() okClick = new EventEmitter<void>();

  messageBox: {
    title: string,
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    visible: boolean,
    okCallback?: () => void,
    okText?: string
  } | null = null;
  private subscription: Subscription;

  constructor(private messageBoxService: ShMessageBoxService) {
    this.subscription = this.messageBoxService.messageBox$.subscribe(data => {
      this.messageBox = data;

      this.msgIcon = '/assets/images/notifications/';
      switch (this.messageBox?.type) {
        case 'success': {
          this.msgIcon += 'noti-success.svg';
          break;
        }
        case 'warning': {
          this.msgIcon += 'noti-warning.svg';
          break;
        }
        case 'error': {
          this.msgIcon += 'noti-error.svg';
          break;
        }
      }
    });
  }

  close() {
    this.messageBoxService.closeMessage();
  }

  onOkClick() {
    if (this.messageBox?.okCallback) {
      this.messageBox.okCallback();
    }
    this.okClick.emit();
    this.close();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
