/**
 * Deterministic drinks calculator. Estimates servings from guest count,
 * reception length and the couple's drink mix, then converts to purchase
 * units. Pure formula — no AI involved (the AI tip is a separate, optional
 * layer).
 */
export type DrinkMix = {
    beer: number;
    wine: number;
    spirits: number;
    non_alcoholic: number;
};

export type DrinkInput = {
    guests: number;
    hours: number;
    mix: DrinkMix;
    includeToast: boolean;
};

export type DrinkLine = {
    label: string;
    servings: number;
    detail: string;
};

export type DrinkResult = {
    totalDrinks: number;
    lines: DrinkLine[];
    iceKg: number;
};

export function computeDrinks({
    guests,
    hours,
    mix,
    includeToast,
}: DrinkInput): DrinkResult {
    // Common rule of thumb: ~1 drink per guest per hour, with a first-hour bump.
    const drinksPerGuest = hours + 1;
    const totalDrinks = Math.max(0, Math.round(guests * drinksPerGuest));

    const share = (pct: number) => Math.round((totalDrinks * pct) / 100);

    const beerDrinks = share(mix.beer);
    const wineDrinks = share(mix.wine);
    const spiritDrinks = share(mix.spirits);
    const nonAlcDrinks = share(mix.non_alcoholic);

    const lines: DrinkLine[] = [
        {
            label: 'Beer',
            servings: beerDrinks,
            detail: `${beerDrinks} bottles/cans · ≈ ${Math.ceil(beerDrinks / 24)} case(s) of 24`,
        },
        {
            label: 'Wine',
            servings: wineDrinks,
            detail: `${Math.ceil(wineDrinks / 5)} bottles (5 glasses each)`,
        },
        {
            label: 'Spirits / cocktails',
            servings: spiritDrinks,
            detail: `${Math.ceil(spiritDrinks / 16)} bottles (≈16 servings each)`,
        },
        {
            label: 'Non-alcoholic',
            servings: nonAlcDrinks,
            detail: `${Math.ceil(nonAlcDrinks / 6)} × 1.5L bottles (6 servings each)`,
        },
    ];

    if (includeToast) {
        lines.push({
            label: 'Toast (sparkling)',
            servings: guests,
            detail: `${Math.ceil(guests / 6)} bottles (6 flutes each)`,
        });
    }

    return {
        totalDrinks,
        lines,
        iceKg: Math.ceil(guests * 0.5),
    };
}
