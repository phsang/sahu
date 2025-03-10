import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShInputComponent } from './sh-input.component';
import { ShButtonModule } from '../sh-button';

@NgModule({
  declarations: [ShInputComponent],
  imports: [CommonModule, ShButtonModule],
  exports: [ShInputComponent],
})
export class ShInputModule { }
