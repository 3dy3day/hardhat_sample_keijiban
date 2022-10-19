// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract keijiban is ERC20 {
    ///////////////////////////////////////////////////////////////////////////////////////////
    /// イベント
    /// イベントはフロントエンドで購読することができる

    // コンテンツが投稿されたときに発火するイベント
    event CreatedPost(string indexed name, string content, address id);

    ///////////////////////////////////////////////////////////////////////////////////////////
    /// 構造体宣言

    // 掲示板のコンテンツ
    struct Post {
        string name;
        string content;
        address author;
        uint256 good_count;
    }

    // フロントへ返却されるコンテンツ
    struct PostWithID {
        Post post;
        uint256 id;
    }

    ///////////////////////////////////////////////////////////////////////////////////////////
    /// プロパティ
    /// クラス内で参照できる。
    /// プロパティはブロックチェーン上に保存され、永続化される。

    // コンテンツの長さを格納する変数。
    // mappingは長さを持たないかつ、直接返却ができないため、Arrayに変換するためにこの変数を持つ
    // また、今回ではコンテンツのID割り振りにも使用する
    //（並列実行時の動作確認は行っていないため、実際のプロダクトでは要確認）
    uint256 public posts_length;

    // 通貨を発行できるアドレス（今回の場合はデプロイヤー）
    address public minter;

    // いいねすることで送られる金額
    uint256 constant good_value = 10;

    // 掲示板に投稿されたコンテンツ
    // いいね機能のために全コンテンツの探索を行う必要があるため、
    // O(1)で探索が行えるmappingを使用することでGas代を節約する
    // 参考：https://qiita.com/yuhattor/items/2bd78cafd1bfd3f08b69#array-vs-mapping
    mapping(uint256 => Post) public posts;

    ///////////////////////////////////////////////////////////////////////////////////////////
    /// メンバ関数

    // コンストラクタ。デプロイ時に一回だけ呼ばれる
    constructor() ERC20("GOLD", "G") {
        minter = msg.sender;
        posts_length = 0;
        _mint(msg.sender, 100);
        createPost(unicode"管理人", unicode"ほんわかレス推奨です！");
    }

    // いいねボタン。いいねするたびに投稿主へ固定額が支払われる
    // TransferはOpenZeppelinで定義されている取引時イベント
    function good(uint256 _post_id) public {
        // 残高不足
        if (balanceOf(msg.sender) < good_value) {
            return;
        }
        // 自分自身には送金できない
        if (msg.sender == posts[_post_id].author) {
            return;
        }
        transfer(posts[_post_id].author, good_value);
        posts[_post_id].good_count++;
        emit Transfer(msg.sender, posts[_post_id].author, good_value);
    }

    // コンテンツを投稿する
    function createPost(string memory _name, string memory _content) public {
        address sender = msg.sender;
        posts[posts_length] = Post(_name, _content, sender, 0);
        posts_length++;
        emit CreatedPost(_name, _content, sender);
    }

    // senderの残高を返却する
    function getBalance() public view returns (uint256) {
        return balanceOf(msg.sender);
    }

    // 投稿されたコンテンツのリストを返却する
    // mappingはそのまま返却することができないため、arrayへ変換して返却する
    function getPosts() public view returns (PostWithID[] memory) {
        PostWithID[] memory ret = new PostWithID[](posts_length);
        for (uint256 i = 0; i < posts_length; i++) {
            ret[i].post = posts[i];
            ret[i].id = i;
        }
        return ret;
    }
}
