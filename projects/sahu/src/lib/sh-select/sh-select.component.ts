import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'sh-select',
  templateUrl: './sh-select.component.html',
  styleUrls: ['./sh-select.component.scss']
})
export class ShSelectComponent implements OnInit {
  @Input() shData: any[] = [];
  _sData: { [key: string]: any[] } = {};

  @Input() shPlaceHolder: string = 'Select';
  @Input() shMultiple: boolean = false;
  @Input() shShowSearch: boolean = false;
  @Input() shOptions: any[] = []; // Để xử lý nhóm hoặc tùy chọn đơn giản
  @Input() shApiCall!: (query: string) => Promise<any[]>;

  @Output() ngModelChange = new EventEmitter<any>();

  dropdownOpen = false;
  selectedValue: string | null = null;
  selectedTags: string[] = [];
  searchQuery: string = '';
  filteredOptions: any[] = [];
  loading: boolean = false;
  searchTimeout: any;

  ngOnInit(): void {
    this.initializeOptions();
  }

  initializeOptions(): void {
    this.filteredOptions = this.shOptions;

    this.shData.forEach(data => {
      if (data.group) {
        if (this._sData[data.group]) {
          this._sData[data.group].push(data);
        } else {
          this._sData[data.group] = [data];
        }
      }
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown(): void {
    this.dropdownOpen = false;
  }

  debounceOnSearchChange(): void {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.onSearchChange(), 300); // Đặt độ trễ tìm kiếm 300ms
  }

  onSearchChange(): void {
    if (this.shApiCall) {
      this.loading = true;
      this.shApiCall(this.searchQuery).then(options => {
        this.filteredOptions = options;
        this.loading = false;
      }).catch(() => {
        this.filteredOptions = [];
        this.loading = false;
      });
    } else {
      this.filterOptions();
    }
  }

  filterOptions(): void {
    this.filteredOptions = this.shOptions.filter(option => {
      const label = option.label.toLowerCase();
      return label.includes(this.searchQuery.toLowerCase());
    });
  }

  selectOption(option: any): void {
    if (this.shMultiple) {
      if (!this.selectedTags.includes(option.label)) {
        this.selectedTags.push(option.label);
        this.ngModelChange.emit(this.selectedTags);
      } else {
        this.removeTag(option.label); // Loại bỏ tag nếu đã chọn
      }
    } else {
      this.selectedValue = option.label;
      this.ngModelChange.emit(option.value);
      this.toggleDropdown();
    }
  }

  removeTag(tag: string): void {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.ngModelChange.emit(this.selectedTags);
  }

  isSelected(option: any): boolean {
    return this.shMultiple ? this.selectedTags.includes(option.label) : this.selectedValue === option.label;
  }
}
