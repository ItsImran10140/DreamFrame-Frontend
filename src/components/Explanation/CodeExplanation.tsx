/* eslint-disable @typescript-eslint/no-explicit-any */
import MarkdownExplanation from "../../utils/MarkDown";

const CodeExplanation = ({ project }: any) => {
  return (
    <div className="flex-grow overflow-hidden rounded-lg border-[0.75px] border-zinc-800/40 bg-zinc-800/40">
      <div className="h-full overflow-y-auto">
        <MarkdownExplanation explanation={project?.explanation} />
      </div>
    </div>
  );
};

export default CodeExplanation;
