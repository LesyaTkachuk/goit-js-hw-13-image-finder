import notifications from '../notyf';

const url = 'https://pixabay.com/api/';
const myKey = '16289241-4573a8dd8ec62d75602da9e3c';

export default {
  page: 1,
  query: '',
  fetchImages() {
    const queryParams = `?image_type=photo&orientation=horizontal&q=${this.query}&page=${this.page}&per_page=15&key=${myKey}`;
    return fetch(url + queryParams)
      .then(response => response.json())
      .then(data => {
        if (data.total === 0) {
          notifications.showNoMatches();
        }
        return data.hits;
      });
  },

  incrementPage() {
    this.page += 1;
  },

  resetPage() {
    this.page = 1;
  },

  set searchQuery(value) {
    this.query = value;
  },

  get searchQuery() {
    return this.query;
  },
};
