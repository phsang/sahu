import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShButtonComponent } from './sh-button.component';
import { RouterModule } from '@angular/router';
import { ShIconModule } from '../sh-icon/sh-icon.module';

@NgModule({
  declarations: [ShButtonComponent],
  imports: [CommonModule, RouterModule, ShIconModule],
  exports: [ShButtonComponent],
})
export class ShButtonModule { }
