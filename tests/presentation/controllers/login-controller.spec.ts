import { faker } from '@faker-js/faker';
import { LoginController } from '../../../src/presentation/controllers/login-controller';
import { MissingParamError } from '../../../src/presentation/errors';
import { badRequest } from '../../../src/presentation/helpers';
import { Validation } from '../../../src/presentation/protocols';

const makeValidCredentials = (): LoginController.Request => ({
  email: faker.internet.email(),
  password: faker.internet.password(),
});

class ValidationSpy implements Validation {
  input: any;
  error: Error = null;

  validate(input: any): Error {
    this.input = input;
    return this.error;
  }
}

type MakeSutReturn = {
  sut: LoginController;
  validationSpy: ValidationSpy;
};

const makeSut = (): MakeSutReturn => {
  const validationSpy = new ValidationSpy();
  const sut = new LoginController(validationSpy);
  return {
    sut,
    validationSpy,
  };
};

describe('Login Controller', () => {
  it('should be able to call Validation with correct values', async () => {
    const { sut, validationSpy } = makeSut();
    const request = makeValidCredentials();
    await sut.handle(request);
    expect(validationSpy.input).toEqual(request);
  });

  it('should be able to return 400 if Validation fails', async () => {
    const { sut, validationSpy } = makeSut();
    validationSpy.error = new MissingParamError(faker.random.word());
    const request = makeValidCredentials();
    const httpResponse = await sut.handle(request);
    expect(httpResponse).toEqual(badRequest(validationSpy.error));
  });
});
