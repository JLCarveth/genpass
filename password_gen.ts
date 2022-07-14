/**
 * Running this password gen requires *either* a dictionary available on 
 * /usr/share/dict/words or as a fallback, "wordlist.txt" within the same directory
 * as the executable.
 * 
 * Compile with: deno compile --allow-read --output genpass password_gen.ts
 * Good source of a wordlist if you aren't using /usr/share/dict is 
 * the Ethereum wordlist (I'm not a cryptobro I swear)
 * https://raw.githubusercontent.com/openethereum/wordlist/master/res/wordlist.txt
 */
let wordlist = '';
try {
    wordlist = await Deno.readTextFile("/usr/share/dict/words");
} catch {
    wordlist = await Deno.readTextFile("./wordlist.txt");
}
const dictionary: Array<string> = wordlist.split("\n");
const length: number = dictionary.length;
const max = (length: number) => {
  return Math.floor(Math.random() * length);
};
const upper = (s: string) => {
  return s[0].toUpperCase() + s.slice(1);
};

function generate(): string {
  const a = max(length), b = max(length), c = max(length);
  const digits = max(1000);
  /**
   * The .split("'s") is to remove 
   */
  return upper(dictionary[a]).split("'s")[0] +
    upper(dictionary[b]).split("'s")[0] +
    upper(dictionary[c]).split("'s")[0] +
    digits;
}

console.log(generate());
