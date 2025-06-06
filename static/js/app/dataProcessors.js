export function processXpData(transactions) {
    const totalXp = transactions.reduce((acc, t) => {
        return acc += t.amount;
    }, 0)

    return totalXp
}

export function processLatestProject(progresses) {
    return progresses[0].object.name
}

export function processUpRatio(auditTransactions) {
    const totalUp = auditTransactions.reduce((acc, at) => {
        return at.type === "up" ? acc + at.amount : acc;
    }, 0)
    return Math.round((totalUp / (1000 * 1000)) * 100) / 100
}

export function processDownRatio(auditTransactions) {
    const totalDown = auditTransactions.reduce((acc, at) => {
        return at.type === "down" ? acc + at.amount : acc;
    }, 0)
    return Math.round((totalDown / (1000 * 1000)) * 100) / 100
}