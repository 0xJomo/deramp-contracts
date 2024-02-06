import { deployments, getNamedAccounts, getUnnamedAccounts, ethers } from 'hardhat';

const { execute } = deployments;
// example script

const args = process.argv.slice(2);
const account = args[0];
const message = args[1];

async function main() {
	const { owner, simpleERC20Beneficiary, offRamper } = await getNamedAccounts();
	const benefactor = await ethers.getSigner(simpleERC20Beneficiary);
	const bob = await ethers.getSigner(offRamper);

	console.log('account: ', simpleERC20Beneficiary);
	console.log('account: ', bob.address);

	const DeRampVault = await deployments.get('DeRampVault');

	const MyContract2 = await ethers.getContractFactory('DeRampVault');

	const contract2 = MyContract2.attach(DeRampVault.address);

	const DeRampHandle = await MyContract2.connect(bob).attach(DeRampVault.address);
	const supp2 = await DeRampHandle.withdrawDeposit(1, bob.address);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
