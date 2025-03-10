import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShInputComponent } from './sh-input.component';
import { ShButtonModule } from '../sh-button';
import { ShIconModule } from '../sh-icon';

@NgModule({
  declarations: [ShInputComponent],
  imports: [
    CommonModule,
    ShIconModule,
    ShButtonModule,
  ],
  exports: [ShInputComponent],
})
export class ShInputModule { }
