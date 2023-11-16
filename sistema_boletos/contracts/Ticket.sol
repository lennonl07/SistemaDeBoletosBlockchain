// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Ticket {
    address public owner;
    string public eventName;
    string public eventDate;
    string public eventLocation;
    uint256 public ticketPrice;
    uint256 public totalTickets;
    uint256 public ticketsSold;

    mapping(address => uint256) public ticketBalances;

    event TicketPurchased(address indexed buyer, uint256 numTickets);
    event RewardReceived(address indexed receiver, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    constructor(
        string memory _eventName,
        string memory _eventDate,
        string memory _eventLocation,
        uint256 _ticketPrice,
        uint256 _totalTickets
    ) {
        owner = msg.sender;
        eventName = _eventName;
        eventDate = _eventDate;
        eventLocation = _eventLocation;
        ticketPrice = _ticketPrice;
        totalTickets = _totalTickets;
        ticketsSold = 0;
    }

    function purchaseTickets(uint256 numTickets) external payable {
        require(ticketsSold + numTickets <= totalTickets, "Not enough tickets available");
        require(msg.value == ticketPrice * numTickets, "Incorrect amount sent");
    
        ticketBalances[msg.sender] += numTickets;
        ticketsSold += numTickets;
    
        emit TicketPurchased(msg.sender, numTickets);
    }
    
    function receiveReward(uint256 amount) external onlyOwner {
        require(amount > 0, "Reward amount must be greater than 0");
        require(amount <= address(this).balance, "Not enough funds in contract");
    
        payable(owner).transfer(amount);
    
        emit RewardReceived(owner, amount);
    }
    
}
