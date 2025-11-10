# 💸 Minhas Finanças - Gerenciador Financeiro Pessoal

![Status](https://img.shields.io/badge/status-concluído-brightgreen)
![Tecnologia](https://img.shields.io/badge/tecnologia-JS%20puro-yellow)
![Licença](https://img.shields.io/badge/licença-MIT-blue)

Este é um projeto de um Gerenciador Financeiro Pessoal completo, criado como trabalho final para a disciplina de **Desenvolvimento Web Básico**.

A aplicação é 100% front-end, escrita em **HTML, CSS e JavaScript puro (Vanilla JS)**, sem o uso de frameworks ou bibliotecas. Todos os dados são persistidos localmente no navegador do usuário utilizando `LocalStorage`.

![Banner do Dashboard](assets/print-banner-dashboard.png)

## ✨ Funcionalidades Principais

O projeto cumpre todos os requisitos obrigatórios da disciplina, implementando um sistema de gestão completo:

* **🔐 Autenticação:** Sistema de login simulado (`admin`/`1234`) para proteger a área administrativa, usando `localStorage` para gerenciar a sessão.
* **🔁 CRUD de Transações:** Funcionalidade completa para Criar, Ler, Editar e Excluir (CRUD) transações financeiras.
* **🏷️ CRUD de Categorias:** Gerenciamento total de categorias para organizar as transações.
* **🎯 CRUD de Metas:** Definição e acompanhamento de metas de economia.
* **💾 Persistência Local:** Todos os dados (transações, categorias, metas) são salvos e carregados do `LocalStorage` do navegador, usando `JSON.stringify` e `JSON.parse`.
* **📱 Design Responsivo:** O layout utiliza **Flexbox** (para navegação) e **Grid** (para o dashboard), se adaptando a dispositivos móveis com `@media` queries.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído do zero utilizando apenas as tecnologias-base da web, conforme ensinado em aula:

* **HTML5:** Estruturação semântica.
* **CSS3:** Estilização, layout com Flexbox e Grid.
* **JavaScript (ES6+):** Manipulação do DOM (`createElement`, `appendChild`, `removeChild`), eventos (`addEventListener`), lógica de CRUD (Arrays, `forEach`, `splice`) e persistência com `LocalStorage`.

## 🛠️ Como Executar o Projeto

Este é um projeto 100% estático (front-end). Nenhuma instalação é necessária.

1.  Clone este repositório:
    ```bash
    git clone [https://github.com/Kumegawwa/gerenciador-financeiro.git](https://github.com/Kumegawwa/gerenciador-financeiro.git)
    ```
2.  Navegue até a pasta do projeto:
    ```bash
    cd gerenciador-financeiro
    ```
3.  Abra o arquivo `index.html` no seu navegador de preferência.

### 🔑 Credenciais de Acesso

Para acessar a área administrativa (dashboard), utilize as seguintes credenciais:

* **Usuário:** `admin`
* **Senha:** `1234`

*(Credenciais definidas em `js/app.js`)*

## 🎓 Contexto do Projeto

Este trabalho foi desenvolvido como avaliação final para a disciplina de Desenvolvimento Web Básico. O objetivo era aplicar de forma prática todos os conceitos de HTML semântico, CSS com layouts modernos (Flex/Grid) e manipulação de dados com JavaScript puro e LocalStorage, conforme os requisitos definidos no documento da disciplina.

---

**Autor:**

* Lucas Kumegawa