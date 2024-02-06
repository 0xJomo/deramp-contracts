import { deployments, getNamedAccounts, getUnnamedAccounts, ethers } from 'hardhat';

const { execute } = deployments;
// example script

const args = process.argv.slice(2);
const account = args[0];
const message = args[1];

async function main() {
	const { owner, simpleOffchainVerifier, offRamper } = await getNamedAccounts();
	const benefactor = await ethers.getSigner(simpleOffchainVerifier);
	const bob = await ethers.getSigner(offRamper);

	console.log('simpleERC20Beneficiary: ', simpleOffchainVerifier);
	console.log('bob.address: ', bob.address);

	const erc20Deployment = await deployments.get('SimpleERC20');

	const erc20ABI = await ethers.getContractFactory('SimpleERC20');


	const DeRampHandle = await erc20ABI.connect(benefactor).attach(erc20Deployment.address);
	const tx = await DeRampHandle.transfer(bob.address, ethers.parseEther('10000'));
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
