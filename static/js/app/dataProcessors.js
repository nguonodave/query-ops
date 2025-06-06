export function processXpData(transactions) {
    const totalXp = transactions.reduce((acc, t) => {
        return acc += t.amount;
    }, 0)

    return totalXp
}

export function processLatestProject(progresses) {
    return progresses[0].object.name
}

export function processDoneRatio(auditTransactions) {
    const totalDone = auditTransactions.reduce((acc, at) => {
        return at.type === "up" ? acc + at.amount : acc;
    }, 0)
    return Math.round((totalDone / (1000 * 1000)) * 100) / 100
}

export function processReceivedRatio(auditTransactions) {
    const totalReceived = auditTransactions.reduce((acc, at) => {
        return at.type === "down" ? acc + at.amount : acc;
    }, 0)
    return Math.round((totalReceived / (1000 * 1000)) * 100) / 100
}