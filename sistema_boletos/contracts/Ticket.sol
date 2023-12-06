// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contrato para la compra de boletos de fútbol
contract CompraBoletos {

    // Estructura para representar un boleto
    struct Boleto {
        uint256 precio;
        uint8 numeroAsiento;
    }

    // Mapeo de zonas a precios
    mapping(string => uint256) public precios;

    // Mapeo de asientos a su estado (ocupado o libre)
    mapping(uint8 => bool) public asientosOcupados;

    // Evento para registrar la compra del boleto
    event BoletoComprado(address comprador, string zona, uint8 numeroAsiento, uint256 precio);

    // Función para inicializar precios y asientos
    constructor() {
        // Inicializar precios para cada zona
        precios["lateral_superior_oriente"] = 100;
        precios["lateral_superior_poniente"] = 100;
        precios["cabecera_superior_norte"] = 100;
        precios["cabecera_superior_sur"] = 100;
        precios["lateral_inferior_oriente"] = 100;
        precios["lateral_inferior_poniente"] = 100;
        precios["cabecera_inferior_norte"] = 100;
        precios["cabecera_inferior_sur"] = 100;
        precios["premium_sur"] = 100;
        precios["premium_este"] = 100;
        precios["premium_oeste"] = 100;
        precios["premium_norte"] = 100;
        
        // Inicializar asientos como libres
        for (uint8 i = 1; i <= 20; i++) {
            asientosOcupados[i] = false;
        }
    }

    // Función para comprar un boleto
    function comprarBoleto(string memory zona, uint8 numeroAsiento) external payable {
        // Verificar que el asiento esté disponible
        require(!asientosOcupados[numeroAsiento], "Asiento ocupado");

        // Obtener el precio de la zona
        uint256 precio = precios[zona];

        // Verificar que el valor enviado sea suficiente
        require(msg.value >= precio, "Pago insuficiente");

        // Marcar el asiento como ocupado
        asientosOcupados[numeroAsiento] = true;

        // Emitir evento de compra
        emit BoletoComprado(msg.sender, zona, numeroAsiento, precio);
    }
}
