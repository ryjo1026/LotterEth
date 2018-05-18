pragma solidity ^0.4.11;

contract LotterEth {
    
    mapping(uint => address) players;
    address owner;
    uint ticketPrice = 1 ether;
    uint playersNeeded = 10;
    uint ticketsBought;
    
    constructor() public {
        owner = msg.sender;
        ticketsBought = 0;
    }
    
    // events
    event Purchase(address _buyer, uint _amount);
    
    function buyTickets(uint quantity) public payable {
        if (msg.value != quantity * ticketPrice) {        //if caller sent wrong amount of ether, revert
            revert();
        }
        
        if (quantity > playersNeeded - ticketsBought) {     //if caller is trying to buy more tickets than are available, revert
            revert();
        }
        
        for (uint i = 0; i < quantity; ++i) {
            players[ticketsBought] = msg.sender;
            ++ticketsBought;
        }
        
        emit Purchase(msg.sender, quantity);
        
        if (ticketsBought == playersNeeded) {     //if all tickets have been bought, choose a winner
            chooseWinner();
        }
        
    }
    
    function chooseWinner() private {
        uint rand = random();
        address winner = players[rand];
        winner.transfer(ticketPrice*playersNeeded);
    }
    
    function random() private view returns (uint) {
        return uint(uint256(keccak256(block.timestamp, block.difficulty)) % playersNeeded);
    }
    
    //event ViewJackpot (uint256 _jackpot);
    
    //function currJackpot() public view returns (uint256) {
        //emit ViewJackpot(address(this).balance);
        //return address(this).balance;
    //}
}
