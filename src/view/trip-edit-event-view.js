import SmartView from './smart-view';
import dayjs from 'dayjs';
import {offersSet, pointTypes, destinations} from '../mock/data';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

const createEventDestinationlist = (destinationPoints) => {
  const eventDestination = destinationPoints.map((destinationPoint) => `<option value="${destinationPoint.name}" ></option>`);
  return  eventDestination.join('');
};

const createOfferListTemplate = (pointOffers, pointTipe) => {
  const createOfferList = (offerType) => {
    for(const offerSet of offersSet) {
      if (offerSet.type === offerType){
        return offerSet.offers;
      }
    }
  };
  const offerList = createOfferList(pointTipe);
  const createOffersTemplate = (offers) => offers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}" ${pointOffers.includes(offer) ? 'checked' : ''} >
    <label class="event__offer-label" for="event-offer-${offer.id}-1">
      <span class="event__offer-title">${he.encode(offer.title)}</span>
        &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');
  return offerList ? (
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createOffersTemplate(offerList)}
        <div>
    </section>
    `
  ) : '';

};
const createEditEventTemplate = (point = {}) => {
  const {
    basePrice ='',
    dateFrom = dayjs(),
    dateTo = dayjs().toISOString(),
    destination = {
      name: '',
      description: null,
      pictures: null,
    },
    type = 'bus',
    offers = null,
    isDeleting = false,
    isSaving,
    isDisabled,
  } = point;
  return (`<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${pointTypes.map((pointType) => `
              <div class="event__type-item">
                <input id="event-type-${pointType}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${pointType}" ${pointType === type ? 'checked' : '' }>
                <label class="event__type-label  event__type-label--${pointType}" for="event-type-${pointType}-1" style="text-transform: capitalize" >${pointType}</label>
              </div>
              `).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${createEventDestinationlist(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD/MM/YY hh:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD/MM/YY hh:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit"${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset"${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${createOfferListTemplate(offers, type)}
        ${destination.description ? `
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${destination.description}</p>
          ${destination.pictures ? `
          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
            </div>
          </div>` : ''}
        </section>` : ''}
      </section>
    </form>
  </li>`);
};

export default class EditEventsListItemView extends SmartView {
  #datepicker = null;

  constructor (point) {
    super();
    this._data = EditEventsListItemView.parsePointToData(point);
    this.#setInnerHandlers();
    this.#setDateFromDatepicker();
  }

  get template () {
    return createEditEventTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepicker) {
      this.#datepicker.destroy();
      this.#datepicker = null;
    }
  };

  #setDateFromDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateData({
      dateFrom: userDate
    }, true);
  };

  #setDateToDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        onChange: this.#dateToChangeHandler,
      },
    );
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateData({
      dateTo: userDate
    }, true);
  };

  reset = (point) => {
    this.updateData(
      EditEventsListItemView.parsePointToData(point)
    );
  };

  restoreHandlers = () => {
    this.#setInnerHandlers();
    // this.#setDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setRollupClickHandler(this._callback.rollupClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditEventsListItemView.parseDataToPoint(this._data));
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    // console.log('set');
  };

  #formSubmitHandler = (evt) => {
    // console.log('form');
    evt.preventDefault();
    this._callback.formSubmit(EditEventsListItemView.parseDataToPoint(this._data));
  };

  setRollupClickHandler = (callback) => {
    this._callback.rollupClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  };

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.rollupClick();
  };

  #pointTypeChangeHandler = (evt) => {
    this.updateData({
      type: evt.target.value
    });
  };

  #pointPriceChangeHandler = (evt) => {
    this.updateData({
      basePrice: +evt.target.value
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    this.updateData({
      destination: destinations.find((destination) => destination.name === evt.target.value)
    });
  };

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
    this.#setDateFromDatepicker();
    this.#setDateToDatepicker();
  };

  static parsePointToData = (point) => ({
    ...point,
    isSaving: false,
    isDeleting: false,
    isDisabled: false,
  });

  static parseDataToPoint = (data) => {
    const point = {...data};
    delete point.isSaving;
    delete point.isDeleting;
    delete point.isDisabled;
    return point;
  };
}

