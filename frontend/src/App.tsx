import { ethers, Contract } from "ethers";
import React from "react";
import artifact from "./abi/keijiban.json";

interface AppState {
    // genaral
    posts: Post[]
    contract: ethers.Contract | null

    // inputs
    inputName: string
    inputContent: string
}

class Post {
    public name = "";
    public content = "";
    public id = "";
}

export class App extends React.Component<any, AppState>{
    constructor (props:any) {
        super(props);

        // Solidityの方と通信するための設定
        const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"
        const provider = this.connectWallet();
        provider.then(provider => {
            const signer = provider.getSigner();
            const keijibanContract = new Contract(
                contractAddress,
                artifact.abi,
                provider
            );
            const contractWithSigner = keijibanContract.connect(signer);
            
            // State初期化
            this.setState(p => ({contract: contractWithSigner}));
            this.getPosts();
            
            // SolidityのCreatedPostイベントを補足する
            const filters: ethers.EventFilter = contractWithSigner.filters.CreatedPost(null, null, null);
            if (filters !== undefined) {
                provider.once("block", () => {
                    contractWithSigner.on(filters, this.handleCreatedPostEvent)
                });
            };
        }); 
        
        this.state =  {
            posts: [] as Post[],
            contract: null,
            inputName: "",
            inputContent: ""
        };
    };

    private connectWallet = async () => {
        // With hardhat test account
        const provider = new ethers.providers.JsonRpcProvider();

        // With metamask
        // const provider = new ethers.providers.Web3Provider((window as any).ethereum);
        // await provider.send('eth_requestAccounts', []);

        return provider
    };

    private getPosts = async () => {
        // Solidityの方で定義したgetPostsを呼び出し、Postの一覧を取得する
        if (this.state.contract !== null) {
            const result = await this.state.contract.getPosts();
            this.setState(p => ({posts: result}));
        }
    };

    private createPost = () => {
        // Solidityの方で定義したcreatePostを呼び出し、Postを新規作成する
        if (this.state.contract !== null) {
            this.state.contract.createPost(this.state.inputName, this.state.inputContent);
        }
    };

    /// handlers
    handleClickSendButton = () => {
        this.createPost();
        this.setState(p => ({
            inputContent: ""
        }));
    }

    handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState(p => ({
            inputName: e.target.value
        }));
    }

    handleChangeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState(p => ({
            inputContent: e.target.value
        }));
    }

    handleCreatedPostEvent = (name: string, content: string, id: string) => {
        this.getPosts();
    }

    render() {
        const listItems = this.state.posts.map((post, index) =>
            <div key={index}>
                    投稿者: {post.name} ID: {post.id}
                    <br></br>
                    <p>{post.content}</p>
            </div>
        );
        return (
            <div>
                <h1>Welcome to Blockchain Keijiban</h1>
                <div>{listItems}</div>
                
                <hr></hr>
                <p>名前<br></br>
                    <input autoComplete="off" id="name" onChange={this.handleChangeName} value={this.state.inputName}></input>
                </p>
                <p>内容<br></br>
                    <textarea autoComplete="off" id="content" cols={40} rows={10} onChange={this.handleChangeContent} value={this.state.inputContent}></textarea>
                </p>

                <button onClick={this.handleClickSendButton}>投稿</button>
            </div>
        )
    }
}