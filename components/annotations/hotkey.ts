import { KeyMap } from 'react-hotkeys'
type AnnotationKeyName = 'PAN_OR_DRAG'
export const annotationHotKeyMap: KeyMap = {
  PAN_Y: {
    sequence: 'ctrl',
    action: 'keydown',
  },
  ZOOM: {
    sequence: 'ctrl',
    action: 'keyup',
  },
  CANCEL: ['esc'],
  UNDO: ['ctrl+z', 'command+z'],
}
export const toolbarHotkeymap: KeyMap = {
  TOOLBAR_UPLOAD: ['0'],
  TOOLBAR_POINTER: ['1'],
  TOOLBAR_POLYGON: ['2'],
  TOOLBAR_TOOGLE_THUMBNAIL: ['4'],
  NEXT_IMAGE: ['d', 'right'],
  PREV_IMAGE: ['a', 'left'],
}
