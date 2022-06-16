import jsonwebtoken from 'jsonwebtoken';
import { Encrypter } from '../../data/protocols/cryptography';

export class JwtAdapter implements Encrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    return jsonwebtoken.sign({ id: value }, this.secret);
  }
}
