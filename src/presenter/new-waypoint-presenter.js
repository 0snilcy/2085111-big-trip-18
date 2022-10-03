import {render, remove, RenderPosition} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import {UserAction, UpdateType} from '../utils/const.js';
import dayjs from 'dayjs';

const BLANK_POINT = {
  basePrice : '',
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  destination : null,
  isFavorite : 0,
  offers : [],
  type: 'taxi',
};

export default class NewWaypointPresenter {
  #waypointEditComponent = null;
  #waypoint = null;
  #waypointListContainer = null;
  #changeData = null;
  #destroyCallback = null;
  #destinations = null;
  #offers = null;

  constructor(waypointListContainer, changeData, destinations, offers) {
    this.#waypointListContainer = waypointListContainer;
    this.#changeData = changeData;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#waypointEditComponent !== null) {
      return;
    }

    this.#waypointEditComponent = new EditFormView(BLANK_POINT, this.#destinations, this.#offers);
    this.#waypointEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#waypointEditComponent.setCloseEditFormClickHandler(this.#handleDeleteClick);
    this.#waypointEditComponent.setDeleteClickHandler(this.#handleDeleteClick);

    render(this.#waypointEditComponent, this.#waypointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#onEscKeyDown);
  };

  destroy = () => {
    if (this.#waypointEditComponent === null) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#waypointEditComponent);
    this.#waypointEditComponent = null;

    document.removeEventListener('keydown', this.#onEscKeyDown);
  };

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #handleFormSubmit = (waypoint) => {
    this.#changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      waypoint,
    );
  };

  setSaving = () => {
    this.#waypointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAborting = () => {
    const resetFormState = () => {
      this.#waypointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointEditComponent.shake(resetFormState);
  };
}
