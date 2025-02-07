export function isOnlyLetters(input: string) {
    return /^[\p{L}\s']+$/u.test(input);
}

export function isOnlyNumbers(input: string) {
    return /^\d+$/.test(input);
}

export function isValidCapacity(input: string) {
    // Convertiamo la stringa in numero
    const capacity = Number(input);
    // Controlliamo se è un numero valido e maggiore di 0
    return !isNaN(capacity) && capacity > 0;
}


export function isPhoneNumber(input: string) {
    return /^\+?\d+$/.test(input);
}
