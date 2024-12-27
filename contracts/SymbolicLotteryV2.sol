// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SymbolicLotteryV2 {

    bool private initialized;
    uint256[50] private __gap;

    address public admin;

    struct Bet {
        address player;
        uint choice;
    }

    mapping(address => uint) public winnings;
    mapping(address => uint) public playerBetCount;
    mapping(uint => address[]) public playersByChoice;
    Bet[] public bets;

    uint public entryFee;
    uint public lastDrawTime;
    uint public drawInterval;
    uint public winningNumber;
    uint public maxBetsPerPlayer;
    uint public maxBets;

    event BetPlaced(address indexed player, uint choice, uint value);
    event WinnerDrawn(uint winningNumber, uint prizePerWinner);
    event WinningsWithdrawn(address indexed player, uint amount);

    modifier onlyAfterInterval() {
        require(block.timestamp >= lastDrawTime + drawInterval, "Intervalle non respecte");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Seul l'administrateur peut appeler cette fonction");
        _;
    }

    function initialize(
        uint _entryFee,
        uint _drawInterval,
        uint _maxBetsPerPlayer,
        uint _maxBets
    ) external {
        require(!initialized, "Deja initialise");
        initialized = true;

        admin = msg.sender; // Initialiser l'administrateur
        lastDrawTime = block.timestamp;

        // Déplacer les initialisations ici
        entryFee = _entryFee;
        drawInterval = _drawInterval;
        maxBetsPerPlayer = _maxBetsPerPlayer;
        maxBets = _maxBets;
    }

    function placeBet(uint _choice) public payable {
        require(bets.length < maxBets, "Nombre maximum de paris atteint");
        require(playerBetCount[msg.sender] < maxBetsPerPlayer, "Max de paris atteint");
        require(_choice < 10, "Choix invalide");
        require(msg.value == entryFee, "La mise est incorrecte");

        bets.push(Bet(msg.sender, _choice));
        playersByChoice[_choice].push(msg.sender);
        playerBetCount[msg.sender]++;
        emit BetPlaced(msg.sender, _choice, msg.value);
    }

    function drawWinner() public onlyAfterInterval {
        require(bets.length > 0, "Pas de paris");

        winningNumber = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 10;

        address[] memory winners = playersByChoice[winningNumber];
        uint prizePerWinner = winners.length > 0 ? address(this).balance / winners.length : 0;

        for (uint i = 0; i < winners.length; i++) {
            winnings[winners[i]] += prizePerWinner;
        }

        lastDrawTime = block.timestamp;
        emit WinnerDrawn(winningNumber, prizePerWinner);
        resetGame();
    }

    function withdrawWinnings() public {
        uint amount = winnings[msg.sender];
        require(amount > 0, "Pas de gains a retirer");
        winnings[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        emit WinningsWithdrawn(msg.sender, amount);
    }

    function withdrawAll() public onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }

    function resetGame() internal {
        delete bets;
        for (uint i = 0; i < 10; i++) {
            delete playersByChoice[i];
        }
    }

    function version() public pure returns (string memory) {
        return "1.0.1";
    }
}
