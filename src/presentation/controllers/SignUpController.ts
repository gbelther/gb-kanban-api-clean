import { MissingParamError } from '../errors';
import { badRequest, serverError, success } from '../helpers/httpHelper';
import { Controller, HttpRequest, HttpResponse } from '../protocols';

export class SignUpController implements Controller {
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

      return success({ name, email, password, passwordConfirmation });
    } catch (error) {
      return serverError();
    }
  }
}
