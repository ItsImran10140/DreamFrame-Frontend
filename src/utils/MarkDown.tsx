/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface MarkdownExplanationProps {
  explanation?: string;
}

export default function MarkdownExplanation({
  explanation,
}: MarkdownExplanationProps) {
  // If there's no explanation, show a placeholder
  if (!explanation) {
    return (
      <div className="flex items-center justify-center h-full p-6 text-zinc-500 text-sm">
        No explanation available for this animation.
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto bg-zinc-900 rounded-lg text-gray-200">
      <h3 className="font-semibold text-lg mb-2 text-gray-100">
        Animation Explanation
      </h3>
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          components={{
            code(
              { node, className, children, ...props }: any,
              { inline = false }: { inline?: boolean } = {}
            ) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={atomDark}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md my-2"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code
                  className="bg-zinc-800 px-1 py-0.5 rounded text-sm"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            h1: ({ node, ...props }) => (
              <h1 className="text-xl font-bold mt-6 mb-2" {...props} />
            ),
            h2: ({ node, ...props }) => (
              <h2 className="text-lg font-bold mt-5 mb-2" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="text-md font-bold mt-4 mb-2" {...props} />
            ),
            p: ({ node, ...props }) => <p className="my-3" {...props} />,
            ul: ({ node, ...props }) => (
              <ul className="list-disc pl-6 my-3" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal pl-6 my-3" {...props} />
            ),
            li: ({ node, ...props }) => <li className="my-1" {...props} />,
            a: ({ node, ...props }) => (
              <a className="text-blue-400 hover:underline" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-zinc-600 pl-4 italic my-3"
                {...props}
              />
            ),
          }}
        >
          {explanation}
        </ReactMarkdown>
      </div>
    </div>
  );
}
