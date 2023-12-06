// Conectar con Metamask
async function conectarMetamask() {
  if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
      // Solicitar acceso a la cuenta de Metamask
      await ethereum.enable();
      web3.eth.defaultAccount = ethereum.selectedAddress;
      console.log('Conectado a Metamask');
    } catch (error) {
      console.error('Acceso denegado a Metamask');
    }
  } else {
    console.error('Metamask no está instalado');
  }
}

// Función para comprar un boleto
async function comprarBoleto() {
  const zona = document.getElementById('zona').value;
  const asiento = document.getElementById('asiento').value;

  const contractAddress = '0x050499eBdbBBc1216011dE07A48b5182c983Ae74'; // Reemplaza con la dirección de tu contrato
  const contractABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "comprador",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "zona",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint8",
				"name": "numeroAsiento",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "precio",
				"type": "uint256"
			}
		],
		"name": "BoletoComprado",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"name": "asientosOcupados",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "zona",
				"type": "string"
			},
			{
				"internalType": "uint8",
				"name": "numeroAsiento",
				"type": "uint8"
			}
		],
		"name": "comprarBoleto",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "precios",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]; // Reemplaza con el ABI de tu contrato

  const contract = new web3.eth.Contract(contractABI, contractAddress);

  contract.methods.comprarBoleto(zona, parseInt(asiento))
    .send({ from: web3.eth.defaultAccount, value: web3.utils.toWei('1', 'ether') })
    .on('transactionHash', function(hash) {
      console.log('Transacción enviada:', hash);
	  // Mostrar el hash en una alerta
alert(`Transacción enviada: ${hash}`);

      // Puedes mostrar un mensaje de éxito aquí
      document.getElementById('mensaje').innerHTML = 'Boleto comprado exitosamente.';
    })
    .on('error', function(error) {
      console.error('Error al comprar boleto:', error);
      // Mostrar un mensaje de error si la transacción falla
      document.getElementById('mensaje').innerHTML = 'Este boleto no se encuentra disponible, intentelo con otro.';
    });
}

// Llamar a la función de conexión al cargar la página
window.addEventListener('load', async function() {
  await conectarMetamask();
});
