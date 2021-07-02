import SnippetExplorer from "./SnippetExplorer"
import WorkspaceOptions from "./WorkspaceOptions"

export default function ToolBar() {
  return (
    <div className="h-11 px-2 flex justify-between items-center border-0 border-b border-solid border-[#ddd]">
      <SnippetExplorer />
      <WorkspaceOptions />
    </div>
  )
}
