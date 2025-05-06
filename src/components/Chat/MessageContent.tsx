
import React from 'react';
import ReactMarkdown from "react-markdown";

interface MessageContentProps {
  content: string;
}

const MessageContent = ({ content }: MessageContentProps) => {
  // Format message content
  const formatMessageContent = (content: string) => {
    return content;
  };

  return (
    <div className="chat-message max-h-[500px] overflow-y-auto scrollbar-thin pr-6" style={{
      scrollbarWidth: 'thin',
      scrollbarColor: '#a87c3a #f0f0f0',
      WebkitOverflowScrolling: 'touch'
    }}>
      <div className="pr-4">
        <ReactMarkdown 
          className="prose prose-lg max-w-none prose-p:my-4"
          components={{
            p: ({node, ...props}) => <p className="mb-5 last:mb-0 text-lg" {...props} />,
            em: ({node, ...props}) => <span className="text-desyr-deep-gold" {...props} />,
            strong: ({node, ...props}) => <span className="text-desyr-soft-gold" {...props} />,
            blockquote: ({node, ...props}) => (
              <blockquote className="border-l-4 border-desyr-soft-gold/50 pl-4 text-desyr-soft-gold" {...props} />
            )
          }}
        >
          {formatMessageContent(content)}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MessageContent;
