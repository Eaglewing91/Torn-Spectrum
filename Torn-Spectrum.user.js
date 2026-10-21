// ==UserScript==
// @name         Torn Spectrum
// @namespace    https://github.com/Eaglewing91
// @version      1.3.1
// @description  Sensory-friendly colour layers for Torn, built with autism, ADHD and visual needs in mind — calm / low-stimulation themes, coloured reading overlays, colour-blind assist, reading ruler, reduced motion and readable text. Visual only: makes no network requests and needs no API key.
// @author       Eaglewing [571041]
// @license      MIT
// @homepageURL  https://github.com/Eaglewing91/Torn-Spectrum
// @supportURL   https://github.com/Eaglewing91/Torn-Spectrum/issues
// @updateURL    https://raw.githubusercontent.com/Eaglewing91/Torn-Spectrum/main/Torn-Spectrum.user.js
// @downloadURL  https://raw.githubusercontent.com/Eaglewing91/Torn-Spectrum/main/Torn-Spectrum.user.js
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// ==/UserScript==

// Torn Spectrum — Copyright (c) 2026 Eaglewing [571041]. Released under the MIT License (see LICENSE).

/*
 * WHY THIS SCRIPT EXISTS
 * ----------------------
 * Torn is a busy, text-heavy game: bright status colours, dense tables, flashing
 * timers, animated banners and a lot of red/green "good/bad" signals. For many
 * players that's just part of the game. For others it's genuinely hard work.
 *
 * Torn Spectrum was made for players who are autistic, have ADHD, dyslexia,
 * visual stress (Irlen / Meares-Irlen syndrome), migraines, light sensitivity,
 * low vision or colour blindness. Torn's Dark Mode helps some people, but one
 * dark theme doesn't suit everyone's eyes or brain. Sensory needs vary a lot from
 * person to person, so instead of a single theme this script gives each player a
 * set of layers they can mix until Torn feels comfortable to them:
 *
 *  - Calm / low-stimulation layers turn down colour and contrast to reduce sensory
 *    overload and make long sessions less tiring.
 *  - Coloured overlays work like the tinted reading overlays many people already
 *    use for visual stress and dyslexia.
 *  - Colour-blind assist layers help tell apart the red, green, blue and yellow
 *    cues Torn relies on, and "Underline links" stops links depending on colour alone.
 *  - The reading ruler and reduced motion help with focus and attention by cutting
 *    movement and visual clutter around what you're reading.
 *  - Readable font and extra spacing make dense text easier to track.
 *
 * Everything is optional, adjustable and switched off by default, so each player
 * chooses what works for them. Nobody should have to struggle with how the game
 * looks in order to enjoy playing it.
 *
 * Open it from your avatar menu, under Dark Mode ("Torn Spectrum"),
 * or with Alt+Shift+C on a keyboard.
 *
 * Works in Tampermonkey / Violentmonkey (desktop) and in Torn PDA (Android & iOS).
 *
 * WHO IT MAY HELP
 * ---------------
 * Everyone is different, so these are features worth trying, not guaranteed fixes.
 * Torn Spectrum is not a medical tool and does not treat any condition.
 *
 * Neurodivergence
 *  - May help players with autism or sensory processing differences: Calm, Low
 *    stimulation, Greyscale, Reduce motion and coloured overlays can ease sensory overload.
 *  - May help players with ADHD: the reading ruler, Reduce motion, Low stimulation and
 *    Greyscale cut distracting movement and colour so it's easier to stay focused.
 *  - May help players with sensory processing disorder (SPD): Low stimulation, Reduce
 *    motion and Night warm soften a busy, bright screen.
 *  - May help players with dyspraxia (DCD): the reading ruler, extra text spacing and
 *    strong focus outline make it easier to keep your place.
 *
 * Reading and visual processing
 *  - May help players with dyslexia: coloured overlays, readable font, extra text
 *    spacing, Paper and the reading ruler can make dense text easier to follow.
 *  - May help players with visual stress (Meares-Irlen syndrome): coloured overlays,
 *    Paper, Calm and lower contrast can reduce glare and text "moving".
 *  - May help players with visual processing disorder: the reading ruler and extra
 *    spacing, plus High contrast or Low stimulation depending on the person.
 *
 * Light sensitivity and headaches
 *  - May help players with migraine, especially light-triggered: Night warm, Low
 *    stimulation, lower brightness and Reduce motion.
 *  - May help players with photophobia (light sensitivity): Night warm, lower brightness
 *    and contrast, and grey or peach overlays.
 *  - May help players with post-concussion syndrome: Low stimulation, Reduce motion
 *    and Night warm.
 *  - May help players with eye strain from long sessions: Night warm, Paper and Calm.
 *  - May help players with photosensitive epilepsy: Reduce motion cuts animated
 *    movement, but it CANNOT guarantee protection from flashing content.
 *
 * Vision
 *  - May help players with low vision: High contrast, the brightness and contrast
 *    sliders, strong focus outline and underline links.
 *  - May help players with protanopia / protanomaly (red-weak): Protan assist and
 *    underline links.
 *  - May help players with deuteranopia / deuteranomaly (green-weak): Deutan assist
 *    and underline links.
 *  - May help players with tritanopia / tritanomaly (blue-yellow): Tritan assist.
 *  - May help players with cataracts or glare sensitivity: lower brightness, Night warm
 *    and High contrast.
 *  - May help players with nystagmus: the reading ruler, extra spacing and Reduce motion.
 *  - May help players with age-related vision changes: High contrast, readable font,
 *    extra spacing and underline links.
 *
 * Other
 *  - May help players with anxiety or sensory overload: Calm, Low stimulation and
 *    Reduce motion.
 *  - May help players with vestibular disorders or motion sensitivity: Reduce motion.
 *  - May help players with chronic fatigue (ME/CFS) or long COVID: Low stimulation and
 *    Night warm can make sessions less draining.
 *
 * COMPLIANCE NOTES
 * - This script only changes how the page you are viewing LOOKS (CSS + overlays).
 * - It makes no requests of any kind (no Torn page requests, no API calls, no external sites).
 * - It never clicks, submits or triggers anything on the page.
 * - Settings are saved in your own browser (localStorage) and never leave it.
 */

