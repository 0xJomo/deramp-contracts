import {deployments, getNamedAccounts, getUnnamedAccounts, ethers} from 'hardhat';

const {execute} = deployments;
// example script

const args = process.argv.slice(2);
const account = args[0];
const message = args[1];

async function main() {
	const {owner, simpleOffchainVerifier, offRamper, onRamper} = await getNamedAccounts();
	const simpleOffchainVerifierSigner = await ethers.getSigner(simpleOffchainVerifier);
	const bob = await ethers.getSigner(offRamper);
	const alice = await ethers.getSigner(onRamper);

	console.log('simpleOffchainVerifier: ', simpleOffchainVerifier);
	console.log('bob.address: ', bob.address);
	console.log('DeRampVault.address: ', DeRampVault.address);

	const erc20Deployment = await deployments.get('SimpleERC20');
	const erc20ABI = await ethers.getContractFactory('SimpleERC20');
	const deRampABI = await ethers.getContractFactory('DeRampVault');

	const DeRampHandle = await deRampABI.connect(simpleOffchainVerifierSigner).attach(DeRampVault.address);
	const tx = await DeRampHandle.transferFrom(DeRampVault.address, alice.address, 100);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
