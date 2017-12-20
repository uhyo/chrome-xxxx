import {
    handleInput,
} from './input';
/**
 * Keydown event handler.
 */
const handler = (e: KeyboardEvent)=> {
    const ta = e.target as HTMLInputElement | HTMLTextAreaElement;
    handleInput(e, ta);
};

let state = false;

/**
 * Enable extension.
 */
export function enable() {
    if (!state) {
        state = true;
        document.addEventListener('keydown', handler);
    }
}

/**
 * Disable extension.
 */
export function disable(){
    if (state){
        state = false;
        document.removeEventListener('keydown', handler);
    }
}

/**
 * Enable/disable
 */
export function setEnabled(enabled: boolean) {
    if (enabled) {
        enable();
    } else {
        disable();
    }
}
