import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { BcryptAdapter } from '../../../src/infra/cryptography';
import { throwError } from '../../domain/mocks';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return 'hash';
  },
  async compare(): Promise<boolean> {
    return true;
  },
}));

const makeSut = (salt: number = faker.datatype.number()): BcryptAdapter =>
  new BcryptAdapter(salt);

describe('Bcrypt Adapter', () => {
  it('should be able to call hash with correct value', async () => {
    const salt = faker.datatype.number();
    const sut = makeSut(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const plaintext = faker.random.word();
    await sut.hash(plaintext);
    expect(hashSpy).toHaveBeenCalledWith(plaintext, salt);
  });

  it('should be able to return a hash when succeeds', async () => {
    const sut = makeSut();
    const hash = await sut.hash(faker.random.word());
    expect(hash).toBe('hash');
  });

  it('should be able to return throws if hash throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError);
    const hashPromise = sut.hash(faker.random.word());
    await expect(hashPromise).rejects.toThrow();
  });

  it('should be able to call compare with correct value', async () => {
    const sut = makeSut();
    const compareSpy = jest.spyOn(bcrypt, 'compare');
    const passwordWithHash = faker.internet.password();
    const hash = faker.datatype.uuid();
    await sut.compare(passwordWithHash, hash);
    expect(compareSpy).toHaveBeenCalledWith(passwordWithHash, hash);
  });

  it('should be able to return false if compare fails', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false);
    const isValid = await sut.compare(
      faker.internet.password(),
      faker.datatype.uuid()
    );
    expect(isValid).toBeFalsy();
  });

  it('should be able to return true if compare succeeds', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'compare');
    const isValid = await sut.compare(
      faker.internet.password(),
      faker.datatype.uuid()
    );
    expect(isValid).toBeTruthy();
  });
});
