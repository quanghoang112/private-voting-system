import { LeanIMT } from "@zk-kit/lean-imt"
import { poseidon2 } from "poseidon-lite"
import {ethers, JsonRpcSigner} from "ethers";
import * as fs from 'fs';
import * as path from 'path';

const readJsonFile =(filePath) => {
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

const writeFileSync =(filePath, data) => {
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




const hash = (a, b) => poseidon2([a, b])

const main =() =>
{
    const tree = new LeanIMT(hash);


    const publicKeys = readJsonFile('./voter-list.json').publicKey;

    for (let i in publicKeys) 
    {
        console.log("Inserting: ", publicKeys[i]);
        tree.insert(publicKeys[i]);
    }

    console.log("leaves: ", tree.leaves);

    console.log("Root: ", tree.root.toString(16));

    const root ={
        MerkleTreeRoot: `0x${tree.root.toString(16)}`,
    }

    console.log("Root: ", root);


    writeFileSync('root.json', root);
}

console.log(hash("1234",1).toString(16))

// main();

