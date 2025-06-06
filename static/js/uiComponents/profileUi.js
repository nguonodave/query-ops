export const profile = (user, processedData) => `
<div id="profile">
  <section class="user-card">
    <h2>Username: ${user.login}</h2>
    <p>Full name: ${user.attrs.firstName} ${user.attrs.middleName} ${user.attrs.lastName}</p>
    <p>Email: ${user.attrs.email}</p>
    <p> Date of Birth:
    ${new Date(user.attrs.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    })}
    </p>
  </section>

  <section class="xp-summary">
    <h3>Total XP</h3>
    <p>Total: ${processedData.xp}</p>
  </section>

  <section class="audit-ratio">
    <h3>Audit Ratio</h3>
    <p>${user.auditRatio.toFixed(1)}</p>
  </section>

  <section class="audit-ratio">
    <h3>Latest created project</h3>
    <p>${processedData.latestProject}</p>
  </section>

  <div class="graph-placeholder">
    <p>XP Over Time Graph (Coming Soon)</p>
    <p>Project Pass/Fail pie chart (Coming Soon)</p>
    <p>Audit ratio pie chart (Coming Soon)</p>
  </div>

  <button id="logout-btn">Logout</button>
</div>
`;