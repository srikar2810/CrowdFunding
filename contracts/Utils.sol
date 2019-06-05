pragma solidity ^0.4.25;

library Utils{
    function etherToWei(uint suminEth) public pure returns(uint){
        return suminEth* 1 ether;
    }
    
    function minToSec(uint mmin) public pure returns(uint){
        return mmin* 1 minutes;
    }
}