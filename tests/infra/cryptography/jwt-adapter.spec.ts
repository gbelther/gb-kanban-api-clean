import { faker } from '@faker-js/faker';
import jsonwebtoken from 'jsonwebtoken';
import { JwtAdapter } from '../../../src/infra/cryptography';
import { throwError } from '../../domain/mocks';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },
  async verify(): Promise<string> {
    return 'any_value';
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

  it('should be able to return a token when sign succeeds', async () => {
    const sut = makeSut();
    const token = await sut.encrypt(faker.random.word());
    expect(token).toBe('any_token');
  });

  it('should be able to throw if method throws', async () => {
    const sut = makeSut();
    jest.spyOn(jsonwebtoken, 'sign').mockImplementationOnce(throwError);
    const encryptPromise = sut.encrypt(faker.random.word());
    await expect(encryptPromise).rejects.toThrow();
  });

  it('should be able to call verify with correct values', async () => {
    const secret = faker.random.word();
    const sut = makeSut(secret);
    const verifySpy = jest.spyOn(jsonwebtoken, 'verify');
    const token = faker.datatype.uuid();
    await sut.decrypt(token);
    expect(verifySpy).toHaveBeenCalledWith(token, secret);
  });
});
