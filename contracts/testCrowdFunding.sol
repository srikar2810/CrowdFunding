pragma solidity ^0.4.25;
import "./CrowdFunding.sol";

contract testCrowdFunding is CrowdFunding{
    
    constructor(
		string contractName,
		uint targetAmountEth,
		uint durationInMin,
		address ben
	)
		public CrowdFunding(contractName,targetAmountEth,durationInMin,ben){}

    uint time;
    
    function currentTime() internal view returns(uint){
	    return time;
	}
	
	function setCurrentTime(uint _time) public{
	    time = _time;
	} 
}