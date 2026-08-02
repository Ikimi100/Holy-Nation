/* ============================================
   HOLY NATION GLOBAL
   Shared JavaScript — safe on every page
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ===== PRELOADER ===== */
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => preloader.classList.add('hidden'), 1400);
    }

    /* ===== NAVBAR SCROLL EFFECT ===== */
    const navbar = document.getElementById('navbar');
    if (navbar) {
        const applyNavState = () => {
            if (window.pageYOffset > 100) navbar.classList.add('scrolled');
            else navbar.classList.remove('scrolled');
        };
        // Inner pages start with a solid bar so links stay readable
        if (navbar.classList.contains('nav-solid')) navbar.classList.add('scrolled');
        else {
            window.addEventListener('scroll', applyNavState);
            applyNavState();
        }
    }

    /* ===== MOBILE MENU TOGGLE ===== */
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    /* ===== SEARCH OVERLAY ===== */
    const searchBtn = document.getElementById('searchBtn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('active');
            if (searchInput) setTimeout(() => searchInput.focus(), 300);
        });
        if (searchClose) {
            searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));
        }
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') searchOverlay.classList.remove('active');
        });
    }

    /* ===== HERO PARTICLES ===== */
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (Math.random() * 3 + 2) + 'px';
            particle.style.height = particle.style.width;
            particlesContainer.appendChild(particle);
        }
    }

    /* ===== COUNTER ANIMATION ===== */
    const counters = document.querySelectorAll('.stat-num');
    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'), 10);
                if (isNaN(target)) { counterObserver.unobserve(counter); return; }
                const suffix = counter.getAttribute('data-suffix') || '+';
                const step = target / (2000 / 16);
                let current = 0;
                const update = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target.toLocaleString() + suffix;
                    }
                };
                update();
                counterObserver.unobserve(counter);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => counterObserver.observe(c));
    }

    /* ===== SCROLL ANIMATIONS (AOS-like) ===== */
    const animatedElements = document.querySelectorAll('[data-aos]');
    if (animatedElements.length) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-aos-delay') || 0;
                    setTimeout(() => entry.target.classList.add('aos-animate'), delay);
                    animationObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        animatedElements.forEach(el => animationObserver.observe(el));
    }

    /* ===== SMOOTH SCROLL FOR IN-PAGE ANCHORS ONLY ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ===== IN-PAGE SECTION NAV (page sub-menu) ===== */
    const pageNav = document.getElementById('pageNav');
    if (pageNav) {
        const pageNavLinks = pageNav.querySelectorAll('a[href^="#"]');
        const targets = [...pageNavLinks]
            .map(l => document.querySelector(l.getAttribute('href')))
            .filter(Boolean);
        window.addEventListener('scroll', () => {
            let currentId = '';
            targets.forEach(sec => {
                if (window.pageYOffset >= sec.offsetTop - 180) currentId = sec.id;
            });
            pageNavLinks.forEach(l => {
                l.classList.toggle('active', l.getAttribute('href') === '#' + currentId);
            });
        });
    }

    /* ===== TESTIMONIAL SLIDER ===== */
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    if (testimonialCards.length && dots.length) {
        const testPrev = document.getElementById('testPrev');
        const testNext = document.getElementById('testNext');
        let currentTestimonial = 0;
        let autoSlideInterval;

        const showTestimonial = (index) => {
            testimonialCards.forEach((card, i) => {
                card.classList.remove('active');
                if (dots[i]) dots[i].classList.remove('active');
            });
            testimonialCards[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentTestimonial = index;
        };
        const nextTestimonial = () => showTestimonial((currentTestimonial + 1) % testimonialCards.length);
        const prevTestimonial = () => showTestimonial((currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length);
        const startAutoSlide = () => { autoSlideInterval = setInterval(nextTestimonial, 6000); };
        const resetAutoSlide = () => { clearInterval(autoSlideInterval); startAutoSlide(); };

        if (testNext) testNext.addEventListener('click', () => { nextTestimonial(); resetAutoSlide(); });
        if (testPrev) testPrev.addEventListener('click', () => { prevTestimonial(); resetAutoSlide(); });
        dots.forEach((dot, i) => dot.addEventListener('click', () => { showTestimonial(i); resetAutoSlide(); }));

        document.addEventListener('keydown', (e) => {
            if (e.target.matches('input, textarea')) return;
            if (e.key === 'ArrowRight') { nextTestimonial(); resetAutoSlide(); }
            else if (e.key === 'ArrowLeft') { prevTestimonial(); resetAutoSlide(); }
        });

        startAutoSlide();
    }

    /* ===== ACCORDIONS (FAQ / curriculum) ===== */
    document.querySelectorAll('.accordion-item').forEach(item => {
        const head = item.querySelector('.accordion-head');
        if (!head) return;
        head.addEventListener('click', () => {
            const parent = item.closest('.accordion');
            if (parent && !parent.hasAttribute('data-multi')) {
                parent.querySelectorAll('.accordion-item').forEach(sib => {
                    if (sib !== item) sib.classList.remove('open');
                });
            }
            item.classList.toggle('open');
        });
    });

    /* ===== TABS ===== */
    document.querySelectorAll('.tabs').forEach(tabs => {
        const btns = tabs.querySelectorAll('.tab-btn');
        const panels = tabs.querySelectorAll('.tab-panel');
        btns.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                btn.classList.add('active');
                if (panels[i]) panels[i].classList.add('active');
            });
        });
    });

    /* ===== LIVE LOCAL CLOCKS ===== */
    const clocks = document.querySelectorAll('[data-tz]');
    if (clocks.length) {
        const tick = () => {
            clocks.forEach(el => {
                const zone = el.getAttribute('data-tz');
                try {
                    el.textContent = new Intl.DateTimeFormat('en-GB', {
                        timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: false
                    }).format(new Date());
                } catch (err) {
                    el.textContent = '--:--';
                }
            });
        };
        tick();
        setInterval(tick, 30000);
    }

    /* ===== NEXT-GATHERING COUNTDOWN ===== */
    const countdowns = document.querySelectorAll('[data-countdown]');
    if (countdowns.length) {
        const DAYS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

        const zoneNow = (tz) => {
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: tz, weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false
            }).formatToParts(new Date());
            const map = {};
            parts.forEach(p => { map[p.type] = p.value; });
            return {
                dow: DAYS[map.weekday],
                mins: (parseInt(map.hour, 10) % 24) * 60 + parseInt(map.minute, 10)
            };
        };

        const phrase = (mins) => {
            if (mins <= 0) return 'starting now';
            if (mins < 60) return `in ${mins} min`;
            const h = Math.floor(mins / 60), m = mins % 60;
            if (h < 24) return m ? `in ${h}h ${m}m` : `in ${h} hours`;
            const d = Math.floor(h / 24), rh = h % 24;
            if (d === 1) return rh ? `tomorrow, in ${rh}h` : 'tomorrow';
            return `in ${d} days`;
        };

        const tickDown = () => {
            countdowns.forEach(el => {
                const tz = el.getAttribute('data-tz');
                const day = DAYS[el.getAttribute('data-day')];
                const [th, tm] = (el.getAttribute('data-time') || '10:00').split(':').map(Number);
                if (!tz || day === undefined) return;
                try {
                    const now = zoneNow(tz);
                    const target = th * 60 + tm;
                    let delta = ((day - now.dow + 7) % 7) * 1440 + (target - now.mins);
                    if (delta <= -90) delta += 7 * 1440; // still counts as "now" for 90 min
                    el.textContent = phrase(delta);
                } catch (err) {
                    el.textContent = '';
                }
            });
        };
        tickDown();
        setInterval(tickDown, 60000);
    }

    /* ===== DIRECTORY FILTER (search + region chips) ===== */
    document.querySelectorAll('[data-filter]').forEach(scope => {
        const input = scope.querySelector('[data-filter-input]');
        const chips = scope.querySelectorAll('[data-filter-chip]');
        const items = scope.querySelectorAll('[data-filter-item]');
        const empty = scope.querySelector('[data-filter-empty]');
        let region = 'all';

        const apply = () => {
            const q = (input ? input.value : '').trim().toLowerCase();
            let shown = 0;
            items.forEach(item => {
                const tags = (item.getAttribute('data-tags') || '').toLowerCase();
                const text = item.textContent.toLowerCase();
                const matchRegion = region === 'all' || tags.split(/\s+/).includes(region);
                const matchText = !q || text.includes(q) || tags.includes(q);
                const show = matchRegion && matchText;
                item.classList.toggle('is-hidden', !show);
                if (show) shown++;
            });
            if (empty) empty.classList.toggle('show', shown === 0);
        };

        if (input) input.addEventListener('input', apply);
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                chips.forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                region = chip.getAttribute('data-filter-chip');
                apply();
            });
        });
        apply();
    });

    /* ============================================
       GIVING TOOLKIT (give page only)
       ============================================ */
    const givingRoot = document.getElementById('giving');
    if (givingRoot) {
        // Indicative display rates only. Not live FX, and never used to take a payment.
        const CURRENCIES = {
            NGN: { symbol: '₦', rate: 1600, step: 5000 },
            USD: { symbol: '$',      rate: 1,    step: 5 },
            GBP: { symbol: '£', rate: 0.79, step: 5 },
            EUR: { symbol: '€', rate: 0.92, step: 5 },
            CAD: { symbol: 'C$',     rate: 1.36, step: 5 },
            KES: { symbol: 'KSh',    rate: 129,  step: 500 },
            ZAR: { symbol: 'R',      rate: 18.2, step: 50 },
            GHS: { symbol: '₵', rate: 15.3, step: 50 }
        };
        let cur = 'NGN';

        const fmt = (usd) => {
            const c = CURRENCIES[cur];
            const v = usd * c.rate;
            const dp = v >= 1000 || c.rate > 5 ? 0 : 2;
            return c.symbol + v.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp });
        };
        const toUsd = (local) => local / CURRENCIES[cur].rate;

        /* --- currency switcher --- */
        const setCurrency = (code) => {
            cur = code;
            document.querySelectorAll('[data-currency]').forEach(b =>
                b.classList.toggle('active', b.getAttribute('data-currency') === code));
            document.querySelectorAll('.calc-cur').forEach(el => el.textContent = CURRENCIES[code].symbol);
            renderCalc();
            renderBasket();
        };
        document.querySelectorAll('[data-currency]').forEach(btn =>
            btn.addEventListener('click', () => setCurrency(btn.getAttribute('data-currency'))));

        /* --- tithe calculator --- */
        const incomeEl = document.getElementById('calcIncome');
        const freqEl = document.getElementById('calcFreq');
        const pctEl = document.getElementById('calcPct');
        const outTithe = document.getElementById('outTithe');
        const outOffering = document.getElementById('outOffering');
        const outAnnual = document.getElementById('outAnnual');
        const PER_YEAR = { weekly: 52, fortnightly: 26, monthly: 12, quarterly: 4, annually: 1 };

        function renderCalc() {
            if (!incomeEl) return;
            const localIncome = parseFloat(incomeEl.value) || 0;
            const usdIncome = toUsd(localIncome);
            const pct = (parseFloat(pctEl.value) || 0) / 100;
            const tithe = usdIncome * 0.10;
            const offering = usdIncome * pct;
            const perYear = PER_YEAR[freqEl.value] || 12;
            outTithe.textContent = fmt(tithe);
            outOffering.textContent = fmt(offering);
            outAnnual.textContent = fmt((tithe + offering) * perYear);
        }
        [incomeEl, freqEl, pctEl].forEach(el => {
            if (el) el.addEventListener('input', renderCalc);
            if (el) el.addEventListener('change', renderCalc);
        });

        /* --- giving basket --- */
        const basketItems = document.getElementById('basketItems');
        const basketTotal = document.getElementById('basketTotal');
        const impactList = document.getElementById('impactList');
        let basket = []; // { key, name, usd }

        function renderBasket() {
            if (!basketItems) return;
            if (!basket.length) {
                basketItems.innerHTML = '<p class="basket-empty">No funds selected yet. Choose one or more above.</p>';
            } else {
                basketItems.innerHTML = basket.map((it, i) => `
                    <div class="basket-item">
                        <span class="basket-item-name">${it.name}</span>
                        <input type="number" min="0" step="any" data-i="${i}"
                               value="${(it.usd * CURRENCIES[cur].rate).toFixed(CURRENCIES[cur].rate > 5 ? 0 : 2)}"
                               aria-label="Amount for ${it.name}">
                        <button class="basket-remove" data-remove="${i}" aria-label="Remove ${it.name}"><i class="fas fa-times"></i></button>
                    </div>`).join('');
                basketItems.querySelectorAll('input').forEach(inp => {
                    inp.addEventListener('input', () => {
                        basket[+inp.getAttribute('data-i')].usd = toUsd(parseFloat(inp.value) || 0);
                        updateTotal();
                    });
                });
                basketItems.querySelectorAll('[data-remove]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const removed = basket.splice(+btn.getAttribute('data-remove'), 1)[0];
                        const chip = document.querySelector(`[data-fund="${removed.key}"]`);
                        if (chip) { chip.classList.remove('added'); chip.innerHTML = '<i class="fas fa-plus"></i> Add to my giving'; }
                        renderBasket();
                    });
                });
            }
            updateTotal();
        }

        function updateTotal() {
            const total = basket.reduce((s, it) => s + it.usd, 0);
            if (basketTotal) basketTotal.textContent = fmt(total);
            renderImpact(total);
        }

        /* --- impact estimator --- */
        // Indicative unit costs in USD, drawn from published programme averages.
        const IMPACT = [
            { usd: 18,  one: 'a school term of fees and materials for one child', many: 'terms of school fees' },
            { usd: 6,   one: 'a week of school meals for one child',              many: 'weeks of school meals' },
            { usd: 45,  one: 'one clinic day for a community of around 60',       many: 'community clinic days' },
            { usd: 120, one: 'one student’s College term, fully bursaried',  many: 'bursaried College terms' },
            { usd: 300, one: 'sending one team member on a city campaign',        many: 'mission team placements' }
        ];
        function renderImpact(total) {
            if (!impactList) return;
            if (total <= 0) {
                impactList.innerHTML = '<li><i class="fas fa-circle"></i>Enter an amount to see indicative impact.</li>';
                return;
            }
            impactList.innerHTML = IMPACT.map(r => {
                const n = Math.floor(total / r.usd);
                if (n < 1) return '';
                return `<li><i class="fas fa-check"></i><span><strong>${n.toLocaleString()}</strong> &times; ${n === 1 ? r.one : r.many}</span></li>`;
            }).filter(Boolean).join('') ||
            '<li><i class="fas fa-seedling"></i><span>Every amount is pooled &mdash; small regular giving funds more here than occasional large gifts.</span></li>';
        }

        /* --- add-to-basket buttons --- */
        document.querySelectorAll('[data-fund]').forEach(btn => {
            btn.addEventListener('click', () => {
                const key = btn.getAttribute('data-fund');
                const name = btn.getAttribute('data-fund-name') || key;
                const idx = basket.findIndex(b => b.key === key);
                if (idx > -1) {
                    basket.splice(idx, 1);
                    btn.classList.remove('added');
                    btn.innerHTML = '<i class="fas fa-plus"></i> Add to my giving';
                } else {
                    basket.push({ key, name, usd: CURRENCIES[cur].step / CURRENCIES[cur].rate });
                    btn.classList.add('added');
                    btn.innerHTML = '<i class="fas fa-check"></i> Added';
                }
                renderBasket();
                const b = document.getElementById('basket');
                if (b && window.innerWidth < 1100) b.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            });
        });

        /* --- frequency toggle --- */
        document.querySelectorAll('[data-freq]').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('[data-freq]').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        /* --- proceed --- */
        const proceed = document.getElementById('basketProceed');
        if (proceed) {
            proceed.addEventListener('click', () => {
                if (!basket.length) {
                    openModal('fas fa-hand-holding-heart', 'Choose a Fund First',
                        'Select at least one fund above so we know where your giving should go.', '');
                    return;
                }
                const freqBtn = document.querySelector('[data-freq].active');
                const freq = freqBtn ? freqBtn.textContent.trim() : 'One-off';
                const lines = basket.map(b => `${b.name} &mdash; ${fmt(b.usd)}`).join('<br>');
                openModal('fas fa-hand-holding-heart', 'Your Giving Summary',
                    `<strong>${freq}</strong><br><br>${lines}<br><br><strong>Total: ${fmt(basket.reduce((s, i) => s + i.usd, 0))}</strong>`,
                    'Secure payment processing is being finalised. Until it is live, use the bank transfer or mobile money details below — quoting your fund names as the reference.');
            });
        }

        setCurrency('NGN');
        renderBasket();
    }

    /* ===== BACK TO TOP ===== */
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.pageYOffset > 500);
        });
        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    /* ===== PARALLAX ON HERO ===== */
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                heroImage.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    /* ===== MARQUEE PAUSE ON HOVER ===== */
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
        marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
    }

    /* ===== SIMPLE MODAL HELPER ===== */
    function openModal(iconClass, title, body, note) {
        const modal = document.createElement('div');
        modal.className = 'hn-modal';
        modal.innerHTML = `
            <div class="hn-modal-box" role="dialog" aria-modal="true">
                <i class="${iconClass}"></i>
                <h2>${title}</h2>
                <p>${body}</p>
                ${note ? `<p class="hn-modal-note">${note}</p>` : ''}
                <button class="btn btn-primary hn-modal-close">Close</button>
            </div>`;
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        const close = () => { modal.remove(); document.body.style.overflow = ''; };
        modal.querySelector('.hn-modal-close').addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        document.addEventListener('keydown', function esc(e) {
            if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc); }
        });
    }

    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal('fas fa-play-circle', 'Live Stream',
                'Our live broadcast will appear here during service and conference times.',
                'Video player integration coming soon.');
        });
    }

    /* ===== WHATSAPP COMMUNITY LINKS ===== */
    document.querySelectorAll('.js-whatsapp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href && href !== '#') return; // real invite link present — let it through
            e.preventDefault();
            const nation = btn.getAttribute('data-nation') || 'this nation';
            openModal('fab fa-whatsapp',
                'WhatsApp Community',
                `The invite link for the <strong>${nation}</strong> community will be published here shortly.`,
                'In the meantime, use the contact form and we will add you directly.');
        });
    });

    /* ===== FORMS (no backend yet) ===== */
    document.querySelectorAll('form[data-demo]').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            openModal('fas fa-paper-plane', 'Thank You',
                'Your submission has been received. A member of our team will be in touch shortly.',
                'Form delivery integration coming soon.');
            form.reset();
        });
    });

    console.log('%c Holy Nation Global ', 'background:#C9A227;color:#0A1628;font-size:18px;font-weight:bold;padding:8px 16px;border-radius:8px;');
    console.log('%c Thy Kingdom Come ', 'color:#C9A227;font-size:13px;');
});
