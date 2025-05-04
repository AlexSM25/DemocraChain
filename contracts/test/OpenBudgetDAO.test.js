const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OpenBudgetDAO", function () {
    let dao;
    let admin;
    let voter1;
    let voter2;

    beforeEach(async function () {
        [admin, voter1, voter2] = await ethers.getSigners();
        
        const OpenBudgetDAO = await ethers.getContractFactory("OpenBudgetDAO");
        dao = await OpenBudgetDAO.deploy();
        await dao.deployed();

        // Otorgar roles de votante
        await dao.grantVoterRole(voter1.address);
        await dao.grantVoterRole(voter2.address);
    });

    describe("Creación de Proyectos", function () {
        it("Debería permitir a un administrador crear un proyecto", async function () {
            await dao.connect(admin).createProject(
                "Parque Comunitario",
                "Construcción de un parque para la comunidad",
                ethers.utils.parseEther("1000")
            );

            const project = await dao.getProject(0);
            expect(project.title).to.equal("Parque Comunitario");
            expect(project.status).to.equal(0); // Status.Pending
        });

        it("No debería permitir a un no administrador crear un proyecto", async function () {
            await expect(
                dao.connect(voter1).createProject(
                    "Parque Comunitario",
                    "Construcción de un parque para la comunidad",
                    ethers.utils.parseEther("1000")
                )
            ).to.be.reverted;
        });
    });

    describe("Votación", function () {
        beforeEach(async function () {
            await dao.connect(admin).createProject(
                "Parque Comunitario",
                "Construcción de un parque para la comunidad",
                ethers.utils.parseEther("1000")
            );
        });

        it("Debería permitir a un votante emitir su voto", async function () {
            await dao.connect(voter1).castVote(0, 10);
            const project = await dao.getProject(0);
            expect(project.votes).to.equal(10);
        });

        it("No debería permitir votar más puntos de los disponibles", async function () {
            await expect(
                dao.connect(voter1).castVote(0, 11) // 11^2 = 121 > 100
            ).to.be.revertedWith("Insufficient points");
        });

        it("Debería permitir cambiar el voto", async function () {
            await dao.connect(voter1).castVote(0, 5);
            await dao.connect(voter1).castVote(0, 7);
            const project = await dao.getProject(0);
            expect(project.votes).to.equal(7);
        });
    });

    describe("Finalización de Votación", function () {
        beforeEach(async function () {
            await dao.connect(admin).createProject(
                "Parque Comunitario",
                "Construcción de un parque para la comunidad",
                ethers.utils.parseEther("1000")
            );
        });

        it("Debería aprobar un proyecto con suficientes votos", async function () {
            await dao.connect(voter1).castVote(0, 8); // 8^2 = 64 puntos
            await dao.connect(voter2).castVote(0, 6); // 6^2 = 36 puntos
            
            // Avanzar el tiempo para que termine el período de votación
            await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60 + 1]); // 2 días + 1 segundo
            await ethers.provider.send("evm_mine", []);
            
            await dao.connect(admin).finalizeVoting(0);
            
            const project = await dao.getProject(0);
            expect(project.status).to.equal(1); // Status.Approved
        });

        it("Debería rechazar un proyecto con votos insuficientes", async function () {
            await dao.connect(voter1).castVote(0, 4); // 4^2 = 16 puntos
            await dao.connect(voter2).castVote(0, 3); // 3^2 = 9 puntos
            
            // Avanzar el tiempo para que termine el período de votación
            await ethers.provider.send("evm_increaseTime", [2 * 24 * 60 * 60 + 1]); // 2 días + 1 segundo
            await ethers.provider.send("evm_mine", []);
            
            await dao.connect(admin).finalizeVoting(0);
            
            const project = await dao.getProject(0);
            expect(project.status).to.equal(2); // Status.Rejected
        });
    });
}); 