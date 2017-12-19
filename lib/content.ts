/**
 * Input event handler.
 */
const handler = (e: Event)=> {
    const ta = e.target as HTMLInputElement | HTMLTextAreaElement;
    console.log(ta);
};

let state = false;

/**
 * Enable extension.
 */
export function enable() {
    if (!state) {
        state = true;
        document.addEventListener('input', handler);
    }
}

/**
 * Disable extension.
 */
export function disable(){
    if (state){
        state = false;
        document.removeEventListener('input', handler);
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
