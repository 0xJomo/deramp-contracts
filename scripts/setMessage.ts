import { deployments, getNamedAccounts, getUnnamedAccounts } from 'hardhat';
const { execute } = deployments;
// example script

const args = process.argv.slice(2);
const account = args[0];
const message = args[1];

async function main() {
	const { owner, simpleERC20Beneficiary } = await getNamedAccounts();
	const accountAddress = isNaN(parseInt(account)) ? account : (await getUnnamedAccounts())[parseInt(account)];
	const DeRampVault = await deployments.get('DeRampVault');

	await execute(
		'SimpleERC20',
		{ from: simpleERC20Beneficiary, log: true },
		'approve',
		DeRampVault.address,
		10000000
	);

	await execute(
		'DeRampVault',
		{ from: simpleERC20Beneficiary, log: true },
		'deposit',
		10000000,
		simpleERC20Beneficiary
	);
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
