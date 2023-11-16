require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
  version: "0.8.20", // Cambia esto a la versión que necesitas
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
},
}
