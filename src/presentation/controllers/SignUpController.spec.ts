import { faker } from '@faker-js/faker';
import { InvalidParamError, MissingParamError } from '../errors';
import { SignUpController } from './SignUpController';

type MakeSutReturn = {
  sut: SignUpController;
};

const makeSut = (): MakeSutReturn => {
  const sut = new SignUpController();
  return {
    sut,
  };
};

describe('SignUpController', () => {
  it('should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        passwordConfirmation: faker.internet.password(),
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        password: faker.internet.password(),
        passwordConfirmation: faker.internet.password(),
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        passwordConfirmation: faker.internet.password(),
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  it('should return 400 if no passwordConfirmation and password are not equals', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password: 'password',
        passwordConfirmation: 'passwordConfirmation',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });
});
