// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OpenBudgetDAO is AccessControl, ReentrancyGuard {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MEMBER_ROLE = keccak256("MEMBER_ROLE");

    struct Proposal {
        uint256 id;
        string title;
        string description;
        uint256 amount;
        address recipient;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public votingPeriod;
    uint256 public quorum;
    IERC20 public token;

    event ProposalCreated(uint256 indexed id, string title, uint256 amount);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support);
    event ProposalExecuted(uint256 indexed id);

    constructor(
        address _token,
        uint256 _votingPeriod,
        uint256 _quorum
    ) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(ADMIN_ROLE, msg.sender);
        token = IERC20(_token);
        votingPeriod = _votingPeriod;
        quorum = _quorum;
    }

    function createProposal(
        string memory _title,
        string memory _description,
        uint256 _amount,
        address _recipient
    ) external onlyRole(MEMBER_ROLE) {
        proposalCount++;
        Proposal storage proposal = proposals[proposalCount];
        proposal.id = proposalCount;
        proposal.title = _title;
        proposal.description = _description;
        proposal.amount = _amount;
        proposal.recipient = _recipient;
        proposal.deadline = block.timestamp + votingPeriod;

        emit ProposalCreated(proposalCount, _title, _amount);
    }

    function vote(uint256 _proposalId, bool _support) external onlyRole(MEMBER_ROLE) nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.deadline, "Voting period ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed, "Proposal already executed");

        uint256 balance = token.balanceOf(msg.sender);
        require(balance > 0, "No voting power");

        proposal.hasVoted[msg.sender] = true;
        if (_support) {
            proposal.votesFor += balance;
        } else {
            proposal.votesAgainst += balance;
        }

        emit Voted(_proposalId, msg.sender, _support);
    }

    function executeProposal(uint256 _proposalId) external nonReentrant {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.deadline, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(
            proposal.votesFor + proposal.votesAgainst >= quorum,
            "Quorum not reached"
        );
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");

        proposal.executed = true;
        require(
            token.transfer(proposal.recipient, proposal.amount),
            "Transfer failed"
        );

        emit ProposalExecuted(_proposalId);
    }

    function addMember(address _member) external onlyRole(ADMIN_ROLE) {
        grantRole(MEMBER_ROLE, _member);
    }

    function removeMember(address _member) external onlyRole(ADMIN_ROLE) {
        revokeRole(MEMBER_ROLE, _member);
    }
} 