// Preview-only version switch, injected by scripts/serve.mjs. Never part of dist/.
(async () => {
  const { versions, current } = await (await fetch('/__compare.json')).json();
  if (!versions.length) return;
  const here = location.pathname.match(/^\/v\/([a-z0-9-]+)\//)?.[1] ?? null;
  const key = 'compare-scroll';
  const saved = sessionStorage.getItem(key);
  if (saved) {
    sessionStorage.removeItem(key);
    scrollTo(0, Number(saved));
  }
  const label = name => name.replace(/^\d+-/, '').replace(/-/g, ' ').toUpperCase();
  const bar = document.createElement('div');
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Compare versions');
  bar.style.cssText = 'position:fixed;z-index:2147483647;inset-block-end:12px;inset-inline-start:12px;display:flex;flex-wrap:wrap;max-width:calc(100% - 24px);border:1px solid #000;background:#fff';
  for (const [name, text] of [...versions.map(name => [name, label(name)]), [null, current]]) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    const active = name === here;
    button.setAttribute('aria-pressed', String(active));
    button.style.cssText = `all:unset;cursor:pointer;padding:9px 12px;${active ? 'background:#000;color:#fff' : 'background:#fff;color:#000'}`;
    // The site forces its own font on every element; the switch keeps one look across versions.
    for (const [property, value] of [['font-family', 'Arial,Helvetica,sans-serif'], ['font-size', '12px'], ['font-weight', '700'], ['line-height', '1'], ['letter-spacing', '.05em']]) {
      button.style.setProperty(property, value, 'important');
    }
    button.addEventListener('focus', () => { button.style.outline = '2px solid #a72e24'; button.style.outlineOffset = '2px'; });
    button.addEventListener('blur', () => { button.style.outline = 'none'; });
    button.addEventListener('click', () => {
      if (active) return;
      sessionStorage.setItem(key, String(scrollY));
      location.href = (name ? `/v/${name}/` : '/') + location.hash;
    });
    bar.append(button);
  }
  document.body.append(bar);
})();
