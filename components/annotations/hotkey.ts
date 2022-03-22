import { KeyMap } from 'react-hotkeys'
type AnnotationKeyName = 'PAN_OR_DRAG'
export const annotationHotKeyMap: KeyMap = {
  PAN_Y: {
    sequence: 'ctrl',
    action: 'keydown',
  },
  PAN_X: {
    sequence: 'ctrl+shift',
    action: 'keydown',
  },
  ZOOM: {
    sequence: 'ctrl+shift',
    action: 'keyup',
  },
  NEXT_IMAGE: ['d', 'right'],
  PREV_IMAGE: ['a', 'left'],
  CANCEL: ['esc'],
  UNDO: ['ctrl+z', 'command+z'],
}
