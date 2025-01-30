export function isOnlyLetters(input: string) {
    return /^[a-zA-Z]+$/.test(input);
}

export function isOnlyLettersSpaceInclusive(input: string) {
    return /^[a-zA-Z ]+$/.test(input);
}

export function isOnlyNumbers(input: string) {
    return /^\d+$/.test(input);
}
