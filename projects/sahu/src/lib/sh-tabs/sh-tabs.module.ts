import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShTabComponent } from './sh-tab.component';
import { ShTabsetComponent } from './sh-tabset.component';
import { ShIconModule } from '../sh-icon/sh-icon.module';

@NgModule({
  declarations: [ShTabsetComponent, ShTabComponent],
  imports: [CommonModule, ShIconModule],
  exports: [ShTabsetComponent, ShTabComponent],
})
export class ShTabsModule {
}
