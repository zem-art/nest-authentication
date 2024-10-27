export class StringUtil {
    static remove_special_phone_number(params: string): string {
        const symbolsToRemove = "+"; // Karakter simbol yang ingin dihapus
    
        // Menggunakan ekspresi reguler untuk mengganti semua karakter yang ingin dihapus
        return params.replace(new RegExp(`[${symbolsToRemove}]`, 'g'), '');
    }

    static special_character_username(params: string): boolean {
        const symbolsToCheck = "\x1F\x7F\x00&*^!+=/?:;>$()|%~#@_,~";
        
        // Menggunakan ekspresi reguler untuk mengecek apakah ada karakter yang ingin dicek
        const regex = new RegExp(`[${symbolsToCheck}]`, 'g');
        
        // Menggunakan metode test() untuk mengecek apakah simbol ditemukan dalam string
        return regex.test(params);
    }
}