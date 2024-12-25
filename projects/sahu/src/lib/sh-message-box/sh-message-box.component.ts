import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShMessageBoxService } from '../../services/sh-message-box.service';

@Component({
  selector: 'sh-message-box',
  template: `
    <div *ngIf="messageBox?.visible" [class]="'sh-message-box ' + messageBox?.type">
      <div class="sh-message-box-header">
        <h3>{{ messageBox?.title }}</h3>
        <button (click)="close()">&times;</button>
      </div>
      <p>{{ messageBox?.message }}</p>
      <div class="sh-message-box-footer" *ngIf="messageBox?.okCallback">
        <button (click)="onOkClick()">OK</button>
      </div>
    </div>
  `,
  styles: [
    `
    .sh-message-box {
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 300px;
      padding: 15px;
      border-radius: 5px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      font-family: Arial, sans-serif;
      z-index: 1000;
    }

    .sh-message-box.success { background-color: #dff0d8; color: #3c763d; }
    .sh-message-box.error { background-color: #f2dede; color: #a94442; }
    .sh-message-box.info { background-color: #d9edf7; color: #31708f; }
    .sh-message-box.warning { background-color: #fcf8e3; color: #8a6d3b; }

    .sh-message-box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .sh-message-box-header button {
      background: none;
      border: none;
      font-size: 1.2em;
      cursor: pointer;
    }

    .sh-message-box-header button:hover {
      color: #555;
    }

    .sh-message-box-footer {
      text-align: right;
      margin-top: 10px;
    }

    .sh-message-box-footer button {
      padding: 5px 10px;
      font-size: 1em;
      cursor: pointer;
      border: none;
      border-radius: 3px;
      background-color: #007bff;
      color: white;
    }

    .sh-message-box-footer button:hover {
      background-color: #0056b3;
    }
    `
  ]
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
