import { KeyConfigTable, KeyListener } from 'my-key-config';
import { handleInput } from './input';
import { initStore, spec } from './options';
/**
 * Keydown event handler.
 */
const handler = (e: any) => {
    const ta = document.activeElement as HTMLElement | null;
    if (ta == null) {
        return;
    }
    const shortcut = e.detail;
    handleInput(shortcut, ta);
};

const store = initStore();
// Initialize a key listener,
const listener = new KeyListener(store, spec);
// listener.addEventListener('key', handler);
listener.onkey = handler;
let state = false;

/**
 * Enable extension.
 */
export function enable() {
    if (!state) {
        state = true;
        listener.listen().catch((err: any) => {
            console.error(err);
        });
    }
}

/**
 * Disable extension.
 */
export function disable() {
    if (state) {
        state = false;
        listener.unlisten();
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
