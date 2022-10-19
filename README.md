## 1. /backendの作業  
``` 
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

もしくは、  
```  
cd backend  
make  
```  
  
## 2. /frontendの作業  
```  
cd frontend  
  
# コンパイルで生成されたABIをsrc/abiにコピー  
cp ../backend/artifacts/contracts/keijiban.sol/keijiban.json ./src/abi/  
  
# 必要パッケージのインストール  
npm install  
  
# フロントエンドのローカルサーバ構築  
npm run dev  
```  
  
もしくは、  
```  
cd frontend  
make  
```  
