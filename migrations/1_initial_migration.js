var Migrations = artifacts.require("./Migrations.sol");

console.log("1_initial_migration.js");
module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
