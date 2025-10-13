function loadNavbar() {
    const navbarDiv = document.getElementById('navbar');
    const user = JSON.parse(localStorage.getItem('user'));
    let html = `<div><a href="index.html">Home</a> <a href="products.html">Products</a></div><div>`;
    if (user) {
        html += `<span>Logged in as ${user.username}</span> <button onclick="logoutUser()">Sign Out</button>`;
    } else {
        html += `<a href="login.html">Login</a> <a href="signup.html">Sign Up</a>`;
    }
    html += `</div>`;
    navbarDiv.innerHTML = html;
}

function logoutUser() {
    localStorage.removeItem('user');
    fetch('http://127.0.0.1:5000/logout', { method: 'POST' });
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', loadNavbar);
