// ABI del contrato OpenBudgetDAO (recortado para ejemplo, usa el ABI completo en producción)
const openBudgetDaoAbi = [
  {"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_votingPeriod","type":"uint256"},{"internalType":"uint256","name":"_quorum","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"ProposalCreated","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"}],"name":"ProposalExecuted","type":"event"},
  {"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposalId","type":"uint256"},{"indexed":true,"internalType":"address","name":"voter","type":"address"},{"indexed":false,"internalType":"bool","name":"support","type":"bool"}],"name":"Voted","type":"event"},
  {"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_recipient","type":"address"}],"name":"createProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"},{"internalType":"bool","name":"_support","type":"bool"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"_proposalId","type":"uint256"}],"name":"executeProposal","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"proposalCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"votesFor","type":"uint256"},{"internalType":"uint256","name":"votesAgainst","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"bool","name":"executed","type":"bool"}],"stateMutability":"view","type":"function"}
];

const openBudgetDaoAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let openBudgetDaoContract;
let currentWallet = null;
let web3 = null;
let projects = [];

// Variables para la votación cuadrática
let userVotes = {};
let totalPoints = 100;
let votingEndTime = new Date();
votingEndTime.setDate(votingEndTime.getDate() + 2); // La votación termina en 2 días
let resultsChart = null;

// Inicializar Web3 y el contrato
async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        openBudgetDaoContract = new web3.eth.Contract(openBudgetDaoAbi, openBudgetDaoAddress);
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
            currentWallet = accounts[0];
        }
        return true;
    } else {
        alert('Por favor instala MetaMask');
        return false;
    }
}

// Crear propuesta en la blockchain
async function createProposal(title, description, amount, recipient) {
    if (!openBudgetDaoContract || !currentWallet) return;
    try {
        await openBudgetDaoContract.methods.createProposal(title, description, amount, recipient).send({ from: currentWallet });
        alert('Propuesta creada exitosamente');
        await loadProposalsFromBlockchain();
    } catch (error) {
        alert('Error al crear propuesta: ' + error.message);
    }
}

// Votar por una propuesta
async function voteProposal(proposalId, support) {
    if (!openBudgetDaoContract || !currentWallet) return;
    try {
        await openBudgetDaoContract.methods.vote(proposalId, support).send({ from: currentWallet });
        alert('Voto registrado');
        await loadProposalsFromBlockchain();
    } catch (error) {
        alert('Error al votar: ' + error.message);
    }
}

// Ejecutar propuesta aprobada
async function executeProposal(proposalId) {
    if (!openBudgetDaoContract || !currentWallet) return;
    try {
        await openBudgetDaoContract.methods.executeProposal(proposalId).send({ from: currentWallet });
        alert('Propuesta ejecutada');
        await loadProposalsFromBlockchain();
    } catch (error) {
        alert('Error al ejecutar propuesta: ' + error.message);
    }
}

// Cargar propuestas desde la blockchain
async function loadProposalsFromBlockchain() {
    if (!openBudgetDaoContract) return;
    const count = await openBudgetDaoContract.methods.proposalCount().call();
    projects = [];
    for (let i = 1; i <= count; i++) {
        const p = await openBudgetDaoContract.methods.proposals(i).call();
        projects.push({
            id: p.id,
            title: p.title,
            description: p.description,
            budget: web3.utils.fromWei(p.amount, 'ether'),
            status: p.executed ? 'approved' : (Date.now()/1000 > p.deadline ? 'rejected' : 'pending'),
            votes: Number(p.votesFor),
            recipient: p.recipient,
            deadline: p.deadline
        });
    }
    if (typeof renderProposals === 'function') renderProposals();
}

window.createProposal = createProposal;
window.voteProposal = voteProposal;
window.executeProposal = executeProposal;
window.loadProposalsFromBlockchain = loadProposalsFromBlockchain;
window.initWeb3 = initWeb3;

// Actualizar UI de wallet
function updateWalletUI() {
    const walletStatus = document.getElementById('walletStatus');
    if (currentWallet) {
        const shortAddress = `${currentWallet.slice(0, 6)}...${currentWallet.slice(-4)}`;
        walletStatus.textContent = `Wallet conectada: ${shortAddress}`;
        walletStatus.classList.add('connected');
    } else {
        walletStatus.textContent = 'Wallet no conectada';
        walletStatus.classList.remove('connected');
    }
}

