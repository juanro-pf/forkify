import icons from 'url:../../img/icons.svg'; // Importing icons with Parcel 2 (as is has a different name and location [dist] after starting/building with parcel)

export default class View {
  _data; // Using this syntax due to babel, as babel will transpile it anyway to ES5

  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string, instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render equals false
   * @this {Object} View instance
   * @author Juan Ro
   * @todo Finish the implementation
   */
  render(data, render = true) {
    if(!data || (Array.isArray(data) && data.length === 0)) return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if(!render) return markup;

    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];

      // Updates changed text      
      if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
        curEl.textContent = newEl.textContent;
      }

      // Updates changed attributes
      if(!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach(att => curEl.setAttribute(att.name, att.value));
      }
    })
  }

  _clearParent() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    `
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clearParent();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}