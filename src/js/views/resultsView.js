import previewView from "./previewView.js";
import View from "./view.js";

class ResultsView extends View{
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No results match your query.';
  _message;

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();