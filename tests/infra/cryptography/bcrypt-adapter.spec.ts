import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { BcryptAdapter } from '../../../src/infra/cryptography';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },
}));

const makeSut = (salt = faker.datatype.number()): BcryptAdapter =>
  new BcryptAdapter(salt);

describe('Bcrypt Adapter', () => {
  it('should be able to call hash with correct value', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash');
    const hash = await sut.hash(faker.random.word());
    expect(hash).toBe('hash');
  });
});
