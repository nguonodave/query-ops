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
            color: '#4169e1',
            label: 'Done',
            mbValue: doneMB
        },
        {
            value: receivedPercent,
            color: '#4CAF50',
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

export function lineGraph(xpTransactions) {
    // Process data to cumulative XP over time
    let cumulativeXP = 0;
    const xpData = xpTransactions.map(transaction => {
        cumulativeXP += transaction.amount;
        return {
            date: new Date(transaction.createdAt),
            xp: cumulativeXP,
            originalAmount: transaction.amount
        };
    });

    const margin = { top: 30, right: 50, bottom: 60, left: 70 };
    const width = 1000 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // const svg = document.querySelector('.graph-svg');
    const xAxisGroup = document.querySelector('.x-axis');
    const yAxisGroup = document.querySelector('.y-axis');
    const xGridGroup = document.querySelector('.x-grid');
    const yGridGroup = document.querySelector('.y-grid');
    const linePath = document.querySelector('.line');
    const dotsGroup = document.querySelector('.dots');
    const tooltip = document.querySelector('.tooltip');

    // Set up scales
    const xScale = d => {
        const dates = xpData.map(d => d.date);
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const range = maxDate - minDate;
        return margin.left + ((d - minDate) / range) * width;
    };

    const yScale = d => {
        const maxXP = Math.max(...xpData.map(d => d.xp));
        return height - margin.bottom - (d / maxXP) * (height - margin.top - margin.bottom);
    };

    // Create line generator
    const lineGenerator = () => {
        let path = '';
        xpData.forEach((d, i) => {
            const x = xScale(d.date);
            const y = yScale(d.xp);
            if (i === 0) {
                path += `M ${x},${y}`;
            } else {
                path += ` L ${x},${y}`;
            }
        });
        return path;
    };

    // Draw axes
    const drawAxes = () => {
        // X Axis (dates)
        const dates = xpData.map(d => d.date);
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const dateRange = maxDate - minDate;

        // Calculate approximately 10 ticks
        const tickCount = 10;
        const tickInterval = dateRange / (tickCount - 1);

        for (let i = 0; i < tickCount; i++) {
            const date = new Date(minDate.getTime() + (i * tickInterval));
            const x = xScale(date);

            // Tick
            const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tick.setAttribute('x1', x);
            tick.setAttribute('y1', height - margin.bottom);
            tick.setAttribute('x2', x);
            tick.setAttribute('y2', height - margin.bottom + 6);
            tick.setAttribute('class', 'axis-tick');
            xAxisGroup.appendChild(tick);

            // Label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', x);
            label.setAttribute('y', height - margin.bottom + 20);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('class', 'axis-label');
            label.textContent = formatDate(date);
            xAxisGroup.appendChild(label);

            // Grid line
            const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            gridLine.setAttribute('x1', x);
            gridLine.setAttribute('y1', margin.top);
            gridLine.setAttribute('x2', x);
            gridLine.setAttribute('y2', height - margin.bottom);
            gridLine.setAttribute('class', 'grid-line');
            xGridGroup.appendChild(gridLine);
        }

        // X axis line
        const xAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        xAxisLine.setAttribute('d', `M ${margin.left},${height - margin.bottom} H ${width + margin.left}`);
        xAxisLine.setAttribute('class', 'axis-line');
        xAxisGroup.appendChild(xAxisLine);

        // X axis label
        const xAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xAxisLabel.setAttribute('x', width / 2 + margin.left);
        xAxisLabel.setAttribute('y', height - 10);
        xAxisLabel.setAttribute('text-anchor', 'middle');
        xAxisLabel.setAttribute('class', 'axis-label');
        xAxisLabel.textContent = 'Date';
        xAxisGroup.appendChild(xAxisLabel);

        // Y Axis (XP)
        const maxXP = Math.max(...xpData.map(d => d.xp));
        const yTicks = 8;
        const yTickInterval = Math.ceil(maxXP / yTicks / 100) * 100; // Round to nearest 100

        for (let i = 0; i <= yTicks; i++) {
            const yValue = i * yTickInterval;
            const y = yScale(yValue);

            // Tick
            const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            tick.setAttribute('x1', margin.left - 6);
            tick.setAttribute('y1', y);
            tick.setAttribute('x2', margin.left);
            tick.setAttribute('y2', y);
            tick.setAttribute('class', 'axis-tick');
            yAxisGroup.appendChild(tick);

            // Label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', margin.left - 10);
            label.setAttribute('y', y + 4);
            label.setAttribute('text-anchor', 'end');
            label.setAttribute('class', 'axis-label');
            label.textContent = yValue.toLocaleString();
            yAxisGroup.appendChild(label);

            // Grid line
            const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            gridLine.setAttribute('x1', margin.left);
            gridLine.setAttribute('y1', y);
            gridLine.setAttribute('x2', width + margin.left);
            gridLine.setAttribute('y2', y);
            gridLine.setAttribute('class', 'grid-line');
            yGridGroup.appendChild(gridLine);
        }

        // Y axis line
        const yAxisLine = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        yAxisLine.setAttribute('d', `M ${margin.left},${height - margin.bottom} V ${margin.top}`);
        yAxisLine.setAttribute('class', 'axis-line');
        yAxisGroup.appendChild(yAxisLine);

        // Y axis label
        const yAxisLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        yAxisLabel.setAttribute('x', -height / 2);
        yAxisLabel.setAttribute('y', -45);
        yAxisLabel.setAttribute('text-anchor', 'middle');
        yAxisLabel.setAttribute('transform', 'rotate(-90)');
        yAxisLabel.setAttribute('class', 'axis-label');
        yAxisLabel.textContent = 'Cumulative XP';
        yAxisGroup.appendChild(yAxisLabel);
    };

    // Format date for display
    const formatDate = date => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short'
            // day: 'numeric'
        }).format(date);
    };

    // Format date with time for tooltip
    const formatDateTime = date => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Draw line
    linePath.setAttribute('d', lineGenerator());

    // Draw dots
    xpData.forEach(d => {
        const x = xScale(d.date);
        const y = yScale(d.xp);

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', x);
        dot.setAttribute('cy', y);
        dot.setAttribute('r', 6);
        dot.setAttribute('class', 'dot');
        dot.setAttribute('data-date', d.date.toISOString());
        dot.setAttribute('data-xp', d.xp);
        dot.setAttribute('data-amount', d.originalAmount);
        dotsGroup.appendChild(dot);

        // Add hover events
        dot.addEventListener('mouseover', function (e) {
            const date = new Date(this.getAttribute('data-date'));
            const xp = parseInt(this.getAttribute('data-xp'));
            const amount = parseInt(this.getAttribute('data-amount'));

            tooltip.innerHTML = `
                        <strong>${formatDateTime(date)}</strong><br/>
                        Transaction: +${amount.toLocaleString()} XP<br/>
                        Total: ${xp.toLocaleString()} XP
                    `;
            tooltip.style.left = (e.pageX + 10) + 'px';
            tooltip.style.top = (e.pageY - 10) + 'px';
            tooltip.style.opacity = 1;
        });

        dot.addEventListener('mouseout', function () {
            tooltip.style.opacity = 0;
        });
    });

    // Draw axes
    drawAxes();
}
