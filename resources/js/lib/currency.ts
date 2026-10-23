/**
 * Money is stored as integer centavos end-to-end. These helpers format for
 * display and prepare values for the decimal-peso inputs the forms use.
 */
export function formatPeso(centavos: number | null | undefined): string {
    const value = (centavos ?? 0) / 100;
    const hasCents = Math.round(value * 100) % 100 !== 0;

    return (
        '₱' +
        value.toLocaleString('en-PH', {
            minimumFractionDigits: hasCents ? 2 : 0,
            maximumFractionDigits: 2,
        })
    );
}

/** Peso value for a controlled/defaulted input (empty string when null). */
export function pesoInputValue(centavos: number | null | undefined): string {
    if (centavos === null || centavos === undefined) return '';
    return String(centavos / 100);
}
