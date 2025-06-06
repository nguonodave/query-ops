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

    <div class="pie-charts">
        <div class="chart-container pass-fail-chart">
            <h3>PASS/FAIL ratio</h3>

            <div class="chart-container">
                <svg class="chart" viewBox="0 0 100 100"></svg>
            </div>

            <div class="chart-legend">
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #4169E1;"></div>
                    <span id="legend-pass">Passed: Loading...</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background-color: #F44336;"></div>
                    <span id="legend-fail">Failed: Loading...</span>
                </div>
            </div>
        </div>


        <div class="chart-container audit-ratio-chart">
            <p>Audit ratio pie chart (Coming Soon)</p>
        </div>
    </div>


    <p>XP Over Time Graph (Coming Soon)</p>

    <button id="logout-btn">Logout</button>
</div>
`;