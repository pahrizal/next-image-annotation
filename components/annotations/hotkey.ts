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
  NEXT_IMAGE: ['d', 'right'],
  PREV_IMAGE: ['a', 'left'],
  CANCEL: ['esc'],
  UNDO: ['ctrl+z', 'command+z'],
  TOOLBAR_UPLOAD: ['0'],
  TOOLBAR_POINTER: ['1'],
  TOOLBAR_POLYGON: ['2'],
}
