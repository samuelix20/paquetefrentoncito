document.addEventListener('DOMContentLoaded', () => {
    const messageEl = document.getElementById('message');

    // --- Lógica para el formulario de Registro (signup.html) ---
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = signupForm.email.value;
            const password = signupForm.password.value;

            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                messageEl.textContent = result.message;
                messageEl.style.color = 'green';
                signupForm.reset();
            } else {
                messageEl.textContent = `Error: ${result.error}`;
                messageEl.style.color = 'red';
            }
        });
    }

    // --- Lógica para el formulario de Inicio de Sesión (login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();
            if (response.ok) {
                messageEl.textContent = result.message;
                messageEl.style.color = 'green';
                // Guardamos la sesión completa en localStorage
                localStorage.setItem('supabase.session', JSON.stringify(result.session));
                setTimeout(() => window.location.href = '/', 2000);
            } else {
                messageEl.textContent = `Error: ${result.error}`;
                messageEl.style.color = 'red';
            }
        });
    }

    // --- Lógica para solicitar reseteo de contraseña (reset-password.html) ---
    const resetPasswordForm = document.getElementById('reset-password-form');
    if (resetPasswordForm) {
        resetPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = resetPasswordForm.email.value;

            const response = await fetch('/api/auth/reset-password-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            messageEl.textContent = result.message || `Error: ${result.error}`;
            messageEl.style.color = response.ok ? 'green' : 'red';
        });
    }

    // --- Lógica para actualizar la contraseña (update-password.html) ---
    const updatePasswordForm = document.getElementById('update-password-form');
    if (updatePasswordForm) {
        // Extraer el access_token del fragmento de la URL (#access_token=...)
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');

        if (!accessToken) {
            messageEl.textContent = 'Error: Token de acceso no encontrado. El enlace puede haber expirado.';
            messageEl.style.color = 'red';
        }

        updatePasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!accessToken) return;

            const password = updatePasswordForm.password.value;

            const response = await fetch('/api/auth/update-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ access_token: accessToken, password }),
            });

            const result = await response.json();
            if (response.ok) {
                messageEl.textContent = '¡Contraseña actualizada! Ya puedes iniciar sesión.';
                messageEl.style.color = 'green';
                setTimeout(() => window.location.href = '/login.html', 3000);
            } else {
                messageEl.textContent = `Error: ${result.error}`;
                messageEl.style.color = 'red';
            }
        });
    }

    // --- Lógica para el botón de Cerrar Sesión ---
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('supabase.session');
            window.location.href = '/login.html';
        });
    }
});