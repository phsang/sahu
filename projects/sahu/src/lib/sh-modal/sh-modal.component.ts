import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sh-modal',
  templateUrl: './sh-modal.component.html',
  styleUrls: ['./sh-modal.component.scss']
})
export class ShModalComponent implements OnInit {
  @Input() shIcon?: string;
  @Input() shType: 'zoomInDown' | 'slideLeft' | 'slideRight' | 'rotateX' | 'rotateY' = 'zoomInDown';
  @Input() shTitle?: string;
  @Input() shSize: 'sm' | 'md' | 'lg' | 'full' = 'md';
  @Input() shClass?: string;
  @Input() shHead: boolean = true;
  @Input() shHeadClass?: string;
  @Input() shFoot: boolean = true;
  @Input() shFootClass?: string;
  @Input() shVisible: boolean = false;
  @Output() shCancel = new EventEmitter<Event>();
  @Output() shOk = new EventEmitter<Event>();

  constructor() { }

  ngOnInit(): void {
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
