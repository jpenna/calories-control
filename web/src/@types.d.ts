
declare module 'element-ui/lib/locale/lang/en';

type MessageType = 'error' | 'success' | 'warning' | 'info' | undefined;
interface Window {
  $notifyGlobal: (params: { message?: string, type: MessageType, title: string } | string) => void;

  $messageGlobal: (message: string, type?: MessageType) => void;
}
