import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  readFileExcelToJson(file: File): any {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const binaryString: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

        // Giả sử bạn muốn lấy dữ liệu từ sheet đầu tiên
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // Chuyển dữ liệu từ sheet thành JSON
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Loại bỏ các mảng rỗng
        const filteredData = data.filter((row: any) => row.length > 0);

        resolve(filteredData);
      };

      reader.onerror = () => {
        reject('File could not be read');
      };

      reader.readAsArrayBuffer(file);
    });
  }
}
