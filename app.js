(() => {
  'use strict';

  const D = window.HANDBOOK_DATA;
  const A = document.querySelector('#app');
  const nav = document.querySelector('#navseries');
  const input = document.querySelector('#search');
  const counts = document.querySelector('#counts');

  const categories = [...new Set(D.map((s) => s.category))];
  const totalLessons = D.reduce((n, s) => n + s.lessons.length, 0);
  let filter = 'all';

  // هر درس یک شناسه پایدار دارد (slug-شماره) تا درس‌های ذخیره‌شده قبلی هم کار کنند.
  D.forEach((s) => s.lessons.forEach((l, i) => { l.index = i + 1; l.id = s.slug + '-' + (i + 1); }));

  const KIND = { playlist: 'پلی‌لیست', course: 'دوره', series: 'مجموعه', topic: 'موضوع' };
  const STATUS = {
    verified: 'عنوان این مجموعه با یک منبع بیرونی تطبیق داده شده است.',
    unverified: 'موضوع این مجموعه از کانال StudioBinder برداشته شده، ولی هنوز با فهرست فعلی پلی‌لیست‌های یوتیوب تطبیق داده نشده است.'
  };

  const escape = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const paras = (list) => (list || []).map((p) => '<p>' + escape(p) + '</p>').join('');
  const seriesUrl = (slug) => '#/series/' + slug;
  const lessonUrl = (slug, id) => '#/lesson/' + slug + '/' + id;

  const storage = {
    get() { try { return new Set(JSON.parse(localStorage.getItem('sb-favorites') || '[]')); } catch { return new Set(); } },
    set(set) { try { localStorage.setItem('sb-favorites', JSON.stringify([...set])); } catch { /* حالت خصوصی یا ذخیره‌سازی مسدود */ } }
  };

  counts.textContent = D.length + ' مجموعه · ' + totalLessons + ' درس';
  nav.innerHTML = D.map((s) => '<a class="nav-item" data-s="' + s.slug + '" href="' + seriesUrl(s.slug) + '"><span>' + escape(s.fa) + '</span><small>' + s.lessons.length + '</small></a>').join('');

  // ---------- خانه ----------

  function card(s) {
    return '<article class="card">' +
      '<span class="pill">' + escape(s.categoryFa) + ' · ' + (KIND[s.kind] || 'مجموعه') + '</span>' +
      '<h3 lang="en">' + escape(s.title) + '</h3>' +
      '<div class="fa">' + escape(s.fa) + '</div>' +
      '<p>' + escape(s.description) + '</p>' +
      '<div class="tag">' + s.lessons.length + ' درس · ' + escape(s.level) + '</div>' +
      '<a class="button" href="' + seriesUrl(s.slug) + '">شروع این مجموعه ←</a>' +
    '</article>';
  }

  function searchable(s) {
    return [s.title, s.fa, s.description, ...(s.intro || []),
      ...s.lessons.flatMap((l) => [l.title, l.fa, l.stack, l.summary, ...(l.concept || []), ...(l.web || [])])
    ].join(' ').toLowerCase();
  }

  function home() {
    const q = input.value.trim().toLowerCase();
    const list = D.filter((s) => (filter === 'all' || s.category === filter) && (!q || searchable(s).includes(q)));

    A.innerHTML =
      '<section class="lead">' +
        '<div class="eyebrow">سینما برای توسعه‌دهنده خلاق</div>' +
        '<h1>از زبان سینما<br>تا ساخت تجربه‌های دیجیتال</h1>' +
        '<p class="summary">فیلم‌سازها حدود صد سال است که یاد گرفته‌اند چطور با قاب، نور، حرکت و ریتم، نگاه مخاطب را هدایت کنند و حسی را به او منتقل کنند. ' +
        'این راهنما همان درس‌ها را به زبان ساده توضیح می‌دهد و برای هر کدام نشان می‌دهد در یک صفحه وب یا یک صحنه سه‌بعدی چه شکلی پیدا می‌کند. ' +
        'موضوع مجموعه‌ها از کانال StudioBinder الهام گرفته شده است.</p>' +
        '<div class="notice">یک نکته درباره منبع: این راهنما ترجمه یا رونوشت ویدیوهای StudioBinder نیست. موضوع‌ها از کانال آن‌ها آمده، ولی درس‌ها مستقل نوشته شده‌اند و عنوان درس‌ها لزوماً همان عنوان قسمت‌های یوتیوب نیست. ' +
        'در صفحه هر مجموعه نوشته‌ایم که آیا با یک منبع بیرونی تطبیق داده شده یا نه.</div>' +
        '<div class="stats">' +
          '<div class="stat"><strong>' + D.length + '</strong><span>مجموعه</span></div>' +
          '<div class="stat"><strong>' + totalLessons + '</strong><span>درس با مثال و کد</span></div>' +
          '<div class="stat"><strong>' + categories.length + '</strong><span>حوزه موضوعی</span></div>' +
          '<div class="stat"><strong>۵ بخش</strong><span>در هر درس: مفهوم، کاربرد، کد، تمرین، اشتباه رایج</span></div>' +
        '</div>' +
      '</section>' +
      '<section>' +
        '<h2>همه مجموعه‌ها</h2>' +
        '<div class="chips">' +
          '<button class="chip ' + (filter === 'all' ? 'active' : '') + '" data-filter="all">همه</button>' +
          categories.map((c) => '<button class="chip ' + (filter === c ? 'active' : '') + '" data-filter="' + c + '">' + escape(D.find((s) => s.category === c).categoryFa) + '</button>').join('') +
        '</div>' +
        '<div class="cards">' + (list.map(card).join('') || '<div class="empty">چیزی پیدا نشد. یک کلمه دیگر امتحان کن.</div>') + '</div>' +
      '</section>';

    A.querySelectorAll('[data-filter]').forEach((b) => { b.onclick = () => { filter = b.dataset.filter; home(); }; });
  }

  // ---------- صفحه مجموعه ----------

  function series(s) {
    A.innerHTML =
      '<section class="detail-head">' +
        '<div class="breadcrumbs"><a href="#/">همه مجموعه‌ها</a> / ' + escape(s.categoryFa) + '</div>' +
        '<div class="eyebrow">' + (KIND[s.kind] || 'مجموعه') + ' · ' + s.lessons.length + ' درس · ' + escape(s.level) + '</div>' +
        '<h1 lang="en" dir="ltr" style="text-align:right">' + escape(s.title) + '</h1>' +
        '<h2>' + escape(s.fa) + '</h2>' +
        '<div class="prose summary">' + paras(s.intro) + '</div>' +
        '<p class="notice">' + escape(STATUS[s.status] || STATUS.unverified) + '</p>' +
        '<a class="button secondary" target="_blank" rel="noopener" href="' + escape(s.source) + '">دیدن منبع ↗</a>' +
      '</section>' +
      '<div class="content">' +
        '<div class="panel"><h3>بعد از این مجموعه</h3><p>' + escape(s.outcome) + '</p></div>' +
        '<h2>درس‌ها</h2>' +
        '<div class="lesson-list">' + s.lessons.map((l) =>
          '<a class="lesson-link" href="' + lessonUrl(s.slug, l.id) + '">' +
            '<span class="lesson-number">' + String(l.index).padStart(2, '0') + '</span>' +
            '<span class="lesson-main"><strong>' + escape(l.fa) + '</strong> <small lang="en" dir="ltr">' + escape(l.title) + '</small>' +
            '<span class="lesson-summary">' + escape(l.summary) + '</span></span>' +
            '<small class="tag">' + escape(l.stack) + '</small>' +
          '</a>').join('') +
        '</div>' +
      '</div>';
  }

  // ---------- صفحه درس ----------

  function lesson(s, l) {
    const saved = storage.get().has(l.id);
    const prev = s.lessons[l.index - 2];
    const next = s.lessons[l.index];
    const showLab = s.category === 'camera';

    const sections = [
      ['concept', 'در سینما', 'ماجرا چیست؟', paras(l.concept)],
      ['web', 'در وب', 'در یک پروژه وب به چه کار می‌آید؟', paras(l.web)],
      ['code', 'کد', 'یک نمونه کد',
        '<p>ابزار: <span class="rtl-ltr">' + escape(l.stack) + '</span></p>' +
        '<div class="codehead"><span>نمونه کد</span><button id="copy" class="copy">کپی کد</button></div>' +
        '<pre><code>' + escape(l.code) + '</code></pre>' +
        '<h4>این کد چه کار می‌کند؟</h4><p>' + escape(l.codeNote) + '</p>'],
      ['exercise', 'تمرین', 'خودت امتحان کن', '<p>' + escape(l.exercise) + '</p>'],
      ['mistake', 'اشتباه رایج', 'حواست باشد', '<p>' + escape(l.mistake) + '</p>']
    ];
    if (showLab) {
      sections.push(['lab', 'دمو', 'با فاصله و زاویه بازی کن',
        '<p>با دو لغزنده زیر، فاصله و زاویه دوربین نسبت به یک شیء ساده را عوض کن و ببین حس تصویر چطور تغییر می‌کند. این یک شبیه‌سازی ساده با CSS است؛ برای دوربین واقعی سه‌بعدی، آزمایشگاه Three.js را باز کن.</p>' +
        '<div class="lab"><div class="lab-floor"></div><div class="lab-object" id="labobj"></div><span class="lab-hud">CSS PERSPECTIVE</span></div>' +
        '<div class="controls"><label>فاصله <input id="labscale" type="range" min="60" max="190" value="100"></label><label>زاویه <input id="labangle" type="range" min="-75" max="75" value="-13"></label></div>' +
        '<a class="button secondary" target="_blank" rel="noopener" href="./demos/threejs-lab.html">باز کردن آزمایشگاه Three.js ↗</a>']);
    }

    A.innerHTML =
      '<div class="content">' +
        '<div class="breadcrumbs"><a href="#/">همه مجموعه‌ها</a> / <a href="' + seriesUrl(s.slug) + '">' + escape(s.fa) + '</a> / درس ' + l.index + '</div>' +
        '<div class="eyebrow">درس ' + l.index + ' از ' + s.lessons.length + ' · ' + escape(s.categoryFa) + '</div>' +
        '<h1>' + escape(l.fa) + '</h1>' +
        '<div class="lesson-en" lang="en" dir="ltr">' + escape(l.title) + '</div>' +
        '<p class="summary lesson-hook">' + escape(l.summary) + '</p>' +
        '<div class="lesson-actions">' +
          '<span class="pill">' + escape(l.stack) + '</span>' +
          '<button class="bookmark" id="fav">' + (saved ? '★ حذف از ذخیره‌ها' : '☆ ذخیره این درس') + '</button>' +
          '<a class="button secondary" href="' + seriesUrl(s.slug) + '">برگشت به مجموعه</a>' +
        '</div>' +
        '<div class="content-grid">' +
          '<div class="lesson-body">' + sections.map(([id, kicker, title, body]) =>
            '<section id="' + id + '" class="panel prose"><div class="kicker">' + kicker + '</div><h3>' + title + '</h3>' + body + '</section>').join('') +
          '</div>' +
          '<aside class="panel toc"><h3>در این درس</h3>' +
            sections.map(([id, , title]) => '<a href="#' + id + '" class="jump" data-jump="' + id + '">' + title + '</a>').join('') +
            '<hr style="border:0;border-top:1px solid var(--line)">' +
            '<div class="srcs"><small>منبع مجموعه</small><a href="' + escape(s.source) + '" target="_blank" rel="noopener">' + escape(s.source) + '</a></div>' +
          '</aside>' +
        '</div>' +
        '<nav class="panel lesson-nav" aria-label="درس‌های قبلی و بعدی">' +
          (prev ? '<a href="' + lessonUrl(s.slug, prev.id) + '">→ ' + escape(prev.fa) + '</a>' : '<span></span>') +
          '<a href="' + seriesUrl(s.slug) + '">فهرست درس‌ها</a>' +
          (next ? '<a href="' + lessonUrl(s.slug, next.id) + '">' + escape(next.fa) + ' ←</a>' : '<span></span>') +
        '</nav>' +
      '</div>';

    A.querySelector('#fav').onclick = () => {
      const f = storage.get();
      f.has(l.id) ? f.delete(l.id) : f.add(l.id);
      storage.set(f);
      A.querySelector('#fav').textContent = f.has(l.id) ? '★ حذف از ذخیره‌ها' : '☆ ذخیره این درس';
    };

    A.querySelector('#copy').onclick = async () => {
      const btn = A.querySelector('#copy');
      try { await navigator.clipboard.writeText(l.code); btn.textContent = 'کپی شد ✓'; }
      catch { btn.textContent = 'کپی نشد؛ کد را دستی انتخاب کن'; }
    };

    A.querySelectorAll('.jump').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(a.dataset.jump)?.scrollIntoView({ behavior: 'smooth' });
    }));

    if (showLab) {
      const update = () => {
        const scale = +document.querySelector('#labscale').value / 100;
        const angle = +document.querySelector('#labangle').value;
        document.querySelector('#labobj').style.transform = 'scale(' + scale + ') rotateY(' + angle + 'deg) rotateX(-12deg)';
      };
      document.querySelectorAll('input[type=range]').forEach((i) => { i.oninput = update; });
      update();
    }
  }

  // ---------- راهنمای استفاده ----------

  function roadmap() {
    A.innerHTML =
      '<section class="lead prose">' +
        '<div class="eyebrow">راهنمای استفاده</div>' +
        '<h1>از کجا شروع کنم؟</h1>' +
        '<p class="summary">این راهنما رونوشت ویدیوها نیست؛ مجموعه‌ای از درس‌های مستقل است که اصول فیلم‌سازی را برای کسی توضیح می‌دهد که صفحه وب، صحنه سه‌بعدی یا تجربه تعاملی می‌سازد. ' +
        'هر درس پنج بخش دارد: اول مفهوم در سینما با مثال از فیلم‌های واقعی، بعد اینکه همان مفهوم در وب چه شکلی پیدا می‌کند، بعد یک نمونه کد با توضیح، یک تمرین و یک اشتباه رایج.</p>' +
        '<div class="panel"><h3>یک مسیر پیشنهادی</h3>' +
          '<p>اگر تازه شروع می‌کنی، این ترتیب کمک می‌کند هر مجموعه روی قبلی سوار شود:</p>' +
          '<ol>' +
            '<li><b>دستور زبان نما و دوربین</b>: الفبای قاب، زاویه و حرکت.</li>' +
            '<li><b>سینماتوگرافی و طراحی تصویر</b>: نور و رنگ، و اینکه هر نور چه کاری می‌کند.</li>' +
            '<li><b>تکنیک‌های پیشرفته</b> و <b>کارگردانی و خوانش صحنه</b>: کنار هم گذاشتن ابزارها برای یک لحن و یک هدف.</li>' +
            '<li><b>روایت تصویری و داستان</b> و <b>مقاله‌های ویدیویی</b>: چطور یک صفحه را مثل یک داستان بچینی.</li>' +
            '<li><b>فرآیند تولید</b> (پیش‌تولید، تجزیه، شات‌لیست): برای وقتی که می‌خواهی یک پروژه واقعی را برنامه‌ریزی کنی.</li>' +
          '</ol>' +
          '<p>بقیه مجموعه‌ها را هر وقت موضوعشان به کارت آمد بخوان. «واژه‌نامه مفاهیم فیلم‌سازی» را هم می‌توانی مثل یک فرهنگ لغت نگه داری.</p>' +
        '</div>' +
        '<div class="panel"><h3>کدام ابزار برای چه کاری؟</h3>' +
          '<p><b>CSS</b> برای تغییرهای ساده ظاهر، چیدمان و انیمیشن‌های کوچک کافی است و سبک‌ترین گزینه است. ' +
          '<b>GSAP</b> وقتی به کار می‌آید که باید چند حرکت را دقیق با هم زمان‌بندی کنی یا انیمیشن را به اسکرول وصل کنی؛ مثل یک تدوینگر که نماها را روی تایم‌لاین می‌چیند. ' +
          '<b>Three.js</b> برای وقتی است که واقعاً دوربین، نور، جنس سطح و پرسپکتیو سه‌بعدی لازم داری. ' +
          '<b>شیدرها</b> هم برای افکت‌هایی‌اند که باید روی تک‌تک پیکسل‌ها کنترل داشته باشی.</p>' +
          '<p>قاعده کلی: ساده‌ترین ابزاری را انتخاب کن که حس مورد نظر را می‌سازد. هر قدم به سمت ابزار سنگین‌تر، هزینه‌اش را روی گوشی کاربر می‌پردازی.</p>' +
        '</div>' +
        '<div class="panel"><h3>این راهنما چقدر کامل است؟</h3>' +
          '<p>در حال حاضر ' + D.length + ' مجموعه و ' + totalLessons + ' درس دارد. فقط عنوان چند مجموعه با یک منبع مستقل بیرونی تطبیق داده شده است؛ ' +
          'تا وقتی فهرست کامل پلی‌لیست‌ها مستقیم از YouTube گرفته نشود، نمی‌شود گفت این فهرست همه پلی‌لیست‌های فعلی کانال را پوشش می‌دهد. ' +
          'برای همین در صفحه هر مجموعه وضعیت تطبیقش و لینک منبع آمده است.</p>' +
        '</div>' +
        '<div class="panel"><h3>انتشار روی GitHub Pages</h3>' +
          '<p>سایت کاملاً ایستاست و به سرور، build یا کلید API نیاز ندارد. انتشار با GitHub Actions انجام می‌شود: هر push روی شاخه main سایت را دوباره منتشر می‌کند. ' +
          'در تنظیمات ریپو، بخش Pages، منبع را روی GitHub Actions بگذار. جستجو در مرورگر انجام می‌شود و درس‌های ذخیره‌شده در حافظه همان مرورگر می‌مانند.</p>' +
        '</div>' +
      '</section>';
  }

  // ---------- ذخیره‌شده‌ها ----------

  function favorites() {
    const f = storage.get();
    const hits = D.flatMap((s) => s.lessons.filter((l) => f.has(l.id)).map((l) => ({ s, l })));
    A.innerHTML =
      '<section class="lead">' +
        '<h1>درس‌های ذخیره‌شده</h1>' +
        '<p>این فهرست فقط در همین مرورگر نگه داشته می‌شود و به دستگاه‌های دیگرت منتقل نمی‌شود.</p>' +
        '<div class="lesson-list">' + (hits.map(({ s, l }) =>
          '<a class="lesson-link" href="' + lessonUrl(s.slug, l.id) + '">' +
            '<span class="lesson-main"><strong>' + escape(l.fa) + '</strong> <small lang="en" dir="ltr">' + escape(l.title) + '</small>' +
            '<span class="lesson-summary">' + escape(s.fa) + '</span></span></a>').join('') ||
          '<div class="panel">هنوز درسی ذخیره نکرده‌ای. در صفحه هر درس دکمه «ذخیره این درس» را بزن تا اینجا بیاید.</div>') +
        '</div>' +
      '</section>';
  }

  // ---------- مسیریابی ----------

  function render() {
    const parts = (location.hash.replace(/^#/, '') || '/').split('/').filter(Boolean);
    document.querySelector('#sidebar').classList.remove('open');
    document.querySelectorAll('.nav-item[data-s]').forEach((n) => n.classList.toggle('active', n.dataset.s === parts[1]));

    if (!parts.length) home();
    else if (parts[0] === 'series') { const s = D.find((x) => x.slug === parts[1]); s ? series(s) : home(); }
    else if (parts[0] === 'lesson') {
      const s = D.find((x) => x.slug === parts[1]);
      const l = s?.lessons.find((x) => x.id === parts[2]);
      s && l ? lesson(s, l) : home();
    }
    else if (parts[0] === 'favorites') favorites();
    else if (parts[0] === 'roadmap') roadmap();
    else home();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  input.addEventListener('input', () => { if (location.hash !== '#/' && location.hash !== '') location.hash = '#/'; home(); });
  document.querySelector('#mobilemenu').onclick = () => document.querySelector('#sidebar').classList.toggle('open');
  render();
})();
