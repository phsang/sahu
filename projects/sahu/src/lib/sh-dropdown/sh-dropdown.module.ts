import { OverlayModule, ScrollDispatcher, ViewportRuler } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShDropdownContentDirective } from './sh-dropdown-content.directive';
import { ShDropdownTriggerDirective } from './sh-dropdown-trigger.directive';
import { ShDropdownComponent } from './sh-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule,
  ],
  declarations: [
    ShDropdownComponent,
    ShDropdownTriggerDirective,
    ShDropdownContentDirective
  ],
  exports: [
    ShDropdownComponent,
    ShDropdownTriggerDirective,
    ShDropdownContentDirective
  ],
  providers: [ScrollDispatcher, ViewportRuler]
})
export class ShDropdownModule { }