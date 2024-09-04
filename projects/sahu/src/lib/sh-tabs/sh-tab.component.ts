import { Component, Input } from '@angular/core';

@Component({
  selector: 'sh-tab',
  template: `<div *ngIf="isActive"><ng-content></ng-content></div>`,
})
export class ShTabComponent {
  @Input() shTitle!: string;
  @Input() shIcon?: string;
  @Input() shIconType: 'light' | 'regular' | 'solid' | 'duotone' = 'light';
  isActive = false;
}
