import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'sh-page-header',
  templateUrl: './sh-page-header.component.html',
  styleUrls: ['./sh-page-header.component.scss']
})
export class ShPageHeaderComponent {
  @Input() shTitle: string = '';
  @Input() shSupTitle?: string;
  @Input() shBack?: boolean = false;

  constructor(private location: Location) { }

  shBackLink(): void {
    this.location.back();
  }
}
