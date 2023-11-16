// Importa las bibliotecas necesarias para las pruebas
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Importa tus contratos
const Ticket = require("/home/lennon/Storage/DDB/sistema_boletos/contracts/Ticket.sol");
const TicketToken = require("/home/lennon/Storage/DDB/sistema_boletos/contracts/TicketToken.sol");

describe("Compra de Boletos y Recompensas", function () {
  it("Debería permitir la compra de boletos y recibir recompensas", async function () {
    // Deploy los contratos
    const TicketContract = await ethers.getContractFactory(Ticket);
    const TicketTokenContract = await ethers.getContractFactory(TicketToken);

    const ticket = await TicketContract.deploy(/* parámetros de inicialización */);
    const ticketToken = await TicketTokenContract.deploy(/* parámetros de inicialización */);

    // Algunas direcciones de prueba
    const comprador = await ethers.getSigner(1); // Puedes cambiar esto según tus necesidades
    const owner = await ethers.getSigner(0); // Puedes cambiar esto según tus necesidades

    // Interactuar con el contrato para comprar boletos
    const numTickets = 2; // Cantidad de boletos a comprar
    const ticketPrice = 100; // Precio de cada boleto (en wei)

    await ticket.connect(comprador).purchaseTickets(numTickets, { value: ticketPrice * numTickets });

    // Verificar que la compra de boletos fue exitosa
    const balance = await ticket.ticketBalances(comprador.getAddress());
    expect(balance).to.equal(numTickets);

    // Intentar recibir recompensas
    const rewardAmount = 200; // Cantidad de recompensa (en wei)

    await ticket.connect(owner).receiveReward(rewardAmount);

    // Verificar que el evento RewardReceived se emitió correctamente
    const rewardEvents = await ticket.queryFilter(ticket.filters.RewardReceived(owner.getAddress(), rewardAmount));
    expect(rewardEvents.length).to.equal(1);

    // También puedes verificar que el saldo del contrato haya disminuido
    const contractBalance = await ethers.provider.getBalance(ticket.address);
    expect(contractBalance).to.equal(0); // Esto dependerá de cómo esté implementada la función receiveReward

    // Puedes hacer más verificaciones según tus necesidades
  });
});
