import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShMessageBoxService } from '../../services/sh-message-box.service';

@Component({
  selector: 'sh-message-box',
  templateUrl: './sh-message-box.component.html',
  styleUrls: ['./sh-message-box.component.scss']
})
export class ShMessageBoxComponent implements OnDestroy {
  @Output() okClick = new EventEmitter<void>();

  messageBox: { title: string, message: string, type: 'success' | 'error' | 'info' | 'warning', visible: boolean, okCallback?: () => void } | null = null;
  private subscription: Subscription;

  constructor(private messageBoxService: ShMessageBoxService) {
    this.subscription = this.messageBoxService.messageBox$.subscribe(data => {
      this.messageBox = data;
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
