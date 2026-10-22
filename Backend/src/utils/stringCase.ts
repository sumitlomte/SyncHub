export function toCamelCase(str: string): string {
    return str.trim().replace(/([-_][a-z])/gi, (match) => {
        return match.toUpperCase().replace('-', '').replace('_', '');
    });
}

export function toSnakeCase(str: string): string {
    return str.trim().replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function toKebabCase(str: string): string {
    return str.trim().replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function toPascalCase(str: string): string {
    return str.trim().replace(/(^\w|[-_]\w)/g, (match) => {
        return match.toUpperCase().replace('-', '').replace('_', '');
    });
}

export function toTitleCase(str: string): string {
    return str.trim().replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export function toLowerCase(str: string): string {
    return str.trim().toLowerCase();
}

export function toUpperCase(str: string): string {
    return str.trim().toUpperCase();
}

