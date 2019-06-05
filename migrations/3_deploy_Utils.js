let Utils = artifacts.require("./Utils.sol");
let CrowdFunding = artifacts.require("./CrowdFunding.sol");
let test = artifacts.require("./testCrowdFunding.sol");

module.exports = async function(deployer){
	await deployer.deploy(Utils);
	deployer.link(Utils,CrowdFunding);
	deployer.link(Utils,test);
}