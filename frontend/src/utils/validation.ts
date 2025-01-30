export function isOnlyLetters(input: string) {
    return /^[a-zA-Z]+$/.test(input);
}

export function isOnlyNumbers(input: string) {
    return /^\d+$/.test(input);
}
