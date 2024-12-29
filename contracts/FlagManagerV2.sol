// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FlagManagerV2 {
    bool private initialized;
    uint256[50] private __gap;

    address public admin;

    struct Flag {
        string countryCode;
        address owner;
        bool isAssigned;
        uint256 lastUpdateTime;
    }

    struct Crypto {
        string name;
        uint256 flagCount;
    }

    struct Winner {
        string countryCode;
        address winnerAddress;
        uint256 flagCount;
        bool hasClaimed;
    }

    mapping(string => mapping(uint256 => Flag)) public flags;
    Crypto[] public cryptos;
    uint256 public assignmentPrice;
    mapping(string => Flag[]) public cryptoFlags;
    mapping(string => uint256) public cryptoFlagCounts;
    mapping(string => mapping(address => uint256)) public userFlagCounts;
    bool public gameEnded;
    Winner public winner;

    mapping(string => uint256) private countryCounts;
    mapping(string => mapping(address => uint256)) private countryUserCounts;

    event FlagAssigned(string cryptoId, uint256 flagIndex, string countryCode, address owner);
    event PriceUpdated(uint256 newPrice);
    event CryptoAdded(string name, uint256 flagCount);
    event GameEnded(string winningCountry, address winnerAddress, uint256 flagCount);
    event PrizeClaimed(address winner, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function initialize() external {
        require(!initialized, "Contract instance has already been initialized");
        initialized = true;

        admin = msg.sender;
        assignmentPrice = 0.01 ether;
        
        cryptos.push(Crypto({name: "Bitcoin", flagCount: 10}));
        cryptos.push(Crypto({name: "Ethereum", flagCount: 8}));
        cryptos.push(Crypto({name: "Fantom", flagCount: 5}));
    }

    function addCrypto(string memory _name, uint256 _flagCount) external onlyAdmin {
        cryptos.push(Crypto({
            name: _name,
            flagCount: _flagCount
        }));
        emit CryptoAdded(_name, _flagCount);
    }

    function assignFlag(
        string memory _cryptoId,
        uint256 _flagIndex,
        string memory _countryCode
    ) external payable {
        require(msg.value >= assignmentPrice, "Insufficient payment");
        require(_flagIndex < getCryptoFlagCount(_cryptoId), "Invalid flag index");
        
        Flag storage flag = flags[_cryptoId][_flagIndex];
        
        flag.countryCode = _countryCode;
        flag.owner = msg.sender;
        flag.isAssigned = true;
        flag.lastUpdateTime = block.timestamp;

        emit FlagAssigned(_cryptoId, _flagIndex, _countryCode, msg.sender);
    }

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

    function getCryptoFlagCount(string memory _cryptoId) public view returns (uint256) {
        for (uint i = 0; i < cryptos.length; i++) {
            if (keccak256(bytes(cryptos[i].name)) == keccak256(bytes(_cryptoId))) {
                return cryptos[i].flagCount;
            }
        }
        revert("Crypto not found");
    }

    function updateAssignmentPrice(uint256 _newPrice) external onlyAdmin {
        assignmentPrice = _newPrice;
        emit PriceUpdated(_newPrice);
    }

    function withdrawFunds() external onlyAdmin {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        
        (bool success, ) = admin.call{value: balance}("");
        require(success, "Transfer failed");
    }

    function getCryptoFlags(string memory _cryptoId) 
        external 
        view 
        returns (Flag[] memory) 
    {
        uint256 count = getCryptoFlagCount(_cryptoId);
        Flag[] memory flagsArray = new Flag[](count);
        
        for (uint256 i = 0; i < count; i++) {
            flagsArray[i] = flags[_cryptoId][i];
        }
        
        return flagsArray;
    }

    function endGame() external onlyAdmin {
        require(!gameEnded, "Game already ended");
        
        bool hasAssignedFlags = false;
        string[3] memory cryptoNames = ["Bitcoin", "Ethereum", "Fantom"];
        
        // Vérifier qu'il y a au moins un drapeau assigné
        for (uint i = 0; i < cryptoNames.length && !hasAssignedFlags; i++) {
            Flag[] storage currentFlags = cryptoFlags[cryptoNames[i]];
            for (uint j = 0; j < currentFlags.length && !hasAssignedFlags; j++) {
                if (currentFlags[j].isAssigned) {
                    hasAssignedFlags = true;
                    break;
                }
            }
        }
        require(hasAssignedFlags, "No flags assigned yet");
        
        // Compter les drapeaux par pays
        for (uint i = 0; i < cryptoNames.length; i++) {
            Flag[] storage currentFlags = cryptoFlags[cryptoNames[i]];
            for (uint j = 0; j < currentFlags.length; j++) {
                if (currentFlags[j].isAssigned) {
                    countryCounts[currentFlags[j].countryCode]++;
                    countryUserCounts[currentFlags[j].countryCode][currentFlags[j].owner]++;
                }
            }
        }

        // Trouver le pays gagnant
        uint256 maxFlags = 0;
        string memory winningCountry;
        
        for (uint i = 0; i < cryptoNames.length; i++) {
            Flag[] storage currentFlags = cryptoFlags[cryptoNames[i]];
            for (uint j = 0; j < currentFlags.length; j++) {
                if (currentFlags[j].isAssigned) {
                    string memory country = currentFlags[j].countryCode;
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
        
        for (uint i = 0; i < cryptoNames.length; i++) {
            Flag[] storage currentFlags = cryptoFlags[cryptoNames[i]];
            for (uint j = 0; j < currentFlags.length; j++) {
                if (currentFlags[j].isAssigned && 
                    keccak256(bytes(currentFlags[j].countryCode)) == keccak256(bytes(winningCountry))) {
                    address user = currentFlags[j].owner;
                    if (countryUserCounts[winningCountry][user] > maxUserFlags) {
                        maxUserFlags = countryUserCounts[winningCountry][user];
                        winnerAddress = user;
                    }
                }
            }
        }

        // Sauvegarder le gagnant
        winner = Winner({
            countryCode: winningCountry,
            winnerAddress: winnerAddress,
            flagCount: maxFlags,
            hasClaimed: false
        });

        // Réinitialiser tous les drapeaux
        for (uint i = 0; i < cryptoNames.length; i++) {
            uint256 flagCount = getCryptoFlagCount(cryptoNames[i]);
            for (uint j = 0; j < flagCount; j++) {
                flags[cryptoNames[i]][j] = Flag({
                    countryCode: "",
                    owner: address(0),
                    isAssigned: false,
                    lastUpdateTime: 0
                });
                delete countryCounts[cryptoNames[i]];
                delete countryUserCounts[cryptoNames[i]][flags[cryptoNames[i]][j].owner];
            }
        }

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

    function getVersion() external pure returns (string memory) {
        return "2.0.0";
    }
} 