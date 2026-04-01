export type UploadBody = {
  filename?: string;
  mimeType?: string;
  size?: number;
  sessionId?: string;
  modelId?: string;
  altText?: string;
  description?: string;
};