// Cargar proyectos
function loadProjects() {
    const votingOptions = document.getElementById('votingOptions');
    votingOptions.innerHTML = '';

    projects.forEach(project => {
        const option = document.createElement('div');
        option.className = 'voting-option';
        option.dataset.projectId = project.id;
        option.innerHTML = `
            <div class="points-cost">Costo: 0 puntos</div>
            <h3>${project.title}</h3>
            <div class="budget">Presupuesto: $${project.budget.toLocaleString()} MXN</div>
            <div class="status status-${project.status}">${getStatusText(project.status)}</div>
            <p>${project.description}</p>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${project.votes}%"></div>
            </div>
            <div class="progress-text">${project.votes}% de votos a favor</div>
            <div class="voting-controls">
                <input type="number" class="vote-input" min="0" max="100" value="0" data-project-id="${project.id}">
                <button class="vote-button" onclick="submitVote(${project.id})">${project.status === 'approved' ? 'Ver Resultados' : 'Votar'}</button>
            </div>
        `;
        votingOptions.appendChild(option);
    });

    // Agregar event listeners para actualizar costos
    document.querySelectorAll('.vote-input').forEach(input => {
        input.addEventListener('input', () => {
            updatePointsCost(input.dataset.projectId);
        });
    });
}

// Obtener texto de estado
function getStatusText(status) {
    switch (status) {
        case 'pending': return 'En Votación';
        case 'approved': return 'Aprobado';
        case 'rejected': return 'Rechazado';
        default: return status;
    }
}

// Actualizar costo de puntos
function updatePointsCost(projectId) {
    const input = document.querySelector(`input[data-project-id="${projectId}"]`);
    const votes = parseInt(input.value) || 0;
    const cost = votes * votes;
    
    const option = document.querySelector(`.voting-option[data-project-id="${projectId}"]`);
    const costDisplay = option.querySelector('.points-cost');
    costDisplay.textContent = `Costo: ${cost} puntos`;

    if (votes > 0) {
        option.classList.add('selected');
    } else {
        option.classList.remove('selected');
    }
}

// Enviar voto
async function submitVote(projectId) {
    if (!currentWallet) {
        alert('Por favor conecta tu wallet primero');
        return;
    }

    const input = document.querySelector(`input[data-project-id="${projectId}"]`);
    const votes = parseInt(input.value);

    if (isNaN(votes) || votes < 0) {
        alert('Por favor ingresa un número válido de votos');
        return;
    }

    const cost = votes * votes;
    const currentTotal = Object.values(userVotes).reduce((sum, v) => sum + (v * v), 0);
    const newTotal = currentTotal - (userVotes[projectId] || 0) * (userVotes[projectId] || 0) + cost;

    if (newTotal > totalPoints) {
        alert(`No tienes suficientes puntos disponibles. Costo: ${cost}, Disponible: ${totalPoints - currentTotal}`);
        return;
    }

    try {
        // Aquí iría la llamada al contrato inteligente
        // Por ahora simulamos la votación
        const project = projects.find(p => p.id === projectId);
        if (project) {
            project.votes = Math.min(project.votes + votes, 100);
        }

        userVotes[projectId] = votes;
        updateVotingUI();
        updateResultsChart();
        
        // Mostrar confirmación
        showVoteConfirmation(projectId, votes, cost);
    } catch (error) {
        console.error('Error al votar:', error);
        alert('Error al procesar tu voto');
    }
}

