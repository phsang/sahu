import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShButtonComponent } from './sh-button.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ShButtonComponent],
  imports: [CommonModule, RouterModule],
  exports: [ShButtonComponent],
})
export class ShButtonModule { }
