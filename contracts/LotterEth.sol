pragma solidity ^0.4.11;

contract LotterEth {

    mapping(uint => address) players;
    address owner;
    address public previousWinner;
    uint public ticketPrice = 0.01 ether;
    uint public totalTickets = 100;
    uint public ticketsBought;

    constructor() public {
        owner = msg.sender;
        previousWinner = 0x0;
        ticketsBought = 0;
    }

    // events
    // event Purchase(address _buyer, uint _amount);
    // event AnnounceWinner(address _winner);

    function () public payable {
        uint quantity = msg.value / ticketPrice;
        uint remainder = msg.value % ticketPrice;

        if (remainder != 0) {
            revert();
        }

        if (quantity > (totalTickets - ticketsBought)) {
            revert();
        }

        for (uint i = 0; i < quantity; ++i) {
            players[ticketsBought] = msg.sender;
            ++ticketsBought;
        }

        // emit Purchase(msg.sender, quantity);

        if (ticketsBought == totalTickets) {     //if all tickets have been bought, choose a winner
            chooseWinner();
            resetLottery();
        }
    }

    function chooseWinner() private {
        uint rand = random();
        address winner = players[rand];
        previousWinner = winner;
        // emit AnnounceWinner(winner);
        winner.transfer(ticketPrice*totalTickets);
    }

    function resetLottery() private {
        ticketsBought = 0;
    }

    function random() private view returns (uint) {
        return uint(uint256(keccak256(block.timestamp, block.difficulty)) % totalTickets);     // not the best prng - TODO: find a way to make a better one
    }

    function ticketsLeft() public constant returns (uint) {
        return totalTickets - ticketsBought;
    }
}
