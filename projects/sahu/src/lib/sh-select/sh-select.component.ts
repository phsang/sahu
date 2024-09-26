import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'sh-select',
  templateUrl: './sh-select.component.html',
  styleUrls: ['./sh-select.component.scss']
})
export class ShSelectComponent implements OnInit {
  @Input() shData: any[] = [];
  _sData: { [key: string]: any[] } = {};

  @Input() shMultiple: boolean = false;
  @Input() shPlaceHolder: string = 'Select';

  @Input() shSearchPlaceHolder: string = '';
  @Input() shShowSearch: boolean = false;

  @Input() ngModel: any[] = [];
  @Output() ngModelChange = new EventEmitter<any>();

  dropdownOpen = false;
  selectedOptions: any[] = [];

  ngOnInit(): void {
    this.initializeOptions();
    this.selectedOptions = this.ngModel || [];
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

  modelChangeEmit() {
    let _model = [];
    if (this.shMultiple) {
      this.selectedOptions.forEach(option => {
        _model.push(option.value);
      })
    } else {
      _model = this.selectedOptions[0].value;
    }
    this.ngModelChange.emit(_model);
  }

  selectOption(option: any, event: any): void {
    if (this.shMultiple) {
      if (event.target.checked) {
        this.selectedOptions.push(option);
      } else {
        this.selectedOptions = this.selectedOptions.filter(o => o !== option);
      }
    } else {
      this.selectedOptions = [option];
      this.toggleDropdown();
    }
    this.modelChangeEmit();
  }

  removeTag(option: any): void {
    this.selectedOptions = this.selectedOptions.filter(o => o !== option);
    this.dropdownOpen = false;
    this.modelChangeEmit();
  }
}
