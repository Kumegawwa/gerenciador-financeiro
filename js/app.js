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

document.addEventListener('DOMContentLoaded', function() {

    if (document.getElementById('dashboard-grid')) {
        initDashboard();
    }
    if (document.getElementById('form-transacao')) {
        initTransacoesPage();
    }
});


function initTransacoesPage() {
    const form = document.getElementById('form-transacao');
    form.addEventListener('submit', handleTransacaoSubmit);
    renderTransacoesTable();
}

function renderTransacoesTable() {
    const tbody = document.getElementById('transacoes-tbody');
    tbody.innerHTML = ''; 

    db.transacoes.forEach(function(trans) {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${trans.descricao}</td>
            <td>R$ ${trans.valor.toFixed(2)}</td>
            <td>${trans.tipo}</td>
            <td class="actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-danger">Excluir</button>
            </td>
        `;

        tr.querySelector('.btn-danger').addEventListener('click', function() {
            handleDeleteTransacao(trans.id);
        });
        
        tr.querySelector('.btn-edit').addEventListener('click', function() {
            handleEditTransacao(trans);
        });

        tbody.appendChild(tr);
    });
}

function handleTransacaoSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('transacao-id').value;
    const descricao = document.getElementById('trans-descricao').value;
    const valor = parseFloat(document.getElementById('trans-valor').value);
    const tipo = document.getElementById('trans-tipo').value;

    if (id) {
        const index = db.transacoes.findIndex(t => t.id == id);
        if (index !== -1) {
            db.transacoes[index].descricao = descricao;
            db.transacoes[index].valor = valor;
            db.transacoes[index].tipo = tipo;
        }
    } else {
        const novaTransacao = {
            id: Date.now(),
            descricao: descricao,
            valor: valor,
            tipo: tipo
        };
        db.transacoes.push(novaTransacao);
    }

    saveDB();
    renderTransacoesTable();
    
    document.getElementById('form-transacao').reset();
    document.getElementById('transacao-id').value = '';
}

function handleEditTransacao(trans) {
    document.getElementById('transacao-id').value = trans.id;
    document.getElementById('trans-descricao').value = trans.descricao;
    document.getElementById('trans-valor').value = trans.valor;
    document.getElementById('trans-tipo').value = trans.tipo;
    window.scrollTo(0, 0);
}

function handleDeleteTransacao(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        const index = db.transacoes.findIndex(t => t.id === id);
        
        if (index !== -1) {
            db.transacoes.splice(index, 1);
            saveDB(); 
            renderTransacoesTable(); 
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    if (document.getElementById('form-transacao')) {
        initTransacoesPage();
    }
    if (document.getElementById('form-categoria')) {
        initCategoriasPage();
    }
});

function initCategoriasPage() {
    const form = document.getElementById('form-categoria');
    form.addEventListener('submit', handleCategoriaSubmit);
    renderCategoriasTable();
}

function renderCategoriasTable() {
    const tbody = document.getElementById('categorias-tbody');
    tbody.innerHTML = '';

    db.categorias.forEach(function(cat) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${cat.nome}</td>
            <td class="actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-danger">Excluir</button>
            </td>
        `;

        tr.querySelector('.btn-danger').addEventListener('click', function() {
            handleDeleteCategoria(cat.id);
        });
        
        tr.querySelector('.btn-edit').addEventListener('click', function() {
            handleEditCategoria(cat);
        });

        tbody.appendChild(tr);
    });
}

function handleCategoriaSubmit(event) {
    event.preventDefault();

    const id = document.getElementById('categoria-id').value;
    const nome = document.getElementById('cat-nome').value;

    if (id) {
        const index = db.categorias.findIndex(c => c.id == id);
        if (index !== -1) {
            db.categorias[index].nome = nome;
        }
    } else {
        db.categorias.push({
            id: Date.now(),
            nome: nome
        });
    }

    saveDB();
    renderCategoriasTable();
    document.getElementById('form-categoria').reset();
    document.getElementById('categoria-id').value = '';
}

function handleEditCategoria(cat) {
    document.getElementById('categoria-id').value = cat.id;
    document.getElementById('cat-nome').value = cat.nome;
    window.scrollTo(0, 0);
}

function handleDeleteCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        const index = db.categorias.findIndex(c => c.id === id);
        if (index !== -1) {
            db.categorias.splice(index, 1);
            saveDB();
            renderCategoriasTable();
        }
    }
}