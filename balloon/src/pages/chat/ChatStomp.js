import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function ChatStomp() {
  const sock = new SockJS('http://localhost:8080/chatstart');
  const client = Stomp.over(sock);

  client.connect({}, () => {
    client.subscribe(`/topic/message`, () => {
      disconnect();
    });
  });

  const disconnect = () => {
    client.disconnect();
  };

  return client;
}
export default ChatStomp;