// Mostrar confirmación de voto
function showVoteConfirmation(projectId, votes, cost) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>¡Voto Registrado!</h2>
            <p>Has votado por "${project.title}"</p>
            <div class="vote-details">
                <p><strong>Votos asignados:</strong> ${votes}</p>
                <p><strong>Costo en puntos:</strong> ${cost}</p>
                <p><strong>Nuevo total de votos:</strong> ${project.votes}%</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
        </div>
    `;
    document.body.appendChild(modal);
}

// Actualizar UI de votación
function updateVotingUI() {
    // Actualizar los inputs y costos
    Object.entries(userVotes).forEach(([projectId, votes]) => {
        const input = document.querySelector(`input[data-project-id="${projectId}"]`);
        if (input) {
            input.value = votes;
            updatePointsCost(projectId);
        }
    });

    // Actualizar el total de puntos usados
    const totalUsed = Object.values(userVotes).reduce((sum, v) => sum + (v * v), 0);
    const pointsRemaining = totalPoints - totalUsed;
    
    // Actualizar displays
    document.getElementById('points-remaining').textContent = pointsRemaining;
    document.getElementById('summary-used').textContent = totalUsed;
    document.getElementById('summary-remaining').textContent = pointsRemaining;

    // Actualizar barras de progreso
    projects.forEach(project => {
        const progressFill = document.querySelector(`.voting-option[data-project-id="${project.id}"] .progress-fill`);
        if (progressFill) {
            progressFill.style.width = `${project.votes}%`;
        }
        const progressText = document.querySelector(`.voting-option[data-project-id="${project.id}"] .progress-text`);
        if (progressText) {
            progressText.textContent = `${project.votes}% de votos a favor`;
        }
    });
}

// Actualizar gráfico de resultados
function updateResultsChart() {
    const ctx = document.getElementById('resultsChart');
    if (!ctx) return;

    if (resultsChart) {
        resultsChart.destroy();
    }

    resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: projects.map(p => p.title),
            datasets: [{
                label: 'Votos a favor (%)',
                data: projects.map(p => p.votes),
                backgroundColor: [
                    'rgba(47, 128, 237, 0.8)',
                    'rgba(39, 174, 96, 0.8)',
                    'rgba(242, 201, 76, 0.8)'
                ],
                borderColor: [
                    'rgba(47, 128, 237, 1)',
                    'rgba(39, 174, 96, 1)',
                    'rgba(242, 201, 76, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: 'Porcentaje de votos'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// Actualizar temporizador
function updateVotingTimer() {
    const timerElement = document.getElementById('votingTimer');
    if (!timerElement) return;

    const now = new Date();
    const timeLeft = votingEndTime - now;

    if (timeLeft <= 0) {
        timerElement.textContent = 'Votación finalizada';
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    timerElement.textContent = `Tiempo restante: ${days} días ${hours} horas`;
}

// Funciones de filtrado de proyectos
function filterProjects(status) {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        const projectStatus = card.querySelector('.project-status').classList[1];
        if (status === 'all' || projectStatus.includes(status)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Funciones de visualización de detalles
function showProjectDetails(projectId) {
    const project = projects.find(p => p.id === projectId);
    if (project) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${project.title}</h2>
                <p>${project.description}</p>
                <h3>Hitos</h3>
                <ul>
                    ${project.milestones.map(m => `
                        <li class="${m.completed ? 'completed' : ''}">
                            ${m.name} - $${m.amount.toLocaleString()} MXN
                        </li>
                    `).join('')}
                </ul>
                <button onclick="this.parentElement.parentElement.remove()">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async function() {
    await initWeb3(); // <-- Esto asegura que web3 esté listo antes de cualquier acción

    // Conectar wallet
    const walletStatus = document.getElementById('walletStatus');
    walletStatus.addEventListener('click', connectWallet);

    // Filtros de proyectos
    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const status = button.textContent.toLowerCase().replace(' ', '');
            filterProjects(status);
        });
    });

    // Botones de votación
    document.querySelectorAll('.vote-button').forEach(button => {
        button.addEventListener('click', () => {
            const projectId = parseInt(button.closest('.project-card').dataset.projectId);
            voteForProject(projectId, true);
        });
    });

    // Botones de detalles
    document.querySelectorAll('.details-button').forEach(button => {
        button.addEventListener('click', () => {
            const projectId = parseInt(button.closest('.project-card').dataset.projectId);
            showProjectDetails(projectId);
        });
    });

    // Actualizar temporizador cada minuto
    setInterval(updateVotingTimer, 60000);
    updateVotingTimer();

    // Inicializar gráfico
    updateResultsChart();

    const proposalForm = document.getElementById('proposalForm');
    if (proposalForm) {
        proposalForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!web3) {
                await initWeb3();
            }
            const title = document.getElementById('proposalTitle').value;
            const description = document.getElementById('proposalDescription').value;
            const amount = web3.utils.toWei(document.getElementById('proposalAmount').value, 'ether');
            const recipient = document.getElementById('proposalRecipient').value;
            await createProposal(title, description, amount, recipient);
            proposalForm.reset();
        });
    }
}); 