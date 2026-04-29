import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleChat, pushUser, sendChatMessage } from '../store/slices/chatSlice';

export default function ChatWidget() {
  const dispatch = useDispatch();
  const { open, messages, sending } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, sending, open]);

  const send = () => {
    const msg = input.trim();
    if (!msg || sending) return;
    dispatch(pushUser(msg));
    setInput('');
    dispatch(sendChatMessage({ message: msg, userEmail: user?.email }));
  };

  return (
    <>
      <button
        className="chat-toggle"
        onClick={() => dispatch(toggleChat())}
        title="Ask GadgetBot"
        aria-label="Open chat"
      >
        🤖
      </button>
      <div className={`chat-window ${open ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-avatar">🤖</div>
          <div className="chat-header-info">
            <h4>GadgetBot</h4>
            <p>● Online – Powered by n8n</p>
          </div>
        </div>
        <div className="chat-messages" ref={scrollRef}>
          {messages.map((m) => (
            <div key={m.id} className={`msg ${m.cls}`}>{m.text}</div>
          ))}
          {sending && <div className="msg bot typing">…typing</div>}
        </div>
        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder="Ask me anything…"
          />
          <button className="chat-send" onClick={send} aria-label="Send">➤</button>
        </div>
      </div>
    </>
  );
}
