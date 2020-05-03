/* eslint-disable no-use-before-define */
import galleryItemsTemplate from '../templates/gallery-items.hbs';
import apiService from './services/apiService';
import notifications from './notyf';
import lightbox from './basicLightbox';
import spinner from './spinner';

const refs = {
  gallery: document.querySelector('#js-gallery'),
  searchForm: document.querySelector('#js-search-form'),
  ioTrigger: document.querySelector('#io-trigger'),
};

refs.searchForm.addEventListener('submit', searchFormHandler);
refs.gallery.addEventListener('click', imageClickHandler);

function searchFormHandler(e) {
  e.preventDefault();

  disconnectIObserver();
  clearGallery();
  apiService.resetPage();

  const form = e.currentTarget;
  const input = form.elements.query;
  const clientQuery = input.value;

  if (clientQuery === '') {
    notifications.showInfo();
    return;
  }

  apiService.searchQuery = clientQuery;
  createGallery();
  input.value = '';
}

function createGallery() {
  spinner.show();
  apiService
    .fetchImages()
    .then(images => {
      if (images.length > 0) {
        renderGalleryItems(images);
        connectIObserver();
      }
    })
    .catch(error => {
      notifications.showError();
      console.log(error);
    })
    .finally(() => {
      spinner.hide();
    });
}

function renderGalleryItems(imgArray) {
  const markup = galleryItemsTemplate(imgArray);
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function imageClickHandler(e) {
  const imgClicked = e.target;
  const sourceForLightbox = imgClicked.dataset.source;
  lightbox.showLargeImage(sourceForLightbox);
}

// Intersection Observer
const options = {
  rootMargin: '80px 0px',
  threshold: 0.01,
};

const onEntry = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      apiService.incrementPage();
      createGallery();

      observer.disconnect();
    }
  });
};

const observer = new IntersectionObserver(onEntry, options);

function connectIObserver() {
  observer.observe(refs.ioTrigger);
}

function disconnectIObserver() {
  observer.disconnect();
}
