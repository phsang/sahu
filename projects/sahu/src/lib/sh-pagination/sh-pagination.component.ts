import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-pagination',
  templateUrl: './sh-pagination.component.html',
  styles: [`
    .pagination-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button:disabled {
      opacity: 0.5;
    }
  `]
})
export class ShPaginationComponent {
  @Input() totalItems = 100;
  @Input() itemsPerPage = 10;
  @Input() shShowSizeChanger = false;
  @Input() pageSizeOptions = [10, 20, 50, 100];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  currentPage = 1;
  get totalPages() {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  onSizeChange() {
    this.currentPage = 1;
    this.pageSizeChange.emit(this.itemsPerPage);
    this.pageChange.emit(this.currentPage);
  }
}
