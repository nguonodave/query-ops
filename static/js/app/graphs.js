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