import jsonwebtoken from 'jsonwebtoken';
import { Decrypter, Encrypter } from '../../data/protocols/cryptography';

export class JwtAdapter implements Encrypter, Decrypter {
  constructor(private readonly secret: string) {}

  async encrypt(value: string): Promise<string> {
    return jsonwebtoken.sign({ id: value }, this.secret);
  }

  async decrypt(value: string): Promise<string> {
    return jsonwebtoken.verify(value, this.secret) as any;
  }
}
