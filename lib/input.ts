import {
    genChar,
} from './char';
/**
 * Handle input event to an input area.
 */
export function handleInput(e: KeyboardEvent, target: HTMLInputElement | HTMLTextAreaElement) {
    // Check if it is Shift+Right
    if (e.key === 'ArrowRight' && e.shiftKey) {
        const {
            selectionStart,
            selectionEnd,
            value,
        } = target;
        if (selectionStart === selectionEnd && selectionEnd === value.length) {
            // It's at the right end.
            const ch = genChar();
            setRangeText(target, ch, selectionEnd, selectionEnd, 'end');

        }
    }
}

/**
 * Helper function, as current TypeScript (2.6.2) does not have a definition for setRangeText.
 */
function setRangeText(
    target: HTMLInputElement | HTMLTextAreaElement,
    replacement: string,
    start?: number,
    end?: number,
    selectionMode?: string): void {
    (target as any).setRangeText(replacement, start, end, selectionMode);
}
