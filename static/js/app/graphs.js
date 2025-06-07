import { processDoneRatio, processReceivedRatio } from "./dataProcessors.js";

export function passFailChart(progresses) {
    const chartSvg = document.querySelector('.chart');
    const legendPass = document.getElementById('legend-pass');
    const legendFail = document.getElementById('legend-fail');

    // Analyze the data
    const analysis = analyzeProjects(progresses);

    // Draw the chart
    drawPieChart(analysis.passPercentage, analysis.failPercentage);

    function analyzeProjects(projects) {
        let passCount = 0;
        let failCount = 0;

        projects.forEach(project => {
            if (project.grade >= 1) {
                passCount++;
            } else {
                failCount++;
            }
        });

        const total = projects.length;
        const passPercentage = Math.round((passCount / total) * 100);
        const failPercentage = 100 - passPercentage;

        return {
            passCount,
            failCount,
            passPercentage,
            failPercentage
        };
    }

    function drawPieChart(passPercent, failPercent) {
        // Clear previous chart
        chartSvg.innerHTML = '';

        // Calculate angles
        const anglePass = (passPercent / 100) * 360;
        const angleFail = (failPercent / 100) * 360;

        // Create path data for passed projects
        const pathPass = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathPass.setAttribute('d', describeArc(50, 50, 40, 0, anglePass));
        pathPass.setAttribute('fill', '#4169E1');

        // Create path data for failed projects
        const pathFail = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathFail.setAttribute('d', describeArc(50, 50, 40, anglePass, anglePass + angleFail));
        pathFail.setAttribute('fill', '#F44336');

        // Add paths to SVG
        chartSvg.appendChild(pathPass);
        chartSvg.appendChild(pathFail);

        // Update legend text
        legendPass.textContent = `Passed: ${passPercent}%`;
        legendFail.textContent = `Failed: ${failPercent}%`;
    }

    // Helper function to create arc path data
    function describeArc(x, y, radius, startAngle, endAngle) {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);

        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", x, y,
            "L", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
            "Z"
        ].join(" ");
    }

    // Helper function to convert polar coordinates to Cartesian
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }
}

export function auditRatioChart(auditTransactions) {
    // Calculate values
    const doneMB = processDoneRatio(auditTransactions);
    const receivedMB = processReceivedRatio(auditTransactions);
    const totalMB = doneMB + receivedMB;

    // Calculate percentages
    const donePercent = Math.round((doneMB / totalMB) * 1000) / 10;
    const receivedPercent = Math.round((receivedMB / totalMB) * 1000) / 10;

    // Prepare chart data
    const chartData = [
        {
            value: donePercent,
            color: '#4CAF50',
            label: 'Done',
            mbValue: doneMB
        },
        {
            value: receivedPercent,
            color: '#2196F3',
            label: 'Received',
            mbValue: receivedMB
        }
    ];

    // Initialize the chart
    renderChart(chartData);

    function renderChart(data) {
        const totalValue = data.reduce((sum, item) => sum + item.value, 0);
        let cumulativePercent = 0;
        const centerX = 50;
        const centerY = 50;
        const radius = 45;
        const strokeWidth = 10;

        // Clear previous segments
        const pieSegments = document.getElementById('pie-segments');
        pieSegments.innerHTML = '';

        // Create each segment
        data.forEach(item => {
            const percent = item.value / totalValue;
            const startAngle = cumulativePercent * 2 * Math.PI;
            const endAngle = (cumulativePercent + percent) * 2 * Math.PI;

            // Outer circle coordinates
            const x1 = centerX + Math.sin(startAngle) * radius;
            const y1 = centerY - Math.cos(startAngle) * radius;
            const x2 = centerX + Math.sin(endAngle) * radius;
            const y2 = centerY - Math.cos(endAngle) * radius;

            // Inner circle coordinates (for doughnut hole)
            const innerRadius = radius - strokeWidth;
            const x3 = centerX + Math.sin(endAngle) * innerRadius;
            const y3 = centerY - Math.cos(endAngle) * innerRadius;
            const x4 = centerX + Math.sin(startAngle) * innerRadius;
            const y4 = centerY - Math.cos(startAngle) * innerRadius;

            const largeArcFlag = percent > 0.5 ? 1 : 0;

            const pathData = [
                `M ${x1} ${y1}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `L ${x3} ${y3}`,
                `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                'Z'
            ].join(' ');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('fill', item.color);
            path.setAttribute('stroke', 'none');

            pieSegments.appendChild(path);
            cumulativePercent += percent;
        });

        // Update legend
        const legend = document.getElementById('audit-chart-legend');
        legend.innerHTML = data.map(item => `
                <div class="audit-legend-item">
                    <div class="audit-legend-color" style="background-color: ${item.color};"></div>
                    <div>${item.label}: ${item.mbValue}MB (${item.value}%)</div>
                </div>
            `).join('');
    }
}
