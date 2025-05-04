const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
    // Obtener la cuenta que desplegará el contrato
    const [deployer] = await hre.ethers.getSigners();
    console.log("Desplegando contratos con la cuenta:", deployer.address);

    // Desplegar un token ERC20 de prueba
    const Token = await hre.ethers.getContractFactory("ERC20Mock");
    const token = await Token.deploy("Test Token", "TTK", deployer.address, ethers.utils.parseEther("1000000"));
    await token.deployed();
    console.log("Token desplegado en:", token.address);

    // Desplegar el DAO
    const OpenBudgetDAO = await hre.ethers.getContractFactory("OpenBudgetDAO");
    const dao = await OpenBudgetDAO.deploy(
        token.address,
        60 * 60 * 24 * 7, // 7 días de período de votación
        ethers.utils.parseEther("1000") // Quorum de 1000 tokens
    );
    await dao.deployed();
    console.log("OpenBudgetDAO desplegado en:", dao.address);

    // Imprimir información útil
    console.log("\nInformación del despliegue:");
    console.log("Cuenta desplegadora:", deployer.address);
    console.log("Dirección del contrato:", dao.address);
    console.log("\nPara interactuar con el contrato, usa esta dirección en tu frontend");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 