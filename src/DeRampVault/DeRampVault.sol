// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "hardhat-deploy/solc_0.8/proxy/Proxied.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { StringUtils } from "@zk-email/contracts/utils/StringUtils.sol";

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC4626Upgradeable.sol";
import "hardhat-deploy/solc_0.8/proxy/Proxied.sol";
import "hardhat/console.sol";

contract DeRampVault is Initializable, ERC4626Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
	    using StringUtils for uint256[];

	// a mapping that checks if a user has deposited the token
	mapping(address => uint256) public shareHolder;
	uint256 public minDepositAmount;
	uint256 public maxOnRampAmount;
	uint256 public sustainabilityFee; // Fee charged to on-rampers in preciseUnits (1e16 = 1%)
	address public sustainabilityFeeRecipient;

	event OffRamp(string payment_id, string payment_platform, uint256 depositAmount, address offramper);

	constructor() {
		_disableInitializers();
	}

	function initialize(
		ERC20 _asset,
		string memory _name,
		string memory _symbol,
		uint256 max,
		uint256 min,
		uint256 fee,
		address benefactor
	) public initializer {
		postUpgrade( _asset, _name, _symbol, max, min, fee, benefactor);
	}

	function postUpgrade(
		ERC20 _asset,
		string memory _name,
		string memory _symbol,
		uint256 max,
		uint256 min,
		uint256 fee,
		address benefactor
	) public {
		minDepositAmount = min;
		maxOnRampAmount = max;
		sustainabilityFee = fee;
		sustainabilityFeeRecipient = benefactor;

		__ERC20_init(_name, _symbol);
		__ERC4626_init(_asset);
		__Ownable_init(benefactor);

		__UUPSUpgradeable_init();
	}

   function offramp(string memory paymentProcessor, string memory ppId, uint amount, address _receiver) public{
		//	console.log("offramp: %s %s %x %x", paymentProcessor, ppId, amount,_receiver );
					console.log("offramp from %s to %s %s", _receiver, amount, ppId);


		deposit(amount, _receiver);
		emit OffRamp(ppId, paymentProcessor, amount, _receiver);
  }
	/**
	 * @notice function to deposit assets and receive vault tokens in exchange
	 * @param _assets amount of the asset token
	 */
	function deposit( uint _assets, address _receiver) public override returns (uint256) {
		// checks that the deposited amount is greater than zero.
		console.log("deposit from %s to %d tokens: rec: %s", msg.sender, _assets, _receiver);
		require(_assets > 0, "Deposit less than Zero");
		// calling the deposit function from the ERC-4626 library to perform all the necessary functionality
		uint256 shares = super.deposit(_assets, _receiver);
		shareHolder[_receiver] += _assets;
		return shares;
	}
	   
	/**
	 * @notice Function to allow msg.sender to withdraw their deposit plus accrued interest
	 * @param _shares amount of shares the user wants to convert
	 * @param _receiver address of the user who will receive the assets
	 */
	function onramp(uint _shares, address offRamper, address _receiver) public onlyOwner {
		// checks that the deposited amount is greater than zero.
		require(_shares > 0, "withdraw must be greater than Zero");
		// Checks that the _receiver address is not zero.
		require(_receiver != address(0), "Zero Address");
		// checks that the caller is a shareholder
		require(shareHolder[offRamper] > 0, "Not a share holder");
		// checks that the caller has more shares than they are trying to withdraw.
		require(shareHolder[offRamper] >= _shares, "Not enough shares");

		// Calculate 10% yield on the withdrawal amount
		uint256 percent = (10 * _shares) / 100;
		// Calculate the total asset amount as the sum of the share amount plus 10% of the share amount.
		uint256 assets = _shares + percent;
		// calling the redeem function from the ERC-4626 library to perform all the necessary functionality
		redeem(assets, _receiver, offRamper);
		// Decrease the share of the user
		shareHolder[offRamper] -= _shares;
	}

	function withdrawDeposit(uint _shares, address _receiver) public  {
		console.log("withD: %s %s %s", msg.sender, _shares,_receiver );
		// checks that the deposited amount is greater than zero.
		require(_shares > 0, "withdraw must be greater than Zero");
		// Checks that the _receiver address is not zero.
		require(_receiver != address(0), "Zero Address");
		// checks that the caller is a shareholder
		require(shareHolder[msg.sender] > 0, "Not a share holder");
		// checks that the caller has more shares than they are trying to withdraw.
		require(shareHolder[msg.sender] >= _shares, "Not enough shares");
		// Calculate 10% yield on the withdrawal amount
		//uint256 percent = (10 * _shares) / 100;
		// Calculate the total asset amount as the sum of the share amount plus 10% of the share amount.
		uint256 assets = _shares;
		// calling the redeem function from the ERC-4626 library to perform all the necessary functionality
		redeem(assets, _receiver, msg.sender);
		// Decrease the share of the user
		shareHolder[msg.sender] -= _shares;
	}

	function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
