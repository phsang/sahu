import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule, ScrollDispatcher, ViewportRuler } from '@angular/cdk/overlay';
import { ShDropdownComponent } from './sh-dropdown.component';
import { ShDropdownTriggerDirective } from './sh-dropdown-trigger.directive';
import { ShDropdownContentDirective } from './sh-dropdown-content.directive';

@NgModule({
  imports: [CommonModule, OverlayModule],
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