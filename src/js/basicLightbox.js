import 'basicLightbox/dist/basicLightbox.min.css';
import * as basicLightbox from 'basiclightbox';

export default {
  showLargeImage(source) {
    const instance = basicLightbox.create(`
            <img src="${source}" width="1200" height="600">
        `);

    instance.show();
  },
};
