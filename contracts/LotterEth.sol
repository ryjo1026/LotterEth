pragma solidity ^0.4.11;

contract LotterEth {

    mapping(uint => address) public players;
    address owner;
    uint public ticketPrice = 1 ether;
    uint public jackpotNeeded = 10;
    uint public ticketsBought;

    constructor() public {
        owner = msg.sender;
        ticketsBought = 0;
    }

    // events
    event Purchase(address _buyer, uint _amount);
    event AnnounceWinner(address _winner);

    function buyTickets(uint quantity) public payable {
        if (msg.value != quantity*ticketPrice) {        //if caller sent wrong amount of ether, revert
            revert();
        }

        if (quantity > jackpotNeeded - ticketsBought) {     //if caller is trying to buy more tickets than are available, revert
            revert();
        }

        for (uint i = 0; i < quantity; ++i) {
            players[ticketsBought] = msg.sender;
            ++ticketsBought;
        }

        emit Purchase(msg.sender, quantity);

        if (ticketsBought == jackpotNeeded) {     //if all tickets have been bought, choose a winner
            chooseWinner();
            resetLottery();
        }

    }

    function chooseWinner() private {
        uint rand = random();
        address winner = players[rand];
        emit AnnounceWinner(winner);
        winner.transfer(ticketPrice*jackpotNeeded);
    }

    function resetLottery() private {
        ticketsBought = 0;
    }

    function random() private view returns (uint) {
        return uint(uint256(keccak256(block.timestamp, block.difficulty)) % jackpotNeeded);     // not the best prng - TODO: find a way to make a better one
    }

    //event ViewJackpot (uint256 _jackpot);

    //function currJackpot() public view returns (uint256) {
        //emit ViewJackpot(address(this).balance);
        //return address(this).balance;
    //}
}
