export class InputError extends Error {
  constructor(message: string, lineNumber?: number) {
    super(lineNumber === undefined ? message : `Line ${lineNumber}: ${message}`);
    this.name = "InputError";
  }
}
