const mapWordToSymbol: Record<string, string> = {
  sharp: "#",
  slash: "/",
};

const mapSymbolToWord: Record<string, string> = {
  "#": "sharp",
  "/": "slash",
};

export function convertChordNotation(input: string) {
  if (/(sharp|slash)/i.test(input)) {
    return input.replace(
      /(sharp|slash)/gi,
      (match) => mapWordToSymbol[match.toLowerCase()]
    );
  }

  if (/[/#]/.test(input)) {
    return input.replace(/[/#]/g, (match) => mapSymbolToWord[match]);
  }

  return input;
}
