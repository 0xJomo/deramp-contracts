import 'dotenv/config';
import {HardhatUserConfig} from 'hardhat/types';

import '@nomicfoundation/hardhat-chai-matchers';
import '@nomicfoundation/hardhat-ethers';
import '@typechain/hardhat';
import 'hardhat-gas-reporter';
import 'solidity-coverage';
import '@nomicfoundation/hardhat-verify';

import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import 'hardhat-deploy-tenderly';

import {node_url, accounts, addForkConfiguration} from './utils/network';

const config: HardhatUserConfig = {
	solidity: {
		compilers: [
			{
				version: '0.8.20',
				settings: {
					optimizer: {
						enabled: true,
						runs: 2000,
					},
				},
			},
		],
	},
	namedAccounts: {
		deployer: 0,
		simpleERC20Beneficiary: 1,
		onRamper: 2,
		offRamper: 3,
		simpleOffchainVerifier: {
			default: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			sepolia: '0x36e7Fda8CC503D5Ec7729A42eb86EF02Af315Bf9',
			arbitrum: '0x36e7Fda8CC503D5Ec7729A42eb86EF02Af315Bf9',
		},
	},
	networks: addForkConfiguration({
		hardhat: {
			initialBaseFeePerGas: 0, // to fix : https://github.com/sc-forks/solidity-coverage/issues/652, see https://github.com/sc-forks/solidity-coverage/issues/652#issuecomment-896330136
		},
		localhost: {
			autoImpersonate: true,
			url: node_url('localhost'),
			accounts: accounts(),
		},
		staging: {
			url: node_url('rinkeby'),
			accounts: accounts('rinkeby'),
		},
		production: {
			url: node_url('mainnet'),
			accounts: accounts('mainnet'),
		},
		mainnet: {
			url: node_url('mainnet'),
			accounts: accounts('mainnet'),
		},
		sepolia: {
			url: node_url('sepolia'),
			accounts: accounts('sepolia'),
		},
		kovan: {
			url: node_url('kovan'),
			accounts: accounts('kovan'),
		},
		goerli: {
			url: node_url('goerli'),
			accounts: accounts('goerli'),
		},
		blast: {
			url: node_url('blast'),
			accounts: accounts('blast'),
		},
		arbitrum: {
			url: node_url('arbitrum'),
			accounts: accounts('arbitrum'),
		},
	}),
	paths: {
		sources: 'src',
	},
	gasReporter: {
		currency: 'USD',
		gasPrice: 100,
		enabled: process.env.REPORT_GAS ? true : false,
		coinmarketcap: process.env.COINMARKETCAP_API_KEY,
		maxMethodDiff: 10,
	},
	mocha: {
		timeout: 0,
	},
	external: process.env.HARDHAT_FORK
		? {
				deployments: {
					// process.env.HARDHAT_FORK will specify the network that the fork is made from.
					// these lines allow it to fetch the deployments from the network being forked from both for node and deploy task
					hardhat: ['deployments/' + process.env.HARDHAT_FORK],
					localhost: ['deployments/' + process.env.HARDHAT_FORK],
				},
		  }
		: undefined,

	tenderly: {
		project: 'template-ethereum-contracts',
		username: process.env.TENDERLY_USERNAME as string,
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://etherscan.io/
		apiKey: 'XRP7MXA18QAETNDXAE6U57ZFPVRKYBUUKM',
	},
	sourcify: {
		// Disabled by default
		// Doesn't need an API key
		enabled: true,
	},
};

export default config;
