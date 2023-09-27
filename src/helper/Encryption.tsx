export function encrypt(key: number | string): string {
    let encode = window.btoa(`${key}${process.env.ENCRYPTED_STRING}`);
    encode = window.btoa(`${encode}${process.env.ENCRYPTED_STRING}`);
    return (encode);
}

export function decrypt(key: string | undefined, decrypted?: boolean): any {
    if (key === undefined) {
        return "";
    }
    try {
        let text = window.atob(key);
        if (process.env.ENCRYPTED_STRING && text.includes(process.env.ENCRYPTED_STRING)) {
            if(decrypted){
                return text.replace(process.env.ENCRYPTED_STRING, "");
            }
            return (decrypt(text.replace(process.env.ENCRYPTED_STRING, ""),!decrypted));
        }
        return "";
    } catch (e) {
        return key;
    }
}

export const decryptNumber = (key: string | undefined): number =>{
    const decodeString = decrypt(key);
    return(parseInt(decodeString));
}
