// Content lives in content.js. This file handles rendering, filtering and details.
const { categories, projects } = window.PORTFOLIO;
const grid = document.querySelector('.grid');
const dialog = document.querySelector('#project-dialog');
const contactPanel = document.querySelector('.contact-panel');
const categoryBar = document.querySelector('.categories');
const filterCount = document.querySelector('.filter-count');
const projectNav = document.querySelector('#project-nav');
// Each project's link is #<slug of its title>, e.g. #moka-sushi.
const slugs = projects.map(project => project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
console.assert(new Set(slugs).size === projects.length, 'Two projects share a title, so their links collide.');
let current = -1;
let pushedHistory = false;

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function mosaic(project, className = 'mosaic-placeholder') {
  const node = element('span', className);
  node.style.setProperty('--mosaic-seed', project.mosaic);
  node.setAttribute('role', 'img');
  node.setAttribute('aria-label', project.alt);
  return node;
}

const number = index => String(index + 1).padStart(2, '0');
const openLabel = project => `Open ${project.title} details`;

projects.forEach((project, index) => {
  const card = element('article', 'project-card');
  card.dataset.category = project.category;
  const button = element('button', 'project-open');
  button.type = 'button';
  button.dataset.project = project.id;
  button.setAttribute('aria-label', openLabel(project));
  if (project.image) {
    const image = element('img');
    image.src = `assets/${project.image}`;
    image.alt = project.alt;
    image.draggable = false;
    image.loading = index < 3 ? 'eager' : 'lazy';
    image.decoding = 'async';
    if (index === 0) image.fetchPriority = 'high';
    // Optional `focus` ("50% 30%") keeps the important part of the image inside the square crop.
    if (project.focus) image.style.objectPosition = project.focus;
    image.addEventListener('error', () => {
      button.classList.add('is-placeholder');
      image.replaceWith(mosaic(project));
    }, { once: true });
    button.append(image);
  } else {
    button.classList.add('is-placeholder');
    button.append(mosaic(project));
  }
  button.addEventListener('click', () => {
    pushedHistory = true;
    location.hash = slugs[index];
  });
  const caption = element('div', 'caption');
  const title = element('div');
  title.append(element('h2', '', project.title), element('p', '', `${project.location} · ${project.affiliation}`));
  caption.append(element('span', '', `${number(index)} / ${categories[project.category]}`), title);
  card.append(button, caption);
  grid.append(card);
});

const cards = [...grid.querySelectorAll('.project-card')];

document.querySelectorAll('.category').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    const isContact = filter === 'contact';
    document.querySelectorAll('.category').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    contactPanel.hidden = !isContact;
    grid.hidden = isContact;
    document.body.classList.toggle('contact-mode', isContact);
    const matches = cards.filter((card, index) => {
      const dimmed = !isContact && filter !== 'all' && card.dataset.category !== filter;
      card.classList.toggle('is-dimmed', dimmed);
      card.querySelector('.project-open').setAttribute('aria-label', openLabel(projects[index]) + (dimmed ? ` (outside ${button.textContent})` : ''));
      return !dimmed;
    });
    filterCount.textContent = isContact || filter === 'all' ? '' : `${matches.length} OF ${cards.length}`;
    // Dimming keeps every tile in place, so bring the first match into view when none is on screen.
    const sticky = getComputedStyle(categoryBar).position === 'sticky';
    const top = sticky ? categoryBar.getBoundingClientRect().bottom : 0;
    const onScreen = card => {
      const box = card.getBoundingClientRect();
      return box.bottom > top && box.top < innerHeight;
    };
    if (!isContact && matches.length && !matches.some(onScreen)) {
      scrollTo(0, matches[0].getBoundingClientRect().top + scrollY - (sticky ? categoryBar.offsetHeight : 0));
    }
  });
});

function renderProject(index) {
  const project = projects[index];
  current = index;
  document.querySelector('#project-number').textContent = number(index);
  document.querySelector('#project-category').textContent = categories[project.category];
  document.querySelector('#project-title').textContent = project.detailTitle || project.title;
  document.querySelector('#project-summary').textContent = project.summary;
  const image = document.querySelector('#detail-image');
  const detailFrame = image.parentElement;
  const pages = document.querySelector('#project-pages');
  detailFrame.querySelector('.mosaic-placeholder')?.remove();
  pages.replaceChildren();
  image.hidden = !project.image || Boolean(project.media?.length);
  if (project.media?.length) {
    project.media.forEach((item, position) => {
      const page = element(item.type === 'video' ? 'video' : 'img');
      page.src = `assets/${item.src}`;
      // Optional w/h (pixels) reserve each page's height so the long scroll does not jump while loading.
      if (item.w && item.h) {
        page.width = item.w;
        page.height = item.h;
      }
      page.addEventListener('error', () => page.remove(), { once: true });
      if (item.type === 'video') {
        page.setAttribute('aria-label', item.alt);
        page.muted = true;
        page.loop = true;
        page.playsInline = true;
        page.autoplay = !matchMedia('(prefers-reduced-motion: reduce)').matches;
        page.controls = true;
        page.preload = 'metadata';
      } else {
        page.alt = item.alt;
        page.loading = position === 0 ? 'eager' : 'lazy';
        page.decoding = 'async';
      }
      pages.append(page);
    });
  } else if (project.image) {
    image.src = `assets/${project.image}`;
    image.alt = project.alt;
  } else {
    detailFrame.insertBefore(mosaic(project, 'mosaic-placeholder detail-mosaic'), image);
  }
  const credit = document.querySelector('#image-credit');
  credit.textContent = project.credit;
  credit.hidden = !project.credit;
  const note = document.querySelector('#project-note');
  note.textContent = project.note;
  note.hidden = !project.note;
  const documents = document.querySelector('#project-documents');
  documents.hidden = !project.documents?.length;
  documents.replaceChildren(...(project.documents || []).map(([label, filename]) => {
    const link = element('a', '', `${label} ↗`);
    link.href = `assets/${filename}`;
    link.target = '_blank';
    link.rel = 'noopener';
    return link;
  }));
  document.querySelector('#project-facts').replaceChildren(...project.facts.filter(([term]) => term !== 'PROJECT NAME').map(([term, value]) => {
    const row = element('div');
    row.append(element('dt', '', term), element('dd', '', value));
    return row;
  }));
  projectNav.replaceChildren(...[[index - 1, 'Previous', 'previous'], [index + 1, 'Next', 'next']]
    .filter(([target]) => projects[target])
    .map(([target, word, className]) => {
      const link = element('a', className, `${word} — ${number(target)} ${projects[target].title}`);
      link.href = `#${slugs[target]}`;
      // Replace instead of push, so Back closes the detail rather than stepping through projects.
      link.addEventListener('click', event => {
        event.preventDefault();
        location.replace(link.href);
      });
      return link;
    }));
  dialog.scrollTop = 0;
}

// The URL hash is the single source of truth for which project is open.
function showFromHash() {
  const index = slugs.indexOf(decodeURIComponent(location.hash.slice(1)));
  if (index === -1) {
    if (dialog.open) dialog.close();
    return;
  }
  renderProject(index);
  if (dialog.open) document.querySelector('#project-title').focus();
  else dialog.showModal();
}

document.querySelector('#close-project').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  if (slugs.includes(location.hash.slice(1))) {
    if (pushedHistory) history.back();
    else history.replaceState(null, '', location.pathname + location.search);
  }
  pushedHistory = false;
  grid.querySelector(`[data-project="${projects[current].id}"]`)?.focus();
});
addEventListener('hashchange', showFromHash);
showFromHash();
