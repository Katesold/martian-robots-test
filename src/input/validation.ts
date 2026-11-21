export function toInteger(text: string | undefined): number | undefined {
  // digits only 0-9
  if (text === undefined || !/^\d+$/.test(text)) return undefined;
  return Number(text);
}
