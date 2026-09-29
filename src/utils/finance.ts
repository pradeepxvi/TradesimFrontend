export type NumericValue = number | string | null | undefined;

export const toFiniteNumber = (value: NumericValue): number | null => {
    if (value === null || value === undefined || value === "") return null;

    const numberValue = typeof value === "number" ? value : Number(value);
    return Number.isFinite(numberValue) ? numberValue : null;
};

export const sumNumericValues = (values: NumericValue[]): number | null => {
    const numbers = values.map(toFiniteNumber);
    if (numbers.some((value) => value === null)) return null;

    return numbers.reduce<number>((total, value) => total + (value ?? 0), 0);
};
