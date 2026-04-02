export type SpeechRecognitionEventLite = {
  results: ArrayLike<{ 0: { transcript: string } }>;
};

export type SpeechRecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLite) => void) | null;
  start: () => void;
  stop: () => void;
};
