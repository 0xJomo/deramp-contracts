import {deployments, getNamedAccounts, getUnnamedAccounts, ethers} from 'hardhat';

const {execute} = deployments;
// example script

const args = process.argv.slice(2);
const account = args[0];
const message = args[1];

async function main() {
	const {owner, simpleERC20Beneficiary, offRamper} = await getNamedAccounts();
	const DeRampVault = await deployments.get('DeRampVault');
	const erc = await deployments.get('SimpleERC20');
	const erc20imp = await ethers.getContractFactory('SimpleERC20');

	const benefactor = await ethers.getSigner(simpleERC20Beneficiary);
	const bob = await ethers.getSigner(offRamper);
	const erc20Handle = await erc20imp.connect(bob).attach(erc.address);
	const see = await erc20Handle.approve(DeRampVault.address, ethers.parseEther('1000000000'));
	console.log('using erc20: ', erc.address);
	const MyContract2 = await ethers.getContractFactory('DeRampVault');
	const DeRampHandle = await MyContract2.connect(bob).attach(DeRampVault.address);
	//const supp2 = await DeRampHandle.deposit(ethers.parseEther(".05"), bob.address);

	const supp2 = await DeRampHandle.offramp('revolut', 'mac@revolut.com', 100, bob.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
