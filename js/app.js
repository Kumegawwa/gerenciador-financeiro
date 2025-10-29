document.addEventListener('DOMContentLoaded', function() {
    
    if (document.getElementById('form-login')) {
        initLoginPage();
    }
});


function initLoginPage() {
    const loginForm = document.getElementById('form-login');
    loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(event) {

    event.preventDefault(); 

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    // senha é "1234"
    if (user === 'admin' && pass === '1234') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        errorMsg.textContent = 'Usuário ou senha inválidos.';
    }
}

let db = {
    transacoes: [],
    categorias: [],
    metas: []
};

document.addEventListener('DOMContentLoaded', function() {
    
    if (document.getElementById('form-login')) {
        initLoginPage();
    } else {
        checkAuth();
        initAdminPage();
    }

    if (document.getElementById('dashboard-grid')) {
        initDashboard();
    }
});


function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'index.html';
    }
    
    loadDB();
}

function initAdminPage() {
    const btnLogout = document.getElementById('btn-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }
}

function handleLogout(event) {
    event.preventDefault();
    localStorage.removeItem('isLoggedIn');
    window.location.href = 'index.html';
}

function loadDB() {
    const dbJSON = localStorage.getItem('minhasFinancasDB');
    if (dbJSON) {
        db = JSON.parse(dbJSON);
    }
}

function saveDB() {
    localStorage.setItem('minhasFinancasDB', JSON.stringify(db));
}

function initDashboard() {
    renderDashboardMetas();
    calculateSummary();
}

function renderDashboardMetas() {
    const tbody = document.getElementById('metas-dashboard-tbody');
    tbody.innerHTML = '';

    db.metas.forEach(function(meta) {
        const tr = document.createElement('tr');
        
        const progresso = (meta.valorAtual / meta.valorAlvo) * 100;

        tr.innerHTML = `
            <td>${meta.descricao}</td>
            <td>${progresso.toFixed(0)}% (R$ ${meta.valorAtual} de R$ ${meta.valorAlvo})</td>
        `;
        
        tbody.appendChild(tr);
    });
}

function calculateSummary() {
    let totalReceitas = 0;
    let totalDespesas = 0;

    db.transacoes.forEach(function(trans) {
        if (trans.tipo === 'receita') {
            totalReceitas += trans.valor;
        } else {
            totalDespesas += trans.valor;
        }
    });

    const saldoAtual = totalReceitas - totalDespesas;

    document.getElementById('saldo-atual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
    document.getElementById('total-receitas').textContent = `R$ ${totalReceitas.toFixed(2)}`;
    document.getElementById('total-despesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
}