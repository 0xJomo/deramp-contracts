import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';
import {ethers} from 'hardhat';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
	const {deployer, simpleOffchainVerifier} = await hre.getNamedAccounts();
	const asset = await (await hre.ethers.getContract('SimpleERC20', deployer)).getAddress();
	console.log('vault asset: ', asset);
	const {deploy} = hre.deployments;
	const useProxy = !hre.network.live;
	const max = ethers.parseEther('1');
	const min = ethers.parseEther('.001');
	const fee = 0;

	// proxy only in non-live network (localhost and hardhat network) enabling HCR (Hot Contract Replacement)
	// in live network, proxy is disabled and constructor is invoked
	await deploy('DeRampVault', {
		from: deployer,
		proxy: useProxy && {
			owner: simpleOffchainVerifier,
			proxyContract: 'UUPS',

			execute: {
				init: {
					methodName: 'initialize',
					args: [asset, 'DeRamp Token', 'RAMP', max, min, fee, simpleOffchainVerifier],
				},

				onUpgrade: {
					methodName: 'postUpgrade',
					args: [asset, 'DeRamp Token', 'RAMP', max, min, fee, simpleOffchainVerifier],
				},
			},
		},

		log: true,
		autoMine: true, // speed up deployment on local network (ganache, hardhat), no effect on live networks
	});

	return !useProxy; // when live network, record the script as executed to prevent rexecution
};
export default func;
func.id = 'deploy_deramp_vault'; // id required to prevent reexecution
func.tags = ['DeRampVault'];
