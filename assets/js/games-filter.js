/* games-filter.js
 * Client-side filtering, searching and sorting for /games/.
 *
 * How it works: every .game-card carries data-* attributes (see
 * _includes/game-card.html). The form in games/index.html is read into a
 * state object, cards are shown or hidden to match, and the state is kept in
 * the URL so a filtered view can be shared or bookmarked, for example:
 *   /games/?genre=puzzle,action&category=jam&year=2024&feature=browser&sort=az
 *
 * Rules: options inside one group combine with OR (Puzzle OR Action),
 * different groups combine with AND (Puzzle AND Game jam).
 * Without JavaScript the filter form is hidden and every game is shown.
 */
(function () {
  'use strict';

  var root = document.querySelector('[data-games]');
  if (!root) return;
  root.classList.remove('no-js');

  var form = root.querySelector('[data-filters]');
  var grid = root.querySelector('[data-grid]');
  var panel = root.querySelector('[data-panel]');
  var countEl = root.querySelector('[data-count]');
  var emptyEl = root.querySelector('[data-empty]');
  var activeEl = root.querySelector('[data-active]');
  var clearBtns = root.querySelectorAll('[data-clear]');
  var cards = Array.from(grid.querySelectorAll('.game-card'));

  var GROUPS = ['genre', 'category', 'year', 'feature'];
  var DEFAULT_SORT = 'newest';

  /* ---------- state <-> form ---------- */

  function readForm() {
    var state = {
      q: form.elements.q.value.trim().toLowerCase(),
      sort: form.elements.sort.value || DEFAULT_SORT
    };
    GROUPS.forEach(function (name) {
      state[name] = Array.from(
        form.querySelectorAll('input[name="' + name + '"]:checked')
      ).map(function (input) { return input.value; });
    });
    return state;
  }

  function writeForm(state) {
    form.elements.q.value = state.q || '';
    form.elements.sort.value = state.sort || DEFAULT_SORT;
    GROUPS.forEach(function (name) {
      form.querySelectorAll('input[name="' + name + '"]').forEach(function (input) {
        input.checked = (state[name] || []).indexOf(input.value) !== -1;
      });
    });
  }

  /* ---------- URL <-> state ---------- */

  function readUrl() {
    var params = new URLSearchParams(window.location.search);
    var state = { q: params.get('q') || '', sort: params.get('sort') || DEFAULT_SORT };
    GROUPS.forEach(function (name) {
      var raw = params.get(name);
      state[name] = raw ? raw.split(',').filter(Boolean) : [];
    });
    return state;
  }

  function writeUrl(state) {
    var params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    if (state.sort !== DEFAULT_SORT) params.set('sort', state.sort);
    GROUPS.forEach(function (name) {
      if (state[name].length) params.set(name, state[name].join(','));
    });
    var query = params.toString();
    var url = window.location.pathname + (query ? '?' + query : '') + window.location.hash;
    try { window.history.replaceState(null, '', url); } catch (e) { /* ignore */ }
  }

  /* ---------- matching and sorting ---------- */

  function matches(card, state) {
    var d = card.dataset;

    if (state.q) {
      var haystack = d.search || '';
      var ok = state.q.split(/\s+/).every(function (term) {
        return haystack.indexOf(term) !== -1;
      });
      if (!ok) return false;
    }
    if (state.genre.length) {
      var cardGenres = (d.genres || '').split('|');
      if (!state.genre.some(function (g) { return cardGenres.indexOf(g) !== -1; })) return false;
    }
    if (state.category.length && state.category.indexOf(d.category) === -1) return false;
    if (state.year.length && state.year.indexOf(d.year) === -1) return false;
    if (state.feature.indexOf('browser') !== -1 && d.browser !== 'true') return false;
    if (state.feature.indexOf('source') !== -1 && d.source !== 'true') return false;
    return true;
  }

  function compare(sort) {
    var byTitle = function (a, b) {
      return a.dataset.title.localeCompare(b.dataset.title, undefined, { sensitivity: 'base' });
    };
    var byDate = function (a, b) {
      return (a.dataset.date || '').localeCompare(b.dataset.date || '');
    };
    switch (sort) {
      case 'oldest': return function (a, b) { return byDate(a, b) || byTitle(a, b); };
      case 'az': return byTitle;
      case 'za': return function (a, b) { return byTitle(b, a); };
      default: return function (a, b) { return byDate(b, a) || byTitle(a, b); }; // newest
    }
  }

  /* ---------- render ---------- */

  function activeCount(state) {
    return (state.q ? 1 : 0) + GROUPS.reduce(function (n, name) {
      return n + state[name].length;
    }, 0);
  }

  function render() {
    var state = readForm();
    var shown = 0;

    cards.forEach(function (card) {
      var visible = matches(card, state);
      card.hidden = !visible;
      if (visible) shown += 1;
    });

    // Reorder every card (hidden ones too) so order stays correct when filters change.
    cards.slice().sort(compare(state.sort)).forEach(function (card) {
      grid.appendChild(card);
    });

    var total = cards.length;
    countEl.textContent = shown === total
      ? total + (total === 1 ? ' game' : ' games')
      : 'Showing ' + shown + ' of ' + total + (total === 1 ? ' game' : ' games');

    emptyEl.hidden = shown !== 0;
    grid.hidden = shown === 0;

    var active = activeCount(state);
    activeEl.hidden = active === 0;
    activeEl.textContent = active ? String(active) : '';
    clearBtns.forEach(function (btn) { btn.disabled = active === 0 && state.sort === DEFAULT_SORT; });

    writeUrl(state);
  }

  /* ---------- wire up ---------- */

  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', function (e) { e.preventDefault(); });

  clearBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      writeForm({ q: '', sort: DEFAULT_SORT, genre: [], category: [], year: [], feature: [] });
      render();
    });
  });

  // Start with the filters collapsed on small screens.
  if (panel && window.matchMedia('(max-width: 720px)').matches && activeCount(readUrl()) === 0) {
    panel.removeAttribute('open');
  }

  writeForm(readUrl());
  render();
})();
