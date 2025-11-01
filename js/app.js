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
    if (document.getElementById('form-transacao')) {
        initTransacoesPage();
    }
    if (document.getElementById('form-categoria')) {
        initCategoriasPage();
    }
    if (document.getElementById('form-meta')) {
        initMetasPage();
    }
});

function initLoginPage() {
    const loginForm = document.getElementById('form-login');
    if (loginForm) { 
        loginForm.addEventListener('submit', handleLogin);
    }
}

function handleLogin(event) {
    event.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    const errorMsg = document.getElementById('login-error');

    // Simulação de login 
    // A senha é "1234"
    if (user === 'admin' && pass === '1234') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'dashboard.html';
    } else {
        errorMsg.textContent = 'Usuário ou senha inválidos.';
    }
}

function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'index.html';
        throw new Error('Usuário não autenticado');
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
    console.log("1. loadDB foi chamado. Dados do localStorage:", dbJSON);
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
    if (!tbody) return;
    tbody.innerHTML = '';

    db.metas.forEach(function(meta) {
        const tr = document.createElement('tr');
        
        const progresso = (meta.valorAlvo > 0) ? (meta.valorAtual / meta.valorAlvo) * 100 : 0;

        tr.innerHTML = `
            <td>${meta.descricao}</td>
            <td>${progresso.toFixed(0)}% (R$ ${meta.valorAtual} de R$ ${meta.valorAlvo})</td>
        `;
        
        tbody.appendChild(tr);
    });
}

function calculateSummary() {
    console.log("2. calculateSummary foi chamado. Transações no DB:", db.transacoes);
    let totalReceitas = 0;
    let totalDespesas = 0;

    db.transacoes.forEach(function(trans) {
        const valor = parseFloat(trans.valor) || 0; 
        if (trans.tipo === 'receita') {
            totalReceitas += valor;
        } else {
            totalDespesas += valor;
        }
    });

    const saldoAtual = totalReceitas - totalDespesas;

    document.getElementById('saldo-atual').textContent = `R$ ${saldoAtual.toFixed(2)}`;
    document.getElementById('total-receitas').textContent = `R$ ${totalReceitas.toFixed(2)}`;
    document.getElementById('total-despesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
}

function initTransacoesPage() {
    const form = document.getElementById('form-transacao');
    form.addEventListener('submit', handleTransacaoSubmit);
    renderTransacoesTable();
}

function renderTransacoesTable() {
    const tbody = document.getElementById('transacoes-tbody');
    if (!tbody) return; 
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

    if (!descricao || isNaN(valor)) {
        alert('Por favor, preencha a descrição e um valor válido.');
        return;
    }

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


function initCategoriasPage() {
    const form = document.getElementById('form-categoria');
    form.addEventListener('submit', handleCategoriaSubmit);
    renderCategoriasTable();
}

function renderCategoriasTable() {
    const tbody = document.getElementById('categorias-tbody');
    if (!tbody) return;
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

    if (!nome) {
        alert('O nome da categoria não pode estar vazio.');
        return;
    }

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


function initMetasPage() {
    const form = document.getElementById('form-meta');
    form.addEventListener('submit', handleMetaSubmit);
    renderMetasTable();
}

function renderMetasTable() {
    const tbody = document.getElementById('metas-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    db.metas.forEach(function(meta) {
        const tr = document.createElement('tr'); 
        const progresso = (meta.valorAlvo > 0) ? (meta.valorAtual / meta.valorAlvo) * 100 : 0;

        tr.innerHTML = `
            <td>${meta.descricao}</td>
            <td>R$ ${meta.valorAlvo.toFixed(2)}</td>
            <td>R$ ${meta.valorAtual.toFixed(2)}</td>
            <td>${progresso.toFixed(0)}%</td>
            <td class="actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-danger">Excluir</button>
            </td>
        `;

        tr.querySelector('.btn-danger').addEventListener('click', function() {
            handleDeleteMeta(meta.id);
        });
        
        tr.querySelector('.btn-edit').addEventListener('click', function() {
            handleEditMeta(meta);
        });

        tbody.appendChild(tr); 
    });
}

function handleMetaSubmit(event) {
    event.preventDefault(); 

    const id = document.getElementById('meta-id').value;
    const descricao = document.getElementById('meta-descricao').value;
    const valorAlvo = parseFloat(document.getElementById('meta-alvo').value);
    const valorAtual = parseFloat(document.getElementById('meta-atual').value);

    if (!descricao || isNaN(valorAlvo) || isNaN(valorAtual)) {
        alert('Por favor, preencha a descrição e valores válidos.');
        return;
    }

    if (id) {
        const index = db.metas.findIndex(m => m.id == id);
        if (index !== -1) {
            db.metas[index].descricao = descricao;
            db.metas[index].valorAlvo = valorAlvo;
            db.metas[index].valorAtual = valorAtual;
        }
    } else {
        db.metas.push({
            id: Date.now(),
            descricao: descricao,
            valorAlvo: valorAlvo,
            valorAtual: valorAtual
        }); 
    }

    saveDB(); 
    renderMetasTable();
    document.getElementById('form-meta').reset();
    document.getElementById('meta-id').value = '';
}

function handleEditMeta(meta) {
    document.getElementById('meta-id').value = meta.id;
    document.getElementById('meta-descricao').value = meta.descricao;
    document.getElementById('meta-alvo').value = meta.valorAlvo;
    document.getElementById('meta-atual').value = meta.valorAtual;
    window.scrollTo(0, 0);
}

function handleDeleteMeta(id) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
        const index = db.metas.findIndex(m => m.id === id);
        if (index !== -1) {
            db.metas.splice(index, 1); 
            saveDB();
            renderMetasTable();
        }
    }
}