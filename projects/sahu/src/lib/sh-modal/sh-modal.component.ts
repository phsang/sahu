import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { getIconList } from '../utils/icon-list';

@Component({
  selector: 'sh-modal',
  templateUrl: './sh-modal.component.html',
  styleUrls: ['./sh-modal.component.scss']
})
export class ShModalComponent implements OnInit {
  @Input() shIcon?: string;
  @Input() shIconType: 'light' | 'regular' | 'solid' | 'duotone' = 'light';
  iconElement?: SafeHtml = '';
  @Input() shMdType: 'zoomInDown' | 'slideLeft' | 'slideRight' | 'rotateX' | 'rotateY' = 'zoomInDown';
  @Input() shTitle?: string;
  @Input() shMdSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' = 'md';
  @Input() shMdClass?: string;
  @Input() shHead: boolean = true;
  @Input() shHeadClass?: string;
  @Input() shFoot: boolean = true;
  @Input() shFootClass?: string;
  @Input() shVisible: boolean = false;
  @Output() shCancel = new EventEmitter<Event>();
  @Output() shOk = new EventEmitter<Event>();

  constructor(
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    if (this.shIcon) {
      let _icon = getIconList(this.shIcon, this.shIconType);
      if (_icon) {
        this.iconElement = this.sanitizer.bypassSecurityTrustHtml(_icon.trim());
      }
    }
  }

  handleCancel(event: Event): void {
    this.shVisible = false;
    this.shCancel.emit(event);
  }

  handleOk(event: Event): void {
    this.shVisible = false;
    this.shOk.emit(event);
  }
}
