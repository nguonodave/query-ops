export const profile = (user) => `
<div id="profile">
    <p>Welcome! ${user.login}.</p>
    <p>firstName! ${user.attrs.firstName}.</p>
    <p>lastName! ${user.attrs.middleName}.</p>
    <p>email! ${user.attrs.email}.</p>
    <p>phone! ${user.attrs.phone}.</p>
    <p>email! ${user.attrs.dateOfBirth}.</p>
    <button id="logout-btn">Logout</button>
</div>
`
