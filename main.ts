/**
 * Running this password gen requires *either* a dictionary available on
 * /usr/share/dict/words or as a fallback, "wordlist.txt" within the same directory.
 *
 * Compile with: deno compile --allow-read --output genpass password_gen.ts
 * 
 * Usage:
 *   genpass                     - generates one word-based password
 *   genpass 5                   - generates 5 word-based passwords
 *   genpass -n 15              - generates one 15-character random password
 *   genpass -n 15 --no-symbols - generates random password without symbols
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
 */
const max = (length: number): number => {
  return Math.floor(Math.random() * length);
};

/**
 * Uppercases the first char of a string
 */
const upper = (s: string): string => {
  return s[0].toUpperCase() + s.slice(1);
};

/**
 * Generates a word-based password
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
 * Generates a random character password
 */
function generateRandom(passwordLength: number, useSymbols = true): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = lowercase + uppercase + numbers;
  if (useSymbols) chars += symbols;

  let password = '';
  for (let i = 0; i < passwordLength; i++) {
    password += chars[max(chars.length)];
  }

  // Ensure at least one of each required type
  password = password
    .slice(3) // Remove first 3 chars to make room for requirements
    + lowercase[max(lowercase.length)]
    + uppercase[max(uppercase.length)]
    + numbers[max(numbers.length)];

  // Simple shuffle
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

const args = parseArgs(Deno.args, {
  boolean: ["no-symbols"],
  string: ["n"],
});

if (args.n) {
  const passwordLength = parseInt(args.n);
  if (isNaN(passwordLength) || passwordLength < 8) {
    console.error("Password length must be a number >= 8");
    Deno.exit(1);
  }
  
  const count = args._.length > 0 ? Number(args._[0]) : 1;
  for (let i = 0; i < count; i++) {
    console.log(generateRandom(passwordLength, !args["no-symbols"]));
  }
} else {
  const count = args._.length > 0 ? Number(args._[0]) : 1;
  for (let i = 0; i < count; i++) {
    console.log(generateWordBased());
  }
}
