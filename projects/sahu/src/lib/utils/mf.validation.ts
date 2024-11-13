import { slideDown, slideUp } from './mf.animation';
import { formatNumber } from './mf.app';
import { fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class mfValidation {

  generateError(element: HTMLElement, status: boolean = true, msg: string = 'Vui lòng điền vào trường này!'): void {
    const parent = element.closest('.field-validation');
    const msgError = parent?.querySelector('.msg_error');
    msg = '<i class="fal fa-exclamation-triangle"></i>' + msg;

    if (status) {
      parent?.classList.remove('field_error');
      if (msgError) {
        slideUp(msgError as HTMLElement, 250, () => {
          msgError.remove();
        });
      }
    } else {
      if (msgError) {
        msgError.innerHTML = msg;
      } else {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'msg_error';
        errorSpan.innerHTML = msg;
        parent?.appendChild(errorSpan);
        slideDown(errorSpan, 250);
      }
      parent?.classList.add('field_error');
    }
  }

  lengthValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, _dataLength: string, _val: string): boolean {
    let [_dataMin, _dataMax] = _dataLength.split(',');
    _dataMin = _dataMin.trim();
    _dataMax = _dataMax.trim();

    if (_dataMin != '*' && _dataMax != '*') {
      if (
        parseInt(_dataMin) > _val.length ||
        parseInt(_dataMax) < _val.length
      ) {
        this.generateError(input, false, `Giá trị có độ dài không được nhỏ hơn ${formatNumber(_dataMin)} và lớn hơn ${formatNumber(_dataMax)}`);
        return false;
      }
    }
    if (_dataMin != '*') {
      if (parseInt(_dataMin) > _val.length) {
        this.generateError(input, false, `Giá trị có độ dài không được nhỏ hơn ${formatNumber(_dataMin)}`);
        return false;
      }
    }
    if (_dataMax != '*') {
      if (parseInt(_dataMax) < _val.length) {
        _val = _val.slice(0, parseInt(_dataMax));
        input.value = _val;

        this.generateError(input, false, `Giá trị có độ dài không được lớn hơn ${formatNumber(_dataMax)}`);
        setTimeout(() => {
          this.generateError(input, true);
        }, 5000);
        return true;
      }
    }

    this.generateError(input, true);
    return true;
  }

  validValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value || null;
    let _dataLength = input.getAttribute('data-length')?.trim() || null;

    if (_val) {
      if (_dataLength) {
        return this.lengthValidation(input, _dataLength, _val);
      }
    }

    this.generateError(input, true);
    return true;
  }

  nullValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _type = input.getAttribute('type');

    if (_type === 'file') {
      if (!input.value || input.value === '') {
        this.generateError(input, false, 'Vui lòng chọn file');
        return false;
      }
      this.generateError(input, true);
      return true;
    }

    if (
      (input.tagName.toUpperCase() === 'INPUT' && _type === 'text') ||
      input.tagName.toUpperCase() === 'TEXTAREA'
    ) {
      let _val: string | null = input.value || null;
      let _dataLength = input.getAttribute('data-length')?.trim() || null;
      if (_val) {
        input.value = _val.trimStart();
        if (_dataLength) {
          return this.lengthValidation(input, _dataLength, _val);
        }

        this.generateError(input, true);
        return true;
      }
    }

    this.generateError(input, false);
    return false;
  }

  otpValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value.trim() || null;
    let _dataLength = input.getAttribute('data-length')?.trim() || null;

    if (!_val) {
      this.generateError(input, false, 'Không bỏ trống giá trị OTP');
      return false;
    } else {
      _val = _val.replace(/\D/g, '');
      input.value = _val;

      if (_dataLength) {
        return this.lengthValidation(input, _dataLength, _val);
      }
    }

    this.generateError(input, true);
    return true;
  }

  urlValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value || null;
    let _dataLength = input.getAttribute('data-length')?.trim() || null;

    if (_val?.trim()) {
      input.value = _val.trimStart();

      const isValidUrl = (urlString: string) => {
        try {
          new URL(urlString);
          return true;
        } catch (_) {
          return false;
        }
      }

      if (isValidUrl(_val)) {
        if (_dataLength) {
          return this.lengthValidation(input, _dataLength, _val);
        }

        this.generateError(input, true);
        return true;
      } else {
        if (_dataLength) {
          const _dataMax = _dataLength.split(',')[1].trim();
          _val = _val.slice(0, parseInt(_dataMax));
          input.value = _val;
        }

        this.generateError(input, false, 'Đường dẫn không phải là một URL hợp lệ!');
        return false;
      }
    }
    this.generateError(input, true);
    return true;
  }

  nullUrlValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value || null;
    let _dataLength = input.getAttribute('data-length')?.trim() || null;

    if (_val?.trim()) {
      input.value = _val.trimStart();

      const isValidUrl = (urlString: string) => {
        try {
          new URL(urlString);
          return true;
        } catch (_) {
          return false;
        }
      }

      if (isValidUrl(_val)) {
        if (_dataLength) {
          return this.lengthValidation(input, _dataLength, _val);
        }

        this.generateError(input, true);
        return true;
      } else {
        if (_dataLength) {
          const _dataMax = _dataLength.split(',')[1].trim();
          _val = _val.slice(0, parseInt(_dataMax));
          input.value = _val;
        }

        this.generateError(input, false, 'Đường dẫn không phải là một URL hợp lệ!');
        return false;
      }
    }
    this.generateError(input, false);
    return false;
  }

  nullIntValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value || null;

    if (_val) {
      _val = _val.trimStart().replace(/\D/g, '');
      input.value = formatNumber(_val);
      let _dataMin = input.getAttribute('data-min')?.trim() || null;
      let _dataMax = input.getAttribute('data-max')?.trim() || null;

      if (_dataMin) {
        if (parseInt(_dataMin) > parseInt(_val)) {
          this.generateError(input, false, `Giá trị không được nhỏ hơn ${formatNumber(_dataMin)}`);
          return false;
        }
      }
      if (_dataMax) {
        if (parseInt(_dataMax) < parseInt(_val)) {
          input.value = formatNumber(_dataMax);

          this.generateError(input, false, `Giá trị không được lớn hơn ${formatNumber(_dataMax)}`);

          setTimeout(() => {
            this.generateError(input, true);
          }, 5000);

          return true;
        }
      }

      this.generateError(input, true);
      return true;
    }
    this.generateError(input, false);
    return false;
  }

  nullPhoneValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    let _val: string | null = input.value || null;

    if (_val) {
      _val = _val.trimStart().replace(/\D|\./g, '');
      if (_val.length > 10) {
        _val = _val.substring(0, 10);
      }
      input.value = _val;
      let vnf = vnf_regex.test(_val);
      this.generateError(input, vnf, vnf ? '' : _val.length > 0 ? 'Số điện thoại không đúng định dạng!' : 'Không bỏ trống số điện thoại!');

      // format số điện thoại
      if (_val.length > 4 && _val.length < 8) {
        _val = _val.substring(0, 4) + '.' + _val.substring(4);
      } else if (_val.length >= 8) {
        _val = _val.substring(0, 4) + '.' + _val.substring(4, 7) + '.' + _val.substring(7);
      }

      input.value = _val;

      return vnf;
    }

    this.generateError(input, false);
    return false;
  }

  nullEmailValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    let _val: string | null = input.value || null;

    if (_val?.trim) {
      let vnf = emailRegex.test(_val);
      this.generateError(input, vnf, vnf ? '' : _val.length > 0 ? 'Email không hợp lệ' : 'Vui lòng điền vào trường này');

      return vnf;
    }

    this.generateError(input, false);
    return false;
  }

  validateWith3Rules(input: HTMLElement, rules: Array<string>): boolean {
    switch (true) {
    }
    return true;
  }

  validateWith2Rules(input: HTMLElement, rules: Array<string>): boolean {
    switch (true) {
      case (rules.includes('null') && rules.includes('email')): {
        return this.nullEmailValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('null') && rules.includes('phone')): {
        return this.nullPhoneValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('null') && rules.includes('url')): {
        return this.nullUrlValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('null') && rules.includes('int')): {
        return this.nullIntValidation(input as HTMLInputElement);
        break;
      }
    }
    return true;
  }

  validateWith1Rules(input: HTMLElement, rules: Array<string>): boolean {
    switch (true) {
      case (rules.includes('valid')): {
        return this.validValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('null')): {
        return this.nullValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('otp')): {
        return this.otpValidation(input as HTMLInputElement);
        break;
      }
      case (rules.includes('url')): {
        return this.urlValidation(input as HTMLInputElement);
        break;
      }
    }
    return true;
  }

  detectAll(form: HTMLFormElement): boolean {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {
        let _dataVali = input.getAttribute('data-vali')?.trim() || null;
        if (_dataVali) {
          let _dataValiArr = _dataVali.split(',');
          _dataValiArr = _dataValiArr.map((item) => item.trim());

          // gọi các hàm validate
          switch (_dataValiArr.length) {
            case 3: {
              isValid = this.validateWith3Rules(input, _dataValiArr) && isValid;
              break;
            }
            case 2: {
              isValid = this.validateWith2Rules(input, _dataValiArr) && isValid;
              break;
            }
            case 1: {
              isValid = this.validateWith1Rules(input, _dataValiArr) && isValid;
              break;
            }
          }
        }
      }
    });

    if (!isValid) {
      form.querySelector('*[type="submit"]')?.classList.add('btn-disabled');
    } else {
      form.querySelector('*[type="submit"]')?.classList.remove('btn-disabled');
    }

    return isValid;
  }

  init(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLSelectElement || input instanceof HTMLTextAreaElement) {

        merge(
          fromEvent(input, 'input'),
          fromEvent(input, 'change')
        ).pipe(
          debounceTime(0)
        ).subscribe(() => {
          // Xử lý logic của bạn ở đây
          let _dataVali = input.getAttribute('data-vali')?.trim() || null;
          let isValid = true;
          if (_dataVali) {
            let _dataValiArr = _dataVali.split(',');
            _dataValiArr = _dataValiArr.map((item) => item.trim());

            // gọi các hàm validate
            switch (_dataValiArr.length) {
              case 3: {
                isValid = this.validateWith3Rules(input, _dataValiArr);
                break;
              }
              case 2: {
                isValid = this.validateWith2Rules(input, _dataValiArr);
                break;
              }
              case 1: {
                isValid = this.validateWith1Rules(input, _dataValiArr);
                break;
              }
            }
          }

          if (!isValid) {
            form.querySelector('*[type="submit"]')?.classList.add('btn-disabled');
          } else {
            form.querySelector('*[type="submit"]')?.classList.remove('btn-disabled');
          }
        });
      }
    });
  }

}