// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract keijiban {
    event CreatedPost(string indexed name, string content, address id);

    struct Post {
        string name;
        string content;
        address id;
    }

    Post[] public posts;

    function getPosts() external view returns(Post[] memory) {
        return posts;
    }
    
    function createPost(string memory _name, string memory _content) public {
        address sender = msg.sender;
        posts.push(Post(_name, _content, sender));
        emit CreatedPost(_name, _content, sender);
    }

    constructor() {
        createPost(unicode"管理人", unicode"ほんわかレス推奨です！");
    }
}