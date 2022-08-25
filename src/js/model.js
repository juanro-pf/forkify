import { API_KEY, API_URL, RES_PER_PAGE } from "./config";
import { AJAX } from "./helpers";

// https://forkify-api.herokuapp.com/v2

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1
  },
  bookmarks: []
}

const createRecipeObject = function(data) {
  const { recipe } = data.data;
    return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
      ...(recipe.key && { key: recipe.key })
    }
}

export const loadRecipe = async function(id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
 
    // Success handling
    state.recipe = createRecipeObject(data);

    if(state.bookmarks.some(bookmark => bookmark.id === id)) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

  } catch (err) {
    throw err;
  }
}

export const loadSearchResults = async function(query) {
  try {
    state.search.query = query;

    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key })
    }});
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
}

export const getSearchResultsPage = function(page = state.search.page) {
  state.search.page = page;

  return state.search.results.slice((page - 1) * state.search.resultsPerPage, page * state.search.resultsPerPage);
}

export const updateServings = function(newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity / state.recipe.servings * newServings;
  });
  state.recipe.servings = newServings;
}

const persistBookmarks = function() {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmarked
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
}

export const removeBookmark = function(id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(recipe => recipe.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmarked
  if(id === state.recipe.id) state.recipe.bookmarked = false;

  persistBookmarks();
}

const init = function() {
  const storage = localStorage.getItem('bookmarks');
  if(storage) state.bookmarks = JSON.parse(storage);
}
init();

const clearBookmarks = function() {
  localStorage.clear('bookmarks');
}
// clearBookmarks();

export const uploadRecipe = async function(newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe).filter(entry => entry[0].startsWith('ingredient') && entry[1] !== ''
    ).map(ing => {
      // const ingArr = ing[1].replaceAll(' ', '').split(',');
      const ingArr = ing[1].split(',').map(el => el.trim());
      if(ingArr.length !== 3) throw new Error('Wrong ingredient format.');
      const [quantity, unit, description] = ingArr;
      return { quantity: quantity ? +quantity : null, unit, description };
    });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients
    }
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
}