import * as model from './model.js';
import recipieView from './views/recipieViews.js';
import SearchView from './views/searchView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipieViews from './views/recipieViews.js';
import bookmarksView from './views/bookmarksView.js';
import searchView from './views/searchView.js';
import Resultview from './views/resultsView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipieView from './views/addRecipieView.js';
import { MODAL_CLOSE_SEC } from './config.js';
// import recipieViews from './views/recipieViews.js';
// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipieView.renderSpinner();

    resultsView.update(model.getSearchResultPage());
    bookmarksView.update(model.state.bookmark);

    await model.loadRecipe(id);

    recipieView.render(model.state.recipe);
  } catch (err) {
    recipieView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    const query = SearchView.getQuery();
    if (!query) return;
    Resultview.renderSpinner();

    await model.loadSearchResult(`${query}`);

    resultsView.render(model.getSearchResultPage(1));

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlerPagination = function (gotoPage) {
  resultsView.render(model.getSearchResultPage(gotoPage));

  paginationView.render(model.state.search);

  console.log(gotoPage);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipieView.update(model.state.recipe);
};

const controlAddbookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipieView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipieView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);
    recipieView.render(model.state.recipe);

    addRecipieView.renderMessage();

    bookmarksView.render(model.state.bookmark);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {}, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.log(err);
    addRecipieView.renderError(err);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipieView.addHandlerRender(controlRecipe);
  recipieView.addHandlerUpdateServings(controlServings);
  recipieView.addHandlerAddbookmark(controlAddbookmark);
  SearchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlerPagination);
  addRecipieView._addHandlerUpload(controlAddRecipe);
};
init();

//we are using publisher-subscribe pattern with init and init is not neccessary
// ['hashchange', 'load'].forEach(ev =>
//   window.addEventListener(ev, controlRecipe)
// );
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
