var Hello = artifacts.require("./Hello.sol");

module.exports = async function(deployer){
	await deployer.deploy(Hello);
};