import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizeFullDate, compareTime} from '../utils/waypoint.js';
import flatpickr from 'flatpickr';
import dayjs from 'dayjs';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice : 0,
  dateFrom: dayjs().toDate(),
  dateTo: dayjs().toDate(),
  destination : 1,
  isFavorite : 0,
  offers : '',
  type: 'taxi',
};

const getOffers = (offersByType, offersIds) => {
  const offersArray = [];
  for (let i = 0; i < offersIds.length; i++) {
    if (offersByType?.length > 0) {
      const offer = offersByType.filter((element) => element.id === offersIds[i]);
      offersArray.push(...offer);
    }
  }
  return offersArray;
};

const createEditFormOffersTemplate = (offers, checkedOffers) => `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${offers && offers.length > 0 && offers.map((offer) => `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage"
          ${checkedOffers.filter((element) => element.id === offer.id).length > 0 ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-luggage-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`)}
    </div>
  </section>`.split(',').join('\n');

const createEditFormTemplate = (waypoint, destinations, arrayOfOffers) => {
  const {basePrice, dateFrom, dateTo, type, destination, offers} = waypoint;

  const destinationById = destinations && destinations.length > 0 && destinations.filter((item) => item.id === destination)[0];


  const humanizedTimeFrom = dateFrom !== null
    ? humanizeFullDate(dateFrom)
    : '';

  const humanizedTimeTo = dateTo !== null
    ? humanizeFullDate(dateTo)
    : '';

  const offersByType = arrayOfOffers.find((element) => element.type === type)?.offers;
  const neededOffers = getOffers(offersByType, offers);
  const offersTemplate = offersByType?.length !== 0
    ? createEditFormOffersTemplate(offersByType, neededOffers)
    : '';

  const createPhotosForDestination = () => {
    let photos = '';
    for (let i = 0; i < destinationById.pictures.length; i++) {
      const src = destinationById.pictures[i].src;
      const description = destinationById.pictures[i].description;
      photos += `<img class="event__photo" src="${src}" alt="${description}"></img>`;
      return photos;
    }
  };

  const renderPhotosOfDestination = () => {
    if (destinationById?.pictures) {
      return (`<div class="event__photos-container">
      <div class="event__photos-tape">
        ${createPhotosForDestination()}
      </div>`);
    }
  };

  const createDatalistOfDestinations = () => {
    let listElements = '';
    for (let i = 0; i < destinations.length; i++) {
      listElements += `<option value="${destinations[i].name}">`;
    }
    return listElements;
  };

  return (
    `<li class="trip-events__item">
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

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi" ${type === 'taxi' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus" ${type === 'bus' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train" ${type === 'train' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship" ${type === 'ship' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive" ${type === 'drive' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" ${type === 'flight' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in" ${type === 'check-in' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing" ${type === 'sightseeing' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant" ${type === 'restaurant' ? 'checked' : ''}>
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationById?.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createDatalistOfDestinations()}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizedTimeFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizedTimeTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
        ${offersTemplate}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinationById?.description}</p>
            ${renderPhotosOfDestination()}
          </section>
        </section>
      </form>
    </li>`
  );
};

export default class EditFormView extends AbstractStatefulView {
  #datepickerFrom = null;
  #datepickerTo = null;
  #destinations = null;
  #arrayOfOffers = null;

  constructor(waypoint = BLANK_POINT, destinations, arrayOfOffers) {
    super();
    this._state = EditFormView.parsePointToState(waypoint);
    this.#destinations = destinations;
    this.#arrayOfOffers = arrayOfOffers;
    this.#setInnerHandlers();
  }

  get template() {
    return createEditFormTemplate(this._state, this.#destinations, this.#arrayOfOffers);
  }

  static parsePointToState = (waypoint) => ({...waypoint});

  static parseStateToPoint = (waypoint) => ({...waypoint});

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('input', this.#destinationChangeHandler);
    this.#setDatepickers();
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setCloseEditFormClickHandler(this._callback.saveEditFormClick);
    this.setDeleteClickHandler(this._callback.deleteClick);
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(EditFormView.parseStateToPoint(this._state));
  };

  setCloseEditFormClickHandler = (callback) => {
    this._callback.saveEditFormClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeEditFormClickHandler);
  };

  #closeEditFormClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.saveEditFormClick();
  };

  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    if (this.#destinations.some((element) => (element.name === evt.target.value))) {
      const newDestinationId = this.#destinations.filter((item) => item.name === evt.target.value);
      this.updateElement({
        destination: newDestinationId[0].id,
      });
    } else {
      this.element.querySelector('.event__save-btn').disabled = true;
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
    compareTime(this._state, this.element);
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
    compareTime(this._state, this.element);
  };

  #setDatepickers = () => {
    if (this._state.dateFrom) {
      this.#datepickerFrom = flatpickr(
        this.element.querySelector('#event-start-time-1'),
        {
          enableTime: true,
          dateFormat: 'y/m/d H:i',
          defaultDate: this._state.dateFrom,
          onChange: this.#dateFromChangeHandler,
        },
      );
    }
    if (this._state.dateTo) {
      this.#datepickerTo = flatpickr(
        this.element.querySelector('#event-end-time-1'),
        {
          enableTime: true,
          dateFormat: 'y/m/d H:i',
          defaultDate: this._state.dateTo,
          onChange: this.#dateToChangeHandler,
          minDate: this._state.dateFrom,
        },
      );
    }
  };

  reset = (waypoint) => {
    this.updateElement(
      EditFormView.parsePointToState(waypoint),
    );
  };

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
  };
}
