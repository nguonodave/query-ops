export const profile = (user, processedData) => `
<div id="profile">
    <nav>
        <h1>Your dashboard</h1>
        <button id="logout-btn">Logout</button>
    </nav>

    <section class="profile-body">
        <section class="left">
            <section class="card basic-details">
                <h3 class="username">${user.login}</h3>

                <div class="basic-detail">
                    <span class="detail-label">First Name:</span>
                    <span class="detail">${user.attrs.firstName}</span>
                </div>

                <div class="basic-detail">
                    <span class="detail-label">Middle Name:</span>
                    <span class="detail">${user.attrs.middleName}</span>
                </div>

                <div class="basic-detail">
                    <span class="detail-label">Last Name:</span>
                    <span class="detail">${user.attrs.lastName}</span>
                </div>

                <div class="basic-detail">
                    <span class="detail-label">Email:</span>
                    <span class="detail">${user.attrs.email}</span>
                </div>

                <div class="basic-detail">
                    <span class="detail-label">Date of Birth:</span>
                    <span class="detail">
                        ${new Date(user.attrs.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                        })}
                    </span>
                </div>

                <div class="basic-detail">
                    <span class="detail-label">Latest Project:</span>
                    <span class="detail">${processedData.latestProject}</span>
                </div>
            </section>

            <section class="card metrics">
                <h3>Performance Metrics</h3>
                <div class="metrics-content">
                    <div class="total-xp">
                        <h3>${processedData.xp}</h3>
                        <p>Total XP</p>
                    </div>

                    <div class="audit-ratio">
                        <h3>${user.auditRatio.toFixed(1)}</h3>
                        <p>Audit Ratio</p>
                    </div>
                </div>
            </section>
        </section>

        <div class="graphs">
            <div class="card pie-charts">
                <div class="chart-contents pass-fail-chart">
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


                <div class="chart-contents audit-ratio-chart">
                    <h3>Audit ratio chart</h3>

                    <div class="audit-chart-container">
                        <svg width="100%" height="100%" viewBox="0 0 100 100">
                            <g id="pie-segments"></g>
                        </svg>
                    </div>

                    <div class="audit-chart-legend" id="audit-chart-legend"></div>
                </div>
            </div>


            <div class="card graph-container">
                <h2 class="graph-title">Your XP Earnings Timeline</h2>
                <svg class="graph-svg" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid meet">
                    <g class="x-axis"></g>
                    <g class="y-axis"></g>
                    <g class="grid x-grid"></g>
                    <g class="grid y-grid"></g>
                    <path class="line"></path>
                    <g class="dots"></g>
                </svg>

                <div class="tooltip"></div>
            </div>
        </div>
    </section>
</div>
`;