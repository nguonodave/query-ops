export function processXpData(transactions) {
    const totalXp = transactions.reduce((acc, t) => {
        return acc += t.amount;
    }, 0)

    return totalXp
}

export function processLatestProject(progresses) {
    return progresses[0].object.name
}