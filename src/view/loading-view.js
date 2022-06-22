import AbstractView from './abstract-view.js';

const createNoPointsTemplate = () => (
  `<p class="route__no-point">
    Loading...
  </p>`
);

export default class LoadingView extends AbstractView {
  get template() {
    return createNoPointsTemplate();
  }
}
