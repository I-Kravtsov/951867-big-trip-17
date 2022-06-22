import AbstractView from './abstract-view';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const createOffersTemplate = (offers) =>{
  if(!offers) {
    return '';
  }
  const offersListTemplate = offers.map((offer) => `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`
  ).join('');
  const createOffersListTemplate = () => (
    `<ul class="event__selected-offers">
      ${offersListTemplate}
    </ul>`
  );
  return createOffersListTemplate(offers);
};

const createEventDuration = (from, to) => {
  const msDuration = dayjs(to).diff(dayjs(from));
  let durationFormat = 'DD[D] HH[H] mm[M]';
  if(msDuration < 3600000) {durationFormat = 'mm[M]';}
  else if (msDuration <= 86400000) {durationFormat = 'HH[H] mm[M]';}
  const eventDuration = dayjs.duration(msDuration).format(durationFormat) ;
  return eventDuration;
};

const createEventsListItemTemplate = (point, offers) => {
  const {dateFrom, dateTo, type, isFavorite, destination, basePrice} = point;
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${dayjs(dateFrom).format('MMM D')}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${dayjs(dateFrom).format('hh:mm')}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${dayjs(dateTo).format('hh:mm')}</time>
          </p>
          <p class="event__duration">
          ${createEventDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${createOffersTemplate(offers)}
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`);
};
export default class EventsListItemView extends AbstractView {
  #point  = null;
  #offers = null;
  constructor (point, offers) {
    super();
    this.#point = point;
    this.#offers = offers;
  }

  get template () {
    return createEventsListItemTemplate(this.#point, this.#offers);
  }

  setRollupClickHandler = (callback) => {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  setFavoriteClickHandler = (callback) => {
    this._callback.favoriteClick = callback;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  };
}
