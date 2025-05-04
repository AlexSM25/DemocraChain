// Dirección del contrato desplegado localmente
const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Dirección del contrato desplegado en Hardhat local

// ABI del contrato (se obtiene de Remix después de compilar)
const contractABI = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "budget",
          "type": "uint256"
        }
      ],
      "name": "ProjectCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "enum OpenBudgetDAO.Status",
          "name": "newStatus",
          "type": "uint8"
        }
      ],
      "name": "ProjectStatusChanged",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "voter",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "points",
          "type": "uint256"
        }
      ],
      "name": "VoteCast",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "ADMIN_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "TOTAL_POINTS",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "VOTER_ROLE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "VOTING_DURATION",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_points",
          "type": "uint256"
        }
      ],
      "name": "castVote",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_budget",
          "type": "uint256"
        }
      ],
      "name": "createProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "finalizeVoting",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_projectId",
          "type": "uint256"
        }
      ],
      "name": "getProject",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "budget",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "votes",
          "type": "uint256"
        },
        {
          "internalType": "enum OpenBudgetDAO.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProjects",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "budget",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "votes",
              "type": "uint256"
            },
            {
              "internalType": "enum OpenBudgetDAO.Status",
              "name": "status",
              "type": "uint8"
            },
            {
              "internalType": "uint256",
              "name": "startTime",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endTime",
              "type": "uint256"
            }
          ],
          "internalType": "struct OpenBudgetDAO.Project[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getVoteHistory",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "projectId",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "points",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "voter",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct OpenBudgetDAO.Vote[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        }
      ],
      "name": "grantVoterRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "projects",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "budget",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "votes",
          "type": "uint256"
        },
        {
          "internalType": "enum OpenBudgetDAO.Status",
          "name": "status",
          "type": "uint8"
        },
        {
          "internalType": "uint256",
          "name": "startTime",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "pointsUsed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_voter",
          "type": "address"
        }
      ],
      "name": "revokeVoterRole",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "votes",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];

let contract;
let web3;

async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // Solicitar conexión de cuenta
            const accounts = await window.ethereum.request({ 
                method: 'eth_requestAccounts' 
            });
            
            // Verificar si estamos en la red correcta (Hardhat local)
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== '0x7a69') { // 31337 en hexadecimal
                try {
                    await window.ethereum.request({
                        method: 'wallet_switchEthereumChain',
                        params: [{ chainId: '0x7a69' }],
                    });
                } catch (switchError) {
                    // Si la red no existe en MetaMask, la agregamos
                    if (switchError.code === 4902) {
                        await window.ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [{
                                chainId: '0x7a69',
                                chainName: 'Hardhat Local',
                                rpcUrls: ['http://127.0.0.1:8545'],
                                nativeCurrency: {
                                    name: 'ETH',
                                    symbol: 'ETH',
                                    decimals: 18
                                }
                            }],
                        });
                    }
                }
            }
            
            // Crear instancia de Web3
            web3 = new Web3(window.ethereum);
            
            // Crear instancia del contrato
            contract = new web3.eth.Contract(contractABI, contractAddress);
            
            // Actualizar UI
            updateWalletStatus();
            loadProjects();
            
            // Escuchar cambios de cuenta
            window.ethereum.on('accountsChanged', (accounts) => {
                updateWalletStatus();
                loadProjects();
            });
            
            // Escuchar cambios de red
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
            
            return true;
        } catch (error) {
            console.error('Error al inicializar Web3:', error);
            alert('Error al conectar con MetaMask: ' + error.message);
            return false;
        }
    } else {
        alert('Por favor instala MetaMask para usar esta aplicación');
        return false;
    }
}

async function updateWalletStatus() {
    const accounts = await web3.eth.getAccounts();
    const walletAddress = accounts[0];
    document.getElementById('wallet-status').textContent = 
        walletAddress ? 
        `Conectado: ${walletAddress.substring(0, 6)}...${walletAddress.substring(38)}` : 
        'No conectado';
}

async function loadProjects() {
    try {
        const projects = await contract.methods.getProjects().call();
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = '';

        projects.forEach(project => {
            const card = createProjectCard(project);
            projectsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
    }
}

function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    const status = ['Pendiente', 'Aprobado', 'Rechazado'][project.status];
    const endTime = new Date(project.endTime * 1000).toLocaleString();
    
    card.innerHTML = `
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <p>Presupuesto: ${web3.utils.fromWei(project.budget.toString(), 'ether')} ETH</p>
        <p>Votos: ${project.votes}</p>
        <p>Estado: ${status}</p>
        <p>Fin de votación: ${endTime}</p>
        <div class="voting-controls">
            <input type="number" min="0" max="10" value="0" id="vote-input-${project.id}">
            <button onclick="castVote(${project.id})">Votar</button>
        </div>
    `;
    
    return card;
}

async function castVote(projectId) {
    try {
        const points = document.getElementById(`vote-input-${projectId}`).value;
        const accounts = await web3.eth.getAccounts();
        
        await contract.methods.castVote(projectId, points).send({
            from: accounts[0]
        });
        
        // Recargar proyectos después de votar
        await loadProjects();
    } catch (error) {
        console.error('Error al votar:', error);
        alert('Error al votar: ' + error.message);
    }
}

// Inicializar Web3 cuando se carga la página
window.addEventListener('load', initWeb3); 