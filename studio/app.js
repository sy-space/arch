// STUDIO proposal. Project data comes from dist/content.js (served at /shared/), read only.
const { categories, projects } = window.PORTFOLIO;
const media = file => `shared/assets/${file}`;
const grid = document.querySelector('.grid');
const bar = document.querySelector('.bar');
const count = document.querySelector('.count');
const dialog = document.querySelector('#project');
const pager = document.querySelector('#project-nav');
const pageCount = document.querySelector('#page-count');
// Each project's link is #<slug of its title>, e.g. #moka-sushi.
const slugs = projects.map(project => project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
const number = index => String(index + 1).padStart(2, '0');
let current = -1;
let openedFromGrid = false;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function placeholder(project) {
  const node = element('span', 'mosaic');
  node.style.setProperty('--seed', project.mosaic);
  node.setAttribute('role', 'img');
  node.setAttribute('aria-label', project.alt);
  return node;
}

// Tiles are links to the project's hash, so Enter, middle-click and Back all behave natively.
const tiles = projects.map((project, index) => {
  const item = element('li');
  const tile = element('a', 'tile');
  tile.href = `#${slugs[index]}`;
  tile.dataset.category = project.category;
  const frame = element('span', 'frame');
  if (project.image) {
    const image = element('img');
    image.src = media(project.image);
    image.alt = project.alt;
    image.loading = index < 3 ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (project.focus) image.style.objectPosition = project.focus;
    image.addEventListener('error', () => image.replaceWith(placeholder(project)), { once: true });
    frame.append(image);
  } else {
    frame.append(placeholder(project));
  }
  // On hover-capable screens only the number shows until the tile is hovered or focused (.tile-more).
  const caption = element('span', 'caption');
  const numberLine = element('span', 'tile-number', number(index));
  numberLine.append(element('span', 'tile-more', ` / ${categories[project.category]}`));
  caption.append(
    numberLine,
    element('h2', 'tile-title tile-more', project.title),
    element('span', 'tile-meta tile-more', `${project.location} · ${project.affiliation}`),
  );
  tile.append(frame, caption);
  tile.addEventListener('click', () => { openedFromGrid = true; });
  item.append(tile);
  grid.append(item);
  return tile;
});
// Contact closes the wall as its last cell.
grid.append(grid.querySelector('.contact-cell'));

// Filter: non-matching tiles dim in place; the count says how many match.
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('.filter').forEach(other => {
      other.classList.toggle('is-active', other === button);
      other.setAttribute('aria-pressed', String(other === button));
    });
    const matches = tiles.filter((tile, index) => {
      const dimmed = filter !== 'all' && tile.dataset.category !== filter;
      tile.classList.toggle('is-dimmed', dimmed);
      if (dimmed) tile.setAttribute('aria-label', `${projects[index].title} (outside ${button.textContent})`);
      else tile.removeAttribute('aria-label');
      return !dimmed;
    });
    count.textContent = filter === 'all' ? '' : `${matches.length} OF ${tiles.length}`;
    // Bring the first match into view when none is on screen.
    const top = getComputedStyle(bar).position === 'sticky' ? bar.getBoundingClientRect().bottom : 0;
    const visible = tile => {
      const box = tile.getBoundingClientRect();
      return box.bottom > top && box.top < innerHeight;
    };
    if (matches.length && !matches.some(visible)) {
      scrollTo(0, matches[0].getBoundingClientRect().top + scrollY - top - 24);
    }
  });
});

function render(index) {
  const project = projects[index];
  current = index;
  document.querySelector('#project-number').textContent = `${number(index)} / ${projects.length}`;
  document.querySelector('#project-category').textContent = categories[project.category];
  document.querySelector('#project-title').textContent = project.detailTitle || project.title;
  document.querySelector('#project-summary').textContent = project.summary;
  document.querySelector('#project-facts').replaceChildren(...project.facts.filter(([term]) => term !== 'PROJECT NAME').map(([term, value]) => {
    const row = element('div');
    row.append(element('dt', '', term), element('dd', '', value));
    return row;
  }));
  const documents = document.querySelector('#project-documents');
  documents.hidden = !project.documents?.length;
  documents.replaceChildren(...(project.documents || []).map(([label, file]) => {
    const link = element('a', '', `${label} (PDF, opens in a new tab)`);
    link.href = media(file);
    link.target = '_blank';
    link.rel = 'noopener';
    return link;
  }));
  const note = document.querySelector('#project-note');
  note.textContent = project.note || '';
  note.hidden = !project.note;

  const pages = document.querySelector('#project-pages');
  const items = project.media?.length ? project.media : project.image ? [{ src: project.image, alt: project.alt }] : [];
  pages.replaceChildren(...items.map((item, position) => {
    const page = element(item.type === 'video' ? 'video' : 'img');
    page.src = media(item.src);
    if (item.w && item.h) {
      page.width = item.w;
      page.height = item.h;
    }
    page.addEventListener('error', () => page.remove(), { once: true });
    if (item.type === 'video') {
      page.setAttribute('aria-label', item.alt);
      Object.assign(page, { muted: true, loop: true, playsInline: true, controls: true, preload: 'metadata' });
    } else {
      page.alt = item.alt;
      page.loading = position === 0 ? 'eager' : 'lazy';
      page.decoding = 'async';
    }
    return page;
  }));
  if (!items.length) {
    const clip = element('span', 'mosaic-clip');
    clip.append(placeholder(project));
    pages.append(clip);
  }

  pager.replaceChildren(...[[index - 1, 'Previous', 'previous'], [index + 1, 'Next', 'next']]
    .filter(([target]) => projects[target])
    .map(([target, word, className]) => {
      const link = element('a', className, `${word}: ${number(target)} ${projects[target].title}`);
      link.href = `#${slugs[target]}`;
      // Replace rather than push, so Back closes the detail instead of stepping through projects.
      link.addEventListener('click', event => {
        event.preventDefault();
        location.replace(link.href);
      });
      return link;
    }));
  dialog.scrollTop = 0;
  updatePageCount();
}

// The detail bar says which image is in view: "IMAGE 7 OF 68" (just "68 IMAGES" above the first one).
let countFrame = 0;
function updatePageCount() {
  countFrame = 0;
  const items = [...document.querySelectorAll('#project-pages > img, #project-pages > video')];
  if (items.length < 2) {
    pageCount.textContent = '';
    return;
  }
  const line = innerHeight / 2;
  const seen = items.filter(item => item.getBoundingClientRect().top < line).length;
  pageCount.textContent = seen ? `IMAGE ${seen} OF ${items.length}` : `${items.length} IMAGES`;
}
dialog.addEventListener('scroll', () => { if (!countFrame) countFrame = requestAnimationFrame(updatePageCount); }, { passive: true });
// A page that fails to load is removed, so recount.
document.querySelector('#project-pages').addEventListener('error', () => requestAnimationFrame(updatePageCount), true);

// Left and right arrow keys step to the previous and next project.
dialog.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('video')) return;
  const direction = { ArrowLeft: '.previous', ArrowRight: '.next' }[event.key];
  const link = direction && pager.querySelector(direction);
  if (!link) return;
  event.preventDefault();
  location.replace(link.href);
});

// The URL hash decides which project is open.
function showFromHash() {
  const index = slugs.indexOf(decodeURIComponent(location.hash.slice(1)));
  if (index === -1) {
    if (dialog.open) dialog.close();
    return;
  }
  render(index);
  if (dialog.open) document.querySelector('#project-title').focus();
  else dialog.showModal();
}

document.querySelector('#close-project').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  if (slugs.includes(decodeURIComponent(location.hash.slice(1)))) {
    if (openedFromGrid) history.back();
    else history.replaceState(null, '', location.pathname + location.search);
  }
  openedFromGrid = false;
  if (current > -1) tiles[current].focus({ preventScroll: true });
});
addEventListener('hashchange', showFromHash);
showFromHash();

// Moving to the contact sheet puts keyboard focus there too.
document.querySelector('.bar-link').addEventListener('click', () => {
  requestAnimationFrame(() => document.querySelector('#contact').focus({ preventScroll: true }));
});
