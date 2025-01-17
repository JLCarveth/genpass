/**
 * Running this password gen requires *either* a dictionary available on
 * /usr/share/dict/words or as a fallback, "wordlist.txt" within the same directory
 * as the executable.
 *
 * Compile with: deno compile --allow-read --output genpass password_gen.ts
 * 
 * Usage:
 *   genpass             - generates one word-based password
 *   genpass 5           - generates 5 word-based passwords
 *   genpass -n 15       - generates one 15-character random password
 *   genpass -n 15 5     - generates 5 random passwords, each 15 characters long
 */

import { parseArgs } from "jsr:@std/cli/parse-args";

// Read the dictionary file
let wordlist = "";
try {
  wordlist = await Deno.readTextFile("/usr/share/dict/words");
} catch {
  wordlist = await Deno.readTextFile("./wordlist.txt");
}
const dictionary: Array<string> = wordlist.split("\n");
const length: number = dictionary.length;

/**
 * Generates a random number 0<=x<=length
 * @param length random digit upper bound
 * @returns {number} random number
 */
const max = (length: number): number => {
  return Math.floor(Math.random() * length);
};

/**
 * Uppercases the first char of a string
 * @param s String
 * @returns Capitalized string (ex. apple -> Apple)
 */
const upper = (s: string): string => {
  return s[0].toUpperCase() + s.slice(1);
};

/**
 * Generates a word-based password
 * @returns {string} Generated password
 */
function generateWordBased(): string {
  const a = max(length), b = max(length), c = max(length);
  const digits = max(1000);
  return upper(dictionary[a]).split("'s")[0] +
    upper(dictionary[b]).split("'s")[0] +
    upper(dictionary[c]).split("'s")[0] +
    digits;
}

/**
 * Generates a random character password of specified length
 * @param length Length of password to generate
 * @returns {string} Generated password
 */
function generateRandom(length: number): string {
  const charset = {
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
  };

  let password = '';
  const allChars = charset.lowercase + charset.uppercase + charset.numbers + charset.symbols;

  // Ensure at least one character from each set
  password += charset.lowercase[max(charset.lowercase.length)];
  password += charset.uppercase[max(charset.uppercase.length)];
  password += charset.numbers[max(charset.numbers.length)];
  password += charset.symbols[max(charset.symbols.length)];

  // Fill the rest with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[max(allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

function main() {
  const args = parseArgs(Deno.args, {
    string: ['n'],
    boolean: ['help', 'h'],
    alias: { h: 'help' },
  });

  if (args.help) {
    console.log(`
Usage:
  genpass             - generates one word-based password
  genpass 5           - generates 5 word-based passwords
  genpass -n 15       - generates one 15-character random password
  genpass -n 15 5     - generates 5 random passwords, each 15 characters long
    `);
    Deno.exit(0);
  }

  const count = args._.length > 0 ? Number(args._[args._.length - 1]) : 1;
  
  if (args.n) {
    const length = parseInt(args.n);
    if (isNaN(length) || length < 8) {
      console.error("Password length must be a number >= 8");
      Deno.exit(1);
    }
    for (let i = 0; i < count; i++) {
      console.log(generateRandom(length));
    }
  } else {
    for (let i = 0; i < count; i++) {
      console.log(generateWordBased());
    }
  }
}

main();
