import * as fs from 'fs';
import * as path from 'path';

export const readJsonFile =(filePath) => {
  try {
    const absolutePath = path.resolve(filePath);
    // Đọc file đồng bộ
    const fileContent = fs.readFileSync(absolutePath, 'utf-8');
    // Phân tích chuỗi JSON thành đối tượng JavaScript và gán kiểu
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Lỗi khi đọc hoặc phân tích file JSON:", error);
    return []; // Trả về mảng rỗng hoặc xử lý lỗi khác
  }
}

export const writeFileSync =(filePath, data) => {
    // const outputFilePath = path.join(__dirname, filePath);
    const dataString = JSON.stringify(data, null, 2); // Chuyển đổi đối tượng thành chuỗi JSON với thụt lề
    fs.writeFile(filePath, dataString, 'utf8', (err) => {
        if (err) {
            // Xử lý lỗi nếu có
            console.error("Lỗi khi ghi file JSON:", err);
            return;
        }
    });
}