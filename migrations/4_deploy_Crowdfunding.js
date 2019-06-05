var CrowdFunding = artifacts.require("./CrowdFunding.sol");

module.exports = function(deployer){
	deployer.deploy(
		CrowdFunding,
		"Test Campaign",
		1,
		10,
		"0x0a07b1679d26Fe1ebbad056d23cc47eE0b001Dc9"
	)
};