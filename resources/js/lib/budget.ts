/**
 * Client mirror of app/Support/BudgetSummary.php — used for the live what-if
 * recompute when toggling items between "committed" and "considering" without
 * a round-trip. The server stays authoritative on load and after mutations.
 */
export type BudgetItemLite = {
    estimated_amount: number;
    actual_amount: number | null;
    status: string;
    paid: number;
};

export type BudgetTotals = {
    ceiling: number | null;
    plannedTotal: number;
    actualTotal: number;
    paidTotal: number;
    remainingTotal: number;
    consideringTotal: number;
    projectedTotal: number;
    variance: number | null;
    projectedVariance: number | null;
};

const effective = (item: BudgetItemLite): number =>
    item.actual_amount ?? item.estimated_amount;

export function summarizeBudget(
    items: BudgetItemLite[],
    ceiling: number | null,
): BudgetTotals {
    const committed = items.filter((i) => i.status === 'committed');
    const considering = items.filter((i) => i.status === 'considering');

    const plannedTotal = committed.reduce((s, i) => s + i.estimated_amount, 0);
    const actualTotal = committed.reduce((s, i) => s + effective(i), 0);
    const paidTotal = committed.reduce((s, i) => s + i.paid, 0);
    const consideringTotal = considering.reduce((s, i) => s + effective(i), 0);
    const projectedTotal = actualTotal + consideringTotal;

    return {
        ceiling,
        plannedTotal,
        actualTotal,
        paidTotal,
        remainingTotal: actualTotal - paidTotal,
        consideringTotal,
        projectedTotal,
        variance: ceiling !== null ? ceiling - actualTotal : null,
        projectedVariance: ceiling !== null ? ceiling - projectedTotal : null,
    };
}
