const crypto = require('crypto');

const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Convert buffer to base62 string
function base62Encode(buffer) {
    const chars = ALPHABET.split('');
    let num = BigInt('0x' + buffer.toString('hex'));
    let str = '';
    while (num > 0) {
        str = chars[Number(num % 62n)] + str;
        num = num / 62n;
    }
    return str;
}

// Generate collision-resistant short ID
function generateShortId(url, length = 6) {
    const hash = crypto.createHash('sha256').update(url + Date.now().toString()).digest();
    const short = base62Encode(hash).substring(0, length);
    return short;
}

module.exports = { generateShortId, ALPHABET };
