import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';
import {Address} from '../typechain-types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployer, simpleOffchainVerifier} = await hre.getNamedAccounts();
	let asset: String;
	if (hre.network.live) {
		//usdc addr
		asset = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';
	} else {
		asset = await (await hre.ethers.getContract('SimpleERC20', deployer)).getAddress();
	}
	console.log('vault asset: ', asset);
	const {deploy} = hre.deployments;
	const useProxy = false;
	const max = ethers.parseEther('1');
	const min = ethers.parseEther('.001');
	const fee = 0;

	// proxy only in non-live network (localhost and hardhat network) enabling HCR (Hot Contract Replacement)
	// in live network, proxy is disabled and constructor is invoked
	await deploy('DeRampVault', {
		from: deployer,
		proxy: useProxy && 'postUpgrade',
		args: [asset, 'DeRamp Token', 'RAMP', max, min, fee, simpleOffchainVerifier],
		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	});

	return !useProxy; // when live network, record the script as executed to prevent rexecution
};
export default func;
func.id = 'deploy_deramp_vault'; // id required to prevent reexecution
func.tags = ['DeRampVault'];
