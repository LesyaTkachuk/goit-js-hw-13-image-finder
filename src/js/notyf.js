import { defaults, info, error } from '@pnotify/core';
import '@pnotify/core/dist/BrightTheme.css';

defaults.delay = 700;
defaults.closer = false;
defaults.sticker = false;
defaults.maxTextHeight = null;
export default {
  showInfo() {
    info({
      text: 'Please enter some information',
    });
  },
  showNoMatches() {
    error({
      text: 'No matches found',
    });
  },
  showError() {
    error({
      text: 'Something is going wrong. Please,try again',
    });
  },
};
