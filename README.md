## 1. /backendの作業  
``` 
cd backend  
# 必要パッケージのインストール  
npm install  
  
# solidityファイルのコンパイル  
npx compile  
  
# hardhat プライベートブロックチェーンの構築  
npx hardhat node  
  
# プライベートブロックチェーンにコンパイルしたコードをデプロイ  
npx hardhat run --network localhost scripts/deploy.ts  
```  
## 2. /frontendの作業  
```  
cd frontend  
  
# 必要パッケージのインストール  
npm install  
  
# フロントエンドのローカルサーバ構築  
npm run dev  
```  
