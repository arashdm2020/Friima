const { ethers, upgrades } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🚀 Starting FARIIMA contract deployment...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString(), "\n");

  const daoTreasury = process.env.DAO_TREASURY || deployer.address;
  console.log("DAO Treasury address:", daoTreasury, "\n");

  // ============ 1. Deploy FARI Token ============
  console.log("📝 Deploying FARIToken (Upgradeable)...");
  const FARIToken = await ethers.getContractFactory("FARIToken");
  const fariToken = await upgrades.deployProxy(FARIToken, [], {
    initializer: "initialize",
  });
  await fariToken.deployed();
  console.log("✅ FARIToken deployed to:", fariToken.address);
  console.log("   Implementation:", await upgrades.erc1967.getImplementationAddress(fariToken.address), "\n");

  // ============ 2. Deploy DAO ============
  console.log("📝 Deploying FARIIMADao (Upgradeable)...");
  const FARIIMADao = await ethers.getContractFactory("FARIIMADao");
  const dao = await upgrades.deployProxy(FARIIMADao, [fariToken.address], {
    initializer: "initialize",
  });
  await dao.deployed();
  console.log("✅ FARIIMADao deployed to:", dao.address);
  console.log("   Implementation:", await upgrades.erc1967.getImplementationAddress(dao.address), "\n");

  // ============ 3. Deploy Proof of Work NFT ============
  console.log("📝 Deploying ProofOfWorkNFT...");
  const ProofOfWorkNFT = await ethers.getContractFactory("ProofOfWorkNFT");
  const nft = await ProofOfWorkNFT.deploy();
  await nft.deployed();
  console.log("✅ ProofOfWorkNFT deployed to:", nft.address, "\n");

  // ============ 4. Deploy Escrow ============
  console.log("📝 Deploying Escrow (Upgradeable)...");
  const Escrow = await ethers.getContractFactory("Escrow");
  const escrow = await upgrades.deployProxy(
    Escrow,
    [dao.address, nft.address, daoTreasury],
    { initializer: "initialize" }
  );
  await escrow.deployed();
  console.log("✅ Escrow deployed to:", escrow.address);
  console.log("   Implementation:", await upgrades.erc1967.getImplementationAddress(escrow.address), "\n");

  // ============ 5. Setup Permissions ============
  console.log("🔐 Setting up permissions...");

  // Grant MINTER_ROLE to Escrow for NFT minting
  const MINTER_ROLE = await nft.MINTER_ROLE();
  const grantMinterTx = await nft.grantRole(MINTER_ROLE, escrow.address);
  await grantMinterTx.wait();
  console.log("✅ Granted MINTER_ROLE to Escrow for NFT minting");

  // Grant DAO_ROLE to DAO contract in Escrow
  const DAO_ROLE = await escrow.DAO_ROLE();
  const grantDaoTx = await escrow.grantRole(DAO_ROLE, dao.address);
  await grantDaoTx.wait();
  console.log("✅ Granted DAO_ROLE to FARIIMADao in Escrow");

  // Grant MINTER_ROLE to deployer (for initial token distribution)
  const FARI_MINTER_ROLE = await fariToken.MINTER_ROLE();
  const grantFariMinterTx = await fariToken.grantRole(FARI_MINTER_ROLE, deployer.address);
  await grantFariMinterTx.wait();
  console.log("✅ Granted MINTER_ROLE to deployer for FARI token");

  // Grant DEFAULT_ADMIN_ROLE to DAO in Escrow (for dispute resolution)
  const DEFAULT_ADMIN_ROLE = await escrow.DEFAULT_ADMIN_ROLE();
  const grantAdminTx = await escrow.grantRole(DEFAULT_ADMIN_ROLE, dao.address);
  await grantAdminTx.wait();
  console.log("✅ Granted DEFAULT_ADMIN_ROLE to DAO in Escrow\n");

  // ============ 6. Add Supported Tokens (USDC, USDT) ============
  console.log("💰 Adding supported stablecoins...");

  const network = await ethers.provider.getNetwork();
  let usdcAddress, usdtAddress;

  if (network.chainId === 137) {
    // Polygon Mainnet
    usdcAddress = process.env.USDC_ADDRESS_POLYGON || "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
    usdtAddress = process.env.USDT_ADDRESS_POLYGON || "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
  } else if (network.chainId === 80001) {
    // Mumbai Testnet
    usdcAddress = "0x0FA8781a83E46826621b3BC094Ea2A0212e71B23"; // Mumbai USDC
    usdtAddress = "0xA02f6adc7926efeBBd59Fd43A84f4E0c0c91e832"; // Mumbai USDT
  } else {
    console.log("⚠️  Unknown network, skipping stablecoin setup");
  }

  if (usdcAddress && usdtAddress) {
    const addUsdcTx = await escrow.addSupportedToken(usdcAddress);
    await addUsdcTx.wait();
    console.log("✅ Added USDC:", usdcAddress);

    const addUsdtTx = await escrow.addSupportedToken(usdtAddress);
    await addUsdtTx.wait();
    console.log("✅ Added USDT:", usdtAddress, "\n");
  }

  // ============ 7. Initial Token Distribution (Optional) ============
  console.log("🎁 Initial token distribution (if configured)...");

  const INITIAL_LIQUIDITY = ethers.utils.parseEther("150000000"); // 150M FARI
  const mintLiquidityTx = await fariToken.mint(deployer.address, INITIAL_LIQUIDITY);
  await mintLiquidityTx.wait();
  console.log("✅ Minted", ethers.utils.formatEther(INITIAL_LIQUIDITY), "FARI for initial liquidity\n");

  // ============ 8. Summary ============
  console.log("═══════════════════════════════════════════════════════");
  console.log("✨ FARIIMA Deployment Complete! ✨");
  console.log("═══════════════════════════════════════════════════════");
  console.log("📋 Contract Addresses:");
  console.log("   FARIToken:        ", fariToken.address);
  console.log("   FARIIMADao:       ", dao.address);
  console.log("   Escrow:           ", escrow.address);
  console.log("   ProofOfWorkNFT:   ", nft.address);
  console.log("   DAO Treasury:     ", daoTreasury);
  console.log("═══════════════════════════════════════════════════════");
  console.log("🔐 Save these addresses for frontend configuration!");
  console.log("═══════════════════════════════════════════════════════\n");

  // Save deployment info to JSON
  const deploymentInfo = {
    network: network.name,
    chainId: network.chainId,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      FARIToken: fariToken.address,
      FARIIMADao: dao.address,
      Escrow: escrow.address,
      ProofOfWorkNFT: nft.address,
      DaoTreasury: daoTreasury,
    },
    stablecoins: {
      USDC: usdcAddress,
      USDT: usdtAddress,
    },
  };

  const fs = require("fs");
  const deploymentPath = `./deployments/${network.name}-${Date.now()}.json`;
  fs.mkdirSync("./deployments", { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log("💾 Deployment info saved to:", deploymentPath, "\n");

  // ============ 9. Verification Instructions ============
  console.log("📝 To verify contracts on PolygonScan:");
  console.log(`   npx hardhat verify --network ${network.name} ${fariToken.address}`);
  console.log(`   npx hardhat verify --network ${network.name} ${dao.address}`);
  console.log(`   npx hardhat verify --network ${network.name} ${escrow.address}`);
  console.log(`   npx hardhat verify --network ${network.name} ${nft.address}\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
