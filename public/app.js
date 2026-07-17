function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('opc_user'));
  } catch {
    return null;
  }
}

function storeSession(token, user) {
  localStorage.setItem('opc_token', token);
  localStorage.setItem('opc_user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem('opc_token');
  localStorage.removeItem('opc_user');
}

function renderHeaderAuth() {
  const container = document.getElementById('auth-buttons');
  if (!container) return;

  const user = getStoredUser();
  if (user) {
    container.innerHTML = `
      <span class="greeting">Hi, ${user.name}</span>
      <button class="btn btn-login" id="logout-btn">Log Out</button>
    `;
    document.getElementById('logout-btn').addEventListener('click', () => {
      clearSession();
      window.location.reload();
    });
  } else {
    container.innerHTML = `
      <a class="btn btn-login" href="login.html">Log In</a>
      <a class="btn btn-signup" href="signup.html">Sign Up</a>
    `;
  }
}

document.addEventListener('DOMContentLoaded', renderHeaderAuth);
