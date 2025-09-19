const crypto = require('crypto');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function base62FromBuffer(buf, length=6){
  let n = BigInt('0x' + buf.toString('hex'));
  const base = BigInt(ALPHABET.length);
  let out = '';
  while (out.length < length && n > 0) {
    const idx = Number(n % base);
    out += ALPHABET[idx];
    n = n / base;
  }
  while (out.length < length) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out.slice(0, length);
}

function generateShortId(url, length=6){
  const hash = crypto.createHash('sha256').update(url).digest();
  return base62FromBuffer(hash, length);
}

module.exports = { generateShortId, ALPHABET };
