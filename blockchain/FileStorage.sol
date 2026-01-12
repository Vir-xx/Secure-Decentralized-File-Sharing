// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FileStorage {
    struct FileData {
        string cid;
        address owner;
        address receiver;
        uint256 timestamp;
    }

    uint256 public fileCount;

    mapping(uint256 => FileData) private files;

    event FileUploaded(
        uint256 indexed fileId,
        address indexed owner,
        address indexed receiver,
        string cid
    );

    function uploadFile(string memory _cid, address _receiver) public {
        fileCount++;

        files[fileCount] = FileData({
            cid: _cid,
            owner: msg.sender,
            receiver: _receiver,
            timestamp: block.timestamp
        });

        emit FileUploaded(fileCount, msg.sender, _receiver, _cid);
    }

    function getFile(uint256 _fileId) public view returns (string memory) {
        require(
            msg.sender == files[_fileId].owner ||
                msg.sender == files[_fileId].receiver,
            "Access denied"
        );

        return files[_fileId].cid;
    }
}
