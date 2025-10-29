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