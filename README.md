# deramp sepolia config:

## quickstart

```bash
pnpm i
pnpm prepare
pnpm dev
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
pnpm execute localhost scripts/getBalance.ts
```
