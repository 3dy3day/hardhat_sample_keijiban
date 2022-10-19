build:
	cd ../backend &&\
	npx hardhat run --network localhost scripts/deploy.ts
	cp ../backend/artifacts/contracts/keijiban.sol/keijiban.json ./src/abi/ &&\
	npm install &&\
	npm run dev
