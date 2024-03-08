import {deployments, getNamedAccounts, getUnnamedAccounts, ethers} from 'hardhat';

const {execute} = deployments;
// example script

const args = process.argv.slice(2);
const account = args[0];
const message = args[1];

async function main() {
	/* 	const [account] = await ethers.getSigners();
		console.log('account: ', account.address);
		const { owner, simpleERC20Beneficiary } = await getNamedAccounts();
		const GreetingsRegistry = await deployments.get('DeRampVault');
		const ss = await deployments.get('SimpleERC20');
	
		const MyContract = await ethers.getContractFactory('SimpleERC20');
		const MyContract2 = await ethers.getContractFactory('DeRampVault');
	
		const contract = MyContract.attach(ss.address);
		const contract2 = MyContract2.attach(GreetingsRegistry.address);
	
		const supp = await contract.balanceOf(simpleERC20Beneficiary);
		const supp2 = await contract2.balanceOf(simpleERC20Beneficiary);
	
		console.log('usdc balance: ', supp);
		console.log('deramp balance: ', supp2);
	 */

	const {deployer, simpleOffchainVerifier, offRamper, onRamper} = await getNamedAccounts();
	const SimpleERC20Factory = await deployments.get('SimpleERC20');
	const DeRampVault = await deployments.get('DeRampVault');

	const benefactor = await ethers.getSigner(deployer);
	const bobby = await ethers.getSigner(offRamper);
	const alice = await ethers.getSigner(onRamper);

	const MyContract2 = await ethers.getContractFactory('SimpleERC20');
	const DeRampVaultABI = await ethers.getContractFactory('DeRampVault');

	const USDCHandle = await MyContract2.connect(benefactor).attach(SimpleERC20Factory.address);
	const ReUSDCHandle = await DeRampVaultABI.connect(benefactor).attach(DeRampVault.address);

	const supp2 = await USDCHandle.balanceOf(benefactor.address);
	const supp3 = await USDCHandle.balanceOf(bobby.address);
	const supp4 = await USDCHandle.balanceOf(alice.address);
	const supp5 = await USDCHandle.balanceOf(DeRampVault.address);

	const supp6 = await ReUSDCHandle.balanceOf(benefactor.address);
	const supp7 = await ReUSDCHandle.balanceOf(bobby.address);
	const supp8 = await ReUSDCHandle.balanceOf(alice.address);
	const supp9 = await ReUSDCHandle.balanceOf(DeRampVault.address);

	console.log('---USDC BALANCES----');

	console.log('usdc owner: ', benefactor.address, supp2);
	console.log('offRamper balance: ', bobby.address, supp3);
	console.log('onRamper balance: ', alice.address, supp4);
	console.log('DeRampVault balance: ', DeRampVault.address, supp5);

	console.log('---ReUSDC BALANCES----');

	console.log('offRamper balance: ', bobby.address, supp7);
	console.log('onRamper balance: ', alice.address, supp8);
	console.log('DeRampVault balance: ', DeRampVault.address, supp9);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
