// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

/**
 * @title FARIToken
 * @notice Governance and utility token for FARIIMA platform
 * @dev ERC-20 token with staking, voting power, and time-weighted multipliers
 */
contract FARIToken is
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable
{
    // ============ Constants ============

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18; // 1 Billion FARI
    uint256 public constant UNSTAKE_COOLDOWN = 7 days;

    // Time-weighted multipliers (in basis points, 100 = 1.0x)
    uint256 public constant BASE_MULTIPLIER = 100; // 1.0x
    uint256 public constant MULTIPLIER_3M = 120;   // 1.2x after 3 months
    uint256 public constant MULTIPLIER_6M = 150;   // 1.5x after 6 months
    uint256 public constant MULTIPLIER_12M = 200;  // 2.0x after 12 months

    // ============ Structs ============

    struct StakeInfo {
        uint256 amount;
        uint256 timestamp;
        uint256 pendingUnstake;
        uint256 unstakeRequestTime;
    }

    // ============ State Variables ============

    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;

    // Vesting schedules
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 released;
        uint256 startTime;
        uint256 duration;
        uint256 cliff;
    }

    mapping(address => VestingSchedule) public vestingSchedules;

    // ============ Events ============

    event Staked(address indexed user, uint256 amount, uint256 totalStaked);
    event UnstakeRequested(address indexed user, uint256 amount, uint256 availableAt);
    event Unstaked(address indexed user, uint256 amount, uint256 totalStaked);
    event VestingScheduleCreated(
        address indexed beneficiary,
        uint256 amount,
        uint256 duration,
        uint256 cliff
    );
    event TokensReleased(address indexed beneficiary, uint256 amount);

    // ============ Errors ============

    error MaxSupplyExceeded();
    error InsufficientStake();
    error CooldownActive();
    error NoUnstakeRequest();
    error InvalidAmount();

    // ============ Initializer ============

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("FARIIMA Token", "FARI");
        __ERC20Burnable_init();
        __Pausable_init();
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(UPGRADER_ROLE, msg.sender);
    }

    // ============ Staking Functions ============

    /**
     * @notice Stake FARI tokens to gain voting power and platform benefits
     * @param amount Amount of FARI to stake
     */
    function stake(uint256 amount) external whenNotPaused {
        if (amount == 0) revert InvalidAmount();
        
        StakeInfo storage userStake = stakes[msg.sender];

        // Transfer tokens to this contract
        _transfer(msg.sender, address(this), amount);

        // Update stake info
        userStake.amount += amount;
        if (userStake.timestamp == 0) {
            userStake.timestamp = block.timestamp;
        }

        totalStaked += amount;

        emit Staked(msg.sender, amount, userStake.amount);
    }

    /**
     * @notice Request to unstake tokens (starts cooldown period)
     * @param amount Amount to unstake
     */
    function requestUnstake(uint256 amount) external {
        StakeInfo storage userStake = stakes[msg.sender];
        
        if (userStake.amount < amount) revert InsufficientStake();
        if (amount == 0) revert InvalidAmount();

        userStake.pendingUnstake = amount;
        userStake.unstakeRequestTime = block.timestamp;

        emit UnstakeRequested(msg.sender, amount, block.timestamp + UNSTAKE_COOLDOWN);
    }

    /**
     * @notice Complete unstake after cooldown period
     */
    function unstake() external whenNotPaused {
        StakeInfo storage userStake = stakes[msg.sender];

        if (userStake.pendingUnstake == 0) revert NoUnstakeRequest();
        if (block.timestamp < userStake.unstakeRequestTime + UNSTAKE_COOLDOWN) {
            revert CooldownActive();
        }

        uint256 amount = userStake.pendingUnstake;

        // Update state
        userStake.amount -= amount;
        userStake.pendingUnstake = 0;
        userStake.unstakeRequestTime = 0;
        totalStaked -= amount;

        // Transfer tokens back
        _transfer(address(this), msg.sender, amount);

        emit Unstaked(msg.sender, amount, userStake.amount);
    }

    /**
     * @notice Cancel pending unstake request
     */
    function cancelUnstake() external {
        StakeInfo storage userStake = stakes[msg.sender];
        
        if (userStake.pendingUnstake == 0) revert NoUnstakeRequest();

        userStake.pendingUnstake = 0;
        userStake.unstakeRequestTime = 0;
    }

    // ============ Voting Power Functions ============

    /**
     * @notice Get voting power with time-weighted multiplier
     * @param account Address to check
     * @return Voting power
     */
    function getVotingPower(address account) external view returns (uint256) {
        StakeInfo memory userStake = stakes[account];
        if (userStake.amount == 0) return 0;

        uint256 timeStaked = block.timestamp - userStake.timestamp;
        uint256 multiplier = _getTimeMultiplier(timeStaked);

        return (userStake.amount * multiplier) / 100;
    }

    /**
     * @notice Get staked amount for an account
     * @param account Address to check
     * @return Staked amount
     */
    function getStakedAmount(address account) external view returns (uint256) {
        return stakes[account].amount;
    }

    /**
     * @notice Calculate time-based multiplier
     * @param timeStaked Duration of stake
     * @return Multiplier in basis points
     */
    function _getTimeMultiplier(uint256 timeStaked) internal pure returns (uint256) {
        if (timeStaked >= 365 days) return MULTIPLIER_12M;
        if (timeStaked >= 180 days) return MULTIPLIER_6M;
        if (timeStaked >= 90 days) return MULTIPLIER_3M;
        return BASE_MULTIPLIER;
    }

    // ============ Vesting Functions ============

    /**
     * @notice Create a vesting schedule for team/advisors
     * @param beneficiary Address to receive vested tokens
     * @param amount Total amount to vest
     * @param duration Vesting duration in seconds
     * @param cliff Cliff period in seconds
     */
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 duration,
        uint256 cliff
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be > 0");
        require(duration > 0, "Duration must be > 0");
        require(cliff <= duration, "Cliff > duration");
        require(vestingSchedules[beneficiary].totalAmount == 0, "Schedule exists");

        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            released: 0,
            startTime: block.timestamp,
            duration: duration,
            cliff: cliff
        });

        // Mint tokens to this contract for vesting
        _mint(address(this), amount);

        emit VestingScheduleCreated(beneficiary, amount, duration, cliff);
    }

    /**
     * @notice Release vested tokens
     */
    function releaseVestedTokens() external {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.totalAmount > 0, "No vesting schedule");

        uint256 releasable = _releasableAmount(msg.sender);
        require(releasable > 0, "No tokens to release");

        schedule.released += releasable;

        _transfer(address(this), msg.sender, releasable);

        emit TokensReleased(msg.sender, releasable);
    }

    /**
     * @notice Calculate releasable vested amount
     * @param beneficiary Address to check
     * @return Amount that can be released
     */
    function _releasableAmount(address beneficiary) internal view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];

        if (block.timestamp < schedule.startTime + schedule.cliff) {
            return 0;
        }

        uint256 elapsed = block.timestamp - schedule.startTime;
        
        uint256 vested;
        if (elapsed >= schedule.duration) {
            vested = schedule.totalAmount;
        } else {
            vested = (schedule.totalAmount * elapsed) / schedule.duration;
        }

        return vested - schedule.released;
    }

    /**
     * @notice Get vested amount for beneficiary
     * @param beneficiary Address to check
     * @return Total vested, released, and releasable amounts
     */
    function getVestingInfo(address beneficiary) 
        external 
        view 
        returns (uint256 total, uint256 released, uint256 releasable) 
    {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        total = schedule.totalAmount;
        released = schedule.released;
        releasable = _releasableAmount(beneficiary);
    }

    // ============ Minting Functions ============

    /**
     * @notice Mint new tokens (rewards, incentives)
     * @param to Recipient address
     * @param amount Amount to mint
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        if (totalSupply() + amount > MAX_SUPPLY) revert MaxSupplyExceeded();
        _mint(to, amount);
    }

    /**
     * @notice Burn tokens from an account (requires approval)
     * @param from Account to burn from
     * @param amount Amount to burn
     */
    function burnFrom(address from, uint256 amount) public override {
        _spendAllowance(from, msg.sender, amount);
        _burn(from, amount);
    }

    // ============ Admin Functions ============

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}

    // ============ Hooks ============

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    // ============ Gap for Upgrades ============

    uint256[50] private __gap;
}
