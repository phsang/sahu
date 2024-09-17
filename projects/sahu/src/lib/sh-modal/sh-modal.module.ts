import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShModalComponent } from './sh-modal.component';
import { RouterModule } from '@angular/router';
import { ShButtonComponent } from '../sh-button/sh-button.component';
import { ShButtonModule } from '../sh-button/sh-button.module';

@NgModule({
  declarations: [ShModalComponent],
  imports: [CommonModule, RouterModule, ShButtonModule],
  exports: [ShModalComponent],
})
export class ShModalModule { }
