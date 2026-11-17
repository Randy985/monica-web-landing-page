/*
 * Softio by Theme-Family, version 1.0.0.
 * Commercial content adaptation: MÓNICA 11 Web.
 */
(function () {
    'use strict';

    var motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    var mobileQuery = window.matchMedia('(max-width: 991px)');
    var menuButton = document.querySelector('.atf-menu-toggle');
    var menu = document.getElementById('main-menu');
    var header = document.querySelector('.atf-sticky-header');
    var backToTop = document.querySelector('.atf-back-to-top');
    var links = Array.from(menu.querySelectorAll('a'));
    var sections = links.map(function (link) {
        return document.getElementById(link.hash.slice(1));
    });

    function closeMenu(returnFocus) {
        menu.classList.remove('is-open');
        menuButton.classList.remove('atf-toggle-active');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menú');
        if (returnFocus) menuButton.focus();
    }

    menuButton.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        menuButton.classList.toggle('atf-toggle-active', open);
        menuButton.setAttribute('aria-expanded', String(open));
        menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && menu.classList.contains('is-open')) closeMenu(true);
    });
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.atf-nav')) closeMenu(false);
    });
    document.addEventListener('focusin', function (event) {
        if (!event.target.closest('.atf-nav')) closeMenu(false);
    });
    mobileQuery.addEventListener('change', function () { closeMenu(false); });

    // Keep native anchor navigation, history and keyboard behavior.
    links.forEach(function (link) {
        link.addEventListener('click', function () {
            if (!mobileQuery.matches) return;
            closeMenu(false);
            var section = document.getElementById(link.hash.slice(1));
            section.setAttribute('tabindex', '-1');
            section.focus({ preventScroll: true });
        });
    });
    backToTop.addEventListener('click', function () {
        window.location.hash = 'home';
        document.getElementById('hero-title').setAttribute('tabindex', '-1');
        document.getElementById('hero-title').focus({ preventScroll: true });
    });

    var scheduled = false;
    function updateNavigation() {
        var top = window.scrollY;
        header.classList.toggle('atf-sticky-active', top >= 10);
        backToTop.classList.toggle('open', top > 50);
        backToTop.tabIndex = top > 50 ? 0 : -1;
        var active = 0;
        sections.forEach(function (section, index) {
            if (section.getBoundingClientRect().top <= header.offsetHeight + 60) active = index;
        });
        links.forEach(function (link, index) {
            link.classList.toggle('active', index === active);
            if (index === active) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
        scheduled = false;
    }
    window.addEventListener('scroll', function () {
        if (!scheduled) {
            scheduled = true;
            window.requestAnimationFrame(updateNavigation);
        }
    }, { passive: true });
    window.addEventListener('resize', updateNavigation);
    updateNavigation();

    // WOW controls only decoration; content remains visible if it cannot start.
    var wow;
    if (typeof window.WOW === 'function' && !motionPreference.matches) {
        wow = new WOW({ mobile: false });
        wow.init();
    }
    motionPreference.addEventListener('change', function (event) {
        if (event.matches) {
            if (wow) wow.stop();
            document.querySelectorAll('.wow').forEach(function (element) {
                element.style.visibility = 'visible';
                element.style.animationName = 'none';
            });
        }
    });
})();
