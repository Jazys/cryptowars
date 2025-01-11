// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract FlagManager {
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
    Winner public winner;
    uint256 public lastGameEndTime;

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
        uint256 cryptoCount = cryptos.length;
        
        // Compter les drapeaux par pays et par utilisateur
        for (uint i = 0; i < cryptoCount; i++) {
            string memory cryptoName = cryptos[i].name;
            uint256 flagCount = cryptos[i].flagCount;
            
            for (uint j = 0; j < flagCount; j++) {
                Flag storage flag = flags[cryptoName][j];
                if (flag.isAssigned) {
                    string memory country = flag.countryCode;
                    address user = flag.owner;
                    countryCounts[country]++;
                    countryUserCounts[country][user]++;
                }
            }
        }

        // Trouver le pays gagnant et le joueur gagnant
        uint256 maxFlags = 0;
        string memory winningCountry = "";
        address winnerAddress = address(0);
        uint256 maxUserFlags = 0;
        
        // D'abord trouver le pays avec le plus de drapeaux
        for (uint i = 0; i < cryptoCount; i++) {
            string memory cryptoName = cryptos[i].name;
            uint256 flagCount = cryptos[i].flagCount;
            
            for (uint j = 0; j < flagCount; j++) {
                Flag storage flag = flags[cryptoName][j];
                if (flag.isAssigned) {
                    string memory country = flag.countryCode;
                    if (countryCounts[country] > maxFlags) {
                        maxFlags = countryCounts[country];
                        winningCountry = country;
                    }
                }
            }
        }

        // Si on a trouvé un pays gagnant, trouver le joueur avec le plus de drapeaux dans ce pays
        if (maxFlags > 0) {
            // Parcourir tous les drapeaux pour trouver le joueur avec le plus de drapeaux dans le pays gagnant
            for (uint i = 0; i < cryptoCount; i++) {
                string memory cryptoName = cryptos[i].name;
                uint256 flagCount = cryptos[i].flagCount;
                
                for (uint j = 0; j < flagCount; j++) {
                    Flag storage flag = flags[cryptoName][j];
                    if (flag.isAssigned && 
                        keccak256(bytes(flag.countryCode)) == keccak256(bytes(winningCountry))) {
                        address user = flag.owner;
                        uint256 userFlags = countryUserCounts[winningCountry][user];
                        if (userFlags > maxUserFlags) {
                            maxUserFlags = userFlags;
                            winnerAddress = user;
                        }
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
        for (uint i = 0; i < cryptoCount; i++) {
            string memory cryptoName = cryptos[i].name;
            uint256 flagCount = cryptos[i].flagCount;
            
            for (uint j = 0; j < flagCount; j++) {
                flags[cryptoName][j] = Flag({
                    countryCode: "",
                    owner: address(0),
                    isAssigned: false,
                    lastUpdateTime: 0
                });
            }
        }

        // Réinitialiser les compteurs
        for (uint i = 0; i < cryptoCount; i++) {
            string memory cryptoName = cryptos[i].name;
            uint256 flagCount = cryptos[i].flagCount;
            
            for (uint j = 0; j < flagCount; j++) {
                if (flags[cryptoName][j].isAssigned) {
                    delete countryCounts[flags[cryptoName][j].countryCode];
                    delete countryUserCounts[flags[cryptoName][j].countryCode][flags[cryptoName][j].owner];
                }
            }
        }

        lastGameEndTime = block.timestamp;
        emit GameEnded(winningCountry, winnerAddress, maxFlags);
    }

    function claimPrize() external {
        require(msg.sender == winner.winnerAddress, "Not the winner");
        require(!winner.hasClaimed, "Prize already claimed");

        // Sauvegarder les infos pour l'event
        address winnerAddress = winner.winnerAddress;
        uint256 prizeAmount = address(this).balance;

        // Réinitialiser le winner avant le transfert pour éviter les reentrancy attacks
        winner = Winner({
            countryCode: "",
            winnerAddress: address(0),
            flagCount: 0,
            hasClaimed: false
        });

        // Transfert du prix
        (bool success, ) = winnerAddress.call{value: prizeAmount}("");
        require(success, "Transfer failed");

        emit PrizeClaimed(winnerAddress, prizeAmount);
    }

    function getWinner() external view returns (Winner memory) {
        return winner;
    }

    function getVersion() external pure returns (string memory) {
        return "1.0.0";
    }
} 