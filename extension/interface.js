/* Presentation only. Original game elements, artwork and network calls stay owned by the game. */
(() => {
  'use strict';
  function mount() {
    if (document.getElementById('loop-ui-shell')) return true;
    const main = document.querySelector('body > main');
    const header = document.querySelector('body > header');
    const side = main?.querySelector('.side-panel');
    const play = main?.querySelector('.play-area');
    if (!main || !header || !side || !play || !document.getElementById('board')) return false;

    const storage = {
      get(key) { try { return localStorage.getItem(`loop-interface-mod.${key}`); } catch { return null; } },
      set(key, value) { try { localStorage.setItem(`loop-interface-mod.${key}`, value); } catch { /* Private browsing may disallow storage. */ } }
    };
    const create = (tag, cls, html) => {
      const el = document.createElement(tag);
      el.className = cls;
      if (html) el.innerHTML = html; // Only static mod-authored markup; user text is assigned with textContent.
      return el;
    };
    const originalTitle = header.querySelector('h1')?.textContent.trim() || document.title;
    const defaults = { title: originalTitle, subtitle: '', font: 'tsukushi', motion: true };
    const fonts = {
      tsukushi: '"Loop Tsukushi", "FOT-TsukuMin Pro L", "Tsukushi Mincho", "筑紫明朝", "Yu Mincho", "Noto Serif SC", "Noto Serif CJK SC", "SimSun", serif',
      song: '"Noto Serif SC", "Noto Serif CJK SC", "Source Han Serif SC", "Songti SC", "SimSun", serif',
      readable: '"Microsoft YaHei", "PingFang SC", system-ui, sans-serif'
    };
    let saved = {};
    try { saved = JSON.parse(storage.get('appearance') || '{}') || {}; } catch { /* Use defaults for malformed settings. */ }
    if (saved.font === 'manuscript') saved.font = 'tsukushi';
    let prefs = {
      title: typeof saved.title === 'string' && saved.title.trim() ? saved.title.slice(0, 80) : defaults.title,
      subtitle: typeof saved.subtitle === 'string' ? saved.subtitle.slice(0, 160) : '',
      font: Object.hasOwn(fonts, saved.font) ? saved.font : defaults.font,
      motion: saved.motion !== false
    };

    // Original vector ornament, drawn locally. No image/font downloads or asset substitutions.
    const petals = Array.from({length:12}, (_,i) => `<g transform="rotate(${i*30} 80 80)"><path d="M80 74Q53 52 80 12Q107 52 80 74Z" fill="${['#833c58','#344675','#35706c','#ae794b'][i%4]}" stroke="#d5b87b" stroke-width="1.2"/><path d="M80 67V24M66 48H94" stroke="#e1c893" stroke-width=".7" opacity=".7"/></g>`).join('');
    const rose = `<svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="77" fill="#292334" stroke="#ba9356" stroke-width="2"/><circle cx="80" cy="80" r="71" fill="none" stroke="#dac58e"/>${petals}<circle cx="80" cy="80" r="16" fill="#632c49" stroke="#d5b77f"/><path d="M80 67L84 76L93 80L84 84L80 93L76 84L67 80L76 76Z" fill="#ead8a9"/></svg>`;
    const lancet = `<svg viewBox="0 0 240 520" aria-hidden="true"><path d="M15 510V154Q15 77 120 10Q225 77 225 154V510Z" fill="#142a36" stroke="#af8c54" stroke-width="3"/><path d="M27 496V160Q27 88 120 26Q213 88 213 160V496Z" fill="#26314c" stroke="#a98e60"/><path d="M120 27L46 135L120 212L194 135Z" fill="#763b59" stroke="#b79a66"/><path d="M27 160L120 212L27 300ZM213 160L120 212L213 300Z" fill="#367477" stroke="#b79a66"/><path d="M27 300L120 212L213 300L120 391Z" fill="#724568" stroke="#b79a66"/><path d="M27 300L120 391L27 496ZM213 300L120 391L213 496Z" fill="#47548a" stroke="#b79a66"/><path d="M27 496L120 391L213 496Z" fill="#887145" stroke="#b79a66"/><path d="M120 27V496M27 300H213M64 496V178Q64 137 120 97Q176 137 176 178V496" fill="none" stroke="#c4a16b"/><circle cx="120" cy="118" r="28" fill="#30243e" stroke="#c4a16b"/><path d="M120 94L126 112L144 118L126 124L120 142L114 124L96 118L114 112Z" fill="#c5a46a"/></svg>`;
    const ambient = create('div', 'loop-ambient', `<div>${lancet}</div><div>${lancet}</div>`);
    ambient.setAttribute('aria-hidden','true');
    document.body.append(ambient);

    const actions = create('div', 'loop-header-actions', '<button type="button" data-loop-settings>题签与字体</button><button type="button" data-loop-original>原版界面</button>');
    header.append(actions);
    const shell = create('div', 'loop-intro', `<div class="loop-title-ornament">${rose}</div><div class="loop-intro-copy"><h1></h1><p hidden></p></div><div class="loop-intro-actions"><button type="button" data-loop-focus aria-pressed="false">放大版图</button></div>`);
    shell.id = 'loop-ui-shell';
    main.before(shell);
    const glass = create('div','loop-panel-glass',rose);
    glass.setAttribute('aria-hidden','true');
    side.querySelector('section')?.append(glass);
    const leaf = '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M3 96V3H96M8 71V8H71M13 45V13H45" fill="none" stroke="#96743f" stroke-width=".8"/><path d="M7 61Q36 53 25 30Q15 12 33 13Q54 13 45 37Q36 60 61 62M14 16Q14 40 39 42Q62 42 62 15" fill="none" stroke="#ac864b" stroke-width="1.3"/><path d="M24 31Q6 28 15 16Q29 16 24 31Z" fill="#814757"/><path d="M39 42Q51 23 62 31Q62 45 39 42Z" fill="#3e6a66"/><path d="M47 56Q35 73 27 59Q32 47 47 56Z" fill="#b49456"/><circle cx="13" cy="13" r="4" fill="#b49355"/><circle cx="62" cy="62" r="2.5" fill="#8e465b"/></svg>';
    const margins = create('div','loop-book-margins',`<i>${leaf}</i><i>${leaf}</i><i>${leaf}</i><i>${leaf}</i><b></b>`);
    margins.setAttribute('aria-hidden','true');
    play.append(margins);
    // Keep the fold aligned with the actual map gap, including the game's variable-width counter.
    const alignFold = () => {
      if (!document.body.classList.contains('loop-ui')) return;
      const bookRect = play.getBoundingClientRect();
      const boardRect = document.getElementById('board')?.getBoundingClientRect();
      if (!bookRect.width || !boardRect?.width) return;
      const fold = `${Math.round((boardRect.left + boardRect.width / 2 - bookRect.left) * play.offsetWidth / bookRect.width)}px`;
      if (play.style.getPropertyValue('--loop-spine') !== fold) play.style.setProperty('--loop-spine',fold);
    };
    const layoutObserver = new ResizeObserver(alignFold);
    layoutObserver.observe(play);
    layoutObserver.observe(document.getElementById('board'));
    play.addEventListener('animationend', event => {
      if (event.target === play && event.animationName === 'loop-open-book') alignFold();
    });
    const restore = create('button', 'loop-restore', `${rose}<span>书卷界面</span>`);
    restore.type = 'button';
    restore.id = 'loop-ui-restore';
    document.body.append(restore);

    const dialog = create('dialog','loop-settings', `<form method="dialog"><div class="loop-settings-heading"><h2 id="loop-settings-title">题签与字体</h2><button type="button" data-loop-close aria-label="关闭">×</button></div><p class="loop-settings-help">书卷题签由你填写；留空标题将使用原站名称。副标题留空时不显示。</p><label>标题<input name="title" maxlength="80" autocomplete="off"></label><label>副标题<textarea name="subtitle" rows="2" maxlength="160"></textarea></label><label>字体<select name="font"><option value="tsukushi">筑紫明朝 · Tsukushi Mincho（优先）</option><option value="song">刊本 · 宋体</option><option value="readable">清晰阅读 · 黑体</option></select></label><label class="loop-motion-label"><input name="motion" type="checkbox">开卷动效</label><p class="loop-settings-help">优先使用本机的筑紫明朝，缺失时回退到本机字体。不会下载字体文件。题签仅保存在此浏览器。</p><div class="loop-settings-buttons"><button type="button" data-loop-reset>恢复默认</button><button type="submit" value="save">保存</button></div></form>`);
    dialog.setAttribute('aria-labelledby','loop-settings-title');
    document.body.append(dialog);
    const form = dialog.querySelector('form');
    const field = name => form.elements.namedItem(name);
    const paintPreferences = () => {
      shell.querySelector('h1').textContent = prefs.title;
      const subtitle = shell.querySelector('p');
      subtitle.textContent = prefs.subtitle;
      subtitle.hidden = !prefs.subtitle.trim();
      document.body.style.setProperty('--loop-title-font', fonts[prefs.font]);
      document.body.style.setProperty('--loop-body-font', fonts[prefs.font]);
      document.body.classList.toggle('loop-no-motion', !prefs.motion);
      document.body.classList.toggle('loop-readable', prefs.font === 'readable');
    };
    const fillSettings = () => {
      field('title').value = prefs.title;
      field('subtitle').value = prefs.subtitle;
      field('font').value = prefs.font;
      field('motion').checked = prefs.motion;
    };
    actions.querySelector('[data-loop-settings]').addEventListener('click', () => {
      fillSettings();
      dialog.showModal();
    });
    dialog.querySelector('[data-loop-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-loop-reset]').addEventListener('click', () => {
      field('title').value = defaults.title;
      field('subtitle').value = defaults.subtitle;
      field('font').value = defaults.font;
      field('motion').checked = defaults.motion;
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      prefs = {title:field('title').value.trim().slice(0,80) || defaults.title, subtitle:field('subtitle').value.trim().slice(0,160), font:field('font').value, motion:field('motion').checked};
      storage.set('appearance', JSON.stringify(prefs));
      paintPreferences();
      dialog.close();
    });
    const focusButton = shell.querySelector('[data-loop-focus]');
    const setFocus = enabled => {
      document.body.classList.toggle('loop-focus', enabled);
      focusButton.setAttribute('aria-pressed',String(enabled));
      focusButton.textContent = enabled ? '恢复双栏' : '放大版图';
      window.dispatchEvent(new Event('resize'));
    };
    const apply = enabled => {
      document.body.classList.toggle('loop-ui', enabled);
      if (!enabled) { setFocus(false); dialog.close(); }
      restore.hidden = enabled;
      storage.set('enabled', enabled ? '1' : '0');
      if (enabled) requestAnimationFrame(alignFold);
      window.dispatchEvent(new Event('resize'));
    };
    actions.querySelector('[data-loop-original]').addEventListener('click', () => apply(false));
    restore.addEventListener('click', () => apply(true));
    focusButton.addEventListener('click', () => setFocus(!document.body.classList.contains('loop-focus')));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && !dialog.open && document.body.classList.contains('loop-focus')) setFocus(false);
    });
    paintPreferences();
    apply(storage.get('enabled') !== '0');
    return true;
  }
  // Some versions render the game shell after document_idle. Watch only until it exists.
  if (!mount()) {
    const observer = new MutationObserver(() => { if (mount()) observer.disconnect(); });
    observer.observe(document.documentElement, {childList:true, subtree:true});
    setTimeout(() => observer.disconnect(), 30000);
  }
})();
