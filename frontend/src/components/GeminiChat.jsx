import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import styled from 'styled-components';

const ChatContainer = styled.div`
  max-width: 1000px;
  margin: 2rem auto;
  padding: 2rem;
  background: ${props => props.theme.colors.backgroundAlt};
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const MessagesContainer = styled.div`
  height: 600px;
  overflow-y: auto;
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 15px;
  background: ${props => props.theme.colors.background};
  margin-bottom: 1.5rem;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.backgroundAlt};
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.primary};
    border-radius: 4px;
  }
`;

const MessageBubble = styled.div`
  max-width: 85%;
  margin: ${props => props.isUser ? '1rem 0 1rem auto' : '1rem 0'};
  padding: 1.5rem;
  border-radius: 15px;
  background-color: ${props => props.isUser ? props.theme.colors.primary : props.theme.colors.backgroundAlt};
  color: ${props => props.isUser ? '#fff' : props.theme.colors.text};
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  line-height: 1.7;
  font-size: 1.05rem;
  white-space: pre-wrap;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1rem 0 0.5rem;
    color: ${props => props.isUser ? '#fff' : props.theme.colors.primary};
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  li {
    margin: 0.5rem 0;
  }

  strong {
    color: ${props => props.isUser ? '#fff' : props.theme.colors.primary};
    font-weight: 600;
  }

  .metric-value {
    font-family: monospace;
    background: ${props => props.isUser ? 'rgba(255,255,255,0.1)' : props.theme.colors.background};
    padding: 0.1rem 0.3rem;
    border-radius: 4px;
    margin: 0 0.2rem;
  }

  .disclaimer {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid ${props => props.isUser ? 'rgba(255,255,255,0.1)' : props.theme.colors.border};
    font-size: 0.9rem;
    font-style: italic;
    opacity: 0.8;
  }
`;

const InputForm = styled.form`
  display: flex;
  gap: 1rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${props => props.theme.borderRadius.medium};
  cursor: pointer;
  font-size: 1rem;
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const systemPrompt = `You are an Indian expert financial analyst and stock market specialist. Your role is to:
  1. Analyze market trends and provide data-driven insights
  2. Extract and explain key financial metrics
  3. Identify significant market patterns and potential opportunities
  4. Provide context-specific analysis for different market sectors
  5. Explain complex financial concepts in clear, understandable terms
  6. Always include relevant numerical data and percentages when available
  7. Structure responses with clear sections: Market Overview, Key Metrics, Sector Analysis, and Action Points
  8. Include relevant disclaimers about financial advice
  Please provide comprehensive, well-structured responses while maintaining professional financial analysis standards.`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });  // Fixed model name
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: input }] }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.8,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      });

      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error analyzing the market data. Please try again.' 
      }]);
    }
    setIsLoading(false);
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/(\d+\.?\d*%?)/g, '<span class="metric-value">$1</span>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <ChatContainer>
      <MessagesContainer>
        {messages.map((message, index) => (
          <MessageBubble 
            key={index} 
            isUser={message.role === 'user'}
            dangerouslySetInnerHTML={{
              __html: message.role === 'user' 
                ? message.content 
                : formatMessage(message.content)
            }}
          />
        ))}
        {isLoading && (
          <MessageBubble>
            <div className="loading">Analyzing market data...</div>
          </MessageBubble>
        )}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputForm onSubmit={handleSubmit}>
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          Send
        </Button>
      </InputForm>
    </ChatContainer>
  );
};

export default GeminiChat;