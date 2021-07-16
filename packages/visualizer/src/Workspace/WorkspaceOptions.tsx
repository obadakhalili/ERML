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

import {
  workspaceOptionsState,
  ActiveViewer,
  IWorkspaceOptions,
} from "../state"

export default function WorkspaceOptions() {
  const [
    { vimEnabled, minimapDisplayed, wordWrapped, activeViewer },
    setWorkspaceOptions,
  ] = useRecoilState(workspaceOptionsState)

  const OptionsContent = (
    <Menu>
      <MenuItem
        shouldDismissPopover={false}
        text={
          <div className="flex">
            <div className="w-full">Vim</div>
            <Checkbox
              checked={vimEnabled}
              onChange={handleWorkspaceOptionsChange<boolean>(
                "vimEnabled",
                !vimEnabled
              )}
            />
          </div>
        }
        icon="key"
      />
      <MenuItem
        shouldDismissPopover={false}
        text={
          <div className="flex">
            <div className="w-full">Minimap</div>
            <Checkbox
              checked={minimapDisplayed}
              onChange={handleWorkspaceOptionsChange<boolean>(
                "minimapDisplayed",
                !minimapDisplayed
              )}
            />
          </div>
        }
        icon="path-search"
      />
      <MenuItem
        shouldDismissPopover={false}
        text={
          <div className="flex">
            <div className="w-full">Word Wrap</div>
            <Checkbox
              checked={wordWrapped}
              onChange={handleWorkspaceOptionsChange<boolean>(
                "wordWrapped",
                !wordWrapped
              )}
            />
          </div>
        }
        icon="compressed"
      />
      <MenuDivider />
      <MenuItem
        popoverProps={{ openOnTargetFocus: false }}
        icon="eye-open"
        text="Viewer"
      >
        <MenuItem
          text={ActiveViewer.DIAGRAM}
          icon="graph"
          disabled={activeViewer === ActiveViewer.DIAGRAM}
          onClick={handleWorkspaceOptionsChange<
            IWorkspaceOptions["activeViewer"]
          >("activeViewer", ActiveViewer.DIAGRAM)}
        />
        <MenuItem
          text={ActiveViewer.AST}
          icon="diagram-tree"
          disabled={activeViewer === ActiveViewer.AST}
          onClick={handleWorkspaceOptionsChange<
            IWorkspaceOptions["activeViewer"]
          >("activeViewer", ActiveViewer.AST)}
        />
      </MenuItem>
    </Menu>
  )

  return (
    <Popover
      autoFocus={false}
      position={Position.RIGHT_TOP}
      content={OptionsContent}
      className="cursor-pointer"
    >
      <Icon icon="cog" className="hover:opacity-80" />
    </Popover>
  )

  function handleWorkspaceOptionsChange<T>(
    option: keyof IWorkspaceOptions,
    value: T
  ) {
    return () =>
      setWorkspaceOptions((options) => ({
        ...options,
        [option]: value,
      }))
  }
}
