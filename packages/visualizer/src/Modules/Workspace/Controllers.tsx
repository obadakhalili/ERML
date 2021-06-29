import { useRecoilState } from "recoil"
import {
  Menu,
  MenuItem,
  MenuDivider,
  Checkbox,
  Popover,
  Button,
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
    <>
      <SnippetExplorer />
      <Popover
        autoFocus={false}
        position={Position.BOTTOM_LEFT}
        content={OptionsContent}
      >
        <Button text="options" rightIcon="cog" />
      </Popover>
    </>
  )
}
