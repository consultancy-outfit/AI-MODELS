import { Injectable } from '@nestjs/common';
import { mockDb } from '../../store/mock-db';

@Injectable()
export class FormsService {
  submitContact(body: Record<string, unknown>) {
    mockDb.contactForms.push({ ...body, id: `contact_${Date.now()}` });
    return { submitted: true };
  }

  submitFeedback(body: Record<string, unknown>) {
    mockDb.feedbackForms.push({ ...body, id: `feedback_${Date.now()}` });
    return { submitted: true };
  }
}
