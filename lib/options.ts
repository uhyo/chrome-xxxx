import {
    ChromeStorageStore,
    KeyConfigSpec,
    LocalStorageStore,
    register,
} from 'my-key-config';

/**
 * Whether the `chrome` environment exists.
 */
const isChrome = 'undefined' !== typeof chrome;

/**
 * Initialize the chrome extension page.
 */
export function initOptionsPage(): void {
    register();
}
/**
 * Spec for the extension.
 */
export const spec: KeyConfigSpec = [
    {
        default: {
            key: 'ArrowRight',
            shiftKey: true,
        },
        id: 'insert-last',
        name: isChrome
            ? chrome.i18n.getMessage('insert_last')
            : '█を入力（入力欄の終端のみ）',
    },
    {
        default: {
            ctrlKey: true,
            key: 'L',
            shiftKey: true,
        },
        id: 'insert-anywhere',
        name: isChrome ? chrome.i18n.getMessage('insert_anywhere') : '█を入力',
    },
];

/**
 * Initialize a store.
 */
export function initStore(): LocalStorageStore | ChromeStorageStore {
    if (isChrome) {
        // If chrome extension environment is enabled, use
        // chrome.sync store.
        return new ChromeStorageStore('chrome-xxxx');
    } else {
        // Otherwise fall back to localStorage.
        return new LocalStorageStore('chrome-xxxx');
    }
}
