/* eslint-disable max-classes-per-file */
import { faker } from '@faker-js/faker';
import {
  Encrypter,
  HashCompare,
} from '../../../src/data/protocols/cryptography';
import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from '../../../src/data/protocols/db/account';
import { DbAuthentication } from '../../../src/data/usecases/db-authentication';
import { Authentication } from '../../../src/domain/usecases';

class LoadAccountByEmailRepositorySpy implements LoadAccountByEmailRepository {
  email: string;
  result = {
    id: faker.datatype.uuid(),
    name: faker.name.findName(),
    password: faker.internet.password(),
  };

  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    this.email = email;
    return this.result;
  }
}

class HashComparerSpy implements HashCompare {
  plaintext: string;
  digest: string;
  isValid = true;

  async compare(plaintext: string, digest: string): Promise<boolean> {
    this.plaintext = plaintext;
    this.digest = digest;
    return this.isValid;
  }
}

class EncrypterSpy implements Encrypter {
  token = faker.datatype.uuid();
  value: string;

  async encrypt(value: string): Promise<string> {
    this.value = value;
    return this.token;
  }
}

class UpdateAccessTokenRepositorySpy implements UpdateAccessTokenRepository {
  id: string;
  token: string;

  async updateAccessToken(id: string, token: string): Promise<void> {
    this.id = id;
    this.token = token;
  }
}

const mockAuthenticationParams = (): Authentication.Params => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

type MakeSutReturn = {
  sut: DbAuthentication;
  loadAccountByEmailRepositorySpy: LoadAccountByEmailRepositorySpy;
  hashComparerSpy: HashComparerSpy;
  encrypterSpy: EncrypterSpy;
  updateAccessTokenRepositorySpy: UpdateAccessTokenRepositorySpy;
};

const makeSut = (): MakeSutReturn => {
  const loadAccountByEmailRepositorySpy = new LoadAccountByEmailRepositorySpy();
  const hashComparerSpy = new HashComparerSpy();
  const encrypterSpy = new EncrypterSpy();
  const updateAccessTokenRepositorySpy = new UpdateAccessTokenRepositorySpy();
  const sut = new DbAuthentication(
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy
  );
  return {
    sut,
    loadAccountByEmailRepositorySpy,
    hashComparerSpy,
    encrypterSpy,
    updateAccessTokenRepositorySpy,
  };
};

describe('DbAuthentication', () => {
  it('should be able to call LoadAccountByEmailRepository with correct param', async () => {
    const { sut, loadAccountByEmailRepositorySpy } = makeSut();
    const authenticationParams = mockAuthenticationParams();
    await sut.auth(authenticationParams);
    expect(loadAccountByEmailRepositorySpy.email).toBe(
      authenticationParams.email
    );
  });
});
