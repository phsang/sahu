import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ShButtonComponent } from '../sh-button/sh-button.component';

@Component({
  selector: 'sh-modal',
  imports: [ShButtonComponent],
  templateUrl: './sh-modal.component.html',
  styleUrls: ['./sh-modal.component.scss']
})
export class ShModalComponent {
  @Input() shIcon?: string;
  iconElement?: SafeHtml = '';
  @Input() shType?: 'success' | 'warning' | 'error';
  @Input() shTitle?: string;
  @Input() shMdSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() shMdClass?: string;
  @Input() shHeadClass?: string;
  @Input() shBodyClass?: string;
  @Input() shFootClass?: string;
  @Input() shHead?: boolean;
  @Input() shFoot?: boolean;
  @Input() shCanClose?: boolean;
  @Output() shCancel = new EventEmitter<Event>();
  @Output() shOk = new EventEmitter<Event>();

  handleCancel(event: Event): void {
    this.shCancel.emit(event);
  }

  handleOk(event: Event): void {
    this.shOk.emit(event);
  }
}
