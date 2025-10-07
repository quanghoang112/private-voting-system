// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.28;



contract roomManagement
{
    struct Room
    {
        address admin;        // wallet address của người tạo
        uint256 code;         // mã phòng (có thể hash)
        // address[] member;    // danh sách accounts đã join
        uint16 voteOptions; // số phiếu cho từng lựa chọn
        // uint256 endAt; // Thời gian kết thúc (ms)
        bool exists;
    }

    mapping(address => Room) public rooms;
    event RoomCreated(
        address indexed admin,
        uint256 code,
        uint16 voteOptions
    );

    function createRoom(uint256 _code, uint16 _voteOptions) public
    {
        address id = msg.sender;
        require(!rooms[id].exists, "Room already exists!");
        rooms[id] = Room
        ({
            admin: id,
            code: _code,
            voteOptions: _voteOptions,
            exists: true
        });

        emit RoomCreated(id,_code,_voteOptions);

    }

    function getRoom(address _admin) public view returns(Room memory)
    {
        require(rooms[_admin].exists, "Room does not exist!");
        return rooms[_admin];
    }
}
