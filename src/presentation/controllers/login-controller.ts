import { badRequest, serverError, success } from '../helpers';
import { Controller, HttpResponse, Validation } from '../protocols';

export class LoginController implements Controller {
  constructor(private readonly validation: Validation) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      return success({
        email: request.email,
        password: request.password,
      });
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  };
}
