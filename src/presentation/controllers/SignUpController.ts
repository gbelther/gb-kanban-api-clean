import { AddAccount } from '../../domain/useCases';
import { InvalidParamError, MissingParamError } from '../errors';
import { badRequest, serverError, success } from '../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../protocols';
import { EmailValidator } from '../protocols/EmailValidator';

export class SignUpController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const emailIsValid = this.emailValidator.isValid(email);
      if (!emailIsValid) {
        return badRequest(new InvalidParamError('email'));
      }

      const account = await this.addAccount.add({
        name,
        email,
        password,
      });

      return success(account);
    } catch (error) {
      return serverError();
    }
  }
}
