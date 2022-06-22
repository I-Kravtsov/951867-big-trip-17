
import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import ApiService from './api-service.js';

const AUTHORIZATION = 'Basic dsbjv80e42TY';
const END_POINT ='https://17.ecmascript.pages.academy/big-trip/';

const pageMainElement = document.querySelector('.page-main');
const tripEventsElement = pageMainElement.querySelector('.trip-events');

const pointsModel = new PointsModel(new ApiService(END_POINT, AUTHORIZATION));
const filterModel = new FilterModel();

const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);
const headerMainElement = document.querySelector('.trip-main');
const headerFilterElement = headerMainElement.querySelector('.trip-controls__filters');
const filterPresenter = new FilterPresenter(headerFilterElement, filterModel, pointsModel);

filterPresenter.init();
tripPresenter.init();
pointsModel.init();
document.querySelector('.trip-main__event-add-btn').addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
