import { randomBytes } from 'crypto';
import { GeneratorCodeType } from '../../core/model/enum/generator_code_type';

function generateCode(
  length = 6,
  type: GeneratorCodeType = GeneratorCodeType.string,
): string {
  const chars =
    type === GeneratorCodeType.number
      ? '0123456789'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const bytes = randomBytes(length);
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }

  return result;
}

export default generateCode;
