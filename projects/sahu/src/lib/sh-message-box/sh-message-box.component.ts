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
  actionBlock: 'only_close' | 'only_ok' | 'close_ok' | 'close_ok_event' = 'only_close';
  @Output() closeClick = new EventEmitter<void>();
  @Output() okClick = new EventEmitter<void>();

  messageBox: {
    title: string,
    message?: string,
    type: 'success' | 'error' | 'info' | 'warning',
    visible: boolean,
    closeText?: string,
    closeCallback?: () => void,
    okText?: string,
    okCallback?: () => void,
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

      // xử lý các nút action
      if (!this.messageBox?.okCallback) {
        if (!this.messageBox?.closeCallback) {
          this.actionBlock = 'only_close';
        } else {
          this.actionBlock = 'only_ok';
        }
      } else {
        if (!this.messageBox?.closeCallback) {
          this.actionBlock = 'close_ok';
        } else {
          this.actionBlock = 'close_ok_event';
        }
      }
    });
  }

  close() {
    if (this.messageBox?.closeCallback) {
      this.messageBox.closeCallback();
      this.closeClick.emit();
    }
    this.messageBoxService.closeMessage();
  }

  onOkClick() {
    if (this.messageBox?.okCallback) {
      this.messageBox.okCallback();
      this.okClick.emit();
    }
    this.messageBoxService.closeMessage();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
