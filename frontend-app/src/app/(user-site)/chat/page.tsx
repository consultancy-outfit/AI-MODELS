import { Suspense } from 'react';
import Chat from '@/ui/chat';

const ChatPage = () => {
  return (
    <Suspense fallback={null}>
      <Chat />
    </Suspense>
  );
};

export default ChatPage;
