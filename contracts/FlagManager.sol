// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FlagManager is Ownable, ReentrancyGuard {
    // Structure pour stocker les informations d'un drapeau
    struct Flag {
        string countryCode;    // Code du pays (ex: 'fr', 'us', etc.)
        address owner;         // Propriétaire du drapeau
        bool isAssigned;       // Si le drapeau est assigné à un pays
        uint256 lastUpdateTime; // Dernier moment de mise à jour
    }

    // Structure pour stocker les informations d'une crypto
    struct Crypto {
        string name;          // Nom de la crypto (ex: 'Bitcoin', 'Ethereum')
        uint256 flagCount;    // Nombre de drapeaux associés
    }

    // Mapping des drapeaux par crypto et index
    mapping(string => mapping(uint256 => Flag)) public flags;
    
    // Liste des cryptos
    Crypto[] public cryptos;
    
    // Prix pour assigner un drapeau (en FTM)
    uint256 public assignmentPrice;
    
    // Événements
    event FlagAssigned(string cryptoId, uint256 flagIndex, string countryCode, address owner);
    event PriceUpdated(uint256 newPrice);
    event CryptoAdded(string name, uint256 flagCount);

    constructor(uint256 _assignmentPrice) {
        assignmentPrice = _assignmentPrice;
    }

    // Ajouter une nouvelle crypto avec un nombre spécifique de drapeaux
    function addCrypto(string memory _name, uint256 _flagCount) external onlyOwner {
        cryptos.push(Crypto({
            name: _name,
            flagCount: _flagCount
        }));
        emit CryptoAdded(_name, _flagCount);
    }

    // Assigner un drapeau à un pays
    function assignFlag(
        string memory _cryptoId,
        uint256 _flagIndex,
        string memory _countryCode
    ) external payable nonReentrant {
        // Vérifier le paiement
        require(msg.value >= assignmentPrice, "Insufficient payment");
        
        // Vérifier que l'index est valide
        require(_flagIndex < getCryptoFlagCount(_cryptoId), "Invalid flag index");
        
        // Récupérer le drapeau
        Flag storage flag = flags[_cryptoId][_flagIndex];
        
        // Mettre à jour le drapeau
        flag.countryCode = _countryCode;
        flag.owner = msg.sender;
        flag.isAssigned = true;
        flag.lastUpdateTime = block.timestamp;

        emit FlagAssigned(_cryptoId, _flagIndex, _countryCode, msg.sender);
    }

    // Obtenir les informations d'un drapeau
    function getFlag(string memory _cryptoId, uint256 _flagIndex) 
        external 
        view 
        returns (
            string memory countryCode,
            address owner,
            bool isAssigned,
            uint256 lastUpdateTime
        ) 
    {
        Flag memory flag = flags[_cryptoId][_flagIndex];
        return (
            flag.countryCode,
            flag.owner,
            flag.isAssigned,
            flag.lastUpdateTime
        );
    }

    // Obtenir le nombre de drapeaux pour une crypto
    function getCryptoFlagCount(string memory _cryptoId) public view returns (uint256) {
        for (uint i = 0; i < cryptos.length; i++) {
            if (keccak256(bytes(cryptos[i].name)) == keccak256(bytes(_cryptoId))) {
                return cryptos[i].flagCount;
            }
        }
        revert("Crypto not found");
    }

    // Mettre à jour le prix d'assignation
    function updateAssignmentPrice(uint256 _newPrice) external onlyOwner {
        assignmentPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }

    // Récupérer les fonds du contrat
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = owner().call{value: balance}("");
        require(success, "Transfer failed");
    }

    // Obtenir tous les drapeaux d'une crypto
    function getCryptoFlags(string memory _cryptoId) 
        external 
        view 
        returns (Flag[] memory) 
    {
        uint256 count = getCryptoFlagCount(_cryptoId);
        Flag[] memory cryptoFlags = new Flag[](count);
        
        for (uint256 i = 0; i < count; i++) {
            cryptoFlags[i] = flags[_cryptoId][i];
        }
        
        return cryptoFlags;
    }

    struct Winner {
        string countryCode;
        address winnerAddress;
        uint256 flagCount;
        bool hasClaimed;
    }

    mapping(string => Flag[]) public cryptoFlags;
    mapping(string => uint256) public cryptoFlagCounts;
    mapping(string => mapping(address => uint256)) public userFlagCounts;
    bool public gameEnded;
    Winner public winner;

    event GameEnded(string winningCountry, address winnerAddress, uint256 flagCount);
    event PrizeClaimed(address winner, uint256 amount);

    function endGame() external onlyOwner {
        require(!gameEnded, "Game already ended");
        
        mapping(string => uint256) storage countryCounts;
        mapping(string => mapping(address => uint256)) storage countryUserCounts;
        
        // Compter les drapeaux par pays
        string[] memory cryptos = ["Bitcoin", "Ethereum", "Fantom"];
        for (uint i = 0; i < cryptos.length; i++) {
            Flag[] storage flags = cryptoFlags[cryptos[i]];
            for (uint j = 0; j < flags.length; j++) {
                if (flags[j].isAssigned) {
                    countryCounts[flags[j].countryCode]++;
                    countryUserCounts[flags[j].countryCode][flags[j].owner]++;
                }
            }
        }

        // Trouver le pays gagnant
        uint256 maxFlags = 0;
        string memory winningCountry;
        
        for (uint i = 0; i < cryptos.length; i++) {
            Flag[] storage flags = cryptoFlags[cryptos[i]];
            for (uint j = 0; j < flags.length; j++) {
                if (flags[j].isAssigned) {
                    string memory country = flags[j].countryCode;
                    if (countryCounts[country] > maxFlags) {
                        maxFlags = countryCounts[country];
                        winningCountry = country;
                    }
                }
            }
        }

        // Trouver l'adresse gagnante dans le pays gagnant
        uint256 maxUserFlags = 0;
        address winnerAddress;
        
        for (uint i = 0; i < cryptos.length; i++) {
            Flag[] storage flags = cryptoFlags[cryptos[i]];
            for (uint j = 0; j < flags.length; j++) {
                if (flags[j].isAssigned && keccak256(bytes(flags[j].countryCode)) == keccak256(bytes(winningCountry))) {
                    address user = flags[j].owner;
                    if (countryUserCounts[winningCountry][user] > maxUserFlags) {
                        maxUserFlags = countryUserCounts[winningCountry][user];
                        winnerAddress = user;
                    }
                }
            }
        }

        winner = Winner({
            countryCode: winningCountry,
            winnerAddress: winnerAddress,
            flagCount: maxFlags,
            hasClaimed: false
        });

        gameEnded = true;
        emit GameEnded(winningCountry, winnerAddress, maxFlags);
    }

    function claimPrize() external {
        require(gameEnded, "Game not ended yet");
        require(msg.sender == winner.winnerAddress, "Not the winner");
        require(!winner.hasClaimed, "Prize already claimed");

        winner.hasClaimed = true;
        uint256 prizeAmount = address(this).balance;
        (bool success, ) = msg.sender.call{value: prizeAmount}("");
        require(success, "Transfer failed");

        emit PrizeClaimed(msg.sender, prizeAmount);
    }

    function getWinner() external view returns (Winner memory) {
        require(gameEnded, "Game not ended yet");
        return winner;
    }
} 