import { renderPosition, render, remove} from '../render.js';
import EditEventsListItemView from '../view/trip-edit-event-view';
import { UserAction, UpdateType } from '../const.js';


export default class PointNewPresenter {
  #pointContainer = null;
  #changeData = null;
  #editPointComponent = null;
  #point = null;
  #destroyCallback = null;

  constructor (pointContainer, changeData,) {
    this.#pointContainer = pointContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;
    if (this.#editPointComponent !== null) {
      return;
    }
    this.#editPointComponent = new EditEventsListItemView();
    this.#editPointComponent.setFormSubmitHandler(this.#handleEditFormSubmit);
    this.#editPointComponent.setRollupClickHandler(this.#handleEditPointClick);
    this.#editPointComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#pointContainer, this.#editPointComponent, renderPosition.AFTERBEGIN);
  };

  destroy = () => {
    if (this.#editPointComponent === null) {
      return;
    }
    this.#destroyCallback?.();
    remove(this.#editPointComponent);
    this.#editPointComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  setSaving = () => {
    this.#editPointComponent.updateData({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#editPointComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPointComponent.shake(resetFormState);
  };

  #handleDeleteClick = () => {
    this.destroy();
  };


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };


  #handleEditPointClick = () => {
    this.#editPointComponent.reset(this.#point);
  };

  #handleEditFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point);
  };
}
