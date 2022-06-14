/* eslint-disable @typescript-eslint/no-unused-vars */
import { faker } from '@faker-js/faker';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { EmailValidator } from '../protocols/EmailValidator';
import { SignUpController } from './SignUpController';

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

type MakeSutReturn = {
  sut: SignUpController;
  emailValidatorStub: EmailValidator;
};

const makeSut = (): MakeSutReturn => {
  const emailValidatorStub = makeEmailValidator();
  const sut = new SignUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
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

  it('should return 400 if email is invalid', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const password = faker.internet.password();
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.name.findName(),
        password,
        passwordConfirmation: password,
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should call EmailValidator with correct param', async () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const email = faker.internet.email();
    const password = faker.internet.password();
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email,
        password,
        passwordConfirmation: password,
      },
    };
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith(email);
  });

  it('should return 500 if email validator throws', async () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new Error();
    });
    const password = faker.internet.password();
    const httpRequest = {
      body: {
        name: faker.name.findName(),
        email: faker.internet.email(),
        password,
        passwordConfirmation: password,
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
