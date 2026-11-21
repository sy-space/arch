// Replaceable archive template. Entries without original material remain blurred.
const researchTitles = [
  'Material light study', 'Timber joint study', 'Alpine settlement mapping',
  'Brick shadow study', 'Facade repair survey', 'Valley section study',
  'Recycled material assembly', 'Acoustic surface study',
];
const projectTitles = [
  'Small civic room', 'House conversion', 'Civic building study',
  'Office facade detail', 'Competition paper model', 'Community centre',
  'School extension', 'Mixed housing street', 'Factory reuse',
  'Lakeside pavilion', 'Public stair system', 'Exhibition interior',
  'Modular dwelling', 'Mountain infrastructure', 'Urban renewal model',
  'Construction detail', 'Spatial image installation',
];

function project(id, category, title, location, affiliation, index) {
  return {
    id, category, title, location, affiliation,
    image: null,
    year: null,
    mosaic: index,
    alt: `Blurred mosaic placeholder for ${title}, ${location}.`,
    summary: 'This is a replaceable project archive entry. It will trace the project from its initial question to its spatial result: site observation, material choices, model studies, drawing development and decisions on site. The text stays brief and explains how the project unfolded, the role taken within it, and the space or research it produced. A blurred mosaic stands in as the temporary representative image. Once original material is supplied, process drawings, sections, details, models and site records can follow in sequence. Each project can hold a different number of images, and the page extends with its content.',
    facts: [
      ['PROJECT NAME', title], ['LOCATION', location],
      ['PERSONAL / OFFICE', affiliation], ['ROLE', 'To be replaced'],
      ['COLLABORATORS', 'To be replaced'], ['STATUS', 'Template placeholder'],
    ],
    credit: 'Temporary mosaic placeholder',
    note: 'This tile is intentionally blurred until the original representative image is supplied.',
  };
}

const research = researchTitles.map((title, i) =>
  project(`research-${i + 1}`, 'research', title, ['Zürich', 'Winterthur', 'Basel', 'Bern'][i % 4], 'PERSONAL', i)
);
const personal = projectTitles.slice(0, 2).map((title, i) =>
  project(`personal-${i + 1}`, 'projects', title, ['Zürich', 'St. Gallen'][i], 'PERSONAL', i + 8)
);
const aCompany = projectTitles.slice(2, 5).map((title, i) =>
  project(`a-company-${i + 1}`, 'projects', title, ['Zürich', 'Luzern', 'Basel'][i], 'A COMPANY', i + 10)
);
const bCompany = projectTitles.slice(5, 16).map((title, i) =>
  project(`b-company-${i + 1}`, 'projects', title, ['Zürich', 'Winterthur', 'Basel', 'Bern', 'Chur'][i % 5], 'B COMPANY', i + 13)
);
const cross = [project('cross-1', 'cross-disciplinary', projectTitles[16], 'Zürich', 'PERSONAL', 24)];

research[0].title = 'Living Energy';
research[0].detailTitle = 'Living Energy — From Energy Supply to Living With Energy';
research[0].location = 'Aarhus, Denmark';
research[0].year = 2026;
research[0].image = 'living-energy-outcome/interior-01.webp';
research[0].alt = 'Living Energy interior rendering showing a split-level space, movable furniture and red heating pipes.';
research[0].summary = 'Living Energy explores how architecture can organize and reveal energy rather than seal it away. The research begins with the building as an open thermal system and considers how the body senses changing temperature, light and air. At an existing warehouse on Sumatravej 1 in Aarhus, the thesis develops a spatial proposal using thermal mass, active heating, openings, height differences and movable furniture walls. The preliminary booklet establishes the research context; the 0622 presentation traces the design logic from site and material studies to airflow, heating and facade strategies. Plans, sections, axonometrics and interior views document the proposal. Photographs of the physical model record its relationship to the site. The final animation shows airflow through a typical unit.';
research[0].documents = [
  ['RESEARCH BOOKLET (PDF)', 'living-energy-research.pdf'],
  ['DESIGN LOGIC / 0622 (PDF)', 'living-energy-presentation.pdf'],
  ['PHYSICAL MODEL (PDF)', 'living-energy-model.pdf'],
];
research[0].media = [
  ...Array.from({ length: 22 }, (_, i) => ({
    type: 'image', src: `living-energy-pages/page-${String(i + 1).padStart(2, '0')}.jpg`,
    alt: `Living Energy research booklet, page ${i + 1} of 22`,
  })),
  ...Array.from({ length: 34 }, (_, i) => ({
    type: 'image', src: `living-energy-pre/page-${String(i + 1).padStart(2, '0')}.jpg`,
    alt: `Living Energy 0622 presentation, page ${i + 1} of 34`,
  })),
  ['site-plan-1-500.webp', 'Site plan at 1:500'],
  ['plan-1-100.webp', 'Typical unit floor plans at 1:100'],
  ['piping-structure-axo.webp', 'Piping and structural system axonometric'],
  ['thermal-airflow-section.webp', 'Thermal airflow section at 1:25'],
  ['facade-thermal-axo.webp', 'Facade views and thermal axonometric studies'],
  ['heating-system.webp', 'Heating system detail and diagram'],
  ['moving-furniture-wall.webp', 'Movable furniture wall variants'],
  ['interior-01.webp', 'Interior view of the split-level heated space'],
  ['interior-02-03.webp', 'Two interior views of the proposed spaces'],
  ...Array.from({ length: 3 }, (_, i) => ({
    type: 'image', src: `living-energy-model/page-${i + 1}.jpg`,
    alt: `Living Energy physical model photograph, page ${i + 1} of 3`,
  })),
  { type: 'video', src: 'living-energy-airflow.mp4', alt: 'Animated airflow study through a typical unit' },
].map(item => Array.isArray(item) ? {
  type: 'image', src: `living-energy-outcome/${item[0]}`, alt: item[1],
} : item);
research[0].facts = [
  ['PROJECT NAME', 'Living Energy — From Energy Supply to Living With Energy'],
  ['LOCATION', 'Aarhus, Denmark'],
  ['PERSONAL / OFFICE', 'PERSONAL'],
  ['ROLE', 'Research, architectural design, visualization and model by Nadia Sha'],
  ['COLLABORATORS', '—'],
  ['STATUS', 'Master thesis · 2026'],
  ['ACADEMIC CONTEXT', '2A Studio · Aarhus School of Architecture'],
];
research[0].credit = '';
research[0].note = '';

research[1].title = 'Living a Ramp';
research[1].location = 'Basel, Switzerland';
research[1].year = 2024;
research[1].affiliation = 'EPFL EAST';
research[1].image = 'living-a-ramp/hero.webp';
research[1].alt = 'Rendering of a proposed interior within the existing parking ramp at Parkhaus Leimgrube.';
research[1].summary = 'Living a Ramp reimagines Parkhaus Leimgrube, a parking structure in Basel, as a place for dwelling. Rather than treating its continuous slope as an obstacle to be levelled, the project asks how the ramp itself can shape domestic space and movement. The research first documents the existing building, its structure and circulation. A catalogue of furniture encountered on the slopes of Lausanne then studies how everyday objects meet inclined ground. In the proposal, a meandering horizontal surface accommodates the activities that need level support: sleeping, sitting, cooking and gathering. Its changing relationship with the ramp creates different heights, rooms and moments of transition. Apartments extend toward a shared circulation zone at the facade, while the original concrete slope remains legible. Plans, sections, spatial views and a physical model show how a structure made for cars could support a new experience of living.';
research[1].documents = [
  ['PROJECT BOOKLET (PDF)', 'living-a-ramp-booklet.pdf'],
  ['PLAN (PDF)', 'living-a-ramp-plan.pdf'],
  ['SECTION (PDF)', 'living-a-ramp-section.pdf'],
];
research[1].media = [
  { type: 'image', src: 'living-a-ramp/plan.jpg', alt: 'Living a Ramp proposed floor plan' },
  { type: 'image', src: 'living-a-ramp/section.jpg', alt: 'Living a Ramp longitudinal section through the converted parking structure' },
  ...[1, 3, ...Array.from({ length: 9 }, (_, i) => i + 5), ...Array.from({ length: 6 }, (_, i) => i + 15), 23, 25, 26, 27].map(n => ({
    type: 'image', src: `living-a-ramp/page-${String(n).padStart(2, '0')}.jpg`,
    alt: `Living a Ramp project booklet, page ${n} of 39`,
  })),
  ...Array.from({ length: 9 }, (_, i) => i + 28).map(n => ({
    type: 'image', src: `living-a-ramp/page-${String(n).padStart(2, '0')}.jpg`,
    alt: `Living a Ramp spatial view or physical model, booklet page ${n} of 39`,
  })),
];
research[1].facts = [
  ['PROJECT NAME', 'Living a Ramp'],
  ['LOCATION', 'Parkhaus Leimgrube, Leimgrubenweg 13, Basel, Switzerland'],
  ['PERSONAL / OFFICE', 'EPFL — EAST studio'],
  ['ROLE', 'Research and design with Domingo Prada'],
  ['COLLABORATORS', 'Domingo Prada'],
  ['STATUS', 'Academic research · Spring 2024'],
  ['TEAM', 'Nadia Sha and Domingo Prada'],
];
research[1].credit = '';
research[1].note = '';

research[2].title = 'Collective Housing, Aarhus';
research[2].detailTitle = 'Collective Housing — Aarhus';
research[2].location = 'Aarhus, Denmark';
research[2].year = 2023;
research[2].image = 'collective-housing-2023/interior-hero.webp';
research[2].alt = 'Interior rendering of the collective housing study in Aarhus.';
research[2].summary = 'Project description to be added.';
research[2].documents = [
  ['PHYSICAL MODEL (PDF)', 'collective-housing-2023-model.pdf'],
];
research[2].media = [
  ['site-ground-floor.webp', 'Site and ground-floor plans'],
  ['upper-floors-section.webp', 'First and second floor plans with longitudinal section'],
  ['upper-floors-sections.webp', 'Third and fourth floor plans with sections'],
  ['basement-elevation.webp', 'Basement plan and elevation'],
  ['structural-axonometric.webp', 'Structural drawings and axonometric'],
  ['construction-detail.webp', 'Construction detail and rendering'],
  ['communal-interiors.webp', 'Communal interior renderings'],
  ['private-interiors.webp', 'Private interior renderings'],
  ['interior-hero.webp', 'Interior rendering of the collective space'],
  ['model-and-detail.webp', 'Model views and architectural detail'],
].map(([filename, alt]) => ({ type: 'image', src: `collective-housing-2023/${filename}`, alt }))
  .concat(Array.from({ length: 9 }, (_, i) => ({
    type: 'image', src: `collective-housing-2023-model/page-${i + 1}.jpg`,
    alt: `Collective housing physical model photograph, page ${i + 1} of 9`,
  })));
research[2].facts = [
  ['PROJECT NAME', 'Collective Housing — Aarhus'],
  ['LOCATION', 'Aarhus, Denmark'],
  ['PERSONAL / OFFICE', 'PERSONAL'],
  ['ROLE', 'Individual academic project'],
  ['COLLABORATORS', 'None'],
  ['STATUS', 'Academic research · September–December 2023'],
  ['ACADEMIC CONTEXT', '2A Studio · Aarhus School of Architecture'],
];
research[2].credit = '';
research[2].note = '';

research[3].title = 'Theatre Built from Reclaimed Building Materials';
research[3].location = 'Aarhus, Denmark';
research[3].year = 2024;
research[3].image = 'reclaimed-stage/page-11.jpg';
research[3].alt = 'Interior view beneath the reclaimed-material roof, from the penultimate page of the project booklet.';
research[3].summary = 'Theatre Built from Reclaimed Building Materials proposes a small performance venue in Aarhus. Developed as an individual design project in autumn 2024, it begins with studies of lightweight structures and reusable components. A repeated metal frame supports a canopy of folded roof elements over an open performance space. The drawings consider how the parts meet, how daylight enters, and how a modest stage can sit within the larger volume. A site model, axonometric, plan, facade and section describe the overall form. A separate assembly study identifies scaffolding, steel members, sheet panels, cables, lighting and drainage within the roof detail. Exterior and interior views show the proposal from the surrounding site and from the performance space. The project uses recovered construction material as the starting point for an architectural proposal, with the atmosphere and structure developed together.';
research[3].documents = [['PROJECT BOOKLET (PDF)', 'reclaimed-stage-booklet.pdf']];
research[3].media = Array.from({ length: 12 }, (_, i) => ({
  type: 'image', src: `reclaimed-stage/page-${String(i + 1).padStart(2, '0')}.jpg`,
  alt: `Theatre Built from Reclaimed Building Materials, booklet page ${i + 1} of 12`,
}));
research[3].facts = [
  ['PROJECT NAME', 'Theatre Built from Reclaimed Building Materials'],
  ['LOCATION', 'Aarhus, Denmark'],
  ['PERSONAL / OFFICE', 'PERSONAL'],
  ['ROLE', 'Individual design project by Nadia Sha'],
  ['COLLABORATORS', 'None'],
  ['STATUS', 'Design proposal · Autumn 2024'],
];
research[3].credit = '';
research[3].note = '';

