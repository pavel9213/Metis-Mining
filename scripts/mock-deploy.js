const hre = require('hardhat');
const fs = require('fs');

async function main() {
    const accounts = await ethers.getSigners();
    const signer = accounts[0].address;
    console.log('signer:', signer);

    const MockMetisTokenFactory = await hre.ethers.getContractFactory('MockMetisToken');
    const MockDACFactory = await hre.ethers.getContractFactory('MockDAC');
    const VaultFactory = await hre.ethers.getContractFactory('Vault');
    const MiningFactory = await hre.ethers.getContractFactory('Mining');
    const DACRecorderFactory = await hre.ethers.getContractFactory('DACRecorder');
    // (10000000 * 1e18)
    const MockMetis = await MockMetisTokenFactory.deploy([signer], '10000000000000000000000000');
    await MockMetis.deployed();
    console.log('MockMetis deployed to: ', MockMetis.address);

    const Vault = await VaultFactory.deploy(MockMetis.address);
    await Vault.deployed();
    console.log('Vault deployed to: ', Vault.address);

    DACRecorder = await DACRecorderFactory.deploy();
    await DACRecorder.deployed();
    console.log('DACRecorder deployed to: ', DACRecorder.address);

    const Mining = await MiningFactory.deploy(
        MockMetis.address,
        Vault.address,
        DACRecorder.address,
        '18500000000000000',
        Math.round(Date.now() / 1000) + 100,
    );
    await Mining.deployed();
    console.log('Mining deployed to: ', Mining.address);

    const MockDAC = await MockDACFactory.deploy(
        Mining.address,
        MockMetis.address,
    );
    await MockDAC.deployed();
    console.log('MockDAC deployed to: ', MockDAC.address);

    const addresses = {
        MockMetis: MockMetis.address,
        MockDAC: MockDAC.address,
        DACRecorder: DACRecorder.address,
        Mining: Mining.address,
        Vault: Vault.address,
    };

    console.log(addresses);

    fs.writeFileSync(`${__dirname}/mock-addresses.json`, JSON.stringify(addresses, null, 4));

     // test function

    // // mint 10000 metis token to signer
    // await MockMetis.functions['mint'](signer, '10000000000000000000000', { gasLimit: 24000000 });
    // console.log('checking singer\'s balance of Metis...');
    // const newBalanceOfMetis = await MockMetis.functions.balanceOf(signer);
    // console.log('signer\'s new balance of Metis:', newBalanceOfMetis);

    // // add Mining contract to minter
    // await MockMetis.functions['addMinter'](Mining.address, { gasLimit: 24000000 });

    // // set DAC for Mining contract
    // await Mining.functions['setDAC'](MockDAC.address, { gasLimit: 24000000 });

    // // add Metis Pool for Mining contract
    // await Mining.functions['add'](100, MockMetis.address, false, { gasLimit: 24000000 });

    // // approve Mining Contract to use signer's Metis token
    // await MockMetis.functions['approve'](Mining.address, hre.ethers.constants.MaxUint256, { gasLimit: 24000000 });

    // // call DAC creator deposit function
    // await MockDAC.functions['creatorDeposit']('100000000000000000000', 1, 80);

    // // check userInfo in Mining Contract
    // console.log('checking singer\'s user info in Mining contract...');
    // const userInfo = await Mining.functions.checkUserInfo(1, signer);
    // console.log("signer user info in Mining contract: ", userInfo);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });