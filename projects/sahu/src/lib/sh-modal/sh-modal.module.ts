import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShModalComponent } from './sh-modal.component';
import { ShButtonModule } from '../sh-button/sh-button.module';

@NgModule({
  declarations: [ShModalComponent],
  imports: [CommonModule, ShButtonModule],
  exports: [ShModalComponent],
})
export class ShModalModule { }
