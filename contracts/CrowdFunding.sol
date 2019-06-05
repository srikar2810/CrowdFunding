pragma solidity ^0.4.25;
import "./Utils.sol";

contract CrowdFunding{
    using Utils for *;
	enum State{ Ongoing , Failed , Succeeded, PaidOut }
    event campaignEvent(
        address addr,
        uint totalCollected,
        bool succesful
    );
	string public name;
	uint public targetAmount;
	uint public fundingDeadline;
	address public beneficiary;
	State public state;
	mapping(address => uint) public amounts;
	bool public collected;
	uint totalCollected;
	string public check;
	
	modifier inState(State expectedState){
	    require(expectedState==state,"InvalidState!");
	    _;
	}
	
	modifier inCollection(){
	    require(collected==true,"CrowdFunding completed");
	    _;
	}
	
	constructor(
		string contractName,
		uint targetAmountEth,
		uint durationInMin,
		address ben
	)
		public
	{
			name = contractName;
			targetAmount = Utils.etherToWei(targetAmountEth);
			fundingDeadline = currentTime() + Utils.minToSec(durationInMin);
			beneficiary = ben;
			state = State.Ongoing;
			collected = false;
			check = "uncheck";
			totalCollected = 0;
	}
	
	function finishCrowdFunding() public inState(State.Ongoing){
	    require(!beforeDeadline(),"not over yet");
	    
	    if(collected){
	        state = State.Succeeded;
	    }else{
	        state = State.Failed;
	    }
	    emit campaignEvent(this,totalCollected,collected);
	}
	
	function collect() public inState(State.Succeeded) {
	    if(beneficiary.send(totalCollected)){
	        state = State.PaidOut;
	    }else state =State.Failed ; 
	}
	
	function withdraw() public inState(State.Failed){
	    require(amounts[msg.sender]>0,"Nothing to withdraw");
	    uint contributed = amounts[msg.sender];
	    amounts[msg.sender] = 0;
	    
	    if(!msg.sender.send(contributed)){
	        amounts[msg.sender] = contributed;
	    }
	}
	function contribute() public payable inState(State.Ongoing){
	    require(beforeDeadline(),"time over");
	    amounts[msg.sender] += msg.value;
	    totalCollected += msg.value;
	    check = "check";
	    if(totalCollected>=targetAmount) collected = true;
	}
	
	function beforeDeadline() public view returns(bool){
	    return currentTime() <fundingDeadline;
	}
	
	function currentTime() internal view returns(uint){
	    return now;
	}
}