import { renderPosition, render, remove} from '../render.js';
import TripInfoView from '../view/trip-info-view';
import SortView from '../view/trip-sort-view';
import EventsListView from '../view/trip-events-list-view';
import EmptyListView from '../view/empty-list-view';
import PointPresenter, {State as PointPresenterViewState} from './point-presenter.js';
import PointNewPresenter from './point-new-presenter.js';
import dayjs from 'dayjs';
import { UpdateType, UserAction, FilterType, SortType } from '../const.js';
import { filter } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';

export default class TripPresenter {
  #tripContainer = null;
  #loadingComponent = new LoadingView();
  #emptyListComponent = null;
  #headerMainElement = document.querySelector('.trip-main');
  #eventsListComponent = new EventsListView();
  #sortComponent = new SortView();
  #infoComponent = new TripInfoView();
  #pointPresenter = new Map();
  #pointNewPresenter = null;
  #currentSortType = SortType.SORT_DAY;
  #filterType = FilterType.EVERYTHING;
  #pointsModel = null;
  #filterModel = null;
  #isLoading = true;

  constructor (tripContainer, pointsModel, filterModel){
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointNewPresenter = new PointNewPresenter(this.#tripContainer, this.#handleViewAction);
  }


  get points () {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);
    switch(this.#currentSortType) {
      case SortType.SORT_TIME:
        return filteredPoints.sort((pointA, pointB) => dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom)) - dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom)));
      case SortType.SORT_PRICE:
        return filteredPoints.sort((pointA, pointB) => pointB.basePrice - pointA.basePrice);
    }
    return filteredPoints;
  }

  get offers () {
    return this.pointsModel.offers;
  }

  init =() => {
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#renderRoute();
  };

  destroy = () => {
    this.#clearRoute({resetRenderedTaskCount: true, resetSortType: true});


    this.#pointsModel.removeObserver(this.#handleModelEvent);
    this.#filterModel.removeObserver(this.#handleModelEvent);
  };

  createPoint = (callback) => {
    this.#currentSortType = SortType.SORT_DAY;
    this.#pointNewPresenter.init(callback);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.SAVING);
        try {
          await this.#pointsModel.updateTask(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
      case UserAction.ADD_POINT:
        this.#pointNewPresenter.setSaving();
        try {
          await this.#pointsModel.addTask(updateType, update);
        } catch(err) {
          this.#pointNewPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.DELETING);
        try {
          await this.#pointsModel.deleteTask(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setViewState(PointPresenterViewState.ABORTING);
        }
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch(updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearRoute();
        this.#renderRoute();
        break;
      case UpdateType.MAJOR:
        this.#clearRoute();
        this.#renderRoute();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderRoute();
        break;
    }
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView() );
    this.#pointNewPresenter.destroy();
  };

  #handleSortTypeCange = (sortType) => {

    if(this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearRoute();
    this.#renderRoute();
  };

  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView(this.#filterType);
    render(this.#tripContainer, this.#emptyListComponent, renderPosition.BEFOREEND);
  };

  #renderLoading = () => {
    render(this.#tripContainer, this.#loadingComponent, renderPosition.AFTERBEGIN);
  };

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeCange);
    render(this.#tripContainer, this.#sortComponent, renderPosition.BEFOREEND);
  };

  #renderInfo = () => {
    render(this.#headerMainElement, this.#infoComponent,renderPosition.AFTERBEGIN);
  };

  #renderEventsList = () => {
    render(this.#tripContainer, this.#eventsListComponent, renderPosition.BEFOREEND);
  };

  #renderPoint = (point, offers) => {
    const pointPresenter = new PointPresenter(this.#eventsListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(point, offers);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #renderPoints = (points) => {
    points.forEach((point) => this.#renderPoint(point));
  };

  #renderRoute = () => {
    const points = this.points;
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }
    if(this.points.length === 0) {
      this.#renderEmptyList();
      return;
    }
    this.#renderInfo();
    this.#renderSort();
    this.#renderEventsList();
    this.#renderPoints(points);
  };

  #clearRoute = (resetSortType = false) => {
    this.#pointNewPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    remove(this.#infoComponent);
    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#eventsListComponent);
    if(this.#emptyListComponent) {
      remove(this.#emptyListComponent);
    }
    if(resetSortType) {
      this.#currentSortType = SortType.SORT_DAY;
    }
  };
}
