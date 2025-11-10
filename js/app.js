let dados = {
    transacoes: [],
    categorias: [],
    metas: []
};

document.addEventListener('DOMContentLoaded', function() {
    
    if (document.getElementById('form-login')) {
        iniciarPaginaLogin();
    } else {
        verificarLogin();
        iniciarPaginaAdmin();
    }

    if (document.getElementById('form-transacao')) {
        iniciarPagTransacoes();
    }
    if (document.getElementById('form-categoria')) {
        iniciarPagCategorias();
    }
    if (document.getElementById('form-meta')) {
        iniciarPagMetas();
    }
});

function iniciarPaginaLogin() {
    const formLogin = document.getElementById('form-login');
    if (formLogin) { 
        formLogin.addEventListener('submit', fazerLogin);
    }
}

function fazerLogin(event) {
    event.preventDefault();

    const usuario = document.getElementById('username').value;
    const senha = document.getElementById('password').value;
    const msgErro = document.getElementById('login-error');

    if (usuario === 'admin' && senha === '1234') {
        localStorage.setItem('usuarioLogado', 'true');
        window.location.href = 'dashboard.html';
    } else {
        msgErro.textContent = 'Usuário ou senha inválidos.';
    }
}

function verificarLogin() {
    const usuarioLogado = localStorage.getItem('usuarioLogado');
    if (usuarioLogado !== 'true') {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'index.html';
        throw new Error('Usuário não autenticado');
    }
    
    carregarDados();
}

function iniciarPaginaAdmin() {
    const botaoSair = document.getElementById('btn-logout');
    if (botaoSair) {
        botaoSair.addEventListener('click', fazerLogout);
    }
}

function fazerLogout(event) {
    event.preventDefault();
    localStorage.removeItem('usuarioLogado');
    window.location.href = 'index.html';
}

function carregarDados() {
    const dadosJSON = localStorage.getItem('minhasFinancasDB');
    if (dadosJSON) {
        dados = JSON.parse(dadosJSON);
    }
}

function salvarDados() {
    localStorage.setItem('minhasFinancasDB', JSON.stringify(dados));
}

function iniciarPagTransacoes() {
    const formulario = document.getElementById('form-transacao');
    formulario.addEventListener('submit', salvarTransacao);
    
    carregarCategoriasDropdown();
    mostrarTabelaTransacoes();
}

function carregarCategoriasDropdown() {
    const selectCategoria = document.getElementById('trans-categoria');
    if (!selectCategoria) return;

    dados.categorias.forEach(function(cat) {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nome;
        selectCategoria.appendChild(option);
    });
}

function buscarNomeCategoria(id) {
    for (let i = 0; i < dados.categorias.length; i++) {
        if (dados.categorias[i].id == id) {
            return dados.categorias[i].nome;
        }
    }
    return "Sem Categoria";
}

function mostrarTabelaTransacoes() {
    const corpoTabela = document.getElementById('transacoes-tbody');
    if (!corpoTabela) return; 
    corpoTabela.innerHTML = ''; 

    dados.transacoes.forEach(function(trans) {
        const novaLinha = document.createElement('tr'); 
        const nomeCategoria = buscarNomeCategoria(trans.categoriaId);

        novaLinha.innerHTML = `
            <td>${trans.descricao}</td>
            <td>R$ ${trans.valor.toFixed(2)}</td>
            <td>${trans.tipo}</td>
            <td>${nomeCategoria}</td>
            <td class="actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-danger">Excluir</button>
            </td>
        `;

        novaLinha.querySelector('.btn-danger').addEventListener('click', function() {
            deletarTransacao(trans.id);
        });
        
        novaLinha.querySelector('.btn-edit').addEventListener('click', function() {
            prepararEdicaoTransacao(trans);
        });

        corpoTabela.appendChild(novaLinha);
    });
}

function salvarTransacao(event) {
    event.preventDefault();

    const id = document.getElementById('transacao-id').value;
    const descricao = document.getElementById('trans-descricao').value;
    const valor = parseFloat(document.getElementById('trans-valor').value);
    const tipo = document.getElementById('trans-tipo').value;
    const categoriaId = document.getElementById('trans-categoria').value;

    if (!descricao || isNaN(valor) || !categoriaId) {
        alert('Por favor, preencha todos os campos, incluindo a categoria.');
        return;
    }

    if (id) {
        let indice = -1;
        for (let i = 0; i < dados.transacoes.length; i++) {
            if (dados.transacoes[i].id == id) {
                indice = i;
                break;
            }
        }

        if (indice !== -1) {
            dados.transacoes[indice].descricao = descricao;
            dados.transacoes[indice].valor = valor;
            dados.transacoes[indice].tipo = tipo;
            dados.transacoes[indice].categoriaId = categoriaId;
        }
    } else {
        const novaTrans = {
            id: Date.now(),
            descricao: descricao,
            valor: valor,
            tipo: tipo,
            categoriaId: categoriaId
        };
        dados.transacoes.push(novaTrans);
    }

    salvarDados();
    mostrarTabelaTransacoes();
    
    document.getElementById('form-transacao').reset();
    document.getElementById('transacao-id').value = '';
}

function prepararEdicaoTransacao(trans) {
    document.getElementById('transacao-id').value = trans.id;
    document.getElementById('trans-descricao').value = trans.descricao;
    document.getElementById('trans-valor').value = trans.valor;
    document.getElementById('trans-tipo').value = trans.tipo;
    document.getElementById('trans-categoria').value = trans.categoriaId;
    window.scrollTo(0, 0); 
}

function deletarTransacao(id) {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
        
        let indice = -1;
        for (let i = 0; i < dados.transacoes.length; i++) {
            if (dados.transacoes[i].id == id) {
                indice = i;
                break;
            }
        }
        
        if (indice !== -1) {
            dados.transacoes.splice(indice, 1);
            salvarDados();
            mostrarTabelaTransacoes();
        }
    }
}

function iniciarPagCategorias() {
    const formulario = document.getElementById('form-categoria');
    formulario.addEventListener('submit', salvarCategoria);
    mostrarTabelaCategorias();
}

function mostrarTabelaCategorias() {
    const corpoTabela = document.getElementById('categorias-tbody');
    if (!corpoTabela) return;
    corpoTabela.innerHTML = '';

    dados.categorias.forEach(function(cat) {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${cat.nome}</td>
            <td class="actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-danger">Excluir</button>
            </td>
        `;

        novaLinha.querySelector('.btn-danger').addEventListener('click', function() {
            deletarCategoria(cat.id);
        });
        
        novaLinha.querySelector('.btn-edit').addEventListener('click', function() {
            prepararEdicaoCategoria(cat);
        });

        corpoTabela.appendChild(novaLinha);
    });
}

function salvarCategoria(event) {
    event.preventDefault();

    const id = document.getElementById('categoria-id').value;
    const nome = document.getElementById('cat-nome').value;

    if (!nome) {
        alert('O nome da categoria não pode estar vazio.');
        return;
    }

    if (id) {
        let indice = -1;
        for (let i = 0; i < dados.categorias.length; i++) {
            if (dados.categorias[i].id == id) {
                indice = i;
                break;
            }
        }
        
        if (indice !== -1) {
            dados.categorias[indice].nome = nome;
        }
    } else {
        dados.categorias.push({
            id: Date.now(),
            nome: nome
        });
    }

    salvarDados();
    mostrarTabelaCategorias();
    document.getElementById('form-categoria').reset();
    document.getElementById('categoria-id').value = '';
}

function prepararEdicaoCategoria(cat) {
    document.getElementById('categoria-id').value = cat.id;
    document.getElementById('cat-nome').value = cat.nome;
    window.scrollTo(0, 0);
}

function deletarCategoria(id) {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
        let indice = -1;
        for (let i = 0; i < dados.categorias.length; i++) {
            if (dados.categorias[i].id == id) {
                indice = i;
                break;
            }
        }
        
        if (indice !== -1) {
            dados.categorias.splice(indice, 1); 
            salvarDados();
            mostrarTabelaCategorias();
        }
    }
}

function iniciarPagMetas() {
    const formulario = document.getElementById('form-meta');
    formulario.addEventListener('submit', salvarMeta);
    mostrarTabelaMetas();
}

function mostrarTabelaMetas() {
    const corpoTabela = document.getElementById('metas-tbody');
    if (!corpoTabela) return;
    corpoTabela.innerHTML = '';

    dados.metas.forEach(function(meta) {
        const novaLinha = document.createElement('tr'); 
        const progresso = (meta.valorAlvo > 0) ? (meta.valorAtual / meta.valorAlvo) * 100 : 0;

        novaLinha.innerHTML = `
            <td>${meta.descricao}</td>
            <td>R$ ${meta.valorAlvo.toFixed(2)}</td>
            <td>R$ ${meta.valorAtual.toFixed(2)}</td>
            <td>${progresso.toFixed(0)}%</td>
            <td class="actions">
                <button class="btn-edit">Editar</button>
                <button class="btn-danger">Excluir</button>
            </td>
        `;

        novaLinha.querySelector('.btn-danger').addEventListener('click', function() {
            deletarMeta(meta.id);
        });
        
        novaLinha.querySelector('.btn-edit').addEventListener('click', function() {
            prepararEdicaoMeta(meta);
        });

        corpoTabela.appendChild(novaLinha); 
    });
}

function prepararEdicaoMeta(meta) {
    document.getElementById('meta-id').value = meta.id;
    document.getElementById('meta-descricao').value = meta.descricao;
    document.getElementById('meta-alvo').value = meta.valorAlvo;
    document.getElementById('meta-atual').value = meta.valorAtual;
    window.scrollTo(0, 0);
}


function salvarMeta(event) {
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
        let indice = -1;
        for (let i = 0; i < dados.metas.length; i++) {
            if (dados.metas[i].id == id) {
                indice = i;
                break;
            }
        }
        
        if (indice !== -1) {
            dados.metas[indice].descricao = descricao;
            dados.metas[indice].valorAlvo = valorAlvo;
            dados.metas[indice].valorAtual = valorAtual;
        }
    } else {
        dados.metas.push({
            id: Date.now(),
            descricao: descricao,
            valorAlvo: valorAlvo,
            valorAtual: valorAtual
        }); 
    }

    salvarDados(); 
    mostrarTabelaMetas();
    document.getElementById('form-meta').reset();
    document.getElementById('meta-id').value = '';
}

function deletarMeta(id) {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
        let indice = -1;
        for (let i = 0; i < dados.metas.length; i++) {
            if (dados.metas[i].id == id) {
                indice = i;
                break;
            }
        }
        
        if (indice !== -1) {
            dados.metas.splice(indice, 1); 
            salvarDados();
            mostrarTabelaMetas();
        }
    }
}