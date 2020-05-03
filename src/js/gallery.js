/* eslint-disable no-use-before-define */
import galleryItemsTemplate from '../templates/gallery-items.hbs';
import apiService from './services/apiService';
import notifications from './notyf';
import lightbox from './basicLightbox';
import spinner from './spinner';

const refs = {
  gallery: document.querySelector('#js-gallery'),
  searchForm: document.querySelector('#js-search-form'),
  loadMoreBtn: document.querySelector('button[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', searchFormHandler);
refs.loadMoreBtn.addEventListener('click', loadMoreBtnHandler);
refs.gallery.addEventListener('click', imageClickHandler);

function searchFormHandler(e) {
  e.preventDefault();

  removeLoadMoreBtn();
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
        addLoadMoreBtn();
      }
      renderGalleryItems(images);
      scroll();
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

function loadMoreBtnHandler() {
  apiService.incrementPage();
  createGallery();
}

function scroll() {
  const top = window.pageYOffset + window.innerHeight;
  window.scrollTo({
    top,
    behavior: 'smooth',
  });
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function addLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
function removeLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}

function imageClickHandler(e) {
  const imgClicked = e.target;
  const sourceForLightbox = imgClicked.dataset.source;
  lightbox.showLargeImage(sourceForLightbox);
}
