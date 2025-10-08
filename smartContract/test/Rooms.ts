import { expect } from "chai";
import { network } from "hardhat";
import { matchesGlob } from "path";

const { ethers } = await network.connect();

const testCode1 = 123456;
const testOptions1 = 3;
const testCode2 = 987654;
const testOptions2 = 5;
const roomManagement = await ethers.deployContract("roomManagement");

const [owner] = await ethers.getSigners();

describe("createRoom", function () {
  it("Should emit the RoomCreated event when calling the createRoom() function", async function () {
    

    await expect(roomManagement.createRoom(testCode2,testOptions2)).to.emit(roomManagement, "RoomCreated")
    .withArgs(owner.address,testCode2,testOptions2);
  });
});

describe("createRoomAndGetRoom", function () {
        it("Nên trả về dữ liệu Room chính xác cho Admin tồn tại", async function () {

            const roomData = await roomManagement.getRoom(owner.address);
            
            expect(roomData.admin).to.equal(owner.address);
            expect(roomData.code).to.equal(testCode2);
            expect(roomData.voteOptions).to.equal(testOptions2);
            expect(roomData.exists).to.equal(true);
        });

        it("Nên revert nếu Room Admin không tồn tại", async function () {
            await expect(roomManagement.getRoom("0x0000000000000000000000000000000000000001"))
                .to.be.revertedWith("Room does not exist!");
        });
    });

describe("isCorrectRoom", function () {
        it("Nên trả về TRUE nếu Admin và Code là chính xác", async function () {
            const isCorrect = await roomManagement.isCorrectRoom(owner.address, testCode2);
            expect(isCorrect).to.equal(true);
        });

        it("Nên trả về FALSE nếu Code không chính xác", async function () {
            const isCorrect = await roomManagement.isCorrectRoom(owner.address, 999999);
            expect(isCorrect).to.equal(false);
        });

        it("Nên revert nếu Room Admin không tồn tại", async function () {
            await expect(roomManagement.isCorrectRoom("0x0000000000000000000000000000000000000001", testCode1))
                .to.be.revertedWith("Room does not exist!");
        });
    });

describe("getAllAdmins", function () {
        it("Should emit the AllAdminsReturned event when calling the getAllAdmins() function", async function () {
    

    await expect(roomManagement.getAllAdmins(5)).to.emit(roomManagement, "AllAdminsReturned")
    .withArgs(5);
  });
    });
