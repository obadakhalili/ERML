import { useRecoilState } from "recoil"
import {
  Menu,
  MenuItem,
  MenuDivider,
  Checkbox,
  Popover,
  Icon,
  Position,
} from "@blueprintjs/core"

import SnippetExplorer from "./SnippetExplorer"
import { activeViewerState } from "../../state"

export default function Controllers() {
  const [activeViewer, setActiveViewer] = useRecoilState(activeViewerState)

  const OptionsContent = (
    <Menu>
      <MenuItem
        shouldDismissPopover={false}
        text={
          <div className="flex">
            <div className="w-full">Enable Vim</div>
            <Checkbox checked={false} />
          </div>
        }
        icon="key"
      />
      <MenuItem
        shouldDismissPopover={false}
        text={
          <div className="flex">
            <div className="w-full">Word Wrap</div>
            <Checkbox checked={true} />
          </div>
        }
        icon="compressed"
      />
      <MenuDivider />
      <MenuItem icon="eye-open" text="Viewer">
        <MenuItem
          text="Diagram"
          icon="graph"
          disabled={activeViewer === "Diagram"}
          onClick={() => setActiveViewer("Diagram")}
        />
        <MenuItem
          text="AST"
          icon="diagram-tree"
          disabled={activeViewer === "AST"}
          onClick={() => setActiveViewer("AST")}
        />
      </MenuItem>
    </Menu>
  )

  return (
    <div className="h-11 px-2 flex justify-between items-center border-0 border-b border-solid border-[#ddd]">
      <SnippetExplorer />
      <Popover
        autoFocus={false}
        position={Position.RIGHT_TOP}
        content={OptionsContent}
        className="cursor-pointer"
      >
        <Icon icon="cog" className="hover:opacity-80" />
      </Popover>
    </div>
  )
}
