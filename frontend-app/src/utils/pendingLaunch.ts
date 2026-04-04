import type { AttachmentType } from '@/interface';

export interface PendingFile {
  blob: Blob;
  name: string;
  mimeType: string;
  type: AttachmentType;
}

interface PendingLaunch {
  text: string;
  files: PendingFile[];
}

let _store: PendingLaunch = { text: '', files: [] };

export const setPendingLaunch = (data: Partial<PendingLaunch>) => {
  _store = { text: data.text ?? '', files: data.files ?? [] };
};

export const getPendingLaunch = (): PendingLaunch => _store;

export const clearPendingLaunch = () => {
  _store = { text: '', files: [] };
};

export const hasPendingLaunch = () =>
  _store.text !== '' || _store.files.length > 0;
