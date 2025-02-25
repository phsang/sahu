import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShPageHeaderComponent } from './sh-page-header.component';
import { ShButtonModule } from '../sh-button/sh-button.module';

@NgModule({
  declarations: [ShPageHeaderComponent],
  imports: [CommonModule, ShButtonModule],
  exports: [ShPageHeaderComponent],
})
export class ShPageHeaderModule { }
