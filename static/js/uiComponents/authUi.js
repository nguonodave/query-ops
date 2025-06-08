export const auth = () => `
<form id="login-form">
    <h3>Login to your profile</h3>

    <input type="text" id="username-or-email" placeholder="Email or Nickname" required>

    <div class="password-wrapper">
        <input type="password" id="password" placeholder="Password" required>
        <img class="toggle-password open-eyes" src="/assets/eyes-svgrepo-com.svg" alt="open-eyes"
            style="display: none;">
        <img class="toggle-password closed-eyes" src="/assets/icons8-closed-eye-90.png" alt="closed-eyes">
    </div>

    <p id="auth-error" class="error"></p>

    <button class="auth-button" type="submit">Login</button>
</form>
`
