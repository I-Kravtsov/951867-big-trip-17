import AbstractView from './abstract-view';

const createTripEventsListTemplate = () => (
  `<ul class="trip-events__list">
  </ul>
  `
);

export default class EventsListView extends AbstractView{
  get template () {
    return createTripEventsListTemplate();
  }
}
