import { faker } from '@faker-js/faker';
import { MissingParamError } from '../../../src/presentation/errors';
import { RequiredFieldValidation } from '../../../src/validation/validators';

const makeSut = (field: string): RequiredFieldValidation =>
  new RequiredFieldValidation(field);

describe('Required Field Validation', () => {
  it('should return MissingParamError if validation fails', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({
      [faker.database.column()]: faker.random.word(),
    });
    expect(error).toEqual(new MissingParamError(field));
  });

  it('should return nothing if validation succeeds', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.random.word() });
    expect(error).toBeFalsy();
  });
});
