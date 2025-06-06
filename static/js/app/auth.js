import { auth } from "../uiComponents/authUi.js";
import { profile } from "../uiComponents/profileUi.js";
import { fetchUserProfile } from "./graphQl.js";
import { domain } from "./main.js";

export async function checkAuthStatusAndRenderUi() {
    const app = document.getElementById('main-app')

    app.innerHTML = ""

    const token = localStorage.getItem("token");
    if (token) {
        try {
            const user = await fetchUserProfile(token);
            app.innerHTML = profile(user);
        } catch (err) {
            console.warn("Token invalid or expired. Logging out...", err);
            localStorage.removeItem("token");
            checkAuthStatusAndRenderUi()
            return;
        }

        const logoutBtn = document.getElementById('logout-btn')
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault()
            localStorage.removeItem("token");
            checkAuthStatusAndRenderUi()
        });
    } else {
        app.innerHTML = auth()
        setupAuthListeners()
    }
}

function setupAuthListeners() {
    const loginForm = document.getElementById('login-form')

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault()

        const username = document.getElementById("username-or-email").value.trim();
        const password = document.getElementById("password").value.trim();
        const authError = document.getElementById("auth-error");
        authError.textContent = "";
        const credentials = btoa(`${username}:${password}`);

        try {
            const response = await fetch(`https://${domain}/api/auth/signin`, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText);
            }

            const token = await response.json(); // JWT token
            localStorage.setItem("token", token);
            checkAuthStatusAndRenderUi()
        } catch (error) {
            authError.textContent = "Login failed: " + error.message;
        }
    });
}
