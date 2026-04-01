import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { randomUUID } from 'node:crypto';
import type { Request } from 'express';
import { mockDb } from '../../store/mock-db';
import type { UploadBody } from './upload.schema';

@Injectable()
export class UploadService {
  constructor(private readonly configService: ConfigService) {}

  async upload(body: UploadBody, req: Request) {
    const now = new Date().toISOString();
    const filename = body.filename?.trim() || 'mock-file';
    const mimeType = body.mimeType?.trim() || 'application/octet-stream';
    const id = `upload_${randomUUID()}`;
    const previewUrl = mimeType.startsWith('image/')
      ? `/uploads/previews/${encodeURIComponent(filename)}`
      : '/uploads/previews/file-generic';
    const url = `/uploads/${encodeURIComponent(filename)}`;
    const uploadRecord = {
      id,
      filename,
      mimeType,
      size: body.size ?? 0,
      url,
      previewUrl,
      createdAt: now,
    };

    mockDb.uploads.unshift(uploadRecord);
    const forwarded = await this.forwardUpload(body);

    return {
      ...uploadRecord,
      sizeLabel: this.formatFileSize(uploadRecord.size),
      isImage: mimeType.startsWith('image/'),
      sessionId: body.sessionId ?? null,
      modelId: body.modelId ?? null,
      altText: body.altText ?? null,
      description: body.description ?? null,
      uploadedBy: this.resolveUploadUserId(req),
      forwardedToMl: Boolean(forwarded),
      mlReference: forwarded?.id ?? forwarded?.reference ?? null,
    };
  }

  private async forwardUpload(body: UploadBody) {
    const mlApiUrl = this.configService.get<string>('ML_TEAM_API_URL');
    if (!mlApiUrl) return null;

    try {
      const response = await axios.post(`${mlApiUrl.replace(/\/$/, '')}/upload`, body, {
        timeout: 10000,
      });
      return response.data;
    } catch {
      return null;
    }
  }

  private formatFileSize(bytes: number) {
    if (!bytes) {
      return '0 B';
    }
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex += 1;
    }
    return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unitIndex]}`;
  }

  private resolveUploadUserId(req: Request) {
    const header = req.headers.authorization;
    return header?.startsWith('Bearer ') ? header.slice(7) : null;
  }
}
