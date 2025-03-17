// sh-tab.component.ts
import { Component, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-tab',
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class ShTabComponent {
  @Input() shTitle: string = '';
  @Input() shDisabled: boolean = false;
  @ViewChild(TemplateRef) contentTemplate!: TemplateRef<any>;
}