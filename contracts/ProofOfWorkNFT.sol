// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title ProofOfWorkNFT
 * @notice Soulbound NFT certificates for completed projects on FARIIMA
 * @dev Non-transferable ERC-721 tokens with on-chain SVG generation
 */
contract ProofOfWorkNFT is ERC721, ERC721URIStorage, AccessControl {
    using Counters for Counters.Counter;
    using Strings for uint256;

    // ============ Constants ============

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    // ============ Structs ============

    struct ProjectMetadata {
        uint256 projectId;
        string projectTitle;
        uint256 amount;
        address client;
        address freelancer;
        uint256 completionDate;
        string category;
    }

    // ============ State Variables ============

    Counters.Counter private _tokenIdCounter;
    
    mapping(uint256 => ProjectMetadata) public projectMetadata;
    mapping(address => uint256[]) public freelancerNFTs;
    mapping(uint256 => uint256) public projectToTokenId; // projectId => tokenId

    // ============ Events ============

    event NFTMinted(
        uint256 indexed tokenId,
        address indexed freelancer,
        uint256 indexed projectId,
        uint256 amount
    );

    // ============ Constructor ============

    constructor() ERC721("FARIIMA Proof of Work", "FARIIMA-POW") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    // ============ Minting Functions ============

    /**
     * @notice Mint a new Proof of Work NFT
     * @param freelancer Address of the freelancer
     * @param projectId The project ID
     * @param amount Project amount
     * @param client Address of the client
     * @param projectTitle Title of the project
     * @return tokenId The minted NFT token ID
     */
    function mint(
        address freelancer,
        uint256 projectId,
        uint256 amount,
        address client,
        string calldata projectTitle
    ) external onlyRole(MINTER_ROLE) returns (uint256) {
        require(freelancer != address(0), "Invalid freelancer");
        require(projectToTokenId[projectId] == 0, "NFT already minted for project");

        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();

        _safeMint(freelancer, tokenId);

        // Store metadata
        projectMetadata[tokenId] = ProjectMetadata({
            projectId: projectId,
            projectTitle: projectTitle,
            amount: amount,
            client: client,
            freelancer: freelancer,
            completionDate: block.timestamp,
            category: "General" // Can be enhanced
        });

        freelancerNFTs[freelancer].push(tokenId);
        projectToTokenId[projectId] = tokenId;

        emit NFTMinted(tokenId, freelancer, projectId, amount);

        return tokenId;
    }

    // ============ Token URI & Metadata ============

    /**
     * @notice Generate token URI with on-chain SVG
     * @param tokenId The NFT token ID
     * @return JSON metadata URI
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        require(_exists(tokenId), "Token does not exist");

        ProjectMetadata memory metadata = projectMetadata[tokenId];

        string memory svg = _generateSVG(metadata, tokenId);
        
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{',
                        '"name": "FARIIMA Proof of Work #', tokenId.toString(), '",',
                        '"description": "Verified completion certificate for project: ', metadata.projectTitle, '",',
                        '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '",',
                        '"attributes": [',
                            '{"trait_type": "Project ID", "value": "', metadata.projectId.toString(), '"},',
                            '{"trait_type": "Amount (Wei)", "value": "', metadata.amount.toString(), '"},',
                            '{"trait_type": "Completion Date", "value": "', metadata.completionDate.toString(), '"},',
                            '{"trait_type": "Category", "value": "', metadata.category, '"}',
                        ']',
                        '}'
                    )
                )
            )
        );

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    /**
     * @notice Generate SVG image for the NFT
     * @param metadata Project metadata
     * @param tokenId Token ID
     * @return SVG string
     */
    function _generateSVG(ProjectMetadata memory metadata, uint256 tokenId)
        internal
        pure
        returns (string memory)
    {
        // Convert amount from wei to readable format (simplified)
        string memory amountStr = _formatAmount(metadata.amount);

        return string(
            abi.encodePacked(
                '<svg width="500" height="700" xmlns="http://www.w3.org/2000/svg">',
                    '<defs>',
                        '<linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">',
                            '<stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />',
                            '<stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />',
                        '</linearGradient>',
                    '</defs>',
                    
                    // Background
                    '<rect width="500" height="700" fill="url(#grad)"/>',
                    
                    // Border
                    '<rect x="20" y="20" width="460" height="660" fill="none" stroke="white" stroke-width="3" rx="15"/>',
                    
                    // FARIIMA Logo Text
                    '<text x="250" y="80" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">',
                        'FARIIMA',
                    '</text>',
                    
                    // Certificate Text
                    '<text x="250" y="120" font-family="Arial, sans-serif" font-size="18" fill="white" text-anchor="middle" opacity="0.9">',
                        'Proof of Work Certificate',
                    '</text>',
                    
                    // Divider Line
                    '<line x1="60" y1="150" x2="440" y2="150" stroke="white" stroke-width="2" opacity="0.5"/>',
                    
                    // Token ID
                    '<text x="250" y="200" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle">',
                        'Certificate #', tokenId.toString(),
                    '</text>',
                    
                    // Project Title Label
                    '<text x="250" y="260" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.7">',
                        'PROJECT',
                    '</text>',
                    
                    // Project Title (truncated if too long)
                    '<text x="250" y="290" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white" text-anchor="middle">',
                        _truncateString(metadata.projectTitle, 30),
                    '</text>',
                    
                    // Amount
                    '<text x="250" y="360" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.7">',
                        'VALUE',
                    '</text>',
                    '<text x="250" y="390" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="white" text-anchor="middle">',
                        amountStr,
                    '</text>',
                    
                    // Freelancer Address
                    '<text x="250" y="460" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.7">',
                        'EARNED BY',
                    '</text>',
                    '<text x="250" y="490" font-family="monospace" font-size="12" fill="white" text-anchor="middle">',
                        _shortenAddress(metadata.freelancer),
                    '</text>',
                    
                    // Client Address
                    '<text x="250" y="540" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" opacity="0.7">',
                        'CLIENT',
                    '</text>',
                    '<text x="250" y="570" font-family="monospace" font-size="12" fill="white" text-anchor="middle">',
                        _shortenAddress(metadata.client),
                    '</text>',
                    
                    // Completion Date
                    '<text x="250" y="630" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" opacity="0.7">',
                        'Completed on Polygon | Timestamp: ', metadata.completionDate.toString(),
                    '</text>',
                    
                    // Checkmark Icon
                    '<circle cx="250" cy="140" r="0" fill="white" opacity="0"/>',
                    
                '</svg>'
            )
        );
    }

    /**
     * @notice Format amount for display (simplified)
     */
    function _formatAmount(uint256 amount) internal pure returns (string memory) {
        // Assuming amount is in USDC/USDT (6 decimals)
        // This is simplified - in production, would need proper decimal handling
        uint256 dollars = amount / 1e6;
        return string(abi.encodePacked("$", dollars.toString(), " USDC"));
    }

    /**
     * @notice Shorten address for display
     */
    function _shortenAddress(address addr) internal pure returns (string memory) {
        string memory addrStr = Strings.toHexString(uint160(addr), 20);
        return string(
            abi.encodePacked(
                _substring(addrStr, 0, 6),
                "...",
                _substring(addrStr, 38, 42)
            )
        );
    }

    /**
     * @notice Truncate string if too long
     */
    function _truncateString(string memory str, uint256 maxLength)
        internal
        pure
        returns (string memory)
    {
        bytes memory strBytes = bytes(str);
        if (strBytes.length <= maxLength) {
            return str;
        }
        
        bytes memory truncated = new bytes(maxLength);
        for (uint256 i = 0; i < maxLength - 3; i++) {
            truncated[i] = strBytes[i];
        }
        return string(abi.encodePacked(string(truncated), "..."));
    }

    /**
     * @notice Get substring (helper function)
     */
    function _substring(string memory str, uint256 startIndex, uint256 endIndex)
        internal
        pure
        returns (string memory)
    {
        bytes memory strBytes = bytes(str);
        bytes memory result = new bytes(endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            result[i - startIndex] = strBytes[i];
        }
        return string(result);
    }

    // ============ View Functions ============

    /**
     * @notice Get all NFTs owned by a freelancer
     * @param freelancer Address of the freelancer
     * @return Array of token IDs
     */
    function getFreelancerNFTs(address freelancer) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return freelancerNFTs[freelancer];
    }

    /**
     * @notice Get metadata for a specific NFT
     * @param tokenId The NFT token ID
     * @return ProjectMetadata struct
     */
    function getMetadata(uint256 tokenId) 
        external 
        view 
        returns (ProjectMetadata memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return projectMetadata[tokenId];
    }

    /**
     * @notice Get token ID for a project
     * @param projectId The project ID
     * @return tokenId (0 if not minted)
     */
    function getTokenIdByProject(uint256 projectId) 
        external 
        view 
        returns (uint256) 
    {
        return projectToTokenId[projectId];
    }

    /**
     * @notice Get total NFTs minted
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    // ============ Soulbound Token (Non-Transferable) ============

    /**
     * @notice Override to make tokens non-transferable (soulbound)
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal virtual override {
        require(
            from == address(0) || to == address(0),
            "Soulbound: Token is non-transferable"
        );
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    // ============ Required Overrides ============

    function _burn(uint256 tokenId) 
        internal 
        override(ERC721, ERC721URIStorage) 
    {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
