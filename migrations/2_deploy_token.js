var RakunCoin = artifacts.require("./RakunCoin.sol");

console.log("2_deploy_token.js");
module.exports = function(deployer) {
  deployer.deploy(RakunCoin);
};
