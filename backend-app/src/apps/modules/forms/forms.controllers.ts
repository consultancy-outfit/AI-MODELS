import { Body, Controller, Post } from '@nestjs/common';
import { FormsService } from './forms.services';

@Controller('forms')
export class FormsController {
  constructor(private readonly formsService: FormsService) {}

  @Post('contact')
  submitContact(@Body() body: Record<string, unknown>) {
    return this.formsService.submitContact(body);
  }

  @Post('feedback')
  submitFeedback(@Body() body: Record<string, unknown>) {
    return this.formsService.submitFeedback(body);
  }
}
