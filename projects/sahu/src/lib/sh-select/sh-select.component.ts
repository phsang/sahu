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

  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter<any>();

  dropdownOpen = false;
  selectedValue: string | null = null;
  selectedTags: string[] = [];

  ngOnInit(): void {
    this.initializeOptions();
    if (this.shMultiple) {
      this.selectedTags = this.ngModel || [];
    } else {
      this.selectedValue = this.ngModel;
    }
  }

  initializeOptions(): void {
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

  selectOption(option: any): void {
    if (this.shMultiple) {
      if (!this.selectedTags.includes(option.label)) {
        this.selectedTags.push(option.label);
      } else {
        this.removeTag(option.label); // Loại bỏ tag nếu đã chọn
      }
      this.ngModelChange.emit(this.selectedTags); // Phát giá trị sau khi thay đổi
    } else {
      this.selectedValue = option.label;
      this.ngModel = option.value;
      this.ngModelChange.emit(this.selectedValue); // Phát giá trị sau khi thay đổi
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
