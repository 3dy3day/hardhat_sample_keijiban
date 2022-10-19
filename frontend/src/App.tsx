import { ethers, Contract } from "ethers";
import React from "react";
import artifact from "./abi/keijiban.json";

class Post {
  public name = "";
  public content = "";
  public author = "";
  public good_count = ethers.BigNumber.from(0);
}

class PostWithID {
  public post = new Post();
  public id = ethers.BigNumber.from(0);
}

interface AppState {
  // genaral
  posts: PostWithID[];
  balance: ethers.BigNumber;
  contract: ethers.Contract | null;

  // inputs
  inputName: string;
  inputContent: string;
}

export class App extends React.Component<any, AppState> {
  constructor(props: any) {
    super(props);

    // Solidityの方と通信するための設定
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const provider = this.connectWallet();
    provider.then((provider) => {
      const signer = provider.getSigner();
      const keijibanContract = new Contract(
        contractAddress,
        (artifact as any).abi,
        provider,
      );
      const contractWithSigner = keijibanContract.connect(signer);

      // State初期化
      this.setState((p) => ({ contract: contractWithSigner }));
      this.getPosts();
      this.getBalance();

      // SolidityのCreatedPostイベントを補足する
      // コンテンツ投稿更新のイベント
      provider.once("block", () => {
        contractWithSigner.on(
          contractWithSigner.filters.CreatedPost(null, null, null),
          this.handleCreatedPostEvent,
        );
      });
      signer.getAddress().then((myAddress: string) => {
        // いいね送信時のイベント
        provider.once("block", () => {
          contractWithSigner.on(
            contractWithSigner.filters.Good(myAddress, null, null),
            this.handleSendGoodEvent,
          );
        });
        // いいね受信時のイベント
        provider.once("block", () => {
          contractWithSigner.on(
            contractWithSigner.filters.Good(null, myAddress, null),
            this.handleReceiveGoodEvent,
          );
        });
      });
    });

    this.state = {
      posts: [],
      balance: ethers.BigNumber.from(0),
      contract: null,
      inputName: "",
      inputContent: "",
    };
  }

  connectWallet = async () => {
    // With hardhat test account
    const provider = new ethers.providers.JsonRpcProvider();

    // With metamask
    // const provider = new ethers.providers.Web3Provider((window as any).ethereum);
    // await provider.send('eth_requestAccounts', []);

    return provider;
  };

  // Solidity側で定義したgetPostsを呼び出し、Postの一覧を取得する
  getPosts = async () => {
    if (this.state.contract == null) {
      return;
    }
    const result = await this.state.contract.getPosts();
    this.setState((p) => ({ posts: result }));
  };

  // Solidity側で定義したcreatePostを呼び出し、Postを新規作成する
  createPost = () => {
    if (this.state.contract == null) {
      return;
    }
    this.state.contract.createPost(
      this.state.inputName,
      this.state.inputContent,
    );
  };

  // Solidity側で定義したgoodを呼び出し、いいね処理を行う
  good = (contentId: ethers.BigNumber) => {
    if (this.state.contract == null) {
      return;
    }
    this.state.contract.good(contentId);
  };

  // Solidity側で定義したgetBalanceを呼び出し、現在の残高を取得する
  getBalance = async () => {
    if (this.state.contract == null) {
      return;
    }
    const balance =
      (await this.state.contract.getBalance()) as ethers.BigNumber;
    this.setState((p) => ({
      balance: balance,
    }));
  };

  /// handlers
  handleClickSendButton = () => {
    this.createPost();
    this.setState((p) => ({
      inputContent: "",
    }));
  };

  handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState((p) => ({
      inputName: e.target.value,
    }));
  };

  handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState((p) => ({
      inputContent: e.target.value,
    }));
  };

  handleCreatedPostEvent = (name: string, content: string, id: string) => {
    this.getPosts();
  };

  handleSendGoodEvent = (
    from: string,
    to: string,
    result: ethers.BigNumber,
  ) => {
    if (result.toNumber() == 1) {
      alert("残高不足です");
    }
    if (result.toNumber() == 2) {
      alert("自分にいいねは送れません");
    }
    this.getBalance();
    this.getPosts();
  };

  handleReceiveGoodEvent = (
    from: string,
    to: string,
    result: ethers.BigNumber,
  ) => {
    this.getBalance();
    this.getPosts();
  };

  render() {
    return (
      <div>
        <h1>Welcome to Blockchain Keijiban</h1>
        <div>現在の残高: {this.state.balance.toString()}</div>
        <div>
          {this.state.posts.map((post, index) => (
            <div key={index}>
              <hr />
              <div>投稿者: {post.post.name}</div>
              <div>ID: {post.post.author}</div>
              <div>いいねの数: {post.post.good_count.toString()}</div>
              <div>
                <button onClick={() => this.good(post.id)}>いいね</button>
              </div>
              <p>{post.post.content}</p>
            </div>
          ))}
        </div>
        <hr></hr>
        <p>
          名前<br></br>
          <input
            autoComplete="off"
            id="name"
            onChange={this.handleChangeName}
            value={this.state.inputName}
          ></input>
        </p>
        <p>
          内容<br></br>
          <textarea
            autoComplete="off"
            id="content"
            cols={40}
            rows={10}
            onChange={this.handleChangeContent}
            value={this.state.inputContent}
          ></textarea>
        </p>
        <button onClick={this.handleClickSendButton}>投稿</button>
      </div>
    );
  }
}
