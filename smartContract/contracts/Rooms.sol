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
    address[] public allAdmins; 

    event RoomCreated(
        address indexed admin,
        uint256 code,
        uint16 voteOptions
    );
    event AllAdminsReturned(
        uint256 indexed length
    );


    function createRoom(uint256 _code, uint16 _voteOptions) public
    {
        address _id = msg.sender;
        require(!rooms[_id].exists, "Room already exists!");
        // require(_admin == _id, "???");
        
        //test
        // require(1 == 0,"Test revert!");
        //

        allAdmins.push(_id); 

        rooms[_id] = Room
        ({
            admin: _id,
            code: _code,
            voteOptions: _voteOptions,
            exists: true
        });



        emit RoomCreated(_id,_code,_voteOptions);

    }

    // function getVoteOptions(address _admin,uint256 _code) public view returns(uint)
    // {
    //     require(rooms[_admin].exists, "Room does not exists!");
    //     return rooms[_admin].voteOptions;
    // }

    function isCorrectRoom(address _admin, uint256 _code) public view returns(bool)
    {
        require(rooms[_admin].exists, "Room does not exist!");
        // require(!rooms[_admin].exists, "Room exist!");
        return rooms[_admin].code==_code;
    }

    function getAllAdmins(uint256 _length) public{
        // require(1 == 0,"Test revert!");
        emit AllAdminsReturned(4);
    }

    function getRoom(address _admin) public view returns(Room memory) {
        require(rooms[_admin].exists, "Room does not exist!");
        return rooms[_admin];
    }

    function getVoteOptions(address _admin) public view returns(uint)
    {
        require(rooms[_admin].exists, "Room does not exist!");
        return rooms[_admin].voteOptions;
    }
}