(function () {
  'use strict';

  // Torn PDA can re-inject userscripts into the same page — only ever run once
  if (window.__tornSpectrumLoaded) return;
  window.__tornSpectrumLoaded = true;

  // Some managers (e.g. Torn PDA at "start") run before <html> exists — wait for it
  if (document.documentElement) main();
  else new MutationObserver((m, o) => {
    if (document.documentElement) { o.disconnect(); main(); }
  }).observe(document, { childList: true });

  function main() {

  /* ------------------------------------------------------------------ */
  /*  Settings                                                           */
  /* ------------------------------------------------------------------ */
  const KEY = 'tcl-settings-v1';
  const DEFAULTS = {
    enabled: true,
    preset: 'none',
    tint: 'none',
    tintStrength: 25,
    tintBlend: 'auto',
    brightness: 100,
    contrast: 100,
    saturation: 100,
    reduceMotion: false,
    ruler: false,
    rulerHeight: 70,
    rulerDim: 50,
    readableFont: false,
    textSpacing: false,
    underlineLinks: false,
    strongFocus: false,
  };

  const load = () => {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { /* storage blocked */ } };
  let s = load();

  /* ------------------------------------------------------------------ */
  /*  Colour layers                                                      */
  /* ------------------------------------------------------------------ */
  const PRESETS = {
    none:     { name: 'None',            filter: '',                                                desc: 'Torn exactly as normal (works alongside Torn’s own dark mode).' },
    calm:     { name: 'Calm',            filter: 'saturate(0.6) contrast(0.9)',                     desc: 'Muted colours and softer contrast — less visual noise without losing detail.' },
    lowstim:  { name: 'Low stimulation', filter: 'saturate(0.3) contrast(0.82) brightness(0.96)',   desc: 'Strongly muted, gentle contrast. Good for sensory sensitivity and overwhelm.' },
    sepia:    { name: 'Paper',           filter: 'sepia(0.45) saturate(0.85) contrast(0.92)',       desc: 'Warm, paper-like tone that many find easier for long reading sessions.' },
    night:    { name: 'Night warm',      filter: 'sepia(0.35) saturate(1.1) brightness(0.9)',       desc: 'Cuts blue light and glare for late-night play.' },
    grey:     { name: 'Greyscale',       filter: 'grayscale(1)',                                    desc: 'Removes all colour to cut distraction. Red/green status colours will be lost.' },
    contrast: { name: 'High contrast',   filter: 'contrast(1.35) saturate(1.15)',                   desc: 'Sharper text and edges for low vision.' },
    protan:   { name: 'Protan assist',   filter: 'url(#tcl-protan)',                                desc: 'Shifts colours so reds are easier to tell apart (red-weak vision).' },
    deutan:   { name: 'Deutan assist',   filter: 'url(#tcl-deutan)',                                desc: 'Shifts colours so greens are easier to tell apart (green-weak vision).' },
    tritan:   { name: 'Tritan assist',   filter: 'url(#tcl-tritan)',                                desc: 'Shifts colours so blues and yellows are easier to tell apart.' },
  };

  const TINTS = {
    none:   { name: 'None',   color: '' },
    blue:   { name: 'Blue',   color: '#7fb2ff' },
    aqua:   { name: 'Aqua',   color: '#7fe3e0' },
    green:  { name: 'Green',  color: '#9be59b' },
    yellow: { name: 'Yellow', color: '#ffe680' },
    peach:  { name: 'Peach',  color: '#ffc499' },
    rose:   { name: 'Rose',   color: '#ffa3b8' },
    lilac:  { name: 'Lilac',  color: '#c9a8ff' },
    grey:   { name: 'Grey',   color: '#b5b5b5' },
  };

  // Daltonisation matrices (sRGB) for the colour-blind assist layers
  const CVD = {
    protan: '1 0 0 0 0  0.4789 0.4769 0.0442 0 0  0.5973 -0.6887 1.0914 0 0  0 0 0 1 0',
    deutan: '1.4366 -0.6314 0.1948 0 0  0 1 0 0 0  -0.1842 0.1863 0.9979 0 0  0 0 0 1 0',
    tritan: '0.7412 -0.4072 0.6653 0 0  0.0751 0.5852 0.339 0 0  0 0 1 0 0  0 0 0 1 0',
  };

  /* ------------------------------------------------------------------ */
  /*  Early injection (document-start) — avoids a flash of unstyled page */
  /* ------------------------------------------------------------------ */
  const root = document.documentElement;
  const SVGNS = 'http://www.w3.org/2000/svg';

  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
  svg.innerHTML = '<defs>' + Object.entries(CVD).map(([id, m]) =>
    `<filter id="tcl-${id}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${m}"/></filter>`
  ).join('') + '</defs>';
  root.appendChild(svg);

  const fxStyle = document.createElement('style');
  fxStyle.id = 'tcl-effects';
  root.appendChild(fxStyle);

  const uiStyle = document.createElement('style');
  uiStyle.id = 'tcl-ui-style';
  uiStyle.textContent = UI_CSS();
  root.appendChild(uiStyle);

  /* ------------------------------------------------------------------ */
  /*  Effect CSS                                                         */
  /* ------------------------------------------------------------------ */
  const TEXT_SEL = 'p,a,li,td,th,dd,dt,label,input,textarea,select,button,h1,h2,h3,h4,h5,h6,div,span,b,strong,em,small';
  const NOT_ICON = ':not(i):not([class*="icon"]):not([class*="Icon"]):not([class*="fa-"])';

  function effectsCSS() {
    if (!s.enabled) return '';
    let css = '';

    const f = [];
    const p = PRESETS[s.preset];
    if (p && p.filter) f.push(p.filter);
    if (s.brightness !== 100) f.push(`brightness(${s.brightness / 100})`);
    if (s.contrast !== 100) f.push(`contrast(${s.contrast / 100})`);
    if (s.saturation !== 100) f.push(`saturate(${s.saturation / 100})`);
    if (f.length) css += `html{filter:${f.join(' ')} !important;}`;

    if (s.reduceMotion) {
      css += `*,*::before,*::after{animation-duration:0.001ms !important;animation-iteration-count:1 !important;` +
             `transition-duration:0.001ms !important;transition-delay:0s !important;scroll-behavior:auto !important;}`;
    }
    if (s.readableFont) {
      css += `body,body :where(${TEXT_SEL})${NOT_ICON}{font-family:"Atkinson Hyperlegible","Lexend","OpenDyslexic",Verdana,Tahoma,sans-serif !important;}`;
    }
    if (s.textSpacing) {
      css += `body :where(${TEXT_SEL})${NOT_ICON}{letter-spacing:0.04em !important;word-spacing:0.12em !important;}`;
    }
    if (s.underlineLinks) {
      css += `body a[href]${NOT_ICON}{text-decoration:underline !important;text-underline-offset:2px !important;}`;
    }
    if (s.strongFocus) {
      css += `body :focus-visible{outline:3px solid #ffbf47 !important;outline-offset:2px !important;}`;
    }
    return css;
  }

  /* ------------------------------------------------------------------ */
  /*  DOM pieces (created once the page body exists)                     */
  /* ------------------------------------------------------------------ */
  let overlay, rulerTop, rulerBottom, panel;
  let pointerY = window.innerHeight / 2, rulerQueued = false;

  const isDarkTorn = () => !!(document.body && document.body.classList.contains('dark-mode'));

  function applyOverlay() {
    if (!overlay) return;
    const t = TINTS[s.tint];
    if (!s.enabled || !t || !t.color) { overlay.style.display = 'none'; return; }
    let blend = s.tintBlend;
    if (blend === 'auto') blend = isDarkTorn() ? 'screen' : 'multiply';
    overlay.style.background = t.color;
    overlay.style.opacity = String(s.tintStrength / 100);
    overlay.style.mixBlendMode = blend;
    overlay.style.display = 'block';
  }

  function drawRuler() {
    rulerQueued = false;
    if (!rulerTop) return;
    const on = s.enabled && s.ruler;
    rulerTop.style.display = rulerBottom.style.display = on ? 'block' : 'none';
    if (!on) return;
    const half = s.rulerHeight / 2;
    const dim = `rgba(0,0,0,${s.rulerDim / 100})`;
    rulerTop.style.background = rulerBottom.style.background = dim;
    rulerTop.style.height = Math.max(0, pointerY - half) + 'px';
    rulerBottom.style.top = (pointerY + half) + 'px';
  }
  const queueRuler = () => { if (!rulerQueued) { rulerQueued = true; requestAnimationFrame(drawRuler); } };

  function applyAll() {
    fxStyle.textContent = effectsCSS();
    applyOverlay();
    drawRuler();
  }

  /* ------------------------------------------------------------------ */
  /*  Avatar settings-menu entry (sits under Torn's Dark Mode row)       */
  /* ------------------------------------------------------------------ */
  const MENU_ICON =
    '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="-6 -4 28 28"><path fill-rule="evenodd" ' +
    'd="M8,0A8,8,0,0,0,8,16a1.4,1.4,0,0,0,1.05-2.33,1.38,1.38,0,0,1,1-2.34h1.62A4.33,4.33,0,0,0,16,7C16,3.13,12.42,0,8,0Z' +
    'M3.5,8A1.25,1.25,0,1,1,4.75,6.75,1.25,1.25,0,0,1,3.5,8ZM6,4.5A1.25,1.25,0,1,1,7.25,3.25,1.25,1.25,0,0,1,6,4.5Z' +
    'M10,4.5A1.25,1.25,0,1,1,11.25,3.25,1.25,1.25,0,0,1,10,4.5ZM12.5,8a1.25,1.25,0,1,1,1.25-1.25A1.25,1.25,0,0,1,12.5,8Z"/></svg>';

  function buildMenuItem() {
    const li = document.createElement('li');
    li.className = 'link tcl-spectrum';
    li.innerHTML =
      '<a role="button" tabindex="0" title="Open Torn Spectrum (Alt+Shift+C)">' +
        '<div class="icon-wrapper">' + MENU_ICON + '</div>' +
        '<span class="link-text">Torn Spectrum</span>' +
      '</a>';

    const btn = li.firstElementChild;
    // No href, so nothing navigates; events stop here so Torn's menu code never sees them
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); openPanel(); });
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); openPanel(); }
    });
    return li;
  }

  function placeMenuItem() {
    const dark = document.querySelector('ul.settings-menu > li.dark-mode');
    if (!dark || dark.parentElement.querySelector(':scope > li.tcl-spectrum')) return;
    dark.after(buildMenuItem());
  }



  /* ------------------------------------------------------------------ */
  /*  Settings panel                                                     */
  /* ------------------------------------------------------------------ */
  const tog = (key, label, hint) =>
    `<label class="tcl-toggle"><input type="checkbox" data-key="${key}"><span class="tcl-tbox" aria-hidden="true"></span>` +
    `<span class="tcl-tl"><span>${label}</span>${hint ? `<small>${hint}</small>` : ''}</span></label>`;
  const range = (key, label, min, max, step, unit) =>
    `<label class="tcl-row"><span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" data-key="${key}">` +
    `<output data-for="${key}" data-unit="${unit}"></output></label>`;

  function panelHTML() {
    const cards = Object.entries(PRESETS).map(([k, p]) =>
      `<label class="tcl-card" title="${p.desc}"><input type="radio" name="tcl-preset" data-key="preset" value="${k}">` +
      `<span class="tcl-swatch" style="filter:${p.filter || 'none'}"></span><span class="tcl-cname">${p.name}</span></label>`).join('');
    const chips = Object.entries(TINTS).map(([k, t]) =>
      `<label class="tcl-chip" title="${t.name}"><input type="radio" name="tcl-tint" data-key="tint" value="${k}">` +
      `<span class="tcl-chipdot" style="background:${t.color || 'transparent'}"></span><span>${t.name}</span></label>`).join('');

    return `
      <div class="tcl-head">
        <h2 id="tcl-title">Torn Spectrum</h2>
        <label class="tcl-switch" title="Turn all layers on / off (Alt+Shift+X)">
          <input type="checkbox" data-key="enabled" aria-label="Layers on"><span class="tcl-knob" aria-hidden="true"></span>
        </label>
        <button type="button" class="tcl-x" data-action="close" aria-label="Close">&times;</button>
      </div>
      <div class="tcl-body">
        <section>
          <h3>Colour layer</h3>
          <div class="tcl-grid" role="radiogroup" aria-label="Colour layer">${cards}</div>
          <p class="tcl-desc" id="tcl-desc"></p>
        </section>
        <section>
          <h3>Coloured overlay</h3>
          <p class="tcl-hint">Tinted overlays, like reading overlays, can ease visual stress. Everyone’s best colour is different, so try a few.</p>
          <div class="tcl-chips" role="radiogroup" aria-label="Overlay colour">${chips}</div>
          ${range('tintStrength', 'Strength', 5, 60, 1, '%')}
          <label class="tcl-row"><span>Overlay style</span>
            <select data-key="tintBlend">
              <option value="auto">Auto (match Torn theme)</option>
              <option value="multiply">For light mode</option>
              <option value="screen">For dark mode</option>
            </select>
          </label>
        </section>
        <section>
          <h3>Fine-tune</h3>
          ${range('brightness', 'Brightness', 60, 120, 1, '%')}
          ${range('contrast', 'Contrast', 60, 150, 1, '%')}
          ${range('saturation', 'Colour', 0, 150, 1, '%')}
          <button type="button" class="tcl-btn" data-action="reset-fine">Reset fine-tune</button>
        </section>
        <section>
          <h3>Focus &amp; reading</h3>
          ${tog('reduceMotion', 'Reduce motion', 'Stops animations and transitions')}
          ${tog('ruler', 'Reading ruler', 'Dims the screen except a band that follows your pointer')}
          <div class="tcl-sub" data-ruler-opts>
            ${range('rulerHeight', 'Band height', 30, 250, 5, 'px')}
            ${range('rulerDim', 'Dimming', 15, 85, 1, '%')}
          </div>
          ${tog('readableFont', 'Readable font', 'Uses Atkinson Hyperlegible / Lexend / OpenDyslexic if installed, else Verdana')}
          ${tog('textSpacing', 'Extra text spacing', 'Wider letter and word spacing')}
          ${tog('underlineLinks', 'Underline links', 'So links don’t rely on colour alone')}
          ${tog('strongFocus', 'Strong focus outline', 'Bright outline for keyboard navigation')}
        </section>
      </div>
      <div class="tcl-foot">
        <p>Open any time from your avatar menu → <strong>Torn Spectrum</strong>.<span class="tcl-keys"> Keyboard: <kbd>Alt+Shift+C</kbd> panel · <kbd>Alt+Shift+X</kbd> on/off.</span></p>
        <p>Visual only. No API key, no network requests; settings stay in this browser.</p>
        <button type="button" class="tcl-btn tcl-btn-ghost" data-action="reset-all">Reset everything</button>
      </div>`;
  }

  function syncUI() {
    if (!panel) return;
    panel.querySelectorAll('[data-key]').forEach(inp => {
      const k = inp.dataset.key;
      if (inp.type === 'checkbox') inp.checked = !!s[k];
      else if (inp.type === 'radio') inp.checked = String(s[k]) === inp.value;
      else inp.value = s[k];
    });
    panel.querySelectorAll('.tcl-card, .tcl-chip').forEach(l => {
      const r = l.querySelector('input');
      l.classList.toggle('tcl-checked', !!(r && r.checked));
    });
    panel.querySelectorAll('output[data-for]').forEach(o => { o.textContent = s[o.dataset.for] + (o.dataset.unit || ''); });
    const p = PRESETS[s.preset];
    panel.querySelector('#tcl-desc').textContent = p ? p.desc : '';
    panel.querySelector('[data-ruler-opts]').hidden = !s.ruler;
    panel.classList.toggle('tcl-off', !s.enabled);
  }

  function onInput(e) {
    const t = e.target;
    const k = t.dataset && t.dataset.key;
    if (!k || !(k in DEFAULTS)) return;
    let v;
    if (t.type === 'checkbox') v = t.checked;
    else if (t.type === 'range') v = Number(t.value);
    else if (t.type === 'radio') { if (!t.checked) return; v = t.value; }
    else v = t.value;
    s[k] = v;
    save(); applyAll(); syncUI();
  }

  function onAction(e) {
    const b = e.target.closest('[data-action]');
    if (!b) return;
    const a = b.dataset.action;
    if (a === 'close') closePanel();
    else if (a === 'reset-fine') { s.brightness = s.contrast = s.saturation = 100; }
    else if (a === 'reset-all') { s = Object.assign({}, DEFAULTS); }
    if (a !== 'close') { save(); applyAll(); syncUI(); }
  }

  function buildPanel() {
    panel = document.createElement('div');
    panel.className = 'tcl-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-labelledby', 'tcl-title');
    panel.hidden = true;
    panel.innerHTML = panelHTML();
    panel.addEventListener('input', onInput);
    panel.addEventListener('change', onInput);
    panel.addEventListener('click', onAction);
    // Keep keystrokes inside the panel from reaching page shortcuts
    panel.addEventListener('keydown', e => {
      if (e.key === 'Escape') { closePanel(); e.preventDefault(); }
      e.stopPropagation();
    });
    root.appendChild(panel);
    syncUI();
  }

  function openPanel() {
    if (!panel) buildPanel();
    syncUI();
    panel.hidden = false;
    const first = panel.querySelector('input[data-key="enabled"]');
    if (first) first.focus();
  }
  function closePanel() {
    if (!panel) return;
    panel.hidden = true;
    const row = document.querySelector('li.tcl-spectrum > a');
    if (row) row.focus();
  }
  const togglePanel = () => (panel && !panel.hidden ? closePanel() : openPanel());
  const toggleEnabled = () => { s.enabled = !s.enabled; save(); applyAll(); syncUI(); };

  /* ------------------------------------------------------------------ */
  /*  Init                                                               */
  /* ------------------------------------------------------------------ */
  function initDOM() {
    overlay = document.createElement('div');
    overlay.className = 'tcl-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    rulerTop = document.createElement('div');
    rulerTop.className = 'tcl-ruler tcl-ruler-top';
    rulerBottom = document.createElement('div');
    rulerBottom.className = 'tcl-ruler tcl-ruler-bottom';
    rulerTop.setAttribute('aria-hidden', 'true');
    rulerBottom.setAttribute('aria-hidden', 'true');

    root.append(overlay, rulerTop, rulerBottom);

    // Re-pick the overlay blend if the user flips Torn's own dark mode (visual only)
    if (document.body) {
      new MutationObserver(applyOverlay).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    }

    // Torn builds the avatar menu on demand — add our row whenever it appears (DOM only, no requests)
    let menuQueued = false;
    const queueMenu = () => {
      if (menuQueued) return;
      menuQueued = true;
      requestAnimationFrame(() => { menuQueued = false; placeMenuItem(); });
    };
    new MutationObserver(queueMenu).observe(document.body || root, { childList: true, subtree: true });
    placeMenuItem();

    applyAll();
  }

  // Reading ruler follows mouse / finger — purely visual
  const trackY = y => { pointerY = y; if (s.enabled && s.ruler) queueRuler(); };
  window.addEventListener('pointermove', e => trackY(e.clientY), { passive: true });
  window.addEventListener('touchmove', e => { if (e.touches[0]) trackY(e.touches[0].clientY); }, { passive: true });

  // Hotkeys
  window.addEventListener('keydown', e => {
    if (!e.altKey || !e.shiftKey) return;
    if (e.code === 'KeyC') { e.preventDefault(); togglePanel(); }
    else if (e.code === 'KeyX') { e.preventDefault(); toggleEnabled(); }
  }, true);

  // Keep several open Torn tabs in sync
  window.addEventListener('storage', e => { if (e.key === KEY) { s = load(); applyAll(); syncUI(); } });

  if (typeof GM_registerMenuCommand === 'function') {
    try {
      GM_registerMenuCommand('Open Torn Spectrum', openPanel);
      GM_registerMenuCommand('Turn layers on / off', toggleEnabled);
    } catch (e) { /* menu not supported (e.g. some mobile managers) */ }
  }

  fxStyle.textContent = effectsCSS(); // apply filters immediately, before the page paints
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initDOM, { once: true });
  else initDOM();

  /* ------------------------------------------------------------------ */
  /*  UI styles                                                          */
  /* ------------------------------------------------------------------ */
  function UI_CSS() {
    return `
.tcl-overlay{position:fixed;inset:0;pointer-events:none;z-index:2147483000;display:none}
.tcl-ruler{position:fixed;left:0;right:0;pointer-events:none;z-index:2147483001;display:none}
.tcl-ruler-top{top:0;border-bottom:2px solid rgba(108,196,176,.7)}
.tcl-ruler-bottom{bottom:0;border-top:2px solid rgba(108,196,176,.7)}

.tcl-panel{position:fixed;z-index:2147483601;top:70px;right:16px;width:min(390px,calc(100vw - 32px));
  max-height:calc(100vh - 90px);display:flex;flex-direction:column;background:#1f2125;color:#e8e8e8;
  border:1px solid #3a3e45;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.55);
  font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;text-align:left}
.tcl-panel[hidden]{display:none}
.tcl-body{-webkit-overflow-scrolling:touch;overscroll-behavior:contain}
.tcl-panel *{box-sizing:border-box;font-family:inherit;-webkit-tap-highlight-color:transparent}
.tcl-panel h2{margin:0;font-size:17px;font-weight:700;flex:1;color:#fff}
.tcl-panel h3{margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9fb3ad}
.tcl-head{display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid #33373d}
.tcl-body{overflow-y:auto;padding:4px 16px 8px}
.tcl-body section{padding:14px 0;border-bottom:1px solid #2c3036}
.tcl-body section:last-child{border-bottom:0}
.tcl-foot{padding:12px 16px;border-top:1px solid #33373d;font-size:12px;color:#a9adb3}
.tcl-foot p{margin:0 0 6px}
.tcl-panel kbd{background:#2c3036;border:1px solid #444a52;border-radius:4px;padding:0 4px;font-size:11px;color:#e8e8e8}
.tcl-panel.tcl-off .tcl-body{opacity:.45}

.tcl-x{background:none;border:0;color:#cfd3d8;font-size:26px;line-height:1;width:36px;height:36px;border-radius:8px;cursor:pointer;padding:0}
.tcl-x:hover,.tcl-x:focus-visible{background:#2c3036;outline:2px solid #6cc4b0}

.tcl-switch{position:relative;display:inline-block;width:46px;height:26px;cursor:pointer}
.tcl-switch input{position:absolute;opacity:0;width:100%;height:100%;margin:0;cursor:pointer}
.tcl-knob{position:absolute;inset:0;background:#444a52;border-radius:13px;transition:background .15s}
.tcl-knob::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:transform .15s}
.tcl-switch input:checked + .tcl-knob{background:#3f9e89}
.tcl-switch input:checked + .tcl-knob::after{transform:translateX(20px)}
.tcl-switch input:focus-visible + .tcl-knob{outline:2px solid #6cc4b0;outline-offset:2px}

.tcl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(98px,1fr));gap:8px}
.tcl-card{position:relative;display:flex;flex-direction:column;gap:6px;padding:6px;border:2px solid #33373d;border-radius:10px;cursor:pointer;background:#262a2f}
.tcl-card:hover{border-color:#4d535b}
.tcl-card input{position:absolute;opacity:0;width:1px;height:1px}
.tcl-card.tcl-checked{border-color:#6cc4b0;background:#23302d}
.tcl-card:has(input:focus-visible){outline:2px solid #6cc4b0;outline-offset:2px}
.tcl-swatch{display:block;height:30px;border-radius:6px;
  background:linear-gradient(90deg,#e74c3c 0 20%,#f1c40f 20% 40%,#2ecc71 40% 60%,#3498db 60% 80%,#9b59b6 80%) top/100% 55% no-repeat,
  linear-gradient(90deg,#f4f4f4 0 50%,#1b1b1b 50%) bottom/100% 45% no-repeat}
.tcl-cname{font-size:12px;font-weight:600;color:#e8e8e8}
.tcl-desc,.tcl-hint{margin:8px 0 0;font-size:12.5px;color:#b8bcc2}
.tcl-hint{margin:0 0 10px}

.tcl-chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
.tcl-chip{position:relative;display:inline-flex;align-items:center;gap:6px;padding:5px 10px 5px 6px;border:2px solid #33373d;border-radius:999px;cursor:pointer;background:#262a2f;font-size:12.5px;color:#e8e8e8}
.tcl-chip input{position:absolute;opacity:0;width:1px;height:1px}
.tcl-chip.tcl-checked{border-color:#6cc4b0;background:#23302d}
.tcl-chip:has(input:focus-visible){outline:2px solid #6cc4b0;outline-offset:2px}
.tcl-chipdot{width:18px;height:18px;border-radius:50%;border:1px solid rgba(255,255,255,.35)}

.tcl-row{display:grid;grid-template-columns:96px 1fr 48px;align-items:center;gap:10px;margin:8px 0;color:#e8e8e8}
.tcl-row select{grid-column:2 / 4;background:#2c3036;color:#e8e8e8;border:1px solid #444a52;border-radius:6px;padding:6px 8px;font-size:13px}
.tcl-row input[type=range]{width:100%;accent-color:#6cc4b0;margin:0}
.tcl-row output{text-align:right;font-variant-numeric:tabular-nums;font-size:12.5px;color:#cfd3d8}
.tcl-sub{margin:0 0 6px 30px}
.tcl-sub[hidden]{display:none}

.tcl-toggle{position:relative;display:flex;align-items:flex-start;gap:10px;padding:7px 0;cursor:pointer;color:#e8e8e8}
.tcl-toggle input{position:absolute;opacity:0;width:1px;height:1px}
.tcl-tbox{flex:none;width:20px;height:20px;margin-top:1px;border:2px solid #6b727b;border-radius:5px;background:#262a2f}
.tcl-toggle input:checked + .tcl-tbox{background:#3f9e89;border-color:#3f9e89;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5 10.5l3.2 3L15 6.5' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");background-size:100%}
.tcl-toggle input:focus-visible + .tcl-tbox{outline:2px solid #6cc4b0;outline-offset:2px}
.tcl-tl{display:flex;flex-direction:column}
.tcl-tl small{font-size:12px;color:#a9adb3}

.tcl-btn{margin-top:6px;background:#2c3036;color:#e8e8e8;border:1px solid #444a52;border-radius:8px;padding:7px 12px;font-size:13px;cursor:pointer}
.tcl-btn:hover,.tcl-btn:focus-visible{background:#353a41;outline:2px solid #6cc4b0}
.tcl-btn-ghost{background:transparent}

li.tcl-spectrum a{cursor:pointer}
li.tcl-spectrum .icon-wrapper svg{fill:currentColor}

@media (max-width:600px){
  .tcl-panel{top:auto;bottom:calc(8px + env(safe-area-inset-bottom,0px));right:8px;left:8px;width:auto;max-height:80vh;max-height:80dvh}
  .tcl-row select{font-size:16px}           /* stops iOS zooming in on focus */
  .tcl-x{width:44px;height:44px}
  .tcl-row input[type=range]{height:28px}
}
@media (hover:none) and (pointer:coarse){
  .tcl-keys{display:none}                   /* hide keyboard tips on phones/tablets */
  .tcl-toggle{padding:10px 0}
  .tcl-chip{padding:8px 12px 8px 8px}
}
@media (prefers-reduced-motion:reduce){.tcl-knob,.tcl-knob::after{transition:none}}
`;
  }
  } // end main
})();
