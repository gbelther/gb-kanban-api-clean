import { faker } from '@faker-js/faker';
import jsonwebtoken from 'jsonwebtoken';
import { JwtAdapter } from '../../../src/infra/cryptography';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },
}));

const makeSut = (secret: string = faker.random.word()): JwtAdapter =>
  new JwtAdapter(secret);

describe('Jwt Adapter', () => {
  it('should be able to call sign with correct values', async () => {
    const secret = faker.datatype.uuid();
    const sut = makeSut(secret);
    const signSpy = jest.spyOn(jsonwebtoken, 'sign');
    const value = faker.random.word();
    await sut.encrypt(value);
    expect(signSpy).toHaveBeenCalledWith({ id: value }, secret);
  });
});
