import { KeyMap } from 'react-hotkeys'
type AnnotationKeyName = 'PAN_OR_DRAG'
export const annotationHotKeyMap: KeyMap = {
  PAN: {
    sequence: 'ctrl',
    action: 'keydown',
  },
  ZOOM: {
    sequence: 'ctrl',
    action: 'keyup',
  },
  NEXT_IMAGE: ['d', 'right'],
  PREV_IMAGE: ['a', 'left'],
}
