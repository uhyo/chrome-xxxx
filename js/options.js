'use strict';

const { options } = ChromeXxxx;
const {
  initOptionsPage,
  spec,
  initStore,
} = options;

const store = initStore();
initOptionsPage();

const kc = document.querySelector('kc-keyconfig');
kc.label = chrome.i18n.getMessage('press_key_label');
kc.connect(store, spec);
