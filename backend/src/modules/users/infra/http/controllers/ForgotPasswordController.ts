import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgotPassowrdEmailService from '@modules/users/services/SendForgotPassowrdEmailService';

export default class ForgotPasswordController {
  async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPasswordEmailService = container.resolve(
      SendForgotPassowrdEmailService,
    );

    await sendForgotPasswordEmailService.execute({
      email,
    });

    return response.status(204).json();
  }
}
