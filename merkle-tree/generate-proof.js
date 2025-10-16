import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";
import {writeFileSync} from "./utils/onFile.js";

// (1)
const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json", "utf8")));

const proofList =[];

// (2)
for (const [i, v] of tree.entries()) {
  // if (v[0] === '0x9576A6135DA7af70bBe2b10c498208Cd4b838DD7') {
    // (3)
    const proof = tree.getProof(i);
    // console.log('Value:', v);
    // console.log('Proof:', proof);
    proofList.push(proof);
    // writeFileSync('proof.json', proof);
  // }
}

console.log(proofList);

const output =
{
  proof: proofList
}

fs.writeFileSync("proof.json", JSON.stringify(output, null, 2));