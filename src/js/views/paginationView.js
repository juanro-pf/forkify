import icons from 'url:../../img/icons.svg';
import View from './view';

class PaginatioView extends View {
  _parentElement= document.querySelector('.pagination');

  addHandlerButton(handler) {
    this._parentElement.addEventListener('click', function(e){
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);

    // Page 1 and there are other pages
    if(currentPage === 1 && numPages > 1) {
      return this._generateMarkupButton('next');
    }

    // Last page
    if(currentPage === numPages && numPages > 1) {
      return this._generateMarkupButton('prev');
    }
    
    // Page in the middle (other page)
    if(currentPage < numPages) {
      return `
        ${this._generateMarkupButton('prev')}
        ${this._generateMarkupButton('next')}
      `;
    }
    
    // Page 1 and there are NO other pages
    return '';
  }

  _generateMarkupButton(type) { // type should be next or prev
    if(type === 'next') return `
      <button data-goto="${this._data.page + 1}" class="btn--inline pagination__btn--next">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
    `
    else return `
      <button data-goto="${this._data.page - 1}" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
      </button>
    `
  }
}

export default new PaginatioView();