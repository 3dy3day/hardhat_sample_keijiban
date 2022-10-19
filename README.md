# ブロックチェーン掲示板アプリのサンプル

## 1. /backendの作業

``` bash  
cd backend  
# 必要パッケージのインストール  
npm install  
  
# solidityファイルのコンパイル  
npx hardhat compile  
  
# hardhat プライベートブロックチェーンの構築  
npx hardhat node  
  
# プライベートブロックチェーンにコンパイルしたコードをデプロイ  
npx hardhat run --network localhost scripts/deploy.ts  
```  
  
## 2. /frontendの作業  

``` bash  
cd frontend  
  
# コンパイルで生成されたABIをsrc/abiにコピー  
cp ../backend/artifacts/contracts/keijiban.sol/keijiban.json ./src/abi/  
  
# 必要パッケージのインストール  
npm install  
  
# フロントエンドのローカルサーバ構築  
npm run dev  
```  
