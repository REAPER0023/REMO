import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function CodeBlock({ children, className }) {
  const [copied, setCopied] = useState(false);

  const language = className
    ? className.replace("language-", "")
    : "";

  const code = String(children).replace(/\n$/, "");

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-language">
          {language || "code"}
        </span>

        <button
          type="button"
          className="copy-code-btn"
          onClick={copyCode}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      <pre>
        <code className={className}>{code}</code>
      </pre>
    </div>
  );
}

function MessageBubble({ sender, text, loading }) {
  return (
    <div className={`message ${sender} ${loading ? "thinking" : ""}`}>
      {loading ? (
        <div className="thinking-indicator">
          <span>Remo is thinking</span>

          <div className="thinking-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      ) : sender === "ai" ? (
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre({ children }) {
              const codeElement = children?.props;

              return (
                <CodeBlock
                  className={codeElement?.className}
                >
                  {codeElement?.children}
                </CodeBlock>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      ) : (
        text
      )}
    </div>
  );
}

export default MessageBubble;