export enum GeneratorCodeType {
  number = 'number',
  string = 'string',
}

export namespace GeneratorCodeType {
  export function fromString(content?: string): GeneratorCodeType {
    switch (content?.toLowerCase()) {
      case GeneratorCodeType.number:
        return GeneratorCodeType.number;
      case GeneratorCodeType.string:
        return GeneratorCodeType.string;
      default:
        throw new Error('Invalid GeneratorCodeType');
    }
  }
}
