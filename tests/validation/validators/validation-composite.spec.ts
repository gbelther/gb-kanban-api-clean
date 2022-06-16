import { faker } from '@faker-js/faker';
import { MissingParamError } from '../../../src/presentation/errors';
import { Validation } from '../../../src/presentation/protocols';
import { ValidationComposite } from '../../../src/validation/validators';

class ValidationSpy implements Validation {
  error: Error = null;
  input: any;

  validate(input: any): Error {
    this.input = input;
    return this.error;
  }
}

type MakeSutReturn = {
  sut: ValidationComposite;
  validationSpies: ValidationSpy[];
};

const makeSut = (): MakeSutReturn => {
  const validationSpies = [new ValidationSpy(), new ValidationSpy()];
  const sut = new ValidationComposite(validationSpies);
  return {
    sut,
    validationSpies,
  };
};

describe('Validation Composite', () => {
  it('should return error if any validation fails', () => {
    const { sut, validationSpies } = makeSut();
    const field = faker.database.column();
    validationSpies[0].error = new MissingParamError(field);
    const error = sut.validate({ [field]: faker.random.word() });
    expect(error).toEqual(validationSpies[0].error);
  });

  it('should return the first error', () => {
    const { sut, validationSpies } = makeSut();
    const field = faker.database.column();
    validationSpies[0].error = new MissingParamError(field);
    validationSpies[1].error = new Error();
    const error = sut.validate({ [field]: faker.random.word() });
    expect(error).toEqual(validationSpies[0].error);
  });

  it('should not return anything if validate succeeds', () => {
    const { sut } = makeSut();
    const field = faker.database.column();
    const error = sut.validate({ [field]: faker.random.word() });
    expect(error).toBeFalsy();
  });
});
