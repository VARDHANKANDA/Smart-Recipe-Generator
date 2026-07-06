/// <reference types="vite/client" />

interface Window {
  SpeechRecognition?: { new (): { onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null; start: () => void } };
  webkitSpeechRecognition?: { new (): { onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null; start: () => void } };
}
