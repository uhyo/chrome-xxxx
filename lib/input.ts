import {
    genChar,
} from './char';

/**
 * Handle input event to an input area.
 */
export function handleInput(e: KeyboardEvent, target: HTMLElement) {
    // Check if it is Shift+Right
    if (e.key === 'ArrowRight' && e.shiftKey) {
        if (isTextArea(target)){
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
        } else if (target.contentEditable) {
            // ContentEdiable HTML node
            const sel = window.getSelection();
            const range = sel.getRangeAt(0);
            if (range == null) {
                return;
            }
            if (isEndOf(range, target)) {
                // insert a text.
                const text = document.createTextNode(genChar());
                range.insertNode(text);
                range.collapse(false);
            }
        }
    }
}

/**
 * Detect a text area.
 */
function isTextArea(elm: HTMLElement): elm is HTMLInputElement | HTMLTextAreaElement {
    return (elm.tagName === 'TEXTAREA') ||
        (elm.tagName === 'INPUT' && 'number' === typeof (elm as HTMLInputElement).selectionStart );
}

/**
 * Check that given `range` is at the end of `target`.
 */
function isEndOf(range: Range, target: HTMLElement): boolean {
    if (!range.collapsed) {
        return false;
    }
    const tr = new Range() as Range & IRangeExt;
    tr.selectNodeContents(target);
    // Represent Range as a point.
    let node = range.endContainer;
    if (node.nodeType === Node.TEXT_NODE) {
        node.normalize();
    }
    let offset = range.endOffset;
    // check that point is in Target.
    if (!tr.isPointInRange(node, offset)) {
        return false;
    }
    // move upwards as much as possible.
    while (node !== target){
        console.log(node, offset, node.childNodes.length, node.childNodes[2]);
        if (!atEnd(node, offset)){
            return false;
        }
        [node, offset] = moveUp(node, offset);
    }
    console.log('result', node, offset);
    return atEnd(node, offset);

}
// it is at the end.
function atEnd(node: Node, offset: number): boolean {
    if (node.nodeType === Node.TEXT_NODE){
        return node.nodeValue!.length === offset;
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
    return [p, getIndex(p, node)+1];
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
        return node.nodeValue === '';
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
    selectionMode?: string): void {
    (target as any).setRangeText(replacement, start, end, selectionMode);
}

/**
 * Extension to Range, as current TypeScript (2.6.2) does not have these definitions.
 */
interface IRangeExt {
    isPointInRange(node: Node, offset: number): boolean;
}
