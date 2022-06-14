import { faker } from '@faker-js/faker';
import { MissingParamError } from '../errors';
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
});
