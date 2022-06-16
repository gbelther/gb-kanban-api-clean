import { faker } from '@faker-js/faker';
import { InvalidParamError } from '../../../src/presentation/errors';
import { EmailValidator } from '../../../src/validation/protocols';
import { EmailValidation } from '../../../src/validation/validators';
import { throwError } from '../../domain/mocks';

class EmailValidatorSpy implements EmailValidator {
  isEmailValid = true;
  email: string;

  isValid(email: string): boolean {
    this.email = email;
    return this.isEmailValid;
  }
}

type MakeSutReturn = {
  sut: EmailValidation;
  emailValidatorSpy: EmailValidatorSpy;
};

const makeSut = (field: string = faker.database.column()): MakeSutReturn => {
  const emailValidatorSpy = new EmailValidatorSpy();
  const sut = new EmailValidation(field, emailValidatorSpy);
  return {
    sut,
    emailValidatorSpy,
  };
};

describe('Email Validation', () => {
  it('should return an error if EmailValidator returns false', () => {
    const field = faker.database.column();
    const { sut, emailValidatorSpy } = makeSut(field);
    emailValidatorSpy.isEmailValid = false;
    const email = faker.internet.email();
    const error = sut.validate({ [field]: email });
    expect(error).toEqual(new InvalidParamError(field));
  });

  it('should call EmailValidator with correct param', () => {
    const field = faker.database.column();
    const { sut, emailValidatorSpy } = makeSut(field);
    const email = faker.internet.email();
    sut.validate({ [field]: email });
    expect(emailValidatorSpy.email).toBe(email);
  });

  it('should throws if EmailValidator throw', () => {
    const { sut, emailValidatorSpy } = makeSut();
    jest
      .spyOn(emailValidatorSpy, 'isValid')
      .mockImplementationOnce(() => throwError());
    expect(sut.validate).toThrow();
  });
});