// Show the finished studies newest first; placeholder slots retain their IDs.
research.splice(1, 0, research.splice(3, 1)[0]);

personal[0].title = 'MOKA SUSHI';
personal[0].location = 'Hobro, Denmark';
personal[0].year = 2026;
personal[0].image = 'moka-sushi/photo-01.png';
personal[0].alt = 'MOKA SUSHI dining space with pale timber furniture, counter and warm daylight.';
personal[0].summary = 'MOKA SUSHI is an independently developed and built restaurant interior in Hobro, Denmark, completed between February and July 2026. The design centres on a timber bar that brings food preparation, ordering and handover into one visible sequence. A light canopy defines the counter without closing off the room, while seating extends along the windows and into smaller areas for groups. Pale wood, soft lighting and translucent curtains give the space a warm, open atmosphere. A two-tone wall and small red diamond details provide a measured rhythm across the interior. The archive begins with photographs of the built space, then moves through details and construction views. The original April design presentation follows with the plan, counter studies, axonometrics and entrance proposal, showing how the project developed before completion.';
personal[0].documents = [['DESIGN PRESENTATION (PDF)', 'moka-sushi-design.pdf']];
personal[0].media = [
  ['photo-12.jpg', 'Overall view across the MOKA SUSHI counter and window seating'],
  ['photo-01.png', 'Dining area and timber counter in daylight'],
  ['photo-08.jpg', 'Window-side seating alongside the timber counter'],
  ['photo-02.png', 'Dining table beneath a paper pendant light'],
  ['photo-13.jpg', 'Dining tables, timber chairs and pendant light'],
  ['photo-06.jpg', 'Banquette seating and wall lights'],
  ['photo-03.jpg', 'Timber table, chairs and red wall detail'],
  ['photo-11.jpg', 'Table and pendant light by the window'],
  ['photo-14.jpg', 'Window-side table and translucent curtain'],
  ['photo-09.jpg', 'Evening view through the restaurant window'],
  ['photo-10.jpg', 'Candle and table seen through the window'],
  ['photo-04.jpg', 'Counter and timber canopy during the project'],
  ['photo-05.jpg', 'Dining area and paper pendant lights during the project'],
  ['photo-07.jpg', 'Window-side dining area during the project'],
  ['photo-15.jpg', 'Timber canopy and wall lighting detail during the project'],
  ...[3, 4, 11, 12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25].map(n => [
    `design-${String(n).padStart(2, '0')}.jpg`, `MOKA SUSHI April design presentation, page ${n}`,
  ]),
].map(([filename, alt]) => ({ type: 'image', src: `moka-sushi/${filename}`, alt }));
personal[0].facts = [
  ['PROJECT NAME', 'MOKA SUSHI'],
  ['LOCATION', 'Hobro, Denmark'],
  ['PERSONAL / OFFICE', 'PERSONAL'],
  ['ROLE', 'Independent project'],
  ['STATUS', 'Built · February–July 2026'],
];
personal[0].credit = '';
personal[0].note = '';

// Clean handoff template: no real project media is bundled in this folder.
for (const item of [...research, ...personal, ...aCompany, ...bCompany, ...cross]) {
  item.image = null;
  item.media = undefined;
  item.documents = undefined;
  item.alt = `Blurred mosaic placeholder for ${item.title}, ${item.location}.`;
  item.credit = 'Template placeholder';
  item.note = 'Replace this placeholder with the project representative image and detail media.';
}

window.PORTFOLIO = {
  categories: {
    research: 'RESEARCH',
    projects: 'PROJECTS',
    'cross-disciplinary': 'CROSS-DISCIPLINARY',
  },
  // 5 real entries, then 10 placeholders covering all three categories.
  projects: [personal[0], ...research.slice(0, 7), personal[1], ...aCompany.slice(0, 2), ...bCompany.slice(0, 3), ...cross],
};
// Sample years for the placeholders (two per year, 2023 down to 2019); the footer marks them as samples.
window.PORTFOLIO.projects.slice(5).forEach((item, i) => { item.year = 2023 - Math.floor(i / 2); });
