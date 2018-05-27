import { genChar } from './char';

/**
 * Handle input event to an input area.
 */
export function handleInput(
    command: 'insert-last' | 'insert-anywhere',
    target: HTMLElement,
) {
    if (isTextArea(target)) {
        const { selectionStart, selectionEnd, value } = target;
        if (
            selectionStart != null &&
            (command === 'insert-anywhere' ||
                (selectionStart === selectionEnd &&
                    selectionEnd === value.length))
        ) {
            const ch = genChar();
            setRangeText(target, ch, selectionStart!, selectionEnd!, 'end');
        }
    } else if (target.contentEditable) {
        // ContentEdiable HTML node
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        if (range == null) {
            return;
        }
        if (command === 'insert-anywhere' || isEndOf(range, target)) {
            // insert a text.
            const text = document.createTextNode(genChar());
            if (command === 'insert-anywhere') {
                range.deleteContents();
            }
            range.insertNode(text);
            // Move cursor to the end.
            range.collapse(false);
        }
    }
}

/**
 * Detect a text area.
 */
function isTextArea(
    elm: HTMLElement,
): elm is HTMLInputElement | HTMLTextAreaElement {
    return (
        elm.tagName === 'TEXTAREA' ||
        (elm.tagName === 'INPUT' &&
            'number' === typeof (elm as HTMLInputElement).selectionStart)
    );
}

/**
 * Check that given `range` is at the end of `target`.
 */
function isEndOf(range: Range, target: HTMLElement): boolean {
    if (!range.collapsed) {
        return false;
    }
    target.normalize();
    const tr = new Range() as Range & IRangeExt;
    tr.selectNodeContents(target);
    // Represent Range as a point.
    let node = range.endContainer;
    let offset = range.endOffset;
    // check that point is in Target.
    if (!tr.isPointInRange(node, offset)) {
        return false;
    }
    // move upwards as much as possible.
    while (node !== target) {
        if (!atEnd(node, offset)) {
            return false;
        }
        [node, offset] = moveUp(node, offset);
    }
    return atEnd(node, offset);
}
// it is at the end.
function atEnd(node: Node, offset: number): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
        const ep = node.nodeValue!.search(/[\r\n]+$/);
        if (ep >= 0) {
            (node as any).splitText(ep).remove();
            offset = node.nodeValue!.length;
        }
        return node.nodeValue!.length <= offset;
    } else {
        const children = node.childNodes;
        // Some sites has excess empty text node.
        for (const l = children.length; offset < l; offset++) {
            if (!isEmpty(children[offset])) {
                return false;
            }
        }
        return true;
    }
}
// move one step up.
function moveUp(node: Node, offset: number): [Node, number] {
    const p = node.parentNode;
    if (p == null) {
        throw new Error('Parent node does not exist');
    }
    return [p, getIndex(p, node) + 1];
}
// index of nodes.
function getIndex(parent: Node, child: Node): number {
    return [].indexOf.call(parent.childNodes, child);
}

/**
 * Check whether given node is empty in our sense.
 */
function isEmpty(node: Node): boolean {
    if (node.nodeType === Node.TEXT_NODE) {
        return /^[\r\n]*$/.test(node.nodeValue!);
    } else if (node.nodeName === 'BR') {
        return true;
    }
    return false;
}

/**
 * Helper function, as current TypeScript (2.6.2) does not have a definition for setRangeText.
 */
function setRangeText(
    target: HTMLInputElement | HTMLTextAreaElement,
    replacement: string,
    start?: number,
    end?: number,
    selectionMode?: string,
): void {
    (target as any).setRangeText(replacement, start, end, selectionMode);
}

/**
 * Extension to Range, as current TypeScript (2.6.2) does not have these definitions.
 */
interface IRangeExt {
    isPointInRange(node: Node, offset: number): boolean;
}
