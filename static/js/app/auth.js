import { auth } from "../uiComponents/authUi.js";
import { profile } from "../uiComponents/profileUi.js";
import { processDoneRatio, processLatestProject, processReceivedRatio, processXpData } from "./dataProcessors.js";
import { fetchUserProfile } from "./graphQl.js";
import { auditRatioChart, lineGraph, passFailChart } from "./graphs.js";
import { domain } from "./main.js";

export async function checkAuthStatusAndRenderUi() {
    const app = document.getElementById('main-app')

    app.innerHTML = ""

    const token = localStorage.getItem("token");
    if (token) {
        const user = await fetchUserProfile(token);
        const processedData = {
            xp: processXpData(user.xpTransactions),
            latestProject: processLatestProject(user.progresses),
            up: processDoneRatio(user.auditTransactions),
            down: processReceivedRatio(user.auditTransactions)
        };
        app.innerHTML = profile(user, processedData);
        passFailChart(user.progresses)
        auditRatioChart(user.auditTransactions)
        lineGraph(user.xpTransactions)

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
    const openEyes = document.querySelectorAll('.open-eyes');
    const closedEyes = document.querySelectorAll('.closed-eyes');

    // password visibility toggle
    function togglePasswordVisibility(e) {
        const wrapper = e.target.closest('.password-wrapper');
        const input = wrapper.querySelector('input');
        const openEye = wrapper.querySelector('.open-eyes');
        const closedEye = wrapper.querySelector('.closed-eyes');

        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        openEye.style.display = isPassword ? 'inline' : 'none';
        closedEye.style.display = isPassword ? 'none' : 'inline';
    }

    openEyes.forEach(icon => {
        icon.addEventListener('click', togglePasswordVisibility);
    });
    closedEyes.forEach(icon => {
        icon.addEventListener('click', togglePasswordVisibility);
    });

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
            let errorMsg = "";
            try {
                const parsed = JSON.parse(error.message);
                errorMsg += parsed.error || error.message;
            } catch {
                errorMsg += error.message;
            }
            authError.textContent = errorMsg;
        }
    });
}
