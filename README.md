
<img width="744" alt="Screenshot 2024-03-07 at 9 09 00 PM" src="https://github.com/0xJomo/deramp-contracts/assets/804368/2b08fd9f-9e8e-454c-937d-6ce1407ee592">



# deramp sepolia config:

## quickstart

```bash
yarn
yarn prepare
yarn dev
```
add sepolia eth to an account and add it to .env:

```env
ETH_NODE_URI_SEPOLIA=https://eth-sepolia.g.alchemy.com/v2/v178sXJ0X49qRdgINzyuNbEvKsMXob4W
MNEMONIC_SEPOLIA='FILL THESE IN'
```

edit **hardhat.config.ts**, and fill in the address for the simpleOffchainVerifier named account on sepolia:
```javascript
	namedAccounts: {
		deployer: 0,
		simpleERC20Beneficiary: 1,
		onRamper: 2,
		offRamper: 3,
		simpleOffchainVerifier: {
			default: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			sepolia: 'match this with the mnemonic in the .env'
		},
```


## in another shell

```bash
yarn execute localhost scripts/getBalance.ts
```
