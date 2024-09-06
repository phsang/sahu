import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShModalComponent } from './sh-modal.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ShModalComponent],
  imports: [CommonModule, RouterModule],
  exports: [ShModalComponent],
})
export class ShModalModule { }
