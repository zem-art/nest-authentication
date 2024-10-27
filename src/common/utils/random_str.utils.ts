export class RandomStrUtil {
    static random_str_number(length: number = 22): string {
        const characters = '0123456789';
        const return_str = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        return return_str
    }

    static random_str_alphanumeric(length: number = 22): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const return_str = Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        return return_str
    }
}

export class RandomNumberUtil {}