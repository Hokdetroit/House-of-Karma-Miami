(function(){
if(window.__ODYN_LR__)return;
window.__ODYN_LR__=true;
var wsUrl="wss://cdn.odyn.dev/p/9tjg/live";
var retryDelay=1000;
var failures=0;
var MAX_FAILURES=50;
var HEALTHY_MS=60000;
function connect(){
var ws=new WebSocket(wsUrl);
var openedAt=0;
ws.onmessage=function(e){
var data;
try{data=JSON.parse(e.data)}catch(err){return}
if(data.type!=="change")return;
if(data.cssOnly){
var links=document.querySelectorAll('link[href*="https://cdn.odyn.dev/staging/"],link[href*="https://cdn.odyn.dev/auto/"]');
if(links.length===0){location.reload();return}
var bust="?t="+Date.now();
for(var i=0;i<links.length;i++){
(function(link){
try{
var next=link.cloneNode(true);
next.href=link.href.split("?")[0]+bust;
next.onload=function(){link.remove()};
link.parentNode.insertBefore(next,link.nextSibling);
}catch(e){}
})(links[i]);
}
return;
}
location.reload();
};
ws.onclose=function(e){
if(e&&e.code===4001)return;
if(openedAt&&Date.now()-openedAt>=HEALTHY_MS){failures=0;retryDelay=1000}
failures++;
if(failures>=MAX_FAILURES)return;
setTimeout(connect,retryDelay*(0.5+Math.random()));
retryDelay=Math.min(retryDelay*2,30000);
};
ws.onopen=function(){
openedAt=Date.now();
};
}
connect();
})();
var OdynCode = (() => {
  // odyn:/__entry__.tsx
  gsap.registerPlugin(CustomEase, SplitText, ScrollTrigger, Flip);
  history.scrollRestoration = "manual";
  var lenis = null;
  var nextPage = document;
  var onceFunctionsInitialized = false;
  var scrollRevealSplits = [];
  var hasLenis = typeof window.Lenis !== "undefined";
  var hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";
  var rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reducedMotion = rmMQ.matches;
  rmMQ.addEventListener?.("change", (e) => reducedMotion = e.matches);
  rmMQ.addListener?.((e) => reducedMotion = e.matches);
  var has = (s) => !!nextPage.querySelector(s);
  var staggerDefault = 0.05;
  var durationDefault = 0.6;
  CustomEase.create("osmo", "0.625, 0.05, 0, 1");
  gsap.defaults({ ease: "osmo", duration: durationDefault });
  function initOnceFunctions() {
    initLenis();
    if (onceFunctionsInitialized) return;
    onceFunctionsInitialized = true;
    preloader();
  }
  function initBeforeEnterFunctions(next) {
    nextPage = next || document;
  }
  function initAfterEnterFunctions(next) {
    nextPage = next || document;
    if (has("[data-hero]")) initHeroIntro();
    if (has("[dark-s-nav]") || has("[light-s-nav]")) initNavTheme();
    initNavMenu();
    if (has("[data-lenis-scroll-to]") || has("[data-lenis-start]") || has("[data-lenis-toggle]")) initLenisTriggers();
    if (has('[data-parallax="trigger"]')) initGlobalParallax();
    if (has("[data-bg-zoom-init]")) initBackgroundZoom();
    if (has('[data-split="heading"]')) initScrollReveal();
    if (has("[data-scroll-highlight]")) initScrollHighlightWords();
    if (has("[hkp-line]")) initHKPLines();
    if (has(".is-track-record")) initTrackRecord();
    if (has("[home-hero-overlay]")) initHeroOverlay();
    if (has(".p-hero_more")) initHeroMoreHide();
    if (has("[home-hiw-scrub]")) initVideoScrub();
    if (has("[home-hiw-scrub]")) initHiwMaskSlideIn();
    if (has("[home-wk-scrub]")) initWeKnowApla();
    if (has("[home-wk-scrub]")) initWkHandoff();
    if (has("[home-wk-scrub]")) initWkFlip();
    if (has("[home-wk-scrub]")) initWeKnowStraighten();
    if (has("[home-wk-scrub]")) initWeKnowHeadFlip();
    if (has("[glass-split]")) initGlassSplit();
    if (has("[home-kp-scrub]")) initKpVideoScrub();
    if (has("[siv-reveal-fade]")) initSivRevealFade();
    if (has("[siv-reveal-grid]")) initSivRevealGrid();
    if (has("[data-divider-height]")) initDividerHeight();
    if (has("[data-img-scale]")) initImgScale();
    if (has("[data-bracket-clip]")) initBracketClip();
    if (has("[data-hor-divider-reveal]")) initHorDividerReveal();
    if (has("[data-square-opacity]")) initSquareFade();
    if (has(".is-footer-bottle-reveal")) initFooterBottleReveal();
    if (has("[data-parallax-init]")) initParallaxImageSlider();
    if (document.querySelector("[data-footer-parallax]")) initFooterParallax();
    if (has(".is-what-we-do")) initWhatWeDoHero();
    if (has("#my-sticky-img")) initWhatWeDoStickyImgHeight();
    if (has(".capsule")) initCapsulesParallax();
    if (has('[careers-hero="text-wrapper"]')) initCareersHeroReveal();
    if (has(".is-careers-process")) initCareersProcess();
    if (has(".wwd_wrapper.is-no-bg")) initWhatWeDoCards();
    if (has("[data-overlay-trigger]")) initCustomOverlayReveal();
    if (has("[modal-get-in-touch-open]")) initGetInTouchModal();
    initUnicorn();
    if (has("[about-journey-scrub]")) initAboutJourney();
    if (has("[data-load-more]")) initInsightsLoadMore();
    if (has(".ins-latest_tabs")) initInsightsTabs();
    if (has(".swiper_wrap")) initSwiperCarousels();
    if (has(".w-form")) initWebflowForms();
    if (has("#pb-globe")) initPbGlobe();
    if (document.querySelector("[pb-glass]")) initPbGlass();
    if (hasLenis) {
      lenis.resize();
    }
    if (hasScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }
  function runPageOnceAnimation(next) {
    const tl = gsap.timeline();
    tl.call(() => {
      resetPage(next);
    }, null, 0);
    return tl;
  }
  function runPageLeaveAnimation(current, next) {
    const transitionWrap = document.querySelector("[data-transition-wrap]");
    const transitionDark = transitionWrap.querySelector("[data-transition-dark]");
    const tl = gsap.timeline({
      onComplete: () => {
        current.remove();
      }
    });
    CustomEase.create("parallax", "0.7, 0.05, 0.13, 1");
    if (reducedMotion) {
      return tl.set(current, { autoAlpha: 0 });
    }
    tl.set(transitionWrap, {
      zIndex: 2
    });
    tl.fromTo(transitionDark, {
      autoAlpha: 0
    }, {
      autoAlpha: 0.8,
      duration: 1.2,
      ease: "parallax"
    }, 0);
    tl.fromTo(current, {
      y: "0vh"
    }, {
      y: "-25vh",
      duration: 1.2,
      ease: "parallax"
    }, 0);
    tl.set(transitionDark, {
      autoAlpha: 0
    });
    return tl;
  }
  function runPageEnterAnimation(next) {
    const tl = gsap.timeline();
    if (reducedMotion) {
      tl.set(next, { autoAlpha: 1 });
      tl.add("pageReady");
      tl.call(resetPage, [next], "pageReady");
      return new Promise((resolve) => tl.call(resolve, null, "pageReady"));
    }
    tl.add("startEnter", 0);
    tl.set(next, {
      zIndex: 3
    });
    tl.fromTo(next, {
      y: "100vh"
    }, {
      y: "0vh",
      duration: 1.2,
      clearProps: "all",
      ease: "parallax"
    }, "startEnter");
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise((resolve) => {
      tl.call(resolve, null, "pageReady");
    });
  }
  barba.hooks.beforeEnter((data) => {
    gsap.set(data.next.container, {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0
    });
    if (lenis && typeof lenis.stop === "function") {
      lenis.stop();
    }
    initBeforeEnterFunctions(data.next.container);
    applyThemeFrom(data.next.container);
  });
  barba.hooks.afterLeave((data) => {
    if (hasScrollTrigger) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (window.UnicornStudio?.destroy) UnicornStudio.destroy();
    }
    destroyScrollReveal();
    destroyPbGlobe();
    destroyPbGlass(data.current.container);
    destroyTurnstileWidgets(data.current.container);
  });
  barba.hooks.enter((data) => {
    initBarbaNavUpdate(data);
  });
  barba.hooks.afterEnter((data) => {
    initAfterEnterFunctions(data.next.container);
    if (hasLenis) {
      lenis.resize();
      lenis.start();
    }
    if (hasScrollTrigger) {
      ScrollTrigger.refresh();
    }
  });
  barba.init({
    debug: true,
    // Set to 'false' in production
    timeout: 7e3,
    preventRunning: true,
    transitions: [
      {
        name: "default",
        sync: true,
        // First load
        async once(data) {
          initOnceFunctions();
          return runPageOnceAnimation(data.next.container);
        },
        // Current page leaves
        async leave(data) {
          return runPageLeaveAnimation(data.current.container, data.next.container);
        },
        // New page enters
        async enter(data) {
          return runPageEnterAnimation(data.next.container);
        }
      }
    ]
  });
  var themeConfig = {
    light: {
      nav: "dark",
      transition: "light"
    },
    dark: {
      nav: "light",
      transition: "dark"
    }
  };
  function applyThemeFrom(container) {
    const pageTheme = container?.dataset?.pageTheme || "light";
    const config = themeConfig[pageTheme] || themeConfig.light;
    document.body.dataset.pageTheme = pageTheme;
    const transitionEl = document.querySelector("[data-theme-transition]");
    if (transitionEl) {
      transitionEl.dataset.themeTransition = config.transition;
    }
    const nav = document.querySelector("[data-theme-nav]");
    if (nav) {
      nav.dataset.themeNav = config.nav;
      nav.classList.toggle("is-nav-on-light", pageTheme === "light");
    }
  }
  var formSuccessObserver = null;
  function initWebflowForms() {
    if (!window.Webflow || typeof Webflow.require !== "function") return;
    var formsModule = Webflow.require("forms");
    if (!formsModule || typeof formsModule.ready !== "function") return;
    var formBlocks = nextPage.querySelectorAll(".w-form");
    var needsBind = Array.prototype.some.call(formBlocks, function(block) {
      var form = block.querySelector("form");
      return form && !(window.jQuery && jQuery.data(form, ".w-form"));
    });
    if (needsBind) {
      if (window.jQuery) jQuery(document).off("ready TURNSTILE_LOADED");
      formsModule.ready();
      if (window.jQuery) jQuery(document).trigger("ready");
    }
    formBlocks.forEach(function(block) {
      var form = block.querySelector("form");
      if (!form) return;
      form.addEventListener("submit", function() {
        block.style.minHeight = block.offsetHeight + "px";
      }, true);
    });
    if (formSuccessObserver) {
      formSuccessObserver.disconnect();
      formSuccessObserver = null;
    }
    var doneEls = nextPage.querySelectorAll(".w-form .w-form-done");
    if (!doneEls.length) return;
    formSuccessObserver = new MutationObserver(function(mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var done = mutations[i].target;
        if (getComputedStyle(done).display === "none") continue;
        formSuccessObserver.disconnect();
        formSuccessObserver = null;
        scrollToFormSuccess(done);
        return;
      }
    });
    doneEls.forEach(function(el) {
      formSuccessObserver.observe(el, { attributes: true, attributeFilter: ["style"] });
    });
  }
  function scrollToFormSuccess(done) {
    var block = done.closest(".w-form") || done;
    var offset = -10 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    function releaseHeight() {
      block.style.minHeight = "";
      if (lenis) lenis.resize();
      if (hasScrollTrigger) ScrollTrigger.refresh();
    }
    if (lenis) {
      lenis.scrollTo(block, { offset, duration: 1.2, immediate: reducedMotion, lock: true, onComplete: releaseHeight });
    } else {
      window.scrollTo({ top: block.getBoundingClientRect().top + window.scrollY + offset });
      releaseHeight();
    }
  }
  function destroyTurnstileWidgets(container) {
    if (!container || !window.turnstile || typeof turnstile.remove !== "function") return;
    container.querySelectorAll('[name="cf-turnstile-response"]').forEach(function(input) {
      try {
        turnstile.remove(input.parentElement);
      } catch (e) {
      }
    });
  }
  function initLenis() {
    if (lenis) return;
    if (!hasLenis) return;
    if (Webflow.env("editor") !== void 0) return;
    lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1.2
    });
    window.lenis = lenis;
    if (hasScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }
    gsap.ticker.add((time) => {
      lenis.raf(time * 1e3);
    });
    gsap.ticker.lagSmoothing(0);
  }
  function resetPage(container) {
    window.scrollTo(0, 0);
    gsap.set(container, { clearProps: "position,top,left,right" });
    if (hasLenis) {
      lenis.resize();
      lenis.start();
    }
  }
  function debounceOnWidthChange(fn, ms) {
    let last = innerWidth, timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (innerWidth !== last) {
          last = innerWidth;
          fn.apply(this, args);
        }
      }, ms);
    };
  }
  function initBarbaNavUpdate(data) {
    var tpl = document.createElement("template");
    tpl.innerHTML = data.next.html.trim();
    var nextNodes = tpl.content.querySelectorAll("[data-barba-update]");
    var currentNodes = document.querySelectorAll("nav [data-barba-update]");
    currentNodes.forEach(function(curr, index) {
      var next = nextNodes[index];
      if (!next) return;
      var newStatus = next.getAttribute("aria-current");
      if (newStatus !== null) {
        curr.setAttribute("aria-current", newStatus);
      } else {
        curr.removeAttribute("aria-current");
      }
      var newClassList = next.getAttribute("class") || "";
      curr.setAttribute("class", newClassList);
    });
  }
  function initLenisTriggers() {
    if (typeof $ === "undefined" || !window.lenis) return;
    $("[data-lenis-start]").off("click").on("click", function() {
      window.lenis.start();
    });
    $("[data-lenis-stop]").off("click").on("click", function() {
      window.lenis.stop();
    });
    $("[data-lenis-toggle]").off("click").on("click", function() {
      if (window.lenis.isStopped) {
        window.lenis.start();
      } else {
        window.lenis.stop();
      }
    });
    var lenisScrollEase = typeof gsap !== "undefined" && gsap.parseEase ? gsap.parseEase("osmo") : void 0;
    function findNextSection(fromEl) {
      var node = fromEl ? fromEl.closest(".section") : null;
      while (node && node.nextElementSibling) {
        node = node.nextElementSibling;
        if (node.classList && node.classList.contains("section")) return node;
      }
      return null;
    }
    $("[data-lenis-scroll-to]").off("click.lenisScrollTo").on("click.lenisScrollTo", function(e) {
      var btn = this;
      var raw = btn.getAttribute("data-lenis-scroll-to");
      var targetEl = raw === "next-section" ? findNextSection(btn) : document.querySelector(raw || "");
      if (!targetEl) return;
      e.preventDefault();
      if (btn.dataset.lenisScrolling === "1") return;
      btn.dataset.lenisScrolling = "1";
      var offsetAttr = btn.getAttribute("data-lenis-scroll-offset");
      var offset = offsetAttr ? parseFloat(offsetAttr) : 0;
      window.lenis.scrollTo(targetEl, {
        offset,
        duration: reducedMotion ? 0 : 1.2,
        easing: lenisScrollEase,
        lock: true,
        onComplete: function() {
          btn.dataset.lenisScrolling = "0";
        }
      });
    });
  }
  function initUnicorn() {
    if (typeof UnicornStudio === "undefined" || !UnicornStudio.init) return;
    try {
      UnicornStudio.init().then((scenes) => {
        unicornScenes = scenes || [];
        gsap.to(".unicorn-mask", {
          delay: 0.5,
          scaleY: 0,
          transformOrigin: "center bottom",
          duration: 5,
          ease: "expo.out"
        });
      }).catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }
  function initNavTheme() {
    var nav = document.querySelector(".nav_component");
    if (!nav || !window.gsap || !window.ScrollTrigger) return;
    var ON_LIGHT = "is-nav-on-light";
    var HIDDEN = "is-nav-hidden";
    var MENU_OPEN = "is-menu-open";
    var HIDE_SEL = ".footer_wrapper";
    var HIDE_AT = 0.85;
    var current = nav.classList.contains(ON_LIGHT);
    var hidden = false;
    nav.classList.remove(HIDDEN);
    function setOnLight(v) {
      if (v === current) return;
      current = v;
      nav.classList.toggle(ON_LIGHT, v);
    }
    function setHidden(v) {
      if (v === hidden) return;
      hidden = v;
      nav.classList.toggle(HIDDEN, v);
    }
    var navSections = Array.prototype.slice.call(document.querySelectorAll("[dark-s-nav], [light-s-nav]"));
    var activeSections = [];
    function removeActiveSection(el) {
      activeSections = activeSections.filter(function(item) {
        return item.el !== el;
      });
    }
    function updateNavTheme() {
      if (activeSections.length === 0) return;
      activeSections.sort(function(a, b) {
        if (a.priority !== b.priority) {
          return b.priority - a.priority;
        }
        return b.index - a.index;
      });
      var winner = activeSections[0];
      setOnLight(winner.isLight);
    }
    navSections.forEach(function(el, index) {
      var isLight = el.hasAttribute("light-s-nav");
      var isApla = el.classList.contains("home-we-know_apla-bg");
      var priority = parseInt(el.getAttribute("data-nav-priority") || "0", 10);
      ScrollTrigger.create({
        trigger: el,
        start: "top 50px",
        end: "bottom 50px",
        onEnter: function() {
          activeSections.push({ el, index, isLight, priority });
          updateNavTheme();
        },
        onLeave: function() {
          removeActiveSection(el);
          if (isApla) setOnLight(false);
          updateNavTheme();
        },
        onEnterBack: function() {
          activeSections.push({ el, index, isLight, priority });
          updateNavTheme();
        },
        onLeaveBack: function() {
          removeActiveSection(el);
          if (isApla) setOnLight(false);
          updateNavTheme();
        }
      });
    });
    var parallaxEl = document.querySelector("[data-footer-parallax]");
    var footerEl = document.querySelector(HIDE_SEL) || parallaxEl;
    if (!footerEl) return;
    var revealTrigger = parallaxEl && parallaxEl.querySelector("[data-footer-container]") || footerEl;
    function updateHidden(self) {
      setHidden(self.progress >= HIDE_AT && !nav.classList.contains(MENU_OPEN));
    }
    ScrollTrigger.create({
      trigger: revealTrigger,
      start: "clamp(top bottom)",
      end: "clamp(top top)",
      onUpdate: updateHidden,
      onRefresh: updateHidden,
      onToggle: updateHidden
    });
  }
  var navMenuCleanup = null;
  function initNavMenu() {
    var nav = document.querySelector(".nav_component");
    if (!nav) return;
    var drop = nav.querySelector(".nav_drop");
    var burger = nav.querySelector(".nav_hamburger");
    var panel = nav.querySelector(".nav_links-component");
    if (navMenuCleanup) navMenuCleanup();
    var OPEN = "is-open";
    var MENUOPEN = "is-menu-open";
    var trigger = drop ? drop.querySelector(".nav_link.is-drop") : null;
    var canHover = !window.matchMedia || window.matchMedia("(hover: hover)").matches;
    var hoverTimer;
    function setDrop(open) {
      if (!drop) return;
      drop.classList.toggle(OPEN, open);
      if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }
    function setMenu(open) {
      nav.classList.toggle(MENUOPEN, open);
      if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
      if (panel) panel.setAttribute("aria-hidden", open ? "false" : "true");
      document.documentElement.classList.toggle("nav-mobile-open", open);
      document.body.classList.toggle("nav-mobile-open", open);
      if (window.lenis) open ? lenis.stop() : lenis.start();
    }
    var onEnter = function() {
      clearTimeout(hoverTimer);
      setDrop(true);
    };
    var onLeave = function() {
      hoverTimer = setTimeout(function() {
        setDrop(false);
      }, 120);
    };
    var onTriggerClick = function(e) {
      e.preventDefault();
      if (!canHover) setDrop(!drop.classList.contains(OPEN));
    };
    var onDocClick = function(e) {
      if (drop && drop.classList.contains(OPEN) && !drop.contains(e.target)) setDrop(false);
    };
    var onBurger = function() {
      setMenu(!nav.classList.contains(MENUOPEN));
    };
    var onLinkClick = function() {
      if (nav.classList.contains(MENUOPEN)) setMenu(false);
    };
    var onKey = function(e) {
      if (e.key !== "Escape" && e.key !== "Esc") return;
      setDrop(false);
      setMenu(false);
    };
    var onResize = function() {
      if (window.innerWidth >= 992 && nav.classList.contains(MENUOPEN)) setMenu(false);
    };
    if (drop) {
      drop.addEventListener("mouseenter", onEnter);
      drop.addEventListener("mouseleave", onLeave);
    }
    if (trigger) trigger.addEventListener("click", onTriggerClick);
    if (burger) burger.addEventListener("click", onBurger);
    var links = panel ? Array.prototype.slice.call(panel.querySelectorAll(".nav_link, .nav_dropdown-link, .nav_cta")) : [];
    links.forEach(function(a) {
      a.addEventListener("click", onLinkClick);
    });
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    navMenuCleanup = function() {
      if (drop) {
        drop.removeEventListener("mouseenter", onEnter);
        drop.removeEventListener("mouseleave", onLeave);
      }
      if (trigger) trigger.removeEventListener("click", onTriggerClick);
      if (burger) burger.removeEventListener("click", onBurger);
      links.forEach(function(a) {
        a.removeEventListener("click", onLinkClick);
      });
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      clearTimeout(hoverTimer);
      navMenuCleanup = null;
    };
  }
  function initGlobalParallax() {
    const mm = gsap.matchMedia();
    mm.add(
      {
        isMobile: "(max-width:479px)",
        isMobileLandscape: "(max-width:767px)",
        isTablet: "(max-width:991px)",
        isDesktop: "(min-width:992px)"
      },
      (context) => {
        const { isMobile, isMobileLandscape, isTablet } = context.conditions;
        const ctx = gsap.context(() => {
          document.querySelectorAll('[data-parallax="trigger"]').forEach((trigger) => {
            const disable = trigger.getAttribute("data-parallax-disable");
            if (disable === "mobile" && isMobile || disable === "mobileLandscape" && isMobileLandscape || disable === "tablet" && isTablet) {
              return;
            }
            const target = trigger.querySelector('[data-parallax="target"]') || trigger;
            const direction = trigger.getAttribute("data-parallax-direction") || "vertical";
            const prop = direction === "horizontal" ? "xPercent" : "yPercent";
            const scrubAttr = trigger.getAttribute("data-parallax-scrub");
            const scrub = scrubAttr ? parseFloat(scrubAttr) : true;
            const startAttr = trigger.getAttribute("data-parallax-start");
            const startVal = startAttr !== null ? parseFloat(startAttr) : 20;
            const endAttr = trigger.getAttribute("data-parallax-end");
            const endVal = endAttr !== null ? parseFloat(endAttr) : -20;
            const scrollStartRaw = trigger.getAttribute("data-parallax-scroll-start") || "top bottom";
            const scrollStart = `clamp(${scrollStartRaw})`;
            const scrollEndRaw = trigger.getAttribute("data-parallax-scroll-end") || "bottom top";
            const scrollEnd = `clamp(${scrollEndRaw})`;
            gsap.fromTo(
              target,
              { [prop]: startVal },
              {
                [prop]: endVal,
                ease: "none",
                scrollTrigger: {
                  trigger,
                  start: scrollStart,
                  end: scrollEnd,
                  scrub
                }
              }
            );
          });
        });
        return () => ctx.revert();
      }
    );
  }
  function preloader() {
    if (!window.gsap) return null;
    var loader = document.querySelector(".loader_component");
    if (!loader) return null;
    var capL = loader.querySelector(".loader_caption.is-left");
    var capR = loader.querySelector(".loader_caption.is-right");
    var square = loader.querySelector(".loader_deco-square");
    var circle = loader.querySelector(".loader_deco");
    var d = circle ? circle.getBoundingClientRect().width || 30 : 30;
    var coverScale = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) / d) + 4;
    var tl = gsap.timeline({ delay: 0.5, defaults: { ease: "expo.out", duration: 1 } });
    tl.addLabel("texts").to(capL, { top: "50%", yPercent: -50 }, "texts").to(capR, { bottom: "50%", yPercent: 50 }, "texts");
    var a = square.getBoundingClientRect(), b = circle.getBoundingClientRect();
    var half = (b.left + b.width / 2 - (a.left + a.width / 2)) / 2;
    tl.addLabel("shapes", "texts+=0.45").to(square, { x: half, rotation: 90, borderRadius: "50%", duration: 1, ease: "power3.out" }, "shapes").to(circle, { x: -half, duration: 1, ease: "power3.out" }, "shapes");
    tl.to(square, { autoAlpha: 0, duration: 0.2 }, "shapes+=0.8").to(circle, { scale: coverScale, duration: 0.8, ease: "power4.in" }, "<");
    tl.to(loader, { autoAlpha: 0, duration: 0.35, ease: "power2.out" }).set(loader, { display: "none" });
    var heroHeading = document.querySelector('[data-split="heading"].home-hero_heading, .home-hero_heading');
    var heroSubtitle = document.querySelector('[data-split="subtitle"].home-hero_subtitle, .home-hero_subtitle');
    var heroBg = document.querySelector(".home-hero_background");
    var SplitTextClass = window.SplitText || gsap.plugins?.SplitText;
    tl.addLabel("heroStart", "-=0.6");
    if (heroBg) {
      tl.to(heroBg, { scale: 1, duration: 2.5, ease: "power3.out" }, "heroStart");
    }
    tl.add(() => {
      if (heroHeading && SplitTextClass) {
        var splitH = SplitTextClass.create(heroHeading, { type: "lines", mask: "lines", autoSplit: true });
        if (splitH && splitH.lines) {
          gsap.fromTo(
            splitH.lines,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "expo.out" }
          );
        }
      }
      if (heroSubtitle && SplitTextClass) {
        var splitS = SplitTextClass.create(heroSubtitle, { type: "lines", mask: "lines", autoSplit: true });
        if (splitS && splitS.lines) {
          gsap.fromTo(
            splitS.lines,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.35 }
          );
        }
      }
    }, "heroStart+=0.2");
    return tl;
  }
  function initHeroIntro(scope = document) {
    const hero = scope.querySelector("[data-hero]");
    if (!hero) return;
    const dividerMask = hero.querySelector(".divider-mask");
    const imageMask = hero.querySelector(".image-mask");
    const dot = hero.querySelector('[data-reveal="dot"]');
    const label = hero.querySelector('[data-reveal="label"]');
    const splits = [...hero.querySelectorAll('[data-split="heading"]')];
    gsap.set([hero, dot, label, ...splits].filter(Boolean), { autoAlpha: 1 });
    const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 0.9 } });
    const revealSplit = (el, at) => {
      const s = SplitText.create(el, { type: "lines", mask: "lines" });
      if (s.lines.length) tl.from(s.lines, { yPercent: 110, stagger: 0.15, duration: 1.25 }, at);
    };
    if (splits[0]) revealSplit(splits[0], 0);
    splits.slice(1).forEach((el) => revealSplit(el, 0.15));
    if (dividerMask) tl.to(dividerMask, { scaleX: 0, transformOrigin: "right center", duration: 1 }, 0.2);
    if (imageMask) tl.to(imageMask, { scaleX: 0, transformOrigin: "right center", duration: 1.1 }, 0.4);
    if (dot) tl.from(dot, { scale: 0, transformOrigin: "center", ease: "back.out(3)", duration: 0.6 }, ">-0.5");
    if (label) tl.from(label, { autoAlpha: 0, y: 12, duration: 0.5 }, "<0.1");
    return tl;
  }
  function initScrollReveal(scope = document) {
    scope.querySelectorAll('[data-split="heading"]').forEach((heading) => {
      if (heading.closest("[data-hero]")) return;
      gsap.set(heading, { autoAlpha: 1 });
      const split = SplitText.create(heading, {
        type: "lines",
        autoSplit: true,
        mask: "lines",
        onSplit(instance) {
          return gsap.from(instance.lines, {
            yPercent: 110,
            duration: 0.8,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 80%",
              once: true
            }
          });
        }
      });
      scrollRevealSplits.push(split);
    });
  }
  function destroyScrollReveal() {
    scrollRevealSplits.forEach((split) => split.revert());
    scrollRevealSplits = [];
  }
  function initHKPLines(scope = document) {
    if (!window.gsap || !window.ScrollTrigger) return;
    scope.querySelectorAll("[hkp-line]").forEach((line) => {
      const val = line.getAttribute("hkp-line") || "";
      const isRight = val.includes("right");
      const startClip = isRight ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)";
      gsap.fromTo(
        line,
        { clipPath: startClip },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            once: true
          }
        }
      );
    });
  }
  function initSivRevealFade() {
    const elements = gsap.utils.toArray("[siv-reveal-fade]");
    elements.forEach((element) => {
      gsap.fromTo(
        element,
        { opacity: 0, y: "2.5rem", filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.25,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%"
          }
        }
      );
    });
  }
  function initSivRevealGrid() {
    const grids = gsap.utils.toArray("[siv-reveal-grid]");
    grids.forEach((grid) => {
      const items = grid.children;
      if (!items.length) return;
      gsap.fromTo(
        items,
        { opacity: 0, y: 40, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.11,
          ease: "power3.out",
          scrollTrigger: {
            trigger: grid,
            start: "top 80%"
          }
        }
      );
    });
  }
  function initDividerHeight() {
    const dividers = gsap.utils.toArray("[data-divider-height]");
    dividers.forEach((divider) => {
      gsap.fromTo(
        divider,
        { height: "0%", transformOrigin: "top center" },
        {
          height: "100%",
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: divider,
            start: "top 65%"
          }
        }
      );
    });
  }
  function initBracketClip() {
    const brackets = gsap.utils.toArray("[data-bracket-clip]");
    if (!brackets.length) return;
    brackets.forEach((bracket) => {
      const target = bracket.querySelector("svg") || bracket;
      gsap.fromTo(
        target,
        {
          clipPath: "inset(50% 0% 50% 0%)"
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bracket,
            start: "top 80%"
          }
        }
      );
    });
  }
  function initImgScale() {
    const images = gsap.utils.toArray("[data-img-scale]");
    images.forEach((img) => {
      gsap.fromTo(
        img,
        { scale: 1.5 },
        {
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: img,
            start: "top 80%"
          }
        }
      );
    });
  }
  function initSquareFade() {
    const squares = gsap.utils.toArray("[data-square-opacity]");
    if (!squares.length) return;
    squares.forEach((square) => {
      gsap.fromTo(
        square,
        {
          opacity: 0
        },
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: square,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }
  function initHorDividerReveal() {
    const dividers = gsap.utils.toArray("[data-hor-divider-reveal]");
    if (!dividers.length) return;
    dividers.forEach((divider) => {
      gsap.fromTo(
        divider,
        {
          clipPath: "inset(0% 100% 0% 0%)"
        },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: divider,
            start: "top 90%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }
  var footerMm = gsap.matchMedia();
  var FOOTER_CIRCLE_START = 0.85;
  function initFooterParallax() {
    const footers = document.querySelectorAll("[data-footer-parallax]");
    if (!footers.length || !window.gsap || !window.ScrollTrigger) return;
    footerMm.revert();
    footers.forEach((el) => {
      const triggerEl = el.querySelector("[data-footer-container]") || el;
      const inner = el.querySelector("[data-footer-parallax-inner]");
      const dark = el.querySelector("[data-footer-parallax-dark]");
      const circle = el.querySelector(".site-footer_circle");
      if (!inner && !dark && !circle) return;
      const isDesktopOnly = el.hasAttribute("data-footer-desktop-only");
      const condition = isDesktopOnly ? "(min-width: 768px)" : "all";
      footerMm.add(condition, () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerEl,
            start: "clamp(top bottom)",
            end: "clamp(top top)",
            scrub: true,
            invalidateOnRefresh: true
          }
        });
        if (inner) {
          tl.from(inner, {
            yPercent: -25,
            ease: "none"
          }, 0);
        }
        if (dark) {
          tl.from(dark, {
            opacity: 0.5,
            ease: "none"
          }, 0);
        }
        if (circle) {
          tl.to(circle, {
            xPercent: 0,
            x: 0,
            duration: 1 - FOOTER_CIRCLE_START,
            ease: "none"
          }, FOOTER_CIRCLE_START);
        }
      });
    });
  }
  function initHeroMoreHide() {
    var btn = nextPage.querySelector(".p-hero_more");
    if (!btn || !window.ScrollTrigger) return;
    function update(self) {
      btn.classList.toggle("is-hidden", self.progress >= 1);
    }
    ScrollTrigger.create({
      start: 0,
      end: function() {
        return window.innerHeight * 0.1;
      },
      onUpdate: update,
      onRefresh: update
    });
  }
  function initHeroOverlay() {
    var overlay = document.querySelector("[home-hero-overlay]");
    var trigger = document.querySelector("[home-hero-scroll]");
    if (!overlay || !trigger || !window.gsap || !window.ScrollTrigger) return;
    gsap.to(overlay, {
      opacity: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger,
        start: "bottom 80%",
        scrub: true
      }
    });
  }
  function initWeKnowApla() {
    var track = document.querySelector("[home-wk-scrub]");
    if (!track) {
      console.warn("[wk] brak [home-wk-scrub]");
      return;
    }
    var apla = track.querySelector("[home-wk-apla]");
    if (!apla) {
      console.warn("[wk] brak [home-wk-apla]");
      return;
    }
    if (!window.gsap || !window.ScrollTrigger) return;
    console.log("[wk] apla init", apla);
    var isMobileWK = window.innerWidth < 992;
    var START_DESK = 0.5, END_DESK = 0.75;
    var START_MOBILE = 0.4;
    var END_MOBILE = 0.75;
    var START = isMobileWK ? START_MOBILE : START_DESK;
    var END = isMobileWK ? END_MOBILE : END_DESK;
    function setClip(top) {
      var v = "inset(" + top + "% 0% 0% 0%)";
      apla.style.clipPath = v;
      apla.style.webkitClipPath = v;
    }
    setClip(100);
    ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: function(self) {
        var local = gsap.utils.clamp(0, 1, (self.progress - START) / (END - START));
        setClip((1 - local) * 100);
      }
    });
  }
  function initWkHandoff() {
    var cf = document.querySelector(".hiw_vector-trigger");
    var vec = document.querySelector(".vector_shape");
    var apla = document.querySelector(".home-we-know_apla-bg");
    if (!cf || !vec || !apla || !window.gsap || !window.ScrollTrigger) return;
    gsap.set(vec, { autoAlpha: 1 });
    function updateClip() {
      var vecRect = vec.getBoundingClientRect();
      var aplaRect = apla.getBoundingClientRect();
      var cutPx = aplaRect.top - vecRect.top;
      if (cutPx < 0) cutPx = 0;
      gsap.set(vec, {
        clipPath: "inset(" + cutPx + "px 0px 0px 0px)"
      });
    }
    ScrollTrigger.create({
      trigger: cf,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: function() {
        updateClip();
      }
    });
    updateClip();
  }
  function initWkFlip() {
    var vec = document.querySelector(".vector_shape");
    var apla = document.querySelector(".home-we-know_apla-bg");
    var stage = document.querySelector(".home-we-know_stage");
    var back = document.querySelector(".home-we-know_stage > .home-we-know_shape");
    if (!stage || !back || !window.gsap || !window.ScrollTrigger) return;
    if (window.innerWidth < 992) {
      var overlay = document.querySelector("[s-video-overlay]");
      gsap.set(back, { autoAlpha: 1 });
      if (overlay) {
        gsap.to(overlay, {
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: stage,
            start: "top 80%",
            end: "top 60%",
            scrub: true
          }
        });
      }
      return;
    }
    if (!vec || !apla) return;
    gsap.set(back, { autoAlpha: 0 });
    gsap.set(vec, { transformOrigin: "50% 50%" });
    var F_DESK = 0.336, OFFX_DESK = 4e-3, OFFY_DESK = 6e-3;
    function apply(p) {
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var cover = Math.max(vw, 1.7778 * vh);
      var offX = OFFX_DESK * cover;
      var offY = OFFY_DESK * cover;
      var vecW = F_DESK * cover;
      var sr = stage.getBoundingClientRect();
      var tr = back.getBoundingClientRect();
      var txEnd = offX + (tr.left - sr.left) + tr.width / 2 - vw / 2;
      var tyEnd = offY + (tr.top - sr.top) + tr.height / 2 - vh / 2;
      var scEnd = tr.width / vecW;
      var tx = OFFX_DESK * cover + p * (txEnd - OFFX_DESK * cover);
      var ty = OFFY_DESK * cover + p * (tyEnd - OFFY_DESK * cover);
      var sc = 1 + p * (scEnd - 1);
      vec.style.transform = "translate(calc(-50% + " + tx + "px), calc(-50% + " + ty + "px)) scale(" + sc + ")";
      var landed = p >= 0.999;
      gsap.set(vec, { autoAlpha: landed ? 0 : 1 });
      gsap.set(back, { autoAlpha: landed ? 1 : 0 });
    }
    apply(0);
    ScrollTrigger.create({
      trigger: apla,
      start: "top top",
      endTrigger: stage,
      end: "top top",
      scrub: true,
      onUpdate: function(self) {
        apply(self.progress);
      },
      onRefresh: function() {
        apply(0);
      }
    });
  }
  function initWeKnowHeadFlip() {
    var track = document.querySelector("[home-wk-scrub]");
    if (!track || !window.gsap || !window.ScrollTrigger || !window.Flip || !window.SplitText) return;
    var big = track.querySelector("[home-wk-flip]");
    var target = track.querySelector("[home-wk-flip-to]");
    if (!big || !target) return;
    var FLIP_START = 0.1, FLIP_END = 0.35, IN_AT = 0.02, OUT_AT = 0.6;
    var SWAP_OUT = 0.55;
    var HL_START = 0.15, HL_END = 0.375;
    var isMobileWK = window.innerWidth < 992;
    var W1_RISE_START = isMobileWK ? 0 : FLIP_START;
    var W1_RISE_END = isMobileWK ? 0.2 : FLIP_END;
    var HL_START_MQ = isMobileWK ? 0 : HL_START;
    var HL_END_MQ = isMobileWK ? 0.4 : HL_END;
    var DIAMOND_SWAP = isMobileWK ? 0.55 : SWAP_OUT;
    var COLOR_MUTED = "#E6EFEF";
    var COLOR_ACTIVE = "#005453";
    var diamond1 = track.querySelector('[home-wk-diamond="1"]');
    var splitHead = new SplitText(big, { type: "lines", mask: "lines" });
    if (splitHead.lines && splitHead.lines.length) {
      gsap.set(big, { autoAlpha: 0 });
      gsap.set(splitHead.lines, { yPercent: 115 });
    }
    var headState = -1;
    function setHeadState(s) {
      if (s === headState || !splitHead.lines.length) return;
      headState = s;
      if (s === 0) {
        gsap.killTweensOf(splitHead.lines);
        gsap.set(big, { autoAlpha: 0 });
        gsap.set(splitHead.lines, { yPercent: 115 });
      } else if (s === 1) {
        gsap.killTweensOf(splitHead.lines);
        gsap.set(big, { autoAlpha: 1 });
        gsap.to(splitHead.lines, { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", overwrite: "auto" });
      } else {
        gsap.killTweensOf(splitHead.lines);
        gsap.to(splitHead.lines, {
          yPercent: 115,
          duration: 0.4,
          stagger: 0,
          ease: "power2.inOut",
          overwrite: "auto",
          onComplete: function() {
            if (headState === 2) gsap.set(big, { autoAlpha: 0 });
          }
        });
      }
    }
    var R = { ease: "expo.out", dur: 1, stag: 0.1, lineY: 115, hideEase: "power2.out", hideDur: 0.35, delay: 0.15 };
    function prep(sel) {
      var el = track.querySelector(sel);
      if (!el) return null;
      var layout = /flex|grid/.test(getComputedStyle(el).display);
      var targets = layout ? Array.prototype.slice.call(el.children) : [el];
      var lines = [];
      targets.forEach(function(t) {
        if (t.matches("[home-wk-diamond]") || t.querySelector("[home-wk-diamond]")) return;
        var s = new SplitText(t, { type: "lines", mask: "lines" });
        if (s.lines && s.lines.length) lines = lines.concat(s.lines);
      });
      if (!lines.length) return null;
      gsap.set(el, { autoAlpha: 0 });
      gsap.set(lines, { yPercent: R.lineY });
      return { el, lines, shown: false };
    }
    function showText(o) {
      if (!o || o.shown || !o.lines.length) return;
      o.shown = true;
      gsap.set(o.el, { autoAlpha: 1 });
      gsap.to(o.lines, { yPercent: 0, duration: R.dur, stagger: R.stag, ease: R.ease, delay: R.delay, overwrite: true });
    }
    function hideText(o) {
      if (!o || !o.shown || !o.lines.length) return;
      o.shown = false;
      gsap.to(o.lines, {
        yPercent: R.lineY,
        duration: R.hideDur,
        stagger: 0,
        ease: R.hideEase,
        overwrite: true,
        onComplete: function() {
          if (!o.shown) gsap.set(o.el, { autoAlpha: 0 });
        }
      });
    }
    var goal = prep('[home-wk-tx="goal"]');
    var w2 = prep('[home-wk-tx="w2"]');
    var w1El = track.querySelector('[home-wk-tx="w1"]');
    var w1Words = [];
    var splitW1Lines = [];
    if (w1El) {
      gsap.set(w1El, { opacity: 1, visibility: "inherit", yPercent: isMobileWK ? 25 : 125 });
      var w1Targets = /flex|grid/.test(getComputedStyle(w1El).display) ? Array.prototype.slice.call(w1El.children) : [w1El];
      w1Targets.forEach(function(t) {
        var isNote = t.classList.contains("home-we-know_note") || t.querySelector(".home-we-know_note");
        var isDiamond = t.matches("[home-wk-diamond]") || t.querySelector("[home-wk-diamond]");
        if (isDiamond) return;
        var s = new SplitText(t, { type: "lines, words", mask: "lines" });
        if (s.lines && s.lines.length) splitW1Lines = splitW1Lines.concat(s.lines);
        if (s.words && s.words.length) {
          if (isNote) {
            gsap.set(s.words, { color: COLOR_ACTIVE, opacity: 1 });
          } else {
            gsap.set(s.words, { color: COLOR_MUTED, opacity: 1 });
            w1Words = w1Words.concat(s.words);
          }
        }
      });
    }
    var w1Exited = false;
    var nextShown = false;
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: isMobileWK ? "top bottom" : "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: function(self) {
          var p = self.progress;
          setHeadState(p < IN_AT ? 0 : p < DIAMOND_SWAP ? 1 : 2);
          if (w1Words.length) {
            var tt = gsap.utils.clamp(0, 1, (p - HL_START_MQ) / (HL_END_MQ - HL_START_MQ));
            var head = tt * w1Words.length;
            for (var i = 0; i < w1Words.length; i++) {
              var factor = gsap.utils.clamp(0, 1, head - i);
              var currentColor = gsap.utils.interpolate(COLOR_MUTED, COLOR_ACTIVE, factor);
              gsap.set(w1Words[i], { color: currentColor });
            }
          }
          if (p >= DIAMOND_SWAP && !w1Exited) {
            w1Exited = true;
            if (splitW1Lines.length) {
              gsap.to(splitW1Lines, {
                yPercent: 115,
                duration: 0.4,
                stagger: 0.05,
                ease: "power2.inOut",
                overwrite: true
              });
            }
            if (diamond1) {
              gsap.to(diamond1, {
                rotate: 90,
                duration: 0.5,
                ease: "back.out(1.7)",
                overwrite: "auto"
              });
            }
          } else if (p < DIAMOND_SWAP && w1Exited) {
            w1Exited = false;
            if (splitW1Lines.length) {
              gsap.to(splitW1Lines, {
                yPercent: 0,
                duration: 0.4,
                stagger: 0,
                ease: "power2.out",
                delay: R.delay,
                overwrite: true
              });
            }
            if (diamond1) {
              gsap.to(diamond1, {
                rotate: 0,
                duration: 0.4,
                ease: "power2.out",
                overwrite: "auto"
              });
            }
          }
          var showNext = p >= DIAMOND_SWAP;
          if (showNext !== nextShown) {
            nextShown = showNext;
            if (showNext) {
              showText(goal);
              showText(w2);
            } else {
              hideText(goal);
              hideText(w2);
            }
          }
        }
      }
    });
    tl.to({}, { duration: 1 }, 0);
    tl.add(Flip.fit(big, target, { duration: FLIP_END - FLIP_START, ease: "none", scale: true }), FLIP_START);
    if (w1El) {
      tl.to(w1El, {
        yPercent: 0,
        duration: W1_RISE_END - W1_RISE_START,
        ease: "none"
      }, W1_RISE_START);
    }
  }
  function initWeKnowStraighten() {
    var track = document.querySelector("[home-wk-scrub]");
    if (!track || !window.gsap || !window.ScrollTrigger) return;
    var rotEls = track.querySelectorAll("[home-wk-rotate]");
    var spreadWraps = track.querySelectorAll("[home-wk-spread]");
    var overlay = document.querySelector("[home-wk-overlay]");
    if (!rotEls.length && !spreadWraps.length) return;
    var isTabletDown = window.matchMedia("(max-width: 991px)").matches;
    var POS_DESKTOP = [
      { x: -120, y: 0, scale: 1.4 },
      { x: -55, y: 0, scale: 1.15 },
      { x: 10, y: 0, scale: 0.9 },
      { x: 70, y: 0, scale: 0.7 }
    ];
    var MOBILE_COUNT = 5;
    var GAP = 48;
    var SCALE_STEP = 0.15;
    var Y_STEP = 14;
    var POS = isTabletDown ? null : POS_DESKTOP;
    var count = isTabletDown ? MOBILE_COUNT : POS_DESKTOP.length;
    var mid = (count - 1) / 2;
    if (isTabletDown) {
      spreadWraps.forEach(function(wrap) {
        while (wrap.children.length > 0 && wrap.children.length < count) {
          var clone = wrap.children[wrap.children.length - 1].cloneNode(true);
          clone.classList.add("is-dup");
          clone.setAttribute("aria-hidden", "true");
          wrap.appendChild(clone);
        }
      });
    }
    spreadWraps.forEach(function(wrap) {
      var items = wrap.children;
      for (var j = 0; j < items.length && j < count; j++) {
        if (isTabletDown) {
          var dFromMid = Math.abs(j - mid);
          gsap.set(items[j], {
            // Closer to the middle = higher zIndex, so the centre bottle sits on top
            zIndex: Math.round(100 - dFromMid),
            transformOrigin: "center bottom",
            willChange: "transform"
          });
        } else {
          gsap.set(items[j], {
            zIndex: Math.round(POS[j].scale * 1e3),
            transformOrigin: "center center",
            willChange: "transform"
          });
        }
      }
    });
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
    if (isTabletDown) {
      gsap.set(rotEls, { autoAlpha: 1, filter: "blur(24px)" });
      tl.to(
        rotEls,
        { filter: "blur(0px)", rotation: 0, duration: 0.22, ease: "none" },
        0
      );
    } else {
      tl.fromTo(
        rotEls,
        { autoAlpha: 0 },
        { autoAlpha: 1, rotation: 0, duration: 0.22, ease: "none" },
        0
      );
    }
    spreadWraps.forEach(function(wrap) {
      var items = wrap.children;
      for (var i = 0; i < items.length && i < count; i++) {
        if (isTabletDown) {
          var d = Math.abs(i - mid);
          tl.fromTo(
            items[i],
            {
              xPercent: 0,
              yPercent: 0,
              scale: 1
            },
            {
              xPercent: (i - mid) * GAP,
              yPercent: -d * Y_STEP,
              scale: 1 - d * SCALE_STEP,
              duration: 0.3,
              ease: "power2.out"
            },
            0.55
          );
        } else {
          tl.to(
            items[i],
            {
              xPercent: POS[i].x,
              yPercent: POS[i].y,
              scale: POS[i].scale,
              duration: 0.3,
              ease: "power2.out"
            },
            0.55
          );
        }
      }
    });
    if (overlay) {
      tl.to(
        overlay,
        {
          opacity: 1,
          duration: 0.1,
          ease: "power2.out"
        },
        0.7
      );
    }
  }
  function initGlassSplit() {
    const trigger = document.querySelector("[glass-split]");
    if (!trigger) return;
    const circle = trigger.querySelector('.home-concept_circle, [pb-glass-shape="circle"]');
    const squareGlass = trigger.querySelector('.home-concept_square-glass, [pb-glass-shape="square"]');
    if (!circle || !squareGlass) return;
    const gap = () => 2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
    const mm = gsap.matchMedia();
    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop } = context.conditions;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          // whole section on screen: its bottom reaches the viewport bottom, or it fills the viewport if taller
          start: () => trigger.offsetHeight <= window.innerHeight ? "clamp(bottom bottom)" : "clamp(top top)",
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true
        }
      });
      if (isDesktop) {
        tl.to(circle, {
          x: () => -(squareGlass.offsetWidth + gap()) / 2,
          duration: 1.5,
          ease: "expo.out"
        }, 0).to(squareGlass, {
          x: () => (circle.offsetWidth + gap()) / 2,
          duration: 1.5,
          ease: "expo.out"
        }, 0);
      } else {
        tl.to(circle, {
          y: "12.9375rem",
          duration: 1.5,
          ease: "expo.out"
        }, 0);
      }
    });
  }
  function initKpVideoScrub() {
    var track = document.querySelector("[home-kp-scrub]");
    if (!track) return;
    var video = track.querySelector("video");
    if (!video || !window.gsap || !window.ScrollTrigger) return;
    var wrap = track.querySelector("[hkp-video-mask]");
    if (wrap) {
      var DIAMOND = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 593 593'%3E%3Crect x='86.8' y='86.8' width='419.4' height='419.4' rx='52.3' fill='%23fff' transform='rotate(45 296.5 296.5)'/%3E%3C/svg%3E")`;
      wrap.style.webkitMaskImage = wrap.style.maskImage = DIAMOND;
      wrap.style.webkitMaskRepeat = wrap.style.maskRepeat = "no-repeat";
      wrap.style.webkitMaskPosition = wrap.style.maskPosition = "center";
      wrap.style.webkitMaskSize = wrap.style.maskSize = "contain";
    }
    var ring = track.querySelector(".home-key-pillars_ring-progress") || track.querySelectorAll(".hkp_circle")[1] || track.querySelector(".hkp_circle");
    var copyItems = gsap.utils.toArray(track.querySelectorAll("[data-copy]")).sort(function(a, b) {
      return +a.getAttribute("data-copy") - +b.getAttribute("data-copy");
    });
    var copyLines = copyItems.map(function(item) {
      var lines = [];
      item.querySelectorAll(".home-key-pillars_heading, .home-key-pillars_paragraph").forEach(function(el) {
        gsap.set(el, { autoAlpha: 1 });
        var s = SplitText.create(el, { type: "lines", mask: "lines" });
        lines = lines.concat(s.lines);
      });
      return lines;
    });
    copyItems.forEach(function(item) {
      gsap.set(item, { autoAlpha: 0 });
    });
    var copyCur = -1;
    function setCopy(i) {
      if (i === copyCur || !copyItems[i]) return;
      copyCur = i;
      copyItems.forEach(function(it, n) {
        gsap.set(it, { zIndex: n === i ? 2 : 1, autoAlpha: n === i ? 1 : 0 });
      });
      gsap.set(copyLines[i], { yPercent: 110 });
      gsap.to(copyLines[i], { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", overwrite: true });
    }
    track.querySelectorAll(".hkp_circle").forEach(function(c) {
      c.style.stroke = c === ring ? "#16ABA9" : "rgba(0, 0, 0, 0.15)";
    });
    var ringLen = 0;
    if (ring && ring.getTotalLength) {
      ringLen = ring.getTotalLength();
      ring.style.strokeDasharray = ringLen;
      ring.style.strokeDashoffset = ringLen;
    }
    var steps = track.querySelectorAll(".home-key-pillars_step");
    var dots = track.querySelectorAll(".home-key-pillars_dot");
    var N = dots.length || steps.length || 1;
    var active = -1;
    function setActive(i) {
      if (i === active) return;
      active = i;
      setCopy(i);
      steps.forEach(function(el, n) {
        el.classList.toggle("is-active", n === i);
      });
      dots.forEach(function(el, n) {
        el.classList.toggle("is-active", n === i);
      });
    }
    var eyebrow = track.querySelector(".home-key-pillars_label");
    var cta = track.querySelector(".home-key-pillars_cta");
    var stage = track.querySelector(".home-key-pillars_progress-block");
    var pager = track.querySelector(".home-key-pillars_right");
    var introTl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: "top 85%",
        once: true
      },
      defaults: { ease: "power2.out" }
    });
    if (eyebrow) {
      introTl.from(eyebrow, { autoAlpha: 0, y: 20, duration: 0.6 }, 0);
    }
    if (stage) {
      introTl.fromTo(
        stage,
        { rotation: -45, scale: 0.8, autoAlpha: 0, transformOrigin: "center center" },
        { rotation: 0, scale: 1, autoAlpha: 1, duration: 0.9 },
        0.35
      );
    }
    if (pager) {
      introTl.fromTo(
        pager,
        { rotation: -45, scale: 0.8, autoAlpha: 0, transformOrigin: "center center" },
        { rotation: 0, scale: 1, autoAlpha: 1, duration: 0.9 },
        0.6
      );
    }
    introTl.call(function() {
      setActive(0);
    }, null, 0.4);
    if (cta) {
      introTl.from(cta, { autoAlpha: 0, y: 20, duration: 0.6 }, 1.1);
    }
    video.muted = true;
    var primed = false;
    function primeVideo() {
      if (primed) return;
      primed = true;
      var p = video.play();
      if (p && p.then) p.then(function() {
        video.pause();
      }).catch(function() {
      });
      window.removeEventListener("touchstart", primeVideo);
      window.removeEventListener("pointerdown", primeVideo);
    }
    window.addEventListener("touchstart", primeVideo, { once: true, passive: true });
    window.addEventListener("pointerdown", primeVideo, { once: true });
    video.pause();
    ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: function(self) {
        var p = self.progress;
        if (video.duration) video.currentTime = Math.min(p * video.duration, video.duration - 0.04);
        if (ring) ring.style.strokeDashoffset = ringLen * (1 - p);
        setActive(Math.min(Math.floor(p * N), N - 1));
      }
    });
  }
  function initFooterBottleReveal() {
    var section = document.querySelector(".is-footer-bottle-reveal");
    if (!section || !window.gsap || !window.ScrollTrigger) return;
    var bottle = section.querySelector(".footer-bottle-reveal_bottle");
    var video = section.querySelector(".footer-bottle-reveal_video");
    var clip = section.querySelector(".footer-bottle-reveal_video-clip") || video;
    if (!bottle || !video) return;
    if (!document.getElementById("bottleMatch")) {
      var svgContainer = document.createElement("div");
      svgContainer.style.display = "none";
      svgContainer.innerHTML = '<svg><filter id="bottleMatch" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncR type="gamma" amplitude="1" exponent="0.874" offset="0" /><feFuncG type="gamma" amplitude="1" exponent="0.874" offset="0" /></feComponentTransfer></filter></svg>';
      document.body.appendChild(svgContainer);
    }
    if (!document.getElementById("bottle-match-styles")) {
      var styleEl = document.createElement("style");
      styleEl.id = "bottle-match-styles";
      styleEl.textContent = `
      .footer-bottle-reveal_bottle {
        filter: url(#bottleMatch) brightness(var(--bottle-tone, 1));
        -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - var(--bottle-feather, 0px)), transparent 100%);
        mask-image: linear-gradient(to bottom, #000 calc(100% - var(--bottle-feather, 0px)), transparent 100%);
      }
    `;
      document.head.appendChild(styleEl);
    }
    var BASE = "https://polpharma.fra1.digitaloceanspaces.com";
    var N_TOP = 16;
    var SEQ_FPS = 24;
    var FRAME_OFFSET = 0;
    var FALLBACK_DUR = 1.9167;
    var pad = function(n) {
      return (n < 10 ? "0" : "") + n;
    };
    var FR = [];
    for (var i = 0; i < N_TOP; i++) {
      var im = new Image();
      im.src = BASE + "/top_" + pad(i) + ".png";
      FR.push(im);
    }
    bottle.src = FR[0].src;
    video.muted = true;
    var primed = false;
    function primeVideo() {
      if (primed) return;
      primed = true;
      var p = video.play();
      if (p && p.then) p.then(function() {
        video.pause();
      }).catch(function() {
      });
      window.removeEventListener("touchstart", primeVideo);
      window.removeEventListener("pointerdown", primeVideo);
    }
    window.addEventListener("touchstart", primeVideo, { once: true, passive: true });
    window.addEventListener("pointerdown", primeVideo, { once: true });
    var curFrame = -1;
    function apply(p) {
      if (p < 0) p = 0;
      else if (p > 1) p = 1;
      var dur = video.duration || FALLBACK_DUR;
      var ti = Math.floor(p * dur * SEQ_FPS) + FRAME_OFFSET;
      if (ti < 0) ti = 0;
      else if (ti > N_TOP - 1) ti = N_TOP - 1;
      if (ti !== curFrame) {
        bottle.src = FR[ti].src;
        curFrame = ti;
      }
      if (video.duration) video.currentTime = Math.min(p * video.duration, video.duration - 0.01);
    }
    video.addEventListener("loadedmetadata", function() {
      video.pause();
      ScrollTrigger.refresh();
    }, { once: true });
    var mm = gsap.matchMedia();
    mm.add("(min-width: 480px)", function() {
      ScrollTrigger.create({
        trigger: bottle,
        start: "bottom 85%",
        endTrigger: clip,
        end: "bottom 50%",
        scrub: 1,
        onUpdate: function(self) {
          apply(self.progress);
        },
        onRefresh: function(self) {
          apply(self.progress);
        }
      });
    });
    mm.add("(max-width: 479px)", function() {
      ScrollTrigger.create({
        trigger: bottle,
        start: "top 30%",
        // fires once the top of the bottle reaches 30% of the screen
        end: "+=700",
        // 700px of scroll to play the sequence out
        scrub: 1,
        onUpdate: function(self) {
          apply(self.progress);
        },
        onRefresh: function(self) {
          apply(self.progress);
        }
      });
    });
    apply(0);
  }
  var bgZoomTweens = [];
  function initBackgroundZoom() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const fadedHeroSections = /* @__PURE__ */ new Set();
    document.querySelectorAll("[data-bg-zoom-init]").forEach((container) => {
      const target = container.querySelector("[data-bg-zoom-start]");
      const trigger = container.querySelector("[data-bg-zoom-end]");
      if (!target || !trigger) return;
      bgZoomTweens.push(
        gsap.to(target, {
          width: "100%",
          height: "100vh",
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            onRefreshInit: () => {
              gsap.set(target, { clearProps: "width,height" });
            }
          }
        })
      );
      const heroSection = container.closest(".section.is-hero-flip");
      if (heroSection && !fadedHeroSections.has(heroSection)) {
        fadedHeroSections.add(heroSection);
        bgZoomTweens.push(
          gsap.to(target, {
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: heroSection,
              start: () => `bottom bottom+=${window.innerHeight}`,
              end: "bottom bottom",
              scrub: true,
              invalidateOnRefresh: true
            }
          })
        );
      }
    });
    ScrollTrigger.refresh();
  }
  function destroyBackgroundZoom() {
    bgZoomTweens.forEach((tween) => {
      tween.scrollTrigger?.kill();
      tween.kill();
    });
    bgZoomTweens = [];
    gsap.set("[data-bg-zoom-start]", {
      clearProps: "width,height,opacity"
    });
  }
  function initTrackRecord() {
    var wrap = document.querySelector(".track-record_sticky");
    if (!wrap) return;
    var band = wrap.querySelector(".track-record_band");
    var track = wrap.querySelector(".track-record_track");
    var heading = wrap.querySelector("[data-highlight]");
    var heading2 = wrap.querySelector("[data-highlight-2]");
    if (!band || !track || !heading) return;
    var hasOverlap = wrap.hasAttribute("data-overlap");
    var colorStartPct = 82;
    var colorHoldVh = 20;
    var endHoldVh = 20;
    var dividerDurationMul = 3;
    var scrub = 1;
    var colorMuted = "#0054522a";
    var colorActive = "#005453";
    var splitText = new SplitText(heading, { type: "words, lines" });
    var words = splitText.words;
    if (words && words.length) {
      gsap.set(words, { color: colorMuted });
    }
    var splitText2 = null;
    var words2 = [];
    if (heading2) {
      splitText2 = new SplitText(heading2, { type: "words, lines" });
      words2 = splitText2.words;
      if (words2 && words2.length) {
        gsap.set(words2, { color: colorMuted });
      }
    }
    var vh = function() {
      return window.innerHeight;
    };
    var dist = function() {
      return Math.max(0, track.scrollWidth - band.clientWidth);
    };
    var bandTop = function() {
      return Math.max(0, (vh() - band.offsetHeight) / 2);
    };
    var holdIn = function() {
      return vh() * colorHoldVh / 100;
    };
    var holdOut = function() {
      return vh() * endHoldVh / 100;
    };
    var isMobile = function() {
      return window.innerWidth <= 1;
    };
    var overlapPin = function() {
      return hasOverlap && !isMobile() ? vh() : 0;
    };
    var total = function() {
      return holdIn() + dist() + holdOut() + overlapPin();
    };
    var hStart = 0, hEnd = 0;
    var syncLength = function() {
      var d = dist();
      wrap.style.setProperty("--tr-scroll", total() + "px");
      if (heading2) {
        var distanceAlongTrack = heading2.getBoundingClientRect().left - track.getBoundingClientRect().left;
        hStart = distanceAlongTrack - window.innerWidth * 0.8;
        hEnd = distanceAlongTrack - window.innerWidth * 0.2;
        if (hEnd > d) {
          hEnd = d;
        }
        if (hStart >= hEnd) {
          hStart = Math.max(0, hEnd - window.innerWidth * 0.2);
        }
      }
    };
    syncLength();
    var prox = { p: 0 };
    function applyTrack() {
      var a = holdIn(), d = dist();
      var px = prox.p * total();
      var moved = Math.min(Math.max(px - a, 0), d);
      gsap.set(track, { x: -moved });
      if (words2 && words2.length) {
        var progress2 = gsap.utils.normalize(hStart, hEnd, moved);
        progress2 = gsap.utils.clamp(0, 1, progress2);
        var head2 = progress2 * words2.length;
        for (var j = 0; j < words2.length; j++) {
          var factor2 = gsap.utils.clamp(0, 1, head2 - j);
          var currentColor2 = gsap.utils.interpolate(colorMuted, colorActive, factor2);
          gsap.set(words2[j], { color: currentColor2 });
        }
      }
    }
    gsap.to(prox, {
      p: 1,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: function() {
          return "top " + bandTop() + "px";
        },
        end: function() {
          return "+=" + total();
        },
        scrub,
        invalidateOnRefresh: true,
        onRefreshInit: syncLength,
        onRefresh: applyTrack
      },
      onUpdate: applyTrack
    });
    var toStick = function() {
      return Math.max(0, vh() * colorStartPct / 100 - bandTop());
    };
    if (words && words.length) {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top " + colorStartPct + "%",
        end: function() {
          return "+=" + (toStick() + holdIn());
        },
        scrub,
        invalidateOnRefresh: true,
        onUpdate: function(self) {
          var progress = self.progress;
          var head = progress * words.length;
          for (var i = 0; i < words.length; i++) {
            var factor = gsap.utils.clamp(0, 1, head - i);
            var currentColor = gsap.utils.interpolate(colorMuted, colorActive, factor);
            gsap.set(words[i], { color: currentColor });
          }
        }
      });
    }
    var r = { start: "top 75%", duration: 1, ease: "expo.out", stagger: 0.1 };
    var trackTexts = wrap.querySelectorAll('[data-reveal="track-record"]');
    var divCols = wrap.querySelectorAll(".track-record_col + .track-record_col");
    var trim = wrap.querySelectorAll(".track-record_dates, .track-record_diamond");
    gsap.set(trim, { autoAlpha: 0, y: 12 });
    if (trackTexts.length) gsap.set(trackTexts, { autoAlpha: 0, y: 20 });
    ScrollTrigger.create({
      trigger: wrap,
      start: r.start,
      once: true,
      onEnter: function() {
        if (trackTexts.length) {
          gsap.to(trackTexts, { autoAlpha: 1, y: 0, duration: r.duration, ease: r.ease, stagger: r.stagger });
        }
        gsap.to(divCols, {
          "--tr-div": 1,
          duration: r.duration * dividerDurationMul,
          ease: r.ease,
          stagger: r.stagger
        });
        gsap.to(trim, {
          autoAlpha: 1,
          y: 0,
          duration: r.duration,
          ease: r.ease,
          stagger: r.stagger
        });
      }
    });
  }
  function initAboutJourney() {
    const section = document.querySelector("[about-journey-scrub]");
    if (!section || !window.gsap || !window.ScrollTrigger || !window.SplitText) return;
    const unicorn = section.querySelector(".about-journey_unicorn");
    const textWrap = section.querySelector(".about-journey_text-wrap");
    const diamond = section.querySelector(".about-journey_diamond");
    const stateEl1 = section.querySelector(".about-journey_state.is-state-1");
    const stateEl2 = section.querySelector(".about-journey_state.is-state-2");
    const slot1 = stateEl1 && stateEl1.querySelector(".about-journey_diamond-slot");
    const slot2 = stateEl2 && stateEl2.querySelector(".about-journey_diamond-slot");
    const navLogo = document.querySelector("[logo-link-color]");
    const stage = section.querySelector(".about-journey_stage");
    const video = section.querySelector(".about-journey_video");
    if (!unicorn || !textWrap || !diamond || !stateEl1 || !stateEl2 || !slot1 || !slot2) return;
    const videoSrc = video ? video.getAttribute("src") : null;
    let mm = gsap.matchMedia();
    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isMobile } = context.conditions;
      let navIsGreen = false;
      let activeSplits = [];
      const c = {
        // "vh" == lvh: height as with the Safari bar HIDDEN. Static, so it doesn't
        // jump when the bar collapses (unlike "dvh"). Cost: with the bar visible the
        // bottom ~15% of a 100vh box sits behind it - invisible for a full-screen
        // cover video, and in exchange there is never an empty strip.
        vhUnit: "vh",
        stickyHoldVh: 5,
        pinViewports: 2.5,
        overlapViewports: 1,
        unicorn: { len: 100, exitToVh: -120, xVw: 20, targetW: "23vw", targetH: "30vw" },
        postShrinkHoldVh: 5,
        textIn: 55,
        swapAt: 200,
        purposeEnterMoment: 250,
        // % of .about-journey_stage height. 100 = exactly below its edge.
        // Measured from the stage, not the viewport - see stageH().
        imageFromPercent: 100,
        imageInnerShiftPercent: 9,
        images: [
          { sel: ".is-img-city", enter: 100, len: 200 },
          { sel: ".is-img-vials", enter: 150, len: 180 },
          { sel: ".is-img-abstract", enter: 200, len: 200 },
          { sel: ".is-img-hand", enter: 250, len: 220 }
        ],
        scrubSmooth: 1.2,
        outro: {
          scale: 0.9,
          opacity: 0,
          startsVhBeforeEnd: 150
        }
      };
      if (isMobile) {
        c.unicorn.targetW = "80vw";
        c.unicorn.targetH = "50" + c.vhUnit;
        c.unicorn.xVw = 10;
        c.images = c.images.map((img, i) => ({ ...img, enter: img.enter + i * 50 }));
      }
      function measureVh() {
        const probe = document.createElement("div");
        probe.style.cssText = "position:absolute;top:0;left:0;width:0;height:100" + c.vhUnit + ";visibility:hidden;pointer-events:none";
        document.body.appendChild(probe);
        const h = probe.getBoundingClientRect().height;
        probe.remove();
        return h;
      }
      let vpH = measureVh();
      const vh = (n) => vpH * n / 100;
      const stageH = () => stage ? stage.offsetHeight : vpH;
      let videoListeners = [];
      if (video) {
        if (videoSrc && !video.getAttribute("src")) {
          video.setAttribute("src", videoSrc);
          video.load();
        }
        video.muted = true;
        video.defaultMuted = true;
        video.playsInline = true;
        video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", "");
        const tryPlay = () => {
          const p = video.play();
          if (p && p.catch) p.catch(() => {
          });
        };
        const onVideo = (target, type, fn, opts) => {
          target.addEventListener(type, fn, opts);
          videoListeners.push([target, type, fn]);
        };
        tryPlay();
        onVideo(video, "loadedmetadata", tryPlay);
        onVideo(video, "canplay", tryPlay);
        onVideo(document, "touchstart", tryPlay, { passive: true });
      }
      function prepState(stateEl) {
        const targets = stateEl.querySelectorAll(".about-journey_heading, .about-journey_caption");
        let lines = [];
        targets.forEach((el) => {
          gsap.set(el, { autoAlpha: 1 });
          const split = SplitText.create(el, { type: "lines", mask: "lines" });
          activeSplits.push(split);
          lines = lines.concat(split.lines);
        });
        gsap.set(lines, { yPercent: 110 });
        gsap.set(stateEl, { autoAlpha: 0 });
        return { lines, shown: false, el: stateEl };
      }
      const state1 = prepState(stateEl1);
      const state2 = prepState(stateEl2);
      function showText(state) {
        if (!state.lines.length || state.shown) return;
        state.shown = true;
        gsap.killTweensOf(state.lines);
        gsap.set(state.el, { autoAlpha: 1 });
        gsap.to(state.lines, { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.15, overwrite: true });
      }
      function hideText(state) {
        if (!state.lines.length || !state.shown) return;
        state.shown = false;
        gsap.killTweensOf(state.lines);
        gsap.to(state.lines, {
          yPercent: 110,
          duration: 0.4,
          stagger: 0,
          ease: "power2.inOut",
          overwrite: true,
          onComplete: () => {
            if (!state.shown) gsap.set(state.el, { autoAlpha: 0 });
          }
        });
      }
      function slotY(slot) {
        const wr = textWrap.getBoundingClientRect();
        const sr = slot.getBoundingClientRect();
        return sr.top + sr.height / 2 - wr.top;
      }
      let diaY1 = slotY(slot1);
      let diaY2 = slotY(slot2);
      let diamondShown = false;
      let diamondRotated = false;
      gsap.set(diamond, { xPercent: -50, yPercent: -50, y: diaY1, autoAlpha: 0, scale: 0.7, rotation: -180 });
      function onRefresh() {
        vpH = measureVh();
        diaY1 = slotY(slot1);
        diaY2 = slotY(slot2);
        gsap.set(diamond, { y: diamondRotated ? diaY2 : diaY1 });
      }
      ScrollTrigger.addEventListener("refresh", onRefresh);
      function showDiamond() {
        gsap.killTweensOf(diamond);
        gsap.to(diamond, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1, ease: "expo.out", overwrite: true });
      }
      function hideDiamond() {
        gsap.killTweensOf(diamond);
        gsap.to(diamond, { autoAlpha: 0, scale: 0.7, rotation: -180, duration: 0.4, ease: "power2.inOut", overwrite: true });
      }
      function swapDiamond(dir) {
        gsap.killTweensOf(diamond);
        gsap.to(diamond, {
          y: dir > 0 ? diaY2 : diaY1,
          rotation: dir > 0 ? "+=90" : "-=90",
          duration: 0.5,
          ease: "back.out(1.7)",
          overwrite: true
        });
      }
      const holdVh = c.postShrinkHoldVh;
      const activeVh = c.pinViewports * 100 + holdVh;
      let textInAt = 1, swapAt = 1, overlapAt = 1;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: () => section.getBoundingClientRect().top + window.scrollY + vh(c.stickyHoldVh),
          end: "bottom bottom",
          scrub: c.scrubSmooth,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < textInAt) {
              hideText(state1);
              hideText(state2);
            } else if (p < swapAt) {
              showText(state1);
              hideText(state2);
            } else {
              hideText(state1);
              showText(state2);
            }
            if (p >= textInAt && !diamondShown) {
              diamondShown = true;
              showDiamond();
            } else if (p < textInAt && diamondShown) {
              diamondShown = false;
              hideDiamond();
            }
            if (p >= swapAt && !diamondRotated) {
              diamondRotated = true;
              swapDiamond(1);
            } else if (p < swapAt && diamondRotated) {
              diamondRotated = false;
              swapDiamond(-1);
            }
          }
        }
      });
      gsap.set(unicorn, { overflow: "hidden" });
      tl.set(textWrap, { opacity: 1 }, 0);
      tl.fromTo(
        unicorn,
        {
          width: "100vw",
          height: "100" + c.vhUnit,
          x: "0vw"
        },
        {
          width: c.unicorn.targetW,
          height: c.unicorn.targetH,
          x: () => `${c.unicorn.xVw}vw`,
          ease: "none",
          duration: c.unicorn.len
        },
        0
      );
      const unicornExitAt = c.unicorn.len + holdVh;
      tl.to(unicorn, {
        y: () => vh(c.unicorn.exitToVh),
        ease: "none",
        duration: activeVh - unicornExitAt
      }, unicornExitAt);
      c.images.forEach((img) => {
        const el = section.querySelector(img.sel);
        if (!el) return;
        const inner = el.querySelector(".about-journey_image-inner");
        const at = img.enter + holdVh;
        tl.fromTo(
          el,
          { y: () => stageH() * c.imageFromPercent / 100 },
          { y: () => -el.offsetHeight, ease: "none", duration: img.len, immediateRender: true },
          at
        );
        if (inner) {
          tl.fromTo(
            inner,
            { yPercent: 0 },
            { yPercent: c.imageInnerShiftPercent, ease: "none", duration: img.len, immediateRender: true },
            at
          );
        }
      });
      const overlapVh = c.overlapViewports * 100;
      const desiredAxis = c.purposeEnterMoment + (c.unicorn.len + holdVh) + overlapVh;
      if (tl.duration() < desiredAxis) tl.to({}, { duration: desiredAxis - tl.duration() }, tl.duration());
      const dur = tl.duration() || activeVh;
      overlapAt = dur / (100 + dur);
      textInAt = c.textIn / dur;
      swapAt = (c.swapAt + holdVh) / dur;
      if (stage) {
        const outroStart = Math.max(0, dur - c.outro.startsVhBeforeEnd);
        gsap.set(stage, { transformOrigin: "50% 50%", willChange: "transform, opacity" });
        tl.fromTo(
          stage,
          { scale: 1, autoAlpha: 1 },
          {
            scale: c.outro.scale,
            autoAlpha: c.outro.opacity,
            ease: "none",
            duration: dur - outroStart
          },
          outroStart
        );
      }
      section.style.height = 100 + c.stickyHoldVh + dur + c.vhUnit;
      return () => {
        activeSplits.forEach((split) => split.revert());
        section.style.height = "";
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        videoListeners.forEach(([target, type, fn]) => target.removeEventListener(type, fn));
        videoListeners = [];
        if (video) {
          video.pause();
          video.removeAttribute("src");
          video.load();
        }
        if (navLogo) gsap.set(navLogo, { clearProps: "color" });
        gsap.set([unicorn, diamond, stateEl1, stateEl2], { clearProps: "all" });
        if (stage) gsap.set(stage, { clearProps: "all" });
        gsap.set(textWrap, { clearProps: "opacity" });
      };
    });
  }
  function initWhatWeDoHero() {
    const heroSection = document.querySelector(".wwd-hero_scroll-trigger");
    if (!heroSection || !window.gsap || !window.ScrollTrigger) return;
    const isMobile = window.matchMedia("(max-width: 479px)").matches;
    gsap.set(".wwd-hero_mask-inside", {
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
      visibility: "visible"
    });
    const wwdShrinkTl = gsap.timeline({
      scrollTrigger: { trigger: heroSection, start: "top bottom", end: "top 50%", scrub: true }
    }).to(".wwd-hero_wrapper", { opacity: 0, ease: "none" }, 0);
    if (!isMobile) {
      wwdShrinkTl.to(".wwd-hero_shape-img", { width: "70%", ease: "none" }, 0);
    }
    gsap.timeline({
      scrollTrigger: { trigger: heroSection, start: "top 25%", end: "bottom bottom", scrub: true }
    }).fromTo(".wwd-hero_video-sticky", { height: "100vh" }, { height: "50vh", ease: "none" }, 0).fromTo(
      ".wwd-hero_mask-inside",
      { clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" },
      { clipPath: "polygon(0% 50%, 100% 50%, 100% 100%, 0% 100%)", ease: "none" },
      0
    );
  }
  function initWhatWeDoStickyImgHeight() {
    const img = document.querySelector("#my-sticky-img");
    if (!img) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        img.style.setProperty("--half-height", `${entry.contentRect.height / 2}px`);
      }
    });
    observer.observe(img);
  }
  var capsulesTickerFn = null;
  function initCapsulesParallax() {
    const capsules = document.querySelectorAll(".capsule");
    if (!capsules.length || !window.gsap) return;
    if (capsulesTickerFn) {
      gsap.ticker.remove(capsulesTickerFn);
      capsulesTickerFn = null;
    }
    const setters = Array.from(capsules).map((el) => ({
      setY: gsap.quickSetter(el, "y", "px"),
      speed: parseFloat(el.dataset.speed || "0")
    }));
    capsulesTickerFn = function() {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      setters.forEach((s) => s.setY(scrollY * s.speed));
    };
    gsap.ticker.add(capsulesTickerFn);
  }
  function initCareersHeroReveal() {
    const wrap = document.querySelector('[careers-hero="text-wrapper"]');
    const scrollTrigger = document.querySelector(".careers-hero_scroll-trigger");
    if (!wrap || !scrollTrigger || !window.gsap || !window.ScrollTrigger || !window.SplitText) return;
    const heading = wrap.querySelector('[careers-hero-text="text1"]');
    const diamond = wrap.querySelector('[careers-hero-text="diament"]');
    const caption = wrap.querySelector('[careers-hero-text="text2"]');
    if (!heading || !diamond || !caption) return;
    let mm = gsap.matchMedia();
    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isDesktop, isMobile } = context.conditions;
      let activeSplits = [];
      let activeTriggers = [];
      if (isDesktop) {
        gsap.set(wrap, { yPercent: 50 });
        const introTween = gsap.to(wrap, {
          yPercent: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scrollTrigger,
            start: "top bottom",
            end: "top top",
            scrub: true
          }
        });
        activeTriggers.push(introTween.scrollTrigger);
      }
      function showLines(lines) {
        gsap.killTweensOf(lines);
        gsap.to(lines, { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.15, overwrite: true });
      }
      function initTextItem(el) {
        gsap.set(el, { autoAlpha: 1 });
        const split = SplitText.create(el, { type: "lines", mask: "lines" });
        activeSplits.push(split);
        gsap.set(split.lines, { yPercent: 110 });
        return split.lines;
      }
      const headingLines = initTextItem(heading);
      const captionLines = initTextItem(caption);
      gsap.set(diamond, { autoAlpha: 0, scale: 0.7, rotation: -180 });
      function showDiamond() {
        gsap.killTweensOf(diamond);
        gsap.to(diamond, { autoAlpha: 1, scale: 1, rotation: 0, duration: 1, ease: "expo.out", overwrite: true });
      }
      if (isMobile) {
        showLines(headingLines);
        showLines(captionLines);
        showDiamond();
      } else {
        const capsulesSection = document.querySelector(".capsules-section");
        if (capsulesSection) {
          const revealTrigger = ScrollTrigger.create({
            trigger: capsulesSection,
            start: "top top",
            once: true,
            onEnter: () => {
              showLines(headingLines);
              showLines(captionLines);
              showDiamond();
            }
          });
          activeTriggers.push(revealTrigger);
        }
      }
      return () => {
        activeTriggers.forEach((st) => st.kill());
        activeSplits.forEach((split) => split.revert());
        gsap.set(diamond, { clearProps: "all" });
        gsap.set(wrap, { clearProps: "all" });
      };
    });
  }
  function initCareersProcess() {
    const section = document.querySelector(".is-careers-process");
    if (!section || !window.gsap || !window.ScrollTrigger || !window.SplitText) return;
    const scrub = section.querySelector(".careers-process_scrub");
    const list = section.querySelector(".careers-process_list");
    const steps = gsap.utils.toArray(section.querySelectorAll(".careers-process_step"));
    if (!scrub || !list || !steps.length) return;
    const visualTrack = section.querySelector(".careers-process_visual-wheel");
    let mm = gsap.matchMedia();
    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      let { isMobile } = context.conditions;
      if (isMobile) return;
      const rowEls = steps.map((step) => step.querySelector(".careers-process_row"));
      const total = steps.length;
      const vhPerStep = 70;
      let activeSplits = [];
      function prepStep(step) {
        const expanded = step.querySelector(".careers-process_expanded");
        const slideEls = [
          expanded.querySelector(".careers-process_expanded-top"),
          expanded.querySelector(".careers-process_cta")
        ].filter(Boolean);
        const descEl = expanded.querySelector(".careers-process_description");
        gsap.set(expanded, { autoAlpha: 1 });
        gsap.set(slideEls, { autoAlpha: 0, y: "1rem" });
        let lines = [];
        if (descEl) {
          gsap.set(descEl, { autoAlpha: 1 });
          const split = SplitText.create(descEl, { type: "lines", mask: "lines" });
          activeSplits.push(split);
          lines = split.lines;
          gsap.set(lines, { yPercent: 110 });
        }
        return { step, slideEls, lines, shown: false };
      }
      function showStep(state) {
        if (state.shown) return;
        state.shown = true;
        state.step.classList.add("is-active");
        gsap.killTweensOf(state.slideEls);
        gsap.to(state.slideEls, { autoAlpha: 1, y: "0rem", duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.15, overwrite: true });
        if (state.lines.length) {
          gsap.killTweensOf(state.lines);
          gsap.to(state.lines, { yPercent: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", delay: 0.15, overwrite: true });
        }
      }
      function hideStep(state) {
        if (!state.shown) return;
        state.shown = false;
        state.step.classList.remove("is-active");
        gsap.killTweensOf(state.slideEls);
        gsap.to(state.slideEls, { autoAlpha: 0, y: "-1rem", duration: 0.4, ease: "power2.inOut", overwrite: true });
        if (state.lines.length) {
          gsap.killTweensOf(state.lines);
          gsap.to(state.lines, { yPercent: 110, duration: 0.4, stagger: 0, ease: "power2.inOut", overwrite: true });
        }
      }
      const stepStates = steps.map(prepStep);
      let activeIndex = 0;
      showStep(stepStates[0]);
      gsap.set(rowEls, { opacity: 1 });
      gsap.set(rowEls[0], { opacity: 1 });
      function setActive(index) {
        hideStep(stepStates[activeIndex]);
        showStep(stepStates[index]);
        gsap.to(rowEls[activeIndex], { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: true });
        gsap.to(rowEls[index], { opacity: 1, duration: 0.4, ease: "power2.out", overwrite: true });
        activeIndex = index;
      }
      scrub.style.height = total * vhPerStep + 100 + "vh";
      const stepTrigger = ScrollTrigger.create({
        trigger: scrub,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const idx = Math.min(total - 1, Math.floor(self.progress * total));
          if (idx !== activeIndex) setActive(idx);
        }
      });
      let rotateTween = null;
      if (visualTrack) {
        rotateTween = gsap.fromTo(
          visualTrack,
          { rotate: 0 },
          {
            rotate: 32,
            // degrees of rotation across the section - to be approved
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true
            }
          }
        );
      }
      return () => {
        stepTrigger.kill();
        if (rotateTween && rotateTween.scrollTrigger) rotateTween.scrollTrigger.kill();
        scrub.style.height = "";
        activeSplits.forEach((split) => split.revert());
        stepStates.forEach((state) => {
          gsap.set(state.slideEls, { clearProps: "all" });
        });
        gsap.set(rowEls, { clearProps: "all" });
        if (visualTrack) gsap.set(visualTrack, { clearProps: "rotate" });
        steps.forEach((step, i) => step.classList.toggle("is-active", i === 0));
      };
    });
  }
  function initScrollHighlightWords(scope = document) {
    if (!window.gsap || !window.ScrollTrigger || !window.SplitText) return;
    const DEFAULT_START = "top 90%";
    const DEFAULT_END = "top 20%";
    const DEFAULT_MUTED = "#0054522a";
    const DEFAULT_ACTIVE = "#005453";
    scope.querySelectorAll("[data-scroll-highlight]").forEach((el) => {
      if (el.__scrollHighlightInit) return;
      el.__scrollHighlightInit = true;
      const start = el.getAttribute("data-scroll-highlight-start") || DEFAULT_START;
      const end = el.getAttribute("data-scroll-highlight-end") || DEFAULT_END;
      const colorMuted = el.getAttribute("data-scroll-highlight-muted") || DEFAULT_MUTED;
      const colorActive = el.getAttribute("data-scroll-highlight-active") || DEFAULT_ACTIVE;
      const scrubAttr = el.getAttribute("data-scroll-highlight-scrub");
      const scrub = scrubAttr ? scrubAttr === "true" ? true : parseFloat(scrubAttr) : true;
      const split = SplitText.create(el, { type: "words, lines", mask: "lines" });
      const words = split.words;
      if (!words || !words.length) return;
      gsap.set(words, { color: colorMuted });
      ScrollTrigger.create({
        trigger: el,
        start,
        end,
        scrub,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const head = self.progress * words.length;
          words.forEach((word, i) => {
            const factor = gsap.utils.clamp(0, 1, head - i);
            gsap.set(word, { color: gsap.utils.interpolate(colorMuted, colorActive, factor) });
          });
        }
      });
    });
  }
  var wwdCardsObserver = null;
  var wwdCardsRefreshTimer = null;
  function initWhatWeDoCards() {
    const wrapper = document.querySelector(".wwd_wrapper.is-no-bg");
    if (!wrapper || !window.gsap || !window.ScrollTrigger) return;
    const SCALE_TO = 0.95;
    const OPACITY_TO = 0;
    const cards = Array.from(wrapper.querySelectorAll(":scope > .wwd_grid"));
    if (cards.length < 2) return;
    const layout = /* @__PURE__ */ new Map();
    const layoutTop = (el) => {
      let y = 0;
      let node = el;
      while (node) {
        y += node.offsetTop;
        node = node.offsetParent;
      }
      return y;
    };
    const measure = () => {
      wrapper.classList.add("is-measuring");
      cards.forEach((card) => {
        layout.set(card, { top: layoutTop(card), h: card.offsetHeight });
      });
      wrapper.classList.remove("is-measuring");
      cards.forEach((card) => {
        card.style.top = window.innerHeight - layout.get(card).h + "px";
      });
    };
    measure();
    wrapper.classList.add("is-stack-ready");
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      const inner = card.querySelectorAll(".wwd_grid_col1, .wwd_grid_col2");
      if (!inner.length) return;
      gsap.fromTo(
        inner,
        { opacity: 1, scale: 1 },
        {
          opacity: OPACITY_TO,
          scale: SCALE_TO,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            // reference (non-sticky) element; start/end are numeric anyway
            start: () => layout.get(next).top - window.innerHeight,
            end: () => layout.get(next).top + layout.get(next).h - window.innerHeight,
            scrub: true,
            invalidateOnRefresh: true,
            onRefreshInit: measure
          }
        }
      );
    });
    if (wwdCardsObserver) wwdCardsObserver.disconnect();
    if (wwdCardsRefreshTimer) clearTimeout(wwdCardsRefreshTimer);
    wwdCardsObserver = new ResizeObserver(() => {
      clearTimeout(wwdCardsRefreshTimer);
      wwdCardsRefreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
    });
    cards.forEach((card) => wwdCardsObserver.observe(card));
  }
  function initVideoScrub() {
    var track = document.querySelector("[home-hiw-scrub]");
    if (!track || !window.gsap || !window.ScrollTrigger) return;
    var isMobile = window.innerWidth <= 767;
    var videoSelector = isMobile ? ".section-bg_video-mobile" : ".section-bg_video";
    var hasSteps = !!track.querySelector(".partnership-process_steps");
    var video = null;
    var introVideo = null;
    Array.prototype.forEach.call(track.querySelectorAll(videoSelector), function(el) {
      if (el.classList.contains("is-hiw-intro")) {
        if (!isMobile) introVideo = el;
      } else if (!video) {
        video = el;
      }
    });
    if (!video && isMobile) {
      Array.prototype.forEach.call(track.querySelectorAll(".section-bg_video"), function(el) {
        if (!video && !el.classList.contains("is-hiw-intro")) video = el;
      });
    }
    var mask = track.querySelector("[video-diamond-mask]");
    var header = track.querySelector(".home-how-it-works_header");
    var bgGradient = track.querySelector(".hiw_bg-gradient");
    if (!video || !mask) return;
    if (!hasSteps) introVideo = null;
    var videoEls = introVideo ? [video, introVideo] : [video];
    videoEls.forEach(function(el) {
      el.muted = true;
    });
    var primed = false;
    function primeVideo() {
      if (primed) return;
      primed = true;
      videoEls.forEach(function(el) {
        var pr = el.play();
        if (pr && pr.then) {
          pr.then(function() {
            el.pause();
          }).catch(function() {
          });
        }
      });
      window.removeEventListener("touchstart", primeVideo);
      window.removeEventListener("pointerdown", primeVideo);
    }
    window.addEventListener("touchstart", primeVideo, { once: true, passive: true });
    window.addEventListener("pointerdown", primeVideo, { once: true });
    videoEls.forEach(function(el) {
      el.pause();
    });
    var VIDEO_DURATION = 15;
    var aiBadge = track.querySelector("[ai-badge]");
    var PB_VIDEO = {
      loops: 3,
      // how many times the main clip plays after the intro
      playStart: 0,
      // scroll progress 0..1 at which the video starts
      playEnd: 1,
      // progress at which the last loop ends (1 = whole scroll path used)
      // mobile only: video movement on the Y axis (desktop untouched)
      mobileY: 75,
      // start offset in VH, + is down. 0 = disabled
      mobileYDuration: 4,
      // timeline units it takes to reach zero (mask grows 0 -> 12)
      mobileYFrom: 0,
      // timeline unit it starts at
      // Delay of the WHOLE steps sequence on mobile, as a fraction of the loop
      // phase (0.333 = one full loop of waiting at 3 loops). Steps still end with
      // the last loop - the rest is squeezed into what's left.
      mobileStepsDelay: 0.15
    };
    try {
      var pbOverride = window.localStorage && window.localStorage.getItem("pbVideoStart");
      if (pbOverride) {
        pbOverride = JSON.parse(pbOverride);
        Object.keys(PB_VIDEO).forEach(function(k) {
          if (typeof pbOverride[k] === "number") PB_VIDEO[k] = pbOverride[k];
        });
        console.log("[hiw] PB_VIDEO z localStorage:", PB_VIDEO);
      }
    } catch (e) {
    }
    if (hasSteps) {
      window.pbVideo = function(opts) {
        if (!opts) {
          console.table(PB_VIDEO);
          return PB_VIDEO;
        }
        var next = Object.assign({}, PB_VIDEO, opts);
        try {
          window.localStorage.setItem("pbVideoStart", JSON.stringify(next));
        } catch (e) {
        }
        window.location.reload();
      };
      window.pbVideo.reset = function() {
        try {
          window.localStorage.removeItem("pbVideoStart");
        } catch (e) {
        }
        window.location.reload();
      };
    }
    var VIDEO_LOOPS = hasSteps ? PB_VIDEO.loops : 1;
    var MASK_AR = 810 / 851;
    var DIAMOND = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 851 810'%3E%3Cpath d='M828.374 353.008L480.123 21.5357C449.956 -7.17857 401.044 -7.17857 370.877 21.5357L22.6258 353.008C-7.54195 381.722 -7.54191 428.277 22.6258 456.992L370.877 788.464C401.044 817.179 449.956 817.179 480.123 788.464L828.374 456.992C858.542 428.278 858.542 381.722 828.374 353.008Z' fill='%23fff'/%3E%3C/svg%3E")`;
    mask.style.webkitMaskImage = mask.style.maskImage = DIAMOND;
    mask.style.webkitMaskRepeat = mask.style.maskRepeat = "no-repeat";
    var whatWeDo = track.querySelector(".home-how-it-works_what-we-do");
    var linesWhatWeDo = [];
    var linesM1 = [], linesM2 = [], linesM3 = [];
    var linesStats1 = [], linesStats2 = [];
    if (window.SplitText) {
      if (whatWeDo) {
        whatWeDo.querySelectorAll("[data-hiw-split]").forEach(function(el) {
          gsap.set(el, { autoAlpha: 1 });
          linesWhatWeDo = linesWhatWeDo.concat(SplitText.create(el, { type: "lines", mask: "lines" }).lines);
        });
      }
      if (isMobile) {
        var m1 = track.querySelector('[stats-mobile="1"]');
        var m2 = track.querySelector('[stats-mobile="2"]');
        var m3 = track.querySelector('[stats-mobile="3"]');
        if (m1) m1.querySelectorAll("[data-hiw-split]").forEach(function(el) {
          gsap.set(el, { autoAlpha: 1 });
          linesM1 = linesM1.concat(SplitText.create(el, { type: "lines", mask: "lines" }).lines);
        });
        if (m2) m2.querySelectorAll("[data-hiw-split]").forEach(function(el) {
          gsap.set(el, { autoAlpha: 1 });
          linesM2 = linesM2.concat(SplitText.create(el, { type: "lines", mask: "lines" }).lines);
        });
        if (m3) m3.querySelectorAll("[data-hiw-split]").forEach(function(el) {
          gsap.set(el, { autoAlpha: 1 });
          linesM3 = linesM3.concat(SplitText.create(el, { type: "lines", mask: "lines" }).lines);
        });
      } else {
        var statsBlocks = track.querySelectorAll(".home-how-it-works_stats");
        var stats1 = statsBlocks[0];
        var stats2 = statsBlocks[1];
        if (stats1) {
          stats1.querySelectorAll("[data-hiw-split]").forEach(function(el) {
            gsap.set(el, { autoAlpha: 1 });
            linesStats1 = linesStats1.concat(SplitText.create(el, { type: "lines", mask: "lines" }).lines);
          });
        }
        if (stats2) {
          stats2.querySelectorAll("[data-hiw-split]").forEach(function(el) {
            gsap.set(el, { autoAlpha: 1 });
            linesStats2 = linesStats2.concat(SplitText.create(el, { type: "lines", mask: "lines" }).lines);
          });
        }
      }
    }
    if (linesWhatWeDo.length) gsap.set(linesWhatWeDo, { yPercent: 110 });
    if (aiBadge) gsap.set(aiBadge, { autoAlpha: 0 });
    if (bgGradient && isMobile && !hasSteps) gsap.set(bgGradient, { opacity: 0 });
    function getMaskStartPx() {
      return Math.min(Math.max(window.innerWidth * 0.35, 400), window.innerHeight * 0.55);
    }
    function getMaskEndPx() {
      return (window.innerWidth + window.innerHeight) * 2.4;
    }
    function getMaskPeekPx() {
      return window.innerHeight * 0.35;
    }
    var maskObj = { progress: 0 };
    function updateMaskStyle() {
      var pEased = maskObj.progress;
      var size = getMaskStartPx() + (getMaskEndPx() - getMaskStartPx()) * pEased;
      var offY = getMaskPeekPx() * (1 - pEased);
      mask.style.webkitMaskSize = mask.style.maskSize = size + "px " + size * MASK_AR + "px";
      mask.style.webkitMaskPosition = mask.style.maskPosition = "center calc(70% + " + offY + "px)";
    }
    updateMaskStyle();
    var VIDEO_START_PROG = hasSteps ? PB_VIDEO.playStart : 0.04;
    var VIDEO_END_PROG = hasSteps ? PB_VIDEO.playEnd : 0.65;
    var introShown = null;
    function setIntroVisible(on) {
      if (!introVideo || introShown === on) return;
      introShown = on;
      introVideo.style.opacity = on ? "1" : "0";
      video.style.opacity = on ? "0" : "1";
    }
    function renderVideoTime(prog, atEnd) {
      if (introVideo && !isFinite(introVideo.duration)) {
        setIntroVisible(true);
        return;
      }
      var dLoop = video.duration || VIDEO_DURATION;
      var dIntro = introVideo ? introVideo.duration || 0 : 0;
      var total = dIntro + dLoop * VIDEO_LOOPS;
      var t = prog * total;
      if (atEnd) t = Math.max(0, total - 1e-3);
      if (dIntro && t < dIntro) {
        setIntroVisible(true);
        introVideo.currentTime = Math.min(t, dIntro - 0.01);
        return;
      }
      setIntroVisible(false);
      var lt = t - dIntro;
      lt = (lt % dLoop + dLoop) % dLoop;
      video.currentTime = Math.min(lt, dLoop - 0.01);
    }
    function renderSteps(prog, atEnd) {
      if (!stepsTl) return;
      var dLoop = video.duration || VIDEO_DURATION;
      var dIntro = introVideo && isFinite(introVideo.duration) ? introVideo.duration : 0;
      var total = dIntro + dLoop * VIDEO_LOOPS;
      var loopSpan = total - dIntro;
      var t = prog * total;
      if (atEnd) t = total;
      var lp = loopSpan > 0 ? (t - dIntro) / loopSpan : 0;
      var delay = isMobile ? PB_VIDEO.mobileStepsDelay : 0;
      if (delay > 0 && delay < 1) lp = (lp - delay) / (1 - delay);
      stepsTl.progress(Math.min(Math.max(lp, 0), 1));
    }
    var stepsTl = hasSteps ? buildPartnershipStepsTimeline(track, isMobile) : null;
    if (introVideo) {
      video.style.opacity = "0";
      introVideo.style.opacity = "1";
      introShown = true;
      try {
        video.currentTime = 0;
        introVideo.currentTime = 0;
      } catch (e) {
      }
    }
    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start: () => "top top-=" + window.innerHeight * 0.25,
        // +25vh pustego scrolla na starcie      end: "bottom bottom",
        end: hasSteps ? "bottom bottom" : "bottom top",
        scrub: true,
        onRefresh: updateMaskStyle,
        // size depends on viewport - recompute after resize
        onUpdate: function(self) {
          var videoProg = 0;
          if (self.progress > VIDEO_START_PROG) {
            videoProg = (self.progress - VIDEO_START_PROG) / (VIDEO_END_PROG - VIDEO_START_PROG);
            videoProg = Math.min(Math.max(videoProg, 0), 1);
          }
          renderVideoTime(videoProg, videoProg >= 1);
          renderSteps(videoProg, videoProg >= 1);
        }
      }
    });
    tl.to(maskObj, { progress: 1, duration: 12, ease: isMobile ? "power1.out" : "none", onUpdate: updateMaskStyle }, 0);
    if (hasSteps && isMobile && PB_VIDEO.mobileY) {
      gsap.set(video, { clearProps: "transform" });
      var mvW = video.offsetWidth || 1;
      var mvH = video.offsetHeight || 1;
      var mvM = new DOMMatrixReadOnly(getComputedStyle(video).transform);
      var mvBaseX = mvM.m41 / mvW * 100;
      var mvBaseY = mvM.m42 / mvH * 100;
      var mobileYPx = window.innerHeight * (PB_VIDEO.mobileY / 100);
      gsap.set(video, {
        x: 0,
        y: mobileYPx,
        xPercent: mvBaseX,
        yPercent: mvBaseY,
        transformOrigin: "50% 50%"
      });
      tl.to(video, {
        y: 0,
        duration: PB_VIDEO.mobileYDuration,
        ease: "power1.out"
      }, PB_VIDEO.mobileYFrom);
    }
    if (!isMobile && header) {
      tl.to(header, { opacity: 0, duration: 8, ease: "none" }, 0);
    }
    if (aiBadge) tl.to(aiBadge, { autoAlpha: 1, duration: 5, ease: "power1.inOut" }, 6);
    if (hasSteps) {
      if (isMobile) {
        if (header) tl.to(header, { opacity: 0, duration: 1.5, ease: "power1.out" }, 0);
        if (linesWhatWeDo.length) tl.to(linesWhatWeDo, { yPercent: 0, duration: 1.2, stagger: 0.06, ease: "power2.out" }, 1.5);
      } else {
        if (linesWhatWeDo.length) tl.to(linesWhatWeDo, { yPercent: 0, duration: 6, stagger: 0.6, ease: "expo.out" }, 12);
      }
      if (!isMobile && aiBadge) {
        tl.to(aiBadge, { autoAlpha: 0, duration: 4, ease: "power1.inOut" }, 68);
      }
      return;
    }
    if (isMobile) {
      var mStat1 = track.querySelector('[stats-mobile="1"]');
      var mStat2 = track.querySelector('[stats-mobile="2"]');
      var mStat3 = track.querySelector('[stats-mobile="3"]');
      var l1 = mStat1 ? mStat1.querySelector(".home-how-it-works_stat-line") : null;
      var l2 = mStat2 ? mStat2.querySelector(".home-how-it-works_stat-line") : null;
      var l3 = mStat3 ? mStat3.querySelector(".home-how-it-works_stat-line") : null;
      if (linesM1.length) gsap.set(linesM1, { yPercent: 110 });
      if (linesM2.length) gsap.set(linesM2, { yPercent: 110 });
      if (linesM3.length) gsap.set(linesM3, { yPercent: 110 });
      if (l1) gsap.set(l1, { scaleX: 0, transformOrigin: "left center" });
      if (l2) gsap.set(l2, { scaleX: 0, transformOrigin: "left center" });
      if (l3) gsap.set(l3, { scaleX: 0, transformOrigin: "left center" });
      if (mStat2) gsap.set(mStat2, { autoAlpha: 0 });
      if (mStat3) gsap.set(mStat3, { autoAlpha: 0 });
      tl.to(header, { opacity: 0, duration: 1.5, ease: "power1.out" }, 0).to(bgGradient, { opacity: 1, duration: 1.2, ease: "power2.out" }, 1.5).to(linesWhatWeDo, { yPercent: 0, duration: 1.2, stagger: 0.06, ease: "power2.out" }, 1.5).to(l1, { scaleX: 1, duration: 1.2, ease: "power2.out" }, 1.7).to(linesM1, { yPercent: 0, duration: 1.2, stagger: 0.06, ease: "power2.out" }, 1.8).to(mStat1, { autoAlpha: 0, duration: 0.5 }, 3.8).to(mStat2, { autoAlpha: 1, duration: 0.5 }, 3.8).to(l2, { scaleX: 1, duration: 1, ease: "power2.out" }, 4).to(linesM2, { yPercent: 0, duration: 1, stagger: 0.06, ease: "power2.out" }, 4.1).to(mStat2, { autoAlpha: 0, duration: 0.5 }, 6.2).to(mStat3, { autoAlpha: 1, duration: 0.5 }, 6.2).to(l3, { scaleX: 1, duration: 1, ease: "power2.out" }, 6.4).to(linesM3, { yPercent: 0, duration: 1, stagger: 0.06, ease: "power2.out" }, 6.5);
    } else {
      if (linesStats1.length) gsap.set(linesStats1, { yPercent: 110 });
      if (linesStats2.length) gsap.set(linesStats2, { yPercent: 110 });
      if (stats2) gsap.set(stats2, { autoAlpha: 0 });
      var lines1Separators = stats1 ? stats1.querySelectorAll(".home-how-it-works_stat-line") : [];
      var lines2Separators = stats2 ? stats2.querySelectorAll(".home-how-it-works_stat-line") : [];
      if (lines1Separators.length) gsap.set(lines1Separators, { scaleX: 0, transformOrigin: "left center" });
      if (lines2Separators.length) gsap.set(lines2Separators, { scaleX: 0, transformOrigin: "left center" });
      tl.to(linesWhatWeDo, { yPercent: 0, duration: 6, stagger: 0.6, ease: "expo.out" }, 18).to(lines1Separators, { scaleX: 1, duration: 6, stagger: 0.6, ease: "power2.out" }, 20).to(linesStats1, { yPercent: 0, duration: 6, stagger: 0.6, ease: "expo.out" }, 22).to(stats1, { autoAlpha: 0, duration: 3 }, 34).to(stats2, { autoAlpha: 1, duration: 3 }, 34).fromTo(lines2Separators, { scaleX: 0 }, { scaleX: 1, duration: 6, stagger: 0.6, ease: "power2.out" }, 36).fromTo(linesStats2, { yPercent: 110 }, { yPercent: 0, duration: 6, stagger: 0.6, ease: "expo.out" }, 38).to(stats2, { autoAlpha: 0, duration: 4 }, 68).to(linesWhatWeDo, { yPercent: -110, duration: 4 }, 68);
      if (aiBadge) tl.to(aiBadge, { autoAlpha: 0, duration: 4, ease: "power1.inOut" }, 68);
    }
  }
  function buildPartnershipStepsTimeline(track, isMobile) {
    var wrap = track.querySelector(".partnership-process_steps");
    if (!wrap || !window.gsap) return null;
    var steps = [].slice.call(wrap.querySelectorAll(".partnership-process_step"));
    if (!steps.length) return null;
    var SPAN = 1;
    var TOTAL = steps.length * SPAN;
    var REVEAL = 0.3;
    var OPEN = 0.22;
    var STAGGER = isMobile ? 0.03 : 0.06;
    var EASE = isMobile ? "power2.out" : "expo.out";
    var eyebrowRoot = track.querySelector(".hwk_stats-title");
    var eyebrowDot = eyebrowRoot ? eyebrowRoot.querySelector(".eyebrow_dot") : null;
    var eyebrowTextEl = eyebrowRoot ? eyebrowRoot.querySelector(".eyebrow_text") : null;
    var eyebrowDivider = eyebrowRoot ? eyebrowRoot.querySelector(".partnership-process_sub-bracket, .partnership-process_step-divider, .hwk_stats-divider") : null;
    var eyebrowLines = [];
    var data = [];
    steps.forEach(function(step) {
      data.push({
        step,
        divider: step.querySelector(".partnership-process_step-divider"),
        head: step.querySelector(".partnership-process_step-head"),
        badge: step.querySelector(".partnership-process_number"),
        list: step.querySelector(".partnership-process_sub-list"),
        brackets: step.querySelectorAll(".partnership-process_sub-bracket"),
        titleLines: [],
        subLines: []
      });
    });
    if (window.SplitText) {
      if (eyebrowTextEl) {
        gsap.set(eyebrowTextEl, { autoAlpha: 1 });
        eyebrowLines = SplitText.create(eyebrowTextEl, { type: "lines", mask: "lines" }).lines;
      }
      data.forEach(function(d) {
        var title = d.step.querySelector(".partnership-process_step-title");
        if (title) {
          gsap.set(title, { autoAlpha: 1 });
          d.titleLines = SplitText.create(title, { type: "lines", mask: "lines" }).lines;
        }
        d.step.querySelectorAll(".partnership-process_sub-index, .partnership-process_sub-text").forEach(function(el) {
          gsap.set(el, { autoAlpha: 1 });
          d.subLines = d.subLines.concat(SplitText.create(el, { type: "lines", mask: "lines" }).lines);
        });
      });
    }
    if (eyebrowRoot) gsap.set(eyebrowRoot, { autoAlpha: 1 });
    if (eyebrowDivider) gsap.set(eyebrowDivider, { scaleX: 0, transformOrigin: "left center" });
    if (eyebrowDot) gsap.set(eyebrowDot, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" });
    if (eyebrowLines.length) gsap.set(eyebrowLines, { yPercent: 110 });
    var allDividers = [], allBadges = [], allTitleLines = [];
    data.forEach(function(d) {
      if (d.divider) {
        gsap.set(d.divider, { scaleX: 0, transformOrigin: "left center" });
        allDividers.push(d.divider);
      }
      if (d.brackets.length) gsap.set(d.brackets, { scaleX: 0, transformOrigin: "left center" });
      if (d.badge) {
        gsap.set(d.badge, { autoAlpha: 0 });
        allBadges.push(d.badge);
      }
      if (d.titleLines.length) {
        gsap.set(d.titleLines, { yPercent: 110 });
        allTitleLines = allTitleLines.concat(d.titleLines);
      }
      if (d.subLines.length) gsap.set(d.subLines, { yPercent: 110 });
      if (d.head) gsap.set(d.head, { opacity: 0.3 });
      if (d.list) gsap.set(d.list, { height: 0, autoAlpha: 0, overflow: "hidden" });
      d.step.classList.remove("is-active");
    });
    gsap.set(wrap, { autoAlpha: 1 });
    var stl = gsap.timeline({ paused: true });
    stl.to({}, { duration: TOTAL }, 0);
    var EYE_SHIFT = eyebrowRoot ? STAGGER : 0;
    if (eyebrowDivider) stl.to(eyebrowDivider, { scaleX: 1, duration: REVEAL, ease: "power2.out" }, 0);
    if (eyebrowDot) stl.to(eyebrowDot, { autoAlpha: 1, scale: 1, duration: REVEAL * 0.6, ease: "back.out(2)" }, REVEAL * 0.2);
    if (eyebrowLines.length) stl.to(eyebrowLines, { yPercent: 0, duration: REVEAL, stagger: STAGGER, ease: EASE }, REVEAL * 0.2);
    if (allDividers.length) stl.to(allDividers, { scaleX: 1, duration: REVEAL, stagger: STAGGER, ease: "power2.out" }, EYE_SHIFT);
    if (allBadges.length) stl.to(allBadges, { autoAlpha: 1, duration: REVEAL * 0.6, stagger: STAGGER, ease: "power1.out" }, EYE_SHIFT + REVEAL * 0.2);
    if (allTitleLines.length) stl.to(allTitleLines, { yPercent: 0, duration: REVEAL, stagger: STAGGER, ease: EASE }, EYE_SHIFT + REVEAL * 0.2);
    data.forEach(function(d, i) {
      var at = i === 0 ? EYE_SHIFT + REVEAL * 0.5 : i * SPAN;
      if (d.head) stl.to(d.head, { opacity: 1, duration: OPEN, ease: "power2.out" }, at);
      if (d.list) stl.to(d.list, { height: "auto", autoAlpha: 1, duration: OPEN, ease: "power2.inOut" }, at);
      if (d.brackets.length) stl.to(d.brackets, { scaleX: 1, duration: OPEN, stagger: STAGGER, ease: "power2.out" }, at + OPEN * 0.4);
      if (d.subLines.length) stl.to(d.subLines, { yPercent: 0, duration: REVEAL, stagger: STAGGER, ease: EASE }, at + OPEN * 0.6);
      if (i < data.length - 1) {
        var off = (i + 1) * SPAN;
        if (d.subLines.length) stl.to(d.subLines, { yPercent: -110, duration: OPEN, stagger: STAGGER * 0.5, ease: "power2.in" }, off - OPEN);
        if (d.list) stl.to(d.list, { height: 0, autoAlpha: 0, duration: OPEN, ease: "power2.inOut" }, off - OPEN * 0.5);
        if (d.head) stl.to(d.head, { opacity: 0.3, duration: OPEN, ease: "power2.out" }, off - OPEN * 0.5);
        if (d.brackets.length) stl.to(d.brackets, { scaleX: 0, duration: OPEN, ease: "power2.in" }, off - OPEN * 0.5);
      }
    });
    stl.progress(0);
    return stl;
  }
  function initCustomOverlayReveal() {
    const triggers = document.querySelectorAll("[data-overlay-trigger]");
    if (!triggers.length || !window.gsap || !window.ScrollTrigger) return;
    triggers.forEach((trigger) => {
      const targetSelector = trigger.getAttribute("data-overlay-target");
      if (!targetSelector) return;
      const overlay = document.querySelector(targetSelector);
      if (!overlay) return;
      gsap.set(overlay, { opacity: 0 });
      gsap.to(overlay, {
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "top top",
          scrub: true
        }
      });
    });
  }
  var getInTouchModalCleanup = null;
  function initGetInTouchModal() {
    const modal = document.querySelector(".modal_component");
    if (!modal || !window.gsap) return;
    modal.setAttribute("data-lenis-prevent", "");
    if (getInTouchModalCleanup) getInTouchModalCleanup();
    const panel = modal.querySelector(".modal_panel") || modal;
    const overlay = modal.querySelector(".modal_overlay");
    const unicorn = modal.querySelector(".modal_unicorn");
    const right = modal.querySelector(".modal_right");
    const OPEN = "is-open";
    const RIGHT_FROM = "25vh";
    const RIGHT_LAG = 0.25;
    if (window.CustomEase) CustomEase.create("parallax", "0.7, 0.05, 0.13, 1");
    const EASE = window.CustomEase ? "parallax" : "power3.inOut";
    const DUR = 1.2;
    const reduced = typeof reducedMotion !== "undefined" && reducedMotion;
    let tl = null;
    let unicornTween = null;
    let unicornReady = null;
    let openSeq = 0;
    function sceneIsLive() {
      const cv = unicorn && unicorn.querySelector("canvas");
      return !!cv && cv.width > 1 && cv.height > 1;
    }
    function ensureModalUnicorn() {
      if (unicornReady) return unicornReady;
      const host = modal.querySelector("[data-us-project],[data-us-project-src]");
      if (!host || typeof UnicornStudio === "undefined") return Promise.resolve();
      const r = host.getBoundingClientRect();
      if (!r.width || !r.height) return Promise.resolve();
      if (sceneIsLive()) return unicornReady = Promise.resolve();
      const cv = host.querySelector("canvas");
      if (cv) cv.remove();
      host.removeAttribute("data-us-initialized");
      unicornReady = UnicornStudio.init().then(waitForPaint).catch(console.error);
      return unicornReady;
    }
    function waitForPaint() {
      return new Promise((done) => {
        const t0 = performance.now();
        (function tick() {
          if (sceneIsLive() || performance.now() - t0 > 2e3)
            return requestAnimationFrame(() => requestAnimationFrame(done));
          requestAnimationFrame(tick);
        })();
      });
    }
    function revealUnicorn() {
      if (!unicorn) return;
      const seq = openSeq;
      if (unicornReady && sceneIsLive()) return void animateUnicorn();
      if (unicornTween) unicornTween.kill();
      gsap.set(unicorn, { scale: 1.1 });
      requestAnimationFrame(() => requestAnimationFrame(() => {
        ensureModalUnicorn().then(() => {
          if (seq === openSeq && modal.classList.contains(OPEN)) animateUnicorn();
        });
      }));
    }
    function animateUnicorn() {
      if (unicornTween) unicornTween.kill();
      unicornTween = gsap.fromTo(
        unicorn,
        { opacity: 0, scale: 1.1 },
        { opacity: 1, scale: 1, duration: 1, ease: EASE }
      );
    }
    function openModal() {
      if (modal.classList.contains(OPEN)) return;
      openSeq++;
      modal.classList.add(OPEN);
      if (window.lenis) lenis.stop();
      if (tl) tl.kill();
      if (reduced) {
        gsap.set(panel, { y: "0vh" });
        if (overlay) gsap.set(overlay, { autoAlpha: 0.8 });
        if (right) gsap.set(right, { y: "0vh" });
        revealUnicorn();
        return;
      }
      tl = gsap.timeline();
      if (overlay) tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 0.8, duration: DUR, ease: EASE }, 0);
      tl.fromTo(panel, { y: "100vh" }, { y: "0vh", duration: DUR, ease: EASE }, 0);
      if (right) tl.fromTo(right, { y: RIGHT_FROM }, { y: "0vh", duration: DUR + RIGHT_LAG, ease: EASE }, 0);
      revealUnicorn();
    }
    function closeModal() {
      if (!modal.classList.contains(OPEN)) return;
      openSeq++;
      if (window.lenis && !document.querySelector(".nav_component.is-menu-open")) lenis.start();
      const settle = () => {
        modal.classList.remove(OPEN);
        gsap.set([panel, overlay, right].filter(Boolean), { clearProps: "all" });
      };
      if (tl) tl.kill();
      if (reduced) return void settle();
      tl = gsap.timeline({ onComplete: settle });
      tl.to(panel, { y: "100vh", duration: DUR, ease: EASE }, 0);
      if (overlay) tl.to(overlay, { autoAlpha: 0, duration: DUR, ease: EASE }, 0);
      tl.to(right, { y: RIGHT_FROM, duration: DUR, ease: EASE }, 0);
    }
    function onDocClick(e) {
      if (e.target.closest("[modal-get-in-touch-open]")) {
        e.preventDefault();
        openModal();
        return;
      }
      if (e.target.closest(".modal_close-btn")) {
        e.preventDefault();
        closeModal();
        return;
      }
      if (overlay && e.target === overlay) closeModal();
    }
    function onKey(e) {
      if ((e.key === "Escape" || e.key === "Esc") && modal.classList.contains(OPEN)) closeModal();
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    getInTouchModalCleanup = function() {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
      if (unicornTween) unicornTween.kill();
      if (tl) tl.kill();
    };
  }
  function initInsightsLoadMore() {
    const cardsPerLoad = 5;
    const hasGsap = typeof window.gsap !== "undefined";
    const hideElement = (element) => {
      element.style.setProperty("display", "none", "important");
    };
    const showElement = (element) => {
      element.style.removeProperty("display");
      element.removeAttribute("hidden");
    };
    const components = document.querySelectorAll(".ins-latest_tab[data-load-more]");
    components.forEach((component) => {
      if (component.dataset.loadMoreInitialized === "true") return;
      const grid = component.querySelector(".ins-latest_cards_wrapper .ins-latest_cards.grid-autofill");
      const moreWrapper = component.querySelector(".ins-more_wrapper");
      const button = moreWrapper?.querySelector("[data-load-button]");
      if (!grid || !moreWrapper || !button) {
        console.warn("Load more: nieprawid\u0142owa struktura komponentu", { component, grid, moreWrapper, button });
        return;
      }
      const cards = [...grid.querySelectorAll(".ins-latest_card")].filter((card) => {
        return card.closest(".ins-latest_cards.grid-autofill") === grid;
      });
      component.dataset.loadMoreInitialized = "true";
      grid.appendChild(button);
      button.style.visibility = "";
      button.style.opacity = "";
      button.style.transform = "";
      showElement(button);
      let visibleCards = cardsPerLoad;
      let isAnimating = false;
      cards.forEach((card, index) => {
        if (index < visibleCards) showElement(card);
        else hideElement(card);
      });
      if (cards.length <= cardsPerLoad) {
        button.setAttribute("aria-hidden", "true");
        hideElement(button);
        return;
      }
      const disableButton = () => {
        button.setAttribute("aria-disabled", "true");
        button.style.pointerEvents = "none";
      };
      const enableButton = () => {
        button.removeAttribute("aria-disabled");
        button.style.pointerEvents = "";
      };
      const hideButton = (permanently) => {
        if (hasGsap) gsap.killTweensOf(button);
        if (permanently) button.setAttribute("aria-hidden", "true");
        if (!hasGsap || reducedMotion) {
          if (permanently) hideElement(button);
          else button.style.visibility = "hidden";
          return;
        }
        if (!permanently) {
          gsap.to(button, { autoAlpha: 0, y: 8, scale: 0.98, duration: 0.2, ease: "power2.out" });
          return;
        }
        gsap.timeline({ onComplete: () => hideElement(button) }).to(button, { autoAlpha: 0, y: 8, scale: 0.98, duration: 0.2, ease: "power2.out" }).to(button, {
          height: 0,
          marginTop: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          duration: 0.3,
          ease: "power2.inOut",
          overflow: "hidden"
        }, 0.05);
      };
      const showButton = () => {
        showElement(button);
        button.style.visibility = "";
        if (!hasGsap || reducedMotion) {
          enableButton();
          isAnimating = false;
          return;
        }
        gsap.fromTo(
          button,
          { autoAlpha: 0, y: 10, scale: 0.98 },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform",
            onComplete: () => {
              enableButton();
              isAnimating = false;
            }
          }
        );
      };
      button.addEventListener("click", (event) => {
        event.preventDefault();
        if (isAnimating) return;
        const nextVisibleCount = Math.min(visibleCards + cardsPerLoad, cards.length);
        const newCards = cards.slice(visibleCards, nextVisibleCount);
        const isLastBatch = nextVisibleCount >= cards.length;
        isAnimating = true;
        visibleCards = nextVisibleCount;
        disableButton();
        hideButton(isLastBatch);
        newCards.forEach(showElement);
        const completeCardsAnimation = () => {
          if (isLastBatch) {
            isAnimating = false;
            return;
          }
          showButton();
        };
        if (!hasGsap || reducedMotion) {
          completeCardsAnimation();
          return;
        }
        gsap.fromTo(
          newCards,
          { autoAlpha: 0, y: 32, scale: 0.975, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform,filter",
            onComplete: completeCardsAnimation
          }
        );
      });
    });
  }
  function initInsightsTabs() {
    const hasGsap = typeof window.gsap !== "undefined";
    const tabNavigations = document.querySelectorAll(".ins-latest_tabs");
    tabNavigations.forEach((tabNavigation) => {
      if (tabNavigation.dataset.intabInitialized === "true") return;
      const group = tabNavigation.parentElement;
      const buttons = [...tabNavigation.querySelectorAll("[data-intab]")];
      const panes = [...group.children].filter((el) => el.matches("[data-intab-pane]"));
      if (!buttons.length || !panes.length) {
        console.warn("Tabs: nie znaleziono przycisk\xF3w lub paneli", { tabNavigation, buttons, panes });
        return;
      }
      const findPane = (value) => panes.find((pane) => pane.dataset.intabPane === value);
      const validButtons = buttons.filter((button) => Boolean(findPane(button.dataset.intab)));
      if (!validButtons.length) {
        console.warn("Tabs: warto\u015Bci data-intab nie pasuj\u0105 do data-intab-pane", { buttons, panes });
        return;
      }
      tabNavigation.dataset.intabInitialized = "true";
      tabNavigation.setAttribute("role", "tablist");
      let activeValue = null;
      buttons.forEach((b) => b.setAttribute("role", "tab"));
      panes.forEach((p) => p.setAttribute("role", "tabpanel"));
      const activateTab = (value, shouldAnimate = true) => {
        const targetPane = findPane(value);
        if (!targetPane || activeValue === value) return;
        activeValue = value;
        buttons.forEach((button) => {
          const isActive = button.dataset.intab === value;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-selected", String(isActive));
          button.tabIndex = isActive ? 0 : -1;
        });
        panes.forEach((pane) => {
          const isActive = pane === targetPane;
          if (hasGsap) gsap.killTweensOf(pane);
          if (isActive) {
            pane.style.setProperty("display", "block", "important");
            pane.setAttribute("aria-hidden", "false");
          } else {
            if (hasGsap) gsap.set(pane, { clearProps: "opacity,visibility,transform,filter" });
            pane.style.setProperty("display", "none", "important");
            pane.setAttribute("aria-hidden", "true");
          }
        });
        if (!hasGsap || reducedMotion || !shouldAnimate) {
          if (hasGsap) gsap.set(targetPane, { clearProps: "opacity,visibility,transform,filter" });
          return;
        }
        gsap.fromTo(
          targetPane,
          { autoAlpha: 0, y: 24, scale: 0.985, filter: "blur(8px)" },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.65,
            ease: "power3.out",
            clearProps: "opacity,visibility,transform,filter"
          }
        );
      };
      validButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();
          activateTab(button.dataset.intab);
        });
      });
      const initialButton = validButtons.find((b) => b.classList.contains("is-active")) || validButtons.find((b) => b.dataset.intab === "all") || validButtons[0];
      activateTab(initialButton.dataset.intab, false);
    });
  }
  var swiperCleanupFns = [];
  function initSwiperCarousels() {
    swiperCleanupFns.forEach((cleanup) => cleanup());
    swiperCleanupFns = [];
    if (typeof Swiper === "undefined") return;
    document.querySelectorAll(".swiper_wrap").forEach((component) => {
      const swiperElement = component.querySelector(".swiper_component");
      const prevButton = component.querySelector("[data-swiper-prev]");
      const nextButton = component.querySelector("[data-swiper-next]");
      const paginationElement = component.querySelector(".swiper_pagination");
      if (!swiperElement) return;
      const attributeNames = ["data-swiper-slides-mobile", "data-swiper-slides-landscape", "data-swiper-slides-tablet", "data-swiper-slides-desktop", "data-swiper-gap", "data-swiper-speed", "data-swiper-loop", "data-swiper-rewind", "data-swiper-drag", "data-swiper-keyboard", "data-swiper-centered", "data-swiper-autoplay", "data-swiper-autoplay-delay", "data-swiper-autoplay-disable-on-interaction", "data-swiper-autoplay-pause-on-mouse-enter", "data-swiper-autoplay-reverse", "data-swiper-easing"];
      const getNumber = (value, fallback) => {
        const number = Number.parseFloat(value);
        return Number.isFinite(number) ? number : fallback;
      };
      const getBoolean = (value, fallback) => {
        if (value === void 0) return fallback;
        return value === "true";
      };
      const resolveCssLength = (value, element, fallback) => {
        const rawValue = String(value || fallback).trim();
        const numberValue = Number.parseFloat(rawValue);
        if (Number.isFinite(numberValue) && rawValue === String(numberValue)) return numberValue;
        if (rawValue.startsWith("var(")) {
          const propertyName = rawValue.slice(4, -1).split(",")[0].trim();
          const propertyValue = getComputedStyle(element).getPropertyValue(propertyName).trim();
          return resolveCssLength(propertyValue, element, fallback);
        }
        if (rawValue.endsWith("rem")) {
          return numberValue * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
        }
        if (rawValue.endsWith("em")) {
          return numberValue * Number.parseFloat(getComputedStyle(element).fontSize);
        }
        return Number.isFinite(numberValue) ? numberValue : Number.parseFloat(fallback);
      };
      const readSettings = () => {
        const slidesMobile = getNumber(component.dataset.swiperSlidesMobile, 1);
        const slidesLandscape = getNumber(component.dataset.swiperSlidesLandscape, slidesMobile);
        const slidesTablet = getNumber(component.dataset.swiperSlidesTablet, slidesLandscape);
        const slidesDesktop = getNumber(component.dataset.swiperSlidesDesktop, slidesTablet);
        const shouldLoop = getBoolean(component.dataset.swiperLoop, false);
        return {
          slidesMobile,
          slidesLandscape,
          slidesTablet,
          slidesDesktop,
          gap: resolveCssLength(component.dataset.swiperGap, component, "0"),
          speed: getNumber(component.dataset.swiperSpeed, 600),
          shouldLoop,
          shouldRewind: shouldLoop ? false : getBoolean(component.dataset.swiperRewind, false),
          shouldDrag: getBoolean(component.dataset.swiperDrag, true),
          shouldUseKeyboard: getBoolean(component.dataset.swiperKeyboard, true),
          shouldCenter: getBoolean(component.dataset.swiperCentered, false),
          shouldAutoplay: getBoolean(component.dataset.swiperAutoplay, false),
          autoplayDelay: getNumber(component.dataset.swiperAutoplayDelay, 3e3),
          autoplayDisableOnInteraction: getBoolean(component.dataset.swiperAutoplayDisableOnInteraction, false),
          autoplayPauseOnMouseEnter: getBoolean(component.dataset.swiperAutoplayPauseOnMouseEnter, true),
          autoplayReverse: getBoolean(component.dataset.swiperAutoplayReverse, false),
          easing: component.dataset.swiperEasing || "cubic-bezier(0.22, 1, 0.36, 1)"
        };
      };
      const getCurrentSlidesPerView = (settings) => {
        if (window.innerWidth >= 992) return settings.slidesDesktop;
        if (window.innerWidth >= 768) return settings.slidesTablet;
        if (window.innerWidth >= 480) return settings.slidesLandscape;
        return settings.slidesMobile;
      };
      const applyEasing = (swiperInstance, settings) => {
        component.style.setProperty("--swiper-easing", settings.easing);
        const wrapper = swiperInstance && swiperInstance.wrapperEl ? swiperInstance.wrapperEl : component.querySelector(".swiper_list");
        if (wrapper) wrapper.style.transitionTimingFunction = settings.easing;
      };
      const prepareManualLoop = (settings) => {
        const list = component.querySelector(".swiper_list");
        if (!list) return { enabled: false, originalCount: 0 };
        list.querySelectorAll("[data-swiper-loop-fill='true']").forEach((slide) => slide.remove());
        const originalSlides = Array.from(list.querySelectorAll(".swiper_item"));
        const shouldUseManualLoop = settings.shouldLoop && settings.shouldCenter && originalSlides.length > 1;
        if (!shouldUseManualLoop) {
          return {
            enabled: false,
            originalCount: originalSlides.length
          };
        }
        const beforeFragment = document.createDocumentFragment();
        const afterFragment = document.createDocumentFragment();
        originalSlides.forEach((slide) => {
          const beforeClone = slide.cloneNode(true);
          const afterClone = slide.cloneNode(true);
          beforeClone.setAttribute("data-swiper-loop-fill", "true");
          afterClone.setAttribute("data-swiper-loop-fill", "true");
          beforeFragment.appendChild(beforeClone);
          afterFragment.appendChild(afterClone);
        });
        list.insertBefore(beforeFragment, originalSlides[0]);
        list.appendChild(afterFragment);
        return {
          enabled: true,
          originalCount: originalSlides.length,
          startIndex: originalSlides.length + Math.floor(getCurrentSlidesPerView(settings) / 2)
        };
      };
      const normalizeManualLoop = (swiperInstance, manualLoop) => {
        if (!manualLoop.enabled || !swiperInstance || swiperInstance.destroyed) return;
        const originalCount = manualLoop.originalCount;
        const activeIndex = swiperInstance.activeIndex;
        if (activeIndex < originalCount) {
          swiperInstance.slideTo(activeIndex + originalCount, 0, false);
        } else if (activeIndex >= originalCount * 2) {
          swiperInstance.slideTo(activeIndex - originalCount, 0, false);
        }
      };
      const getPaginationIndex = (swiperInstance, manualLoop) => {
        if (!swiperInstance || swiperInstance.destroyed || !manualLoop.originalCount) return 0;
        const sourceIndex = manualLoop.enabled ? swiperInstance.activeIndex - manualLoop.originalCount : typeof swiperInstance.realIndex === "number" ? swiperInstance.realIndex : swiperInstance.activeIndex;
        return (sourceIndex % manualLoop.originalCount + manualLoop.originalCount) % manualLoop.originalCount;
      };
      const setPaginationActiveIndex = (activeIndex) => {
        if (!paginationElement) return;
        const dots = Array.from(paginationElement.querySelectorAll(".swiper_pagination_dot"));
        dots.forEach((dot, index) => {
          const isActive = index === activeIndex;
          dot.classList.toggle("is-active", isActive);
          dot.setAttribute("aria-current", isActive ? "true" : "false");
          dot.setAttribute("aria-label", isActive ? `Current slide ${index + 1}` : `Go to slide ${index + 1}`);
        });
      };
      const updatePagination = (swiperInstance, manualLoop) => {
        if (!paginationElement || !manualLoop.originalCount) return;
        setPaginationActiveIndex(getPaginationIndex(swiperInstance, manualLoop));
      };
      const updateManualLoopNavigation = (swiperInstance, manualLoop) => {
        if (!manualLoop.enabled || !swiperInstance || swiperInstance.destroyed) return;
        [prevButton, nextButton].forEach((button) => {
          if (!button) return;
          button.classList.remove("is-disabled", "is-locked");
          button.removeAttribute("disabled");
          button.setAttribute("aria-disabled", "false");
        });
      };
      const buildPagination = (manualLoop) => {
        if (!paginationElement || !manualLoop.originalCount) return;
        paginationElement.replaceChildren();
        for (let index = 0; index < manualLoop.originalCount; index += 1) {
          const dot = document.createElement("button");
          dot.className = "swiper_pagination_dot";
          dot.type = "button";
          dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
          dot.addEventListener("click", () => {
            if (!swiper || swiper.destroyed) return;
            setPaginationActiveIndex(index);
            if (manualLoop.enabled) {
              swiper.slideTo(manualLoop.originalCount + index);
            } else if (swiper.params.loop && typeof swiper.slideToLoop === "function") {
              swiper.slideToLoop(index);
            } else {
              swiper.slideTo(index);
            }
          });
          paginationElement.appendChild(dot);
        }
      };
      const createSwiper = () => {
        const settings = readSettings();
        applyEasing(null, settings);
        const maxSlidesPerView = Math.max(settings.slidesMobile, settings.slidesLandscape, settings.slidesTablet, settings.slidesDesktop);
        const manualLoop = prepareManualLoop(settings);
        const loopAdditionalSlides = settings.shouldLoop && !manualLoop.enabled ? Math.ceil(maxSlidesPerView) : 0;
        buildPagination(manualLoop);
        return new Swiper(swiperElement, {
          initialSlide: manualLoop.enabled ? manualLoop.startIndex : 0,
          slidesPerView: settings.slidesMobile,
          centeredSlides: settings.shouldCenter,
          slidesPerGroup: 1,
          spaceBetween: settings.gap,
          speed: settings.speed,
          loop: settings.shouldLoop && !manualLoop.enabled,
          loopAdditionalSlides,
          rewind: manualLoop.enabled ? false : settings.shouldRewind,
          watchOverflow: !manualLoop.enabled,
          allowTouchMove: settings.shouldDrag,
          simulateTouch: settings.shouldDrag,
          grabCursor: settings.shouldDrag,
          autoplay: settings.shouldAutoplay ? {
            delay: settings.autoplayDelay,
            disableOnInteraction: settings.autoplayDisableOnInteraction,
            pauseOnMouseEnter: settings.autoplayPauseOnMouseEnter,
            reverseDirection: settings.autoplayReverse,
            stopOnLastSlide: false,
            waitForTransition: true
          } : false,
          keyboard: settings.shouldUseKeyboard ? {
            enabled: true,
            onlyInViewport: true
          } : false,
          navigation: nextButton && prevButton ? {
            nextEl: nextButton,
            prevEl: prevButton,
            disabledClass: "is-disabled",
            lockClass: "is-locked"
          } : false,
          breakpoints: {
            480: {
              slidesPerView: settings.slidesLandscape,
              slidesPerGroup: 1,
              spaceBetween: settings.gap
            },
            768: {
              slidesPerView: settings.slidesTablet,
              slidesPerGroup: 1,
              spaceBetween: settings.gap
            },
            992: {
              slidesPerView: settings.slidesDesktop,
              slidesPerGroup: 1,
              spaceBetween: settings.gap
            }
          },
          on: {
            init: function(swiperInstance) {
              const instance = swiperInstance || this;
              applyEasing(instance, settings);
              normalizeManualLoop(instance, manualLoop);
              updateManualLoopNavigation(instance, manualLoop);
              updatePagination(instance, manualLoop);
            },
            slideChange: function(swiperInstance) {
              updatePagination(swiperInstance || this, manualLoop);
            },
            slideChangeTransitionStart: function(swiperInstance) {
              updatePagination(swiperInstance || this, manualLoop);
            },
            beforeTransitionStart: function(swiperInstance) {
              applyEasing(swiperInstance || this, settings);
            },
            setTransition: function(swiperInstance) {
              applyEasing(swiperInstance || this, settings);
            },
            touchStart: function() {
              swiperElement.classList.add("is-dragging");
            },
            touchEnd: function() {
              swiperElement.classList.remove("is-dragging");
            },
            slideChangeTransitionEnd: function(swiperInstance) {
              const instance = swiperInstance || this;
              normalizeManualLoop(instance, manualLoop);
              updateManualLoopNavigation(instance, manualLoop);
            },
            transitionEnd: function(swiperInstance) {
              const instance = swiperInstance || this;
              normalizeManualLoop(instance, manualLoop);
              updateManualLoopNavigation(instance, manualLoop);
            }
          }
        });
      };
      let swiper = createSwiper();
      let refreshFrame;
      const refreshSwiper = () => {
        if (refreshFrame) cancelAnimationFrame(refreshFrame);
        refreshFrame = requestAnimationFrame(() => {
          if (swiper && !swiper.destroyed) swiper.destroy(true, true);
          swiper = createSwiper();
        });
      };
      const updateGap = () => {
        if (!swiper || swiper.destroyed) return;
        const settings = readSettings();
        swiper.params.spaceBetween = settings.gap;
        Object.keys(swiper.params.breakpoints || {}).forEach((key) => {
          swiper.params.breakpoints[key].spaceBetween = settings.gap;
        });
        applyEasing(swiper, settings);
        swiper.update();
      };
      const observer = new MutationObserver((mutations) => {
        const shouldRefresh = mutations.some((mutation) => attributeNames.includes(mutation.attributeName));
        if (shouldRefresh) refreshSwiper();
      });
      observer.observe(component, {
        attributes: true,
        attributeFilter: attributeNames
      });
      window.addEventListener("resize", updateGap);
      swiperCleanupFns.push(() => {
        if (refreshFrame) cancelAnimationFrame(refreshFrame);
        observer.disconnect();
        window.removeEventListener("resize", updateGap);
        if (swiper && !swiper.destroyed) swiper.destroy(true, true);
      });
    });
  }
  function initHiwMaskSlideIn() {
    var track = document.querySelector("[home-hiw-scrub]");
    if (!track || !window.gsap || !window.ScrollTrigger) return;
    if (window.innerWidth <= 767) return;
    var mask = track.querySelector("[video-diamond-mask]");
    if (!mask) return;
    gsap.fromTo(
      mask,
      { yPercent: 50 },
      {
        yPercent: 0,
        ease: "none",
        scrollTrigger: {
          trigger: track,
          start: "top bottom",
          end: () => "top top-=" + window.innerHeight * 0.25,
          scrub: true
        }
      }
    );
  }
  var SPACE_BASE = "https://polpharma.fra1.cdn.digitaloceanspaces.com/";
  var spaceScripts = {};
  function loadSpaceScript(file, globalName) {
    if (window[globalName]) return Promise.resolve();
    if (!spaceScripts[file]) {
      spaceScripts[file] = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = SPACE_BASE + file;
        script.onload = resolve;
        script.onerror = () => {
          delete spaceScripts[file];
          reject(new Error(file + " failed to load"));
        };
        document.head.appendChild(script);
      });
    }
    return spaceScripts[file];
  }
  var globeApi = null;
  var globeAbort = null;
  function initPbGlobe() {
    const section = nextPage.querySelector("#pb-globe");
    if (!section) return;
    destroyPbGlobe();
    const abort = new AbortController();
    globeAbort = abort;
    loadSpaceScript("globe-v1.js", "GlobeApp").then(() => window.GlobeApp.initGlobe({ host: section, binUrl: SPACE_BASE + "globe-v1.bin", signal: abort.signal })).then((api) => {
      if (abort.signal.aborted) {
        api.destroy();
        return;
      }
      globeApi = api;
      if (api.stickyBroken) console.warn("[globe] sticky broken by:", api.stickyBroken);
    }).catch((e) => {
      if (e.name !== "AbortError") console.warn("[globe]", e);
    });
  }
  function destroyPbGlobe() {
    if (globeAbort) {
      globeAbort.abort();
      globeAbort = null;
    }
    if (globeApi) {
      globeApi.destroy();
      globeApi = null;
    }
  }
  var GLASS_FILE = "glass-9081816b.js";
  var GLASS_PARAMS = {
    // glass
    ior: 1.45,
    refraction: 70,
    dispersion: 0.06,
    fresnel: 0.35,
    reflections: 1.1,
    tint: "#eafff9",
    // shape thickness
    depth: 8,
    circleBevel: 26,
    circleBevelDepth: 18,
    squareBevel: 5.7,
    // keep < 5.8 (wall next to the hole)
    squareBevelDepth: 11,
    // overlap / layering
    layerGap: 14,
    maxBend: 55,
    shadow: 0,
    shadowBlur: 16,
    shadowOffset: 14
  };
  var GLASS_TILT = 0.28;
  var GLASS_STORE = "pb-glass";
  var GLASS_STORE_DAYS = 30;
  var glassLive = /* @__PURE__ */ new Map();
  var glassState = "idle";
  var glassReady = null;
  var glassTicker = false;
  function glassMemo(value) {
    try {
      if (value) {
        localStorage.setItem(GLASS_STORE, JSON.stringify({ ...value, t: Date.now() }));
        return null;
      }
      const saved = JSON.parse(localStorage.getItem(GLASS_STORE) || "null");
      return saved && Date.now() - saved.t < GLASS_STORE_DAYS * 864e5 ? saved : null;
    } catch (e) {
      return null;
    }
  }
  function glassSkipReason() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return "touch device";
    const conn = navigator.connection;
    if (conn && conn.saveData) return "save-data";
    if (navigator.deviceMemory && navigator.deviceMemory <= 4) return "low memory";
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) return "few CPU cores";
    if (typeof WebGL2RenderingContext === "undefined") return "no WebGL2";
    const saved = glassMemo();
    if (saved && !saved.ok) return "remembered: " + saved.reason;
    return null;
  }
  function glassParams(host) {
    if (!host.hasAttribute("pb-glass-tilt")) return GLASS_PARAMS;
    const tilt = parseFloat(host.getAttribute("pb-glass-tilt"));
    return { ...GLASS_PARAMS, tilt: isNaN(tilt) ? GLASS_TILT : tilt };
  }
  function glassOff(reason, remember, gentle) {
    if (glassState === "off") return;
    glassState = "off";
    console.info("[glass] CSS shapes:", reason);
    if (remember) glassMemo({ ok: false, reason });
    glassLive.forEach((api) => gentle ? api.retire() : api.destroy());
    if (!gentle) glassLive.clear();
  }
  function initPbGlass() {
    const hosts = [...document.querySelectorAll("[pb-glass]")].filter((h) => !glassLive.has(h));
    if (!hosts.length) return;
    if (glassState === "off") return;
    if (glassState === "idle") {
      const skip = glassSkipReason();
      if (skip) {
        glassOff(skip, false);
        return;
      }
      glassState = "warming";
      glassReady = new Promise((resolve) => window.requestIdleCallback ? requestIdleCallback(resolve, { timeout: 2500 }) : setTimeout(resolve, 300)).then(() => loadSpaceScript(GLASS_FILE, "GlassApp")).then(() => window.GlassApp.warm({
        params: GLASS_PARAMS,
        workerUrl: SPACE_BASE + GLASS_FILE,
        // the worker loads the same bundle for the geometry
        onSlow: (e) => glassOff(e.message, true, true)
      })).then((info) => {
        if (glassState !== "warming") throw new Error("glass turned off while warming");
        glassState = "on";
        glassMemo({ ok: true, reason: info.gpu });
      }).catch((e) => {
        const msg = e && e.message ? e.message : String(e);
        glassOff(msg, /slow|software/.test(msg));
        throw e;
      });
    }
    glassReady.then(() => glassCreate(hosts)).catch(() => {
    });
  }
  function glassCreate(hosts) {
    if (!glassTicker) {
      glassTicker = true;
      gsap.ticker.add(() => glassLive.forEach((api) => api.update()));
    }
    const next = () => {
      if (glassState !== "on") return;
      const host = hosts.shift();
      if (!host) return;
      if (host.isConnected && !glassLive.has(host)) {
        try {
          glassLive.set(host, window.GlassApp.initGlass({
            host,
            backdropRoot: host.closest("section, footer") || host.parentElement,
            params: glassParams(host),
            quality: "high",
            onFail: (e) => glassOff(e.message, false)
          }));
        } catch (e) {
          console.warn("[glass]", e.message, host);
        }
      }
      if (hosts.length) window.requestIdleCallback ? requestIdleCallback(next, { timeout: 500 }) : setTimeout(next, 16);
    };
    next();
  }
  function destroyPbGlass(container) {
    [...glassLive.keys()].forEach((h) => {
      if (container && !container.contains(h) && h.isConnected) return;
      glassLive.get(h).destroy();
      glassLive.delete(h);
    });
  }
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9fX2VudHJ5X18udHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBvbHBoYXJtYS1zd2lzcy5qc1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBBR0UgVFJBTlNJVElPTiBCT0lMRVJQTEFURVxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZ3NhcC5yZWdpc3RlclBsdWdpbihDdXN0b21FYXNlLCBTcGxpdFRleHQsIFNjcm9sbFRyaWdnZXIsIEZsaXApO1xuXG5oaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gXCJtYW51YWxcIjtcblxubGV0IGxlbmlzID0gbnVsbDtcbmxldCBuZXh0UGFnZSA9IGRvY3VtZW50O1xubGV0IG9uY2VGdW5jdGlvbnNJbml0aWFsaXplZCA9IGZhbHNlO1xubGV0IHNjcm9sbFJldmVhbFNwbGl0cyA9IFtdO1xuXG5jb25zdCBoYXNMZW5pcyA9IHR5cGVvZiB3aW5kb3cuTGVuaXMgIT09IFwidW5kZWZpbmVkXCI7XG5jb25zdCBoYXNTY3JvbGxUcmlnZ2VyID0gdHlwZW9mIHdpbmRvdy5TY3JvbGxUcmlnZ2VyICE9PSBcInVuZGVmaW5lZFwiO1xuXG5jb25zdCBybU1RID0gd2luZG93Lm1hdGNoTWVkaWEoXCIocHJlZmVycy1yZWR1Y2VkLW1vdGlvbjogcmVkdWNlKVwiKTtcbmxldCByZWR1Y2VkTW90aW9uID0gcm1NUS5tYXRjaGVzO1xucm1NUS5hZGRFdmVudExpc3RlbmVyPy4oXCJjaGFuZ2VcIiwgZSA9PiAocmVkdWNlZE1vdGlvbiA9IGUubWF0Y2hlcykpO1xucm1NUS5hZGRMaXN0ZW5lcj8uKGUgPT4gKHJlZHVjZWRNb3Rpb24gPSBlLm1hdGNoZXMpKTtcblxuY29uc3QgaGFzID0gKHMpID0+ICEhbmV4dFBhZ2UucXVlcnlTZWxlY3RvcihzKTtcblxubGV0IHN0YWdnZXJEZWZhdWx0ID0gMC4wNTtcbmxldCBkdXJhdGlvbkRlZmF1bHQgPSAwLjY7XG5cbkN1c3RvbUVhc2UuY3JlYXRlKFwib3Ntb1wiLCBcIjAuNjI1LCAwLjA1LCAwLCAxXCIpO1xuZ3NhcC5kZWZhdWx0cyh7IGVhc2U6IFwib3Ntb1wiLCBkdXJhdGlvbjogZHVyYXRpb25EZWZhdWx0IH0pO1xuXG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEZVTkNUSU9OIFJFR0lTVFJZXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpbml0T25jZUZ1bmN0aW9ucygpIHtcbiAgaW5pdExlbmlzKCk7XG4gIGlmIChvbmNlRnVuY3Rpb25zSW5pdGlhbGl6ZWQpIHJldHVybjtcbiAgb25jZUZ1bmN0aW9uc0luaXRpYWxpemVkID0gdHJ1ZTtcblxuICAvLyBSdW5zIG9uY2Ugb24gZmlyc3QgbG9hZFxuICBwcmVsb2FkZXIoKTtcbn1cblxuZnVuY3Rpb24gaW5pdEJlZm9yZUVudGVyRnVuY3Rpb25zKG5leHQpIHtcbiAgbmV4dFBhZ2UgPSBuZXh0IHx8IGRvY3VtZW50O1xuXG4gIC8vIFJ1bnMgYmVmb3JlIHRoZSBlbnRlciBhbmltYXRpb25cbn1cblxuZnVuY3Rpb24gaW5pdEFmdGVyRW50ZXJGdW5jdGlvbnMobmV4dCkge1xuICBuZXh0UGFnZSA9IG5leHQgfHwgZG9jdW1lbnQ7XG5cbiAgLy8gUnVucyBhZnRlciBlbnRlciBhbmltYXRpb24gY29tcGxldGVzXG4gIGlmIChoYXMoJ1tkYXRhLWhlcm9dJykpIGluaXRIZXJvSW50cm8oKTsgLyogR0xPQkFMICovXG4gIGlmIChoYXMoJ1tkYXJrLXMtbmF2XScpIHx8IGhhcygnW2xpZ2h0LXMtbmF2XScpKSBpbml0TmF2VGhlbWUoKTsgLyogR0xPQkFMIC0gbmF2IHRoZW1lICovXG4gIGluaXROYXZNZW51KCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogR0xPQkFMIC0gZHJvcGRvd24gKyBtb2JpbGUgKi9cbiAgaWYgKGhhcygnW2RhdGEtbGVuaXMtc2Nyb2xsLXRvXScpIHx8IGhhcygnW2RhdGEtbGVuaXMtc3RhcnRdJykgfHwgaGFzKCdbZGF0YS1sZW5pcy10b2dnbGVdJykpIGluaXRMZW5pc1RyaWdnZXJzKCk7IC8qIEdMT0JBTCAtIGxlbmlzIGJ1dHRvbnMgKi9cbiAgaWYgKGhhcygnW2RhdGEtcGFyYWxsYXg9XCJ0cmlnZ2VyXCJdJykpIGluaXRHbG9iYWxQYXJhbGxheCgpOyAvKiBDSEVDSyAqL1xuICBpZiAoaGFzKCdbZGF0YS1iZy16b29tLWluaXRdJykpIGluaXRCYWNrZ3JvdW5kWm9vbSgpOyAvKiBHTE9CQUwgKi9cbiAgaWYgKGhhcygnW2RhdGEtc3BsaXQ9XCJoZWFkaW5nXCJdJykpIGluaXRTY3JvbGxSZXZlYWwoKTsgLyogR0xPQkFMICovXG4gIGlmIChoYXMoJ1tkYXRhLXNjcm9sbC1oaWdobGlnaHRdJykpIGluaXRTY3JvbGxIaWdobGlnaHRXb3JkcygpOyAvKiBHTE9CQUwgKi9cbiAgaWYgKGhhcygnW2hrcC1saW5lXScpKSBpbml0SEtQTGluZXMoKTsgLyogR0xPQkFMIC0gaGVhZGVyIGJyYWNrZXQgbGluZXMgKi9cbiAgaWYgKGhhcygnLmlzLXRyYWNrLXJlY29yZCcpKSBpbml0VHJhY2tSZWNvcmQoKTsgLyogVHJhY2sgUmVjb3JkIFNlY3Rpb24gKi9cbiAgaWYgKGhhcygnW2hvbWUtaGVyby1vdmVybGF5XScpKSBpbml0SGVyb092ZXJsYXkoKTsgLyogSG9tZSAqL1xuICBpZiAoaGFzKCcucC1oZXJvX21vcmUnKSkgaW5pdEhlcm9Nb3JlSGlkZSgpOyAvKiBHTE9CQUwgLSBoZXJvIHNjcm9sbC1kb3duIGJ1dHRvbiAqL1xuICBpZiAoaGFzKCdbaG9tZS1oaXctc2NydWJdJykpIGluaXRWaWRlb1NjcnViKCk7IC8qIEhvbWUgKi9cbiAgaWYgKGhhcygnW2hvbWUtaGl3LXNjcnViXScpKSBpbml0SGl3TWFza1NsaWRlSW4oKTsgLyogSG9tZSArIFBhcnRuZXJzaGlwICovXG4gIGlmIChoYXMoJ1tob21lLXdrLXNjcnViXScpKSBpbml0V2VLbm93QXBsYSgpOyAvKiBIb21lICovXG4gIGlmIChoYXMoJ1tob21lLXdrLXNjcnViXScpKSBpbml0V2tIYW5kb2ZmKCk7IC8qIEhvbWUgKi9cbiAgaWYgKGhhcygnW2hvbWUtd2stc2NydWJdJykpIGluaXRXa0ZsaXAoKTsgLyogSG9tZSAqL1xuICBpZiAoaGFzKCdbaG9tZS13ay1zY3J1Yl0nKSkgaW5pdFdlS25vd1N0cmFpZ2h0ZW4oKTsgLyogSG9tZSAqL1xuICBpZiAoaGFzKCdbaG9tZS13ay1zY3J1Yl0nKSkgaW5pdFdlS25vd0hlYWRGbGlwKCk7IC8qIEhvbWUgKi9cbiAgaWYgKGhhcygnW2dsYXNzLXNwbGl0XScpKSBpbml0R2xhc3NTcGxpdCgpOyAvKiBIb21lICovXG4gIGlmIChoYXMoJ1tob21lLWtwLXNjcnViXScpKSBpbml0S3BWaWRlb1NjcnViKCk7IC8qIEhvbWUgKi9cbiAgaWYgKGhhcygnW3Npdi1yZXZlYWwtZmFkZV0nKSkgaW5pdFNpdlJldmVhbEZhZGUoKTsgLyogR0xPQkFMICovXG4gIGlmIChoYXMoJ1tzaXYtcmV2ZWFsLWdyaWRdJykpIGluaXRTaXZSZXZlYWxHcmlkKCk7IC8qIEdMT0JBTCAqL1xuICBpZiAoaGFzKCdbZGF0YS1kaXZpZGVyLWhlaWdodF0nKSkgaW5pdERpdmlkZXJIZWlnaHQoKTsgLyogR0xPQkFMICovXG4gIGlmIChoYXMoJ1tkYXRhLWltZy1zY2FsZV0nKSkgaW5pdEltZ1NjYWxlKCk7IC8qIEdMT0JBTCAqL1xuICBpZiAoaGFzKCdbZGF0YS1icmFja2V0LWNsaXBdJykpIGluaXRCcmFja2V0Q2xpcCgpOyAvKiBHTE9CQUwgKi9cbiAgaWYgKGhhcygnW2RhdGEtaG9yLWRpdmlkZXItcmV2ZWFsXScpKSBpbml0SG9yRGl2aWRlclJldmVhbCgpOyAvKiBHTE9CQUwgKi9cbiAgaWYgKGhhcygnW2RhdGEtc3F1YXJlLW9wYWNpdHldJykpIGluaXRTcXVhcmVGYWRlKCk7IC8qIEdMT0JBTCAqL1xuICBpZiAoaGFzKCcuaXMtZm9vdGVyLWJvdHRsZS1yZXZlYWwnKSkgaW5pdEZvb3RlckJvdHRsZVJldmVhbCgpOyAvKiBIb21lICovXG4gIGlmIChoYXMoJ1tkYXRhLXBhcmFsbGF4LWluaXRdJykpIGluaXRQYXJhbGxheEltYWdlU2xpZGVyKCk7IC8qIENIRUNLICovXG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1mb290ZXItcGFyYWxsYXhdJykpIGluaXRGb290ZXJQYXJhbGxheCgpOyAvKiBHTE9CQUwgKi9cbiAgaWYgKGhhcygnLmlzLXdoYXQtd2UtZG8nKSkgaW5pdFdoYXRXZURvSGVybygpOyAvKiBXaGF0IFdlIERvICovXG4gIGlmIChoYXMoJyNteS1zdGlja3ktaW1nJykpIGluaXRXaGF0V2VEb1N0aWNreUltZ0hlaWdodCgpOyAvKiBXaGF0IFdlIERvICovXG4gIGlmIChoYXMoJy5jYXBzdWxlJykpIGluaXRDYXBzdWxlc1BhcmFsbGF4KCk7IC8qIFBvbHBoYXJtYSBCaW9sb2dpY3MgLSBjYXBzdWxlcyAqL1xuICBpZiAoaGFzKCdbY2FyZWVycy1oZXJvPVwidGV4dC13cmFwcGVyXCJdJykpIGluaXRDYXJlZXJzSGVyb1JldmVhbCgpO1xuICBpZiAoaGFzKCcuaXMtY2FyZWVycy1wcm9jZXNzJykpIGluaXRDYXJlZXJzUHJvY2VzcygpO1xuICBpZiAoaGFzKCcud3dkX3dyYXBwZXIuaXMtbm8tYmcnKSkgaW5pdFdoYXRXZURvQ2FyZHMoKTsgLyogV2hhdCBXZSBEbyAqL1xuICBpZiAoaGFzKCdbZGF0YS1vdmVybGF5LXRyaWdnZXJdJykpIGluaXRDdXN0b21PdmVybGF5UmV2ZWFsKCk7XG4gIGlmIChoYXMoJ1ttb2RhbC1nZXQtaW4tdG91Y2gtb3Blbl0nKSkgaW5pdEdldEluVG91Y2hNb2RhbCgpO1xuICBpbml0VW5pY29ybigpOyAvKiBHTE9CQUwgKi9cbiAgaWYgKGhhcygnW2Fib3V0LWpvdXJuZXktc2NydWJdJykpIGluaXRBYm91dEpvdXJuZXkoKTsgLyogQWJvdXQgKi9cbiAgaWYgKGhhcygnW2RhdGEtbG9hZC1tb3JlXScpKSBpbml0SW5zaWdodHNMb2FkTW9yZSgpOyAvKiBJbnNpZ2h0cyAtIExhdGVzdCAqL1xuICBpZiAoaGFzKCcuaW5zLWxhdGVzdF90YWJzJykpIGluaXRJbnNpZ2h0c1RhYnMoKTsgLyogSW5zaWdodHMgLSBMYXRlc3QgKi9cbiAgaWYgKGhhcygnLnN3aXBlcl93cmFwJykpIGluaXRTd2lwZXJDYXJvdXNlbHMoKTsgLyogR0xPQkFMIC0gU3dpcGVyICovXG4gIGlmIChoYXMoJy53LWZvcm0nKSkgaW5pdFdlYmZsb3dGb3JtcygpOyAvKiBHTE9CQUwgLSBXZWJmbG93IGZvcm1zIGFmdGVyIEJhcmJhICovXG4gIGlmIChoYXMoJyNwYi1nbG9iZScpKSBpbml0UGJHbG9iZSgpOyAvKiBHbG9iZSBzZWN0aW9uICovXG4gIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbcGItZ2xhc3NdJykpIGluaXRQYkdsYXNzKCk7IC8qIEdMT0JBTCAtIFdlYkdMIGdsYXNzIHNoYXBlcyAoaG9tZSBjb25jZXB0LCBmb290ZXIpICovXG5cblxuXG4gIGlmIChoYXNMZW5pcykge1xuICAgIGxlbmlzLnJlc2l6ZSgpO1xuICB9XG5cbiAgaWYgKGhhc1Njcm9sbFRyaWdnZXIpIHtcbiAgICBTY3JvbGxUcmlnZ2VyLnJlZnJlc2goKTtcbiAgfVxufVxuXG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBBR0UgVFJBTlNJVElPTlNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIHJ1blBhZ2VPbmNlQW5pbWF0aW9uKG5leHQpIHtcbiAgY29uc3QgdGwgPSBnc2FwLnRpbWVsaW5lKCk7XG5cbiAgdGwuY2FsbCgoKSA9PiB7XG4gICAgcmVzZXRQYWdlKG5leHQpXG4gIH0sIG51bGwsIDApO1xuXG4gIHJldHVybiB0bDtcbn1cblxuZnVuY3Rpb24gcnVuUGFnZUxlYXZlQW5pbWF0aW9uKGN1cnJlbnQsIG5leHQpIHtcbiAgY29uc3QgdHJhbnNpdGlvbldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtdHJhbnNpdGlvbi13cmFwXVwiKTtcbiAgY29uc3QgdHJhbnNpdGlvbkRhcmsgPSB0cmFuc2l0aW9uV3JhcC5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtdHJhbnNpdGlvbi1kYXJrXVwiKTtcblxuICBjb25zdCB0bCA9IGdzYXAudGltZWxpbmUoe1xuICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgIGN1cnJlbnQucmVtb3ZlKCk7XG4gICAgfVxuICB9KVxuXG4gIEN1c3RvbUVhc2UuY3JlYXRlKFwicGFyYWxsYXhcIiwgXCIwLjcsIDAuMDUsIDAuMTMsIDFcIik7XG5cbiAgaWYgKHJlZHVjZWRNb3Rpb24pIHtcbiAgICAvLyBJbW1lZGlhdGUgc3dhcCBpZiB1c2VyIHByZWZlcnMgcmVkdWNlZCBtb3Rpb25cbiAgICByZXR1cm4gdGwuc2V0KGN1cnJlbnQsIHsgYXV0b0FscGhhOiAwIH0pO1xuICB9XG5cbiAgdGwuc2V0KHRyYW5zaXRpb25XcmFwLCB7XG4gICAgekluZGV4OiAyXG4gIH0pO1xuXG4gIHRsLmZyb21Ubyh0cmFuc2l0aW9uRGFyaywge1xuICAgIGF1dG9BbHBoYTogMFxuICB9LCB7XG4gICAgYXV0b0FscGhhOiAwLjgsXG4gICAgZHVyYXRpb246IDEuMixcbiAgICBlYXNlOiBcInBhcmFsbGF4XCJcbiAgfSwgMCk7XG5cbiAgdGwuZnJvbVRvKGN1cnJlbnQsIHtcbiAgICB5OiBcIjB2aFwiXG4gIH0sIHtcbiAgICB5OiBcIi0yNXZoXCIsXG4gICAgZHVyYXRpb246IDEuMixcbiAgICBlYXNlOiBcInBhcmFsbGF4XCIsXG4gIH0sIDApO1xuXG4gIHRsLnNldCh0cmFuc2l0aW9uRGFyaywge1xuICAgIGF1dG9BbHBoYTogMCxcbiAgfSk7XG5cbiAgcmV0dXJuIHRsO1xufVxuXG5mdW5jdGlvbiBydW5QYWdlRW50ZXJBbmltYXRpb24obmV4dCkge1xuICBjb25zdCB0bCA9IGdzYXAudGltZWxpbmUoKTtcblxuICBpZiAocmVkdWNlZE1vdGlvbikge1xuICAgIC8vIEltbWVkaWF0ZSBzd2FwIGlmIHVzZXIgcHJlZmVycyByZWR1Y2VkIG1vdGlvblxuICAgIHRsLnNldChuZXh0LCB7IGF1dG9BbHBoYTogMSB9KTtcbiAgICB0bC5hZGQoXCJwYWdlUmVhZHlcIilcbiAgICB0bC5jYWxsKHJlc2V0UGFnZSwgW25leHRdLCBcInBhZ2VSZWFkeVwiKTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB0bC5jYWxsKHJlc29sdmUsIG51bGwsIFwicGFnZVJlYWR5XCIpKTtcbiAgfVxuXG4gIHRsLmFkZChcInN0YXJ0RW50ZXJcIiwgMCk7XG5cbiAgdGwuc2V0KG5leHQsIHtcbiAgICB6SW5kZXg6IDNcbiAgfSk7XG5cbiAgdGwuZnJvbVRvKG5leHQsIHtcbiAgICB5OiBcIjEwMHZoXCJcbiAgfSwge1xuICAgIHk6IFwiMHZoXCIsXG4gICAgZHVyYXRpb246IDEuMixcbiAgICBjbGVhclByb3BzOiBcImFsbFwiLFxuICAgIGVhc2U6IFwicGFyYWxsYXhcIlxuICB9LCBcInN0YXJ0RW50ZXJcIik7XG5cbiAgdGwuYWRkKFwicGFnZVJlYWR5XCIpO1xuICB0bC5jYWxsKHJlc2V0UGFnZSwgW25leHRdLCBcInBhZ2VSZWFkeVwiKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgdGwuY2FsbChyZXNvbHZlLCBudWxsLCBcInBhZ2VSZWFkeVwiKTtcbiAgfSk7XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJBUkJBIEhPT0tTICsgSU5JVFxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuYmFyYmEuaG9va3MuYmVmb3JlRW50ZXIoZGF0YSA9PiB7XG4gIC8vIFBvc2l0aW9uIG5ldyBjb250YWluZXIgb24gdG9wXG4gIGdzYXAuc2V0KGRhdGEubmV4dC5jb250YWluZXIsIHtcbiAgICBwb3NpdGlvbjogXCJmaXhlZFwiLFxuICAgIHRvcDogMCxcbiAgICBsZWZ0OiAwLFxuICAgIHJpZ2h0OiAwLFxuICB9KTtcblxuICBpZiAobGVuaXMgJiYgdHlwZW9mIGxlbmlzLnN0b3AgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIGxlbmlzLnN0b3AoKTtcbiAgfVxuXG4gIGluaXRCZWZvcmVFbnRlckZ1bmN0aW9ucyhkYXRhLm5leHQuY29udGFpbmVyKTtcbiAgYXBwbHlUaGVtZUZyb20oZGF0YS5uZXh0LmNvbnRhaW5lcik7XG59KTtcblxuYmFyYmEuaG9va3MuYWZ0ZXJMZWF2ZShkYXRhID0+IHtcbiAgaWYgKGhhc1Njcm9sbFRyaWdnZXIpIHtcbiAgICBTY3JvbGxUcmlnZ2VyLmdldEFsbCgpLmZvckVhY2godHJpZ2dlciA9PiB0cmlnZ2VyLmtpbGwoKSk7XG4gICAgaWYgKHdpbmRvdy5Vbmljb3JuU3R1ZGlvPy5kZXN0cm95KSBVbmljb3JuU3R1ZGlvLmRlc3Ryb3koKVxuICB9XG4gIGRlc3Ryb3lTY3JvbGxSZXZlYWwoKTtcbiAgZGVzdHJveVBiR2xvYmUoKTtcbiAgZGVzdHJveVBiR2xhc3MoZGF0YS5jdXJyZW50LmNvbnRhaW5lcik7XG4gIGRlc3Ryb3lUdXJuc3RpbGVXaWRnZXRzKGRhdGEuY3VycmVudC5jb250YWluZXIpO1xufSk7XG5cblxuYmFyYmEuaG9va3MuZW50ZXIoZGF0YSA9PiB7XG4gIGluaXRCYXJiYU5hdlVwZGF0ZShkYXRhKTtcbn0pXG5cbmJhcmJhLmhvb2tzLmFmdGVyRW50ZXIoZGF0YSA9PiB7XG4gIC8vIFJ1biBwYWdlIGZ1bmN0aW9uc1xuICBpbml0QWZ0ZXJFbnRlckZ1bmN0aW9ucyhkYXRhLm5leHQuY29udGFpbmVyKTtcblxuICAvLyBTZXR0bGVcbiAgaWYgKGhhc0xlbmlzKSB7XG4gICAgbGVuaXMucmVzaXplKCk7XG4gICAgbGVuaXMuc3RhcnQoKTtcbiAgfVxuXG4gIGlmIChoYXNTY3JvbGxUcmlnZ2VyKSB7XG4gICAgU2Nyb2xsVHJpZ2dlci5yZWZyZXNoKCk7XG4gIH1cbn0pO1xuXG5iYXJiYS5pbml0KHtcbiAgZGVidWc6IHRydWUsIC8vIFNldCB0byAnZmFsc2UnIGluIHByb2R1Y3Rpb25cbiAgdGltZW91dDogNzAwMCxcbiAgcHJldmVudFJ1bm5pbmc6IHRydWUsXG4gIHRyYW5zaXRpb25zOiBbXG4gICAge1xuICAgICAgbmFtZTogXCJkZWZhdWx0XCIsXG4gICAgICBzeW5jOiB0cnVlLFxuXG4gICAgICAvLyBGaXJzdCBsb2FkXG4gICAgICBhc3luYyBvbmNlKGRhdGEpIHtcbiAgICAgICAgaW5pdE9uY2VGdW5jdGlvbnMoKTtcblxuICAgICAgICByZXR1cm4gcnVuUGFnZU9uY2VBbmltYXRpb24oZGF0YS5uZXh0LmNvbnRhaW5lcik7XG4gICAgICB9LFxuXG4gICAgICAvLyBDdXJyZW50IHBhZ2UgbGVhdmVzXG4gICAgICBhc3luYyBsZWF2ZShkYXRhKSB7XG4gICAgICAgIHJldHVybiBydW5QYWdlTGVhdmVBbmltYXRpb24oZGF0YS5jdXJyZW50LmNvbnRhaW5lciwgZGF0YS5uZXh0LmNvbnRhaW5lcik7XG4gICAgICB9LFxuXG4gICAgICAvLyBOZXcgcGFnZSBlbnRlcnNcbiAgICAgIGFzeW5jIGVudGVyKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHJ1blBhZ2VFbnRlckFuaW1hdGlvbihkYXRhLm5leHQuY29udGFpbmVyKTtcbiAgICAgIH1cbiAgICB9XG4gIF0sXG59KTtcblxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBHRU5FUklDICsgSEVMUEVSU1xuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY29uc3QgdGhlbWVDb25maWcgPSB7XG4gIGxpZ2h0OiB7XG4gICAgbmF2OiBcImRhcmtcIixcbiAgICB0cmFuc2l0aW9uOiBcImxpZ2h0XCJcbiAgfSxcbiAgZGFyazoge1xuICAgIG5hdjogXCJsaWdodFwiLFxuICAgIHRyYW5zaXRpb246IFwiZGFya1wiXG4gIH1cbn07XG5cbmZ1bmN0aW9uIGFwcGx5VGhlbWVGcm9tKGNvbnRhaW5lcikge1xuICBjb25zdCBwYWdlVGhlbWUgPSBjb250YWluZXI/LmRhdGFzZXQ/LnBhZ2VUaGVtZSB8fCBcImxpZ2h0XCI7XG4gIGNvbnN0IGNvbmZpZyA9IHRoZW1lQ29uZmlnW3BhZ2VUaGVtZV0gfHwgdGhlbWVDb25maWcubGlnaHQ7XG5cbiAgZG9jdW1lbnQuYm9keS5kYXRhc2V0LnBhZ2VUaGVtZSA9IHBhZ2VUaGVtZTtcbiAgY29uc3QgdHJhbnNpdGlvbkVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGhlbWUtdHJhbnNpdGlvbl0nKTtcbiAgaWYgKHRyYW5zaXRpb25FbCkge1xuICAgIHRyYW5zaXRpb25FbC5kYXRhc2V0LnRoZW1lVHJhbnNpdGlvbiA9IGNvbmZpZy50cmFuc2l0aW9uO1xuICB9XG5cbiAgY29uc3QgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtdGhlbWUtbmF2XScpO1xuICBpZiAobmF2KSB7XG4gICAgbmF2LmRhdGFzZXQudGhlbWVOYXYgPSBjb25maWcubmF2O1xuICAgIG5hdi5jbGFzc0xpc3QudG9nZ2xlKCdpcy1uYXYtb24tbGlnaHQnLCBwYWdlVGhlbWUgPT09ICdsaWdodCcpO1xuICB9XG59XG5cbmxldCBmb3JtU3VjY2Vzc09ic2VydmVyID0gbnVsbDtcblxuLy8gPiBXZWJmbG93IGZvcm1zIC0gYmluZCBmb3JtcyBzd2FwcGVkIGluIGJ5IEJhcmJhICh3ZWJmbG93LmpzIGJpbmRzIG9ubHkgb24gYSByZWFsIHBhZ2UgbG9hZClcbmZ1bmN0aW9uIGluaXRXZWJmbG93Rm9ybXMoKSB7XG4gIGlmICghd2luZG93LldlYmZsb3cgfHwgdHlwZW9mIFdlYmZsb3cucmVxdWlyZSAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICB2YXIgZm9ybXNNb2R1bGUgPSBXZWJmbG93LnJlcXVpcmUoJ2Zvcm1zJyk7XG4gIGlmICghZm9ybXNNb2R1bGUgfHwgdHlwZW9mIGZvcm1zTW9kdWxlLnJlYWR5ICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG5cbiAgdmFyIGZvcm1CbG9ja3MgPSBuZXh0UGFnZS5xdWVyeVNlbGVjdG9yQWxsKCcudy1mb3JtJyk7XG4gIHZhciBuZWVkc0JpbmQgPSBBcnJheS5wcm90b3R5cGUuc29tZS5jYWxsKGZvcm1CbG9ja3MsIGZ1bmN0aW9uIChibG9jaykge1xuICAgIHZhciBmb3JtID0gYmxvY2sucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIHJldHVybiBmb3JtICYmICEod2luZG93LmpRdWVyeSAmJiBqUXVlcnkuZGF0YShmb3JtLCAnLnctZm9ybScpKTsgLy8gdW5ib3VuZCAtPiBuYXRpdmUgc3VibWl0IHJlbG9hZHMgdGhlIHBhZ2VcbiAgfSk7XG4gIGlmIChuZWVkc0JpbmQpIHtcbiAgICAvLyB3ZWJmbG93LmpzIHdhaXRzIGZvciBUVVJOU1RJTEVfTE9BREVEIChmaXJzdCBsb2FkKSBvciBkb2N1bWVudCBcInJlYWR5XCIgKHR1cm5zdGlsZSBhbHJlYWR5IGxvYWRlZCksXG4gICAgLy8gd2hpY2ggbmV2ZXIgZmlyZXMgYWdhaW4gYWZ0ZXIgYSBCYXJiYSBzd2FwIC0+IHN1Ym1pdCBidXR0b24gc3RheXMgZGlzYWJsZWRcbiAgICBpZiAod2luZG93LmpRdWVyeSkgalF1ZXJ5KGRvY3VtZW50KS5vZmYoJ3JlYWR5IFRVUk5TVElMRV9MT0FERUQnKTsgLy8gZHJvcCBoYW5kbGVycyBvZiBwcmV2aW91cyB2aXNpdHMnIGZvcm1zXG4gICAgZm9ybXNNb2R1bGUucmVhZHkoKTtcbiAgICBpZiAod2luZG93LmpRdWVyeSkgalF1ZXJ5KGRvY3VtZW50KS50cmlnZ2VyKCdyZWFkeScpO1xuICB9XG5cbiAgZm9ybUJsb2Nrcy5mb3JFYWNoKGZ1bmN0aW9uIChibG9jaykge1xuICAgIHZhciBmb3JtID0gYmxvY2sucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIGlmICghZm9ybSkgcmV0dXJuO1xuICAgIGZvcm0uYWRkRXZlbnRMaXN0ZW5lcignc3VibWl0JywgZnVuY3Rpb24gKCkgeyAvLyBmaXJlcyBvbmx5IGFmdGVyIG5hdGl2ZSB2YWxpZGF0aW9uIHBhc3NlZFxuICAgICAgYmxvY2suc3R5bGUubWluSGVpZ2h0ID0gYmxvY2sub2Zmc2V0SGVpZ2h0ICsgJ3B4JzsgLy8ga2VlcCBwYWdlIGhlaWdodCB0aHJvdWdoIGZvcm0gLT4gc3VjY2VzcyBzd2FwXG4gICAgfSwgdHJ1ZSk7XG4gIH0pO1xuXG4gIGlmIChmb3JtU3VjY2Vzc09ic2VydmVyKSB7IGZvcm1TdWNjZXNzT2JzZXJ2ZXIuZGlzY29ubmVjdCgpOyBmb3JtU3VjY2Vzc09ic2VydmVyID0gbnVsbDsgfSAvLyBCYXJiYSB3b24ndCBjbGVhbiBpdCB1cFxuICB2YXIgZG9uZUVscyA9IG5leHRQYWdlLnF1ZXJ5U2VsZWN0b3JBbGwoJy53LWZvcm0gLnctZm9ybS1kb25lJyk7XG4gIGlmICghZG9uZUVscy5sZW5ndGgpIHJldHVybjtcblxuICBmb3JtU3VjY2Vzc09ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbXV0YXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZG9uZSA9IG11dGF0aW9uc1tpXS50YXJnZXQ7XG4gICAgICBpZiAoZ2V0Q29tcHV0ZWRTdHlsZShkb25lKS5kaXNwbGF5ID09PSAnbm9uZScpIGNvbnRpbnVlO1xuICAgICAgZm9ybVN1Y2Nlc3NPYnNlcnZlci5kaXNjb25uZWN0KCk7IC8vIHN1Y2Nlc3MgaGFwcGVucyBvbmNlIHBlciB2aXNpdFxuICAgICAgZm9ybVN1Y2Nlc3NPYnNlcnZlciA9IG51bGw7XG4gICAgICBzY3JvbGxUb0Zvcm1TdWNjZXNzKGRvbmUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSk7XG4gIGRvbmVFbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBmb3JtU3VjY2Vzc09ic2VydmVyLm9ic2VydmUoZWwsIHsgYXR0cmlidXRlczogdHJ1ZSwgYXR0cmlidXRlRmlsdGVyOiBbJ3N0eWxlJ10gfSk7IC8vIFdlYmZsb3cgdG9nZ2xlcyBkaXNwbGF5IGlubGluZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2Nyb2xsVG9Gb3JtU3VjY2Vzcyhkb25lKSB7XG4gIHZhciBibG9jayA9IGRvbmUuY2xvc2VzdCgnLnctZm9ybScpIHx8IGRvbmU7XG4gIHZhciBvZmZzZXQgPSAtMTAgKiBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5mb250U2l6ZSk7IC8vIDEwcmVtIC0gY2xlYXIgdGhlIGZpeGVkIG5hdlxuXG4gIC8vIHJlbGVhc2UgdGhlIGxvY2tlZCBoZWlnaHQgb25seSBhZnRlciBzY3JvbGxpbmcsIHNvIHRoZSBwYWdlIG5ldmVyIHNocmlua3MgdW5kZXIgdGhlIHZpZXdwb3J0XG4gIGZ1bmN0aW9uIHJlbGVhc2VIZWlnaHQoKSB7XG4gICAgYmxvY2suc3R5bGUubWluSGVpZ2h0ID0gJyc7XG4gICAgaWYgKGxlbmlzKSBsZW5pcy5yZXNpemUoKTtcbiAgICBpZiAoaGFzU2Nyb2xsVHJpZ2dlcikgU2Nyb2xsVHJpZ2dlci5yZWZyZXNoKCk7XG4gIH1cblxuICBpZiAobGVuaXMpIHtcbiAgICBsZW5pcy5zY3JvbGxUbyhibG9jaywgeyBvZmZzZXQ6IG9mZnNldCwgZHVyYXRpb246IDEuMiwgaW1tZWRpYXRlOiByZWR1Y2VkTW90aW9uLCBsb2NrOiB0cnVlLCBvbkNvbXBsZXRlOiByZWxlYXNlSGVpZ2h0IH0pO1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5zY3JvbGxUbyh7IHRvcDogYmxvY2suZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wICsgd2luZG93LnNjcm9sbFkgKyBvZmZzZXQgfSk7XG4gICAgcmVsZWFzZUhlaWdodCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lUdXJuc3RpbGVXaWRnZXRzKGNvbnRhaW5lcikge1xuICBpZiAoIWNvbnRhaW5lciB8fCAhd2luZG93LnR1cm5zdGlsZSB8fCB0eXBlb2YgdHVybnN0aWxlLnJlbW92ZSAhPT0gJ2Z1bmN0aW9uJykgcmV0dXJuO1xuICBjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnW25hbWU9XCJjZi10dXJuc3RpbGUtcmVzcG9uc2VcIl0nKS5mb3JFYWNoKGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIHRyeSB7IHR1cm5zdGlsZS5yZW1vdmUoaW5wdXQucGFyZW50RWxlbWVudCk7IH0gY2F0Y2ggKGUpIHsgfSAvLyB3aWRnZXQgY29udGFpbmVyIHJlbmRlcmVkIGJ5IHdlYmZsb3cuanNcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluaXRMZW5pcygpIHtcbiAgaWYgKGxlbmlzKSByZXR1cm47IC8vIGFscmVhZHkgY3JlYXRlZFxuICBpZiAoIWhhc0xlbmlzKSByZXR1cm47XG4gIGlmIChXZWJmbG93LmVudignZWRpdG9yJykgIT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gIGxlbmlzID0gbmV3IExlbmlzKHtcbiAgICBsZXJwOiAwLjA1LFxuICAgIHdoZWVsTXVsdGlwbGllcjogMS4yLFxuICB9KTtcblxuICB3aW5kb3cubGVuaXMgPSBsZW5pcztcblxuICBpZiAoaGFzU2Nyb2xsVHJpZ2dlcikge1xuICAgIGxlbmlzLm9uKFwic2Nyb2xsXCIsIFNjcm9sbFRyaWdnZXIudXBkYXRlKTtcbiAgfVxuXG4gIGdzYXAudGlja2VyLmFkZCgodGltZSkgPT4ge1xuICAgIGxlbmlzLnJhZih0aW1lICogMTAwMCk7XG4gIH0pO1xuXG4gIGdzYXAudGlja2VyLmxhZ1Ntb290aGluZygwKTtcbn1cblxuZnVuY3Rpb24gcmVzZXRQYWdlKGNvbnRhaW5lcikge1xuICB3aW5kb3cuc2Nyb2xsVG8oMCwgMCk7XG4gIGdzYXAuc2V0KGNvbnRhaW5lciwgeyBjbGVhclByb3BzOiBcInBvc2l0aW9uLHRvcCxsZWZ0LHJpZ2h0XCIgfSk7XG5cbiAgaWYgKGhhc0xlbmlzKSB7XG4gICAgbGVuaXMucmVzaXplKCk7XG4gICAgbGVuaXMuc3RhcnQoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkZWJvdW5jZU9uV2lkdGhDaGFuZ2UoZm4sIG1zKSB7XG4gIGxldCBsYXN0ID0gaW5uZXJXaWR0aCxcbiAgICB0aW1lcjtcbiAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgaWYgKGlubmVyV2lkdGggIT09IGxhc3QpIHtcbiAgICAgICAgbGFzdCA9IGlubmVyV2lkdGg7XG4gICAgICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0sIG1zKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gaW5pdEJhcmJhTmF2VXBkYXRlKGRhdGEpIHtcbiAgdmFyIHRwbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RlbXBsYXRlJyk7XG4gIHRwbC5pbm5lckhUTUwgPSBkYXRhLm5leHQuaHRtbC50cmltKCk7XG4gIHZhciBuZXh0Tm9kZXMgPSB0cGwuY29udGVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1iYXJiYS11cGRhdGVdJyk7XG4gIHZhciBjdXJyZW50Tm9kZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCduYXYgW2RhdGEtYmFyYmEtdXBkYXRlXScpO1xuXG4gIGN1cnJlbnROb2Rlcy5mb3JFYWNoKGZ1bmN0aW9uIChjdXJyLCBpbmRleCkge1xuICAgIHZhciBuZXh0ID0gbmV4dE5vZGVzW2luZGV4XTtcbiAgICBpZiAoIW5leHQpIHJldHVybjtcblxuICAgIC8vIEFyaWEtY3VycmVudCBzeW5jXG4gICAgdmFyIG5ld1N0YXR1cyA9IG5leHQuZ2V0QXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnKTtcbiAgICBpZiAobmV3U3RhdHVzICE9PSBudWxsKSB7XG4gICAgICBjdXJyLnNldEF0dHJpYnV0ZSgnYXJpYS1jdXJyZW50JywgbmV3U3RhdHVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3Vyci5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtY3VycmVudCcpO1xuICAgIH1cblxuICAgIC8vIENsYXNzIGxpc3Qgc3luY1xuICAgIHZhciBuZXdDbGFzc0xpc3QgPSBuZXh0LmdldEF0dHJpYnV0ZSgnY2xhc3MnKSB8fCAnJztcbiAgICBjdXJyLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBuZXdDbGFzc0xpc3QpO1xuICB9KTtcbn1cblxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBQT0xQSEFSTUEgRlVOQ1RJT05TXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5cbi8vIC0tLSBHTE9CQUwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuLy8gPiBMZW5pcyBTbW9vdGggU2Nyb2xsXG5mdW5jdGlvbiBpbml0TGVuaXNUcmlnZ2VycygpIHtcbiAgaWYgKHR5cGVvZiAkID09PSBcInVuZGVmaW5lZFwiIHx8ICF3aW5kb3cubGVuaXMpIHJldHVybjtcblxuICAkKCdbZGF0YS1sZW5pcy1zdGFydF0nKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5sZW5pcy5zdGFydCgpO1xuICB9KTtcblxuICAkKCdbZGF0YS1sZW5pcy1zdG9wXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93LmxlbmlzLnN0b3AoKTtcbiAgfSk7XG5cbiAgJCgnW2RhdGEtbGVuaXMtdG9nZ2xlXScpLm9mZignY2xpY2snKS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHdpbmRvdy5sZW5pcy5pc1N0b3BwZWQpIHtcbiAgICAgIHdpbmRvdy5sZW5pcy5zdGFydCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aW5kb3cubGVuaXMuc3RvcCgpO1xuICAgIH1cbiAgfSk7XG5cbiAgdmFyIGxlbmlzU2Nyb2xsRWFzZSA9ICh0eXBlb2YgZ3NhcCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBnc2FwLnBhcnNlRWFzZSlcbiAgICA/IGdzYXAucGFyc2VFYXNlKFwib3Ntb1wiKVxuICAgIDogdW5kZWZpbmVkO1xuXG4gIGZ1bmN0aW9uIGZpbmROZXh0U2VjdGlvbihmcm9tRWwpIHtcbiAgICB2YXIgbm9kZSA9IGZyb21FbCA/IGZyb21FbC5jbG9zZXN0KFwiLnNlY3Rpb25cIikgOiBudWxsO1xuICAgIHdoaWxlIChub2RlICYmIG5vZGUubmV4dEVsZW1lbnRTaWJsaW5nKSB7XG4gICAgICBub2RlID0gbm9kZS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICBpZiAobm9kZS5jbGFzc0xpc3QgJiYgbm9kZS5jbGFzc0xpc3QuY29udGFpbnMoXCJzZWN0aW9uXCIpKSByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICAkKCdbZGF0YS1sZW5pcy1zY3JvbGwtdG9dJykub2ZmKCdjbGljay5sZW5pc1Njcm9sbFRvJykub24oJ2NsaWNrLmxlbmlzU2Nyb2xsVG8nLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBidG4gPSB0aGlzO1xuICAgIHZhciByYXcgPSBidG4uZ2V0QXR0cmlidXRlKCdkYXRhLWxlbmlzLXNjcm9sbC10bycpO1xuICAgIHZhciB0YXJnZXRFbCA9IHJhdyA9PT0gJ25leHQtc2VjdGlvbicgPyBmaW5kTmV4dFNlY3Rpb24oYnRuKSA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IocmF3IHx8ICcnKTtcbiAgICBpZiAoIXRhcmdldEVsKSByZXR1cm47XG5cbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBpZiAoYnRuLmRhdGFzZXQubGVuaXNTY3JvbGxpbmcgPT09IFwiMVwiKSByZXR1cm47XG4gICAgYnRuLmRhdGFzZXQubGVuaXNTY3JvbGxpbmcgPSBcIjFcIjtcblxuICAgIHZhciBvZmZzZXRBdHRyID0gYnRuLmdldEF0dHJpYnV0ZSgnZGF0YS1sZW5pcy1zY3JvbGwtb2Zmc2V0Jyk7XG4gICAgdmFyIG9mZnNldCA9IG9mZnNldEF0dHIgPyBwYXJzZUZsb2F0KG9mZnNldEF0dHIpIDogMDtcblxuICAgIHdpbmRvdy5sZW5pcy5zY3JvbGxUbyh0YXJnZXRFbCwge1xuICAgICAgb2Zmc2V0OiBvZmZzZXQsXG4gICAgICBkdXJhdGlvbjogcmVkdWNlZE1vdGlvbiA/IDAgOiAxLjIsXG4gICAgICBlYXNpbmc6IGxlbmlzU2Nyb2xsRWFzZSxcbiAgICAgIGxvY2s6IHRydWUsXG4gICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGJ0bi5kYXRhc2V0LmxlbmlzU2Nyb2xsaW5nID0gXCIwXCI7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyA+IFVuaWNvcm4gU3R1ZGlvXG5mdW5jdGlvbiBpbml0VW5pY29ybigpIHtcbiAgaWYgKHR5cGVvZiBVbmljb3JuU3R1ZGlvID09PSBcInVuZGVmaW5lZFwiIHx8ICFVbmljb3JuU3R1ZGlvLmluaXQpIHJldHVybjtcbiAgdHJ5IHtcbiAgICBVbmljb3JuU3R1ZGlvLmluaXQoKVxuICAgICAgLnRoZW4oKHNjZW5lcykgPT4ge1xuICAgICAgICB1bmljb3JuU2NlbmVzID0gc2NlbmVzIHx8IFtdO1xuICAgICAgICBnc2FwLnRvKCcudW5pY29ybi1tYXNrJywge1xuICAgICAgICAgIGRlbGF5OiAwLjUsXG4gICAgICAgICAgc2NhbGVZOiAwLFxuICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogJ2NlbnRlciBib3R0b20nLFxuICAgICAgICAgIGR1cmF0aW9uOiA1LFxuICAgICAgICAgIGVhc2U6ICdleHBvLm91dCdcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGNvbnNvbGUuZXJyb3IpO1xuICB9IGNhdGNoIChlKSB7IGNvbnNvbGUuZXJyb3IoZSk7IH1cbn1cblxuLy8gPiBOYXYgdGhlbWUgKGxpZ2h0IC8gZGFyayBzZWN0aW9ucylcbmZ1bmN0aW9uIGluaXROYXZUaGVtZSgpIHtcbiAgdmFyIG5hdiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZfY29tcG9uZW50Jyk7XG4gIGlmICghbmF2IHx8ICF3aW5kb3cuZ3NhcCB8fCAhd2luZG93LlNjcm9sbFRyaWdnZXIpIHJldHVybjtcblxuICB2YXIgT05fTElHSFQgPSAnaXMtbmF2LW9uLWxpZ2h0JztcbiAgdmFyIEhJRERFTiA9ICdpcy1uYXYtaGlkZGVuJztcbiAgdmFyIE1FTlVfT1BFTiA9ICdpcy1tZW51LW9wZW4nO1xuICB2YXIgSElERV9TRUwgPSAnLmZvb3Rlcl93cmFwcGVyJztcbiAgdmFyIEhJREVfQVQgPSAwLjg1OyAvLyBmb290ZXIgcmV2ZWFsIHByb2dyZXNzIGF0IHdoaWNoIG5hdiBoaWRlc1xuXG4gIHZhciBjdXJyZW50ID0gbmF2LmNsYXNzTGlzdC5jb250YWlucyhPTl9MSUdIVCk7XG4gIHZhciBoaWRkZW4gPSBmYWxzZTtcbiAgbmF2LmNsYXNzTGlzdC5yZW1vdmUoSElEREVOKTsgLy8gcmVzZXQgb24gQmFyYmEgZW50ZXJcblxuICBmdW5jdGlvbiBzZXRPbkxpZ2h0KHYpIHtcbiAgICBpZiAodiA9PT0gY3VycmVudCkgcmV0dXJuO1xuICAgIGN1cnJlbnQgPSB2O1xuICAgIG5hdi5jbGFzc0xpc3QudG9nZ2xlKE9OX0xJR0hULCB2KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldEhpZGRlbih2KSB7XG4gICAgaWYgKHYgPT09IGhpZGRlbikgcmV0dXJuO1xuICAgIGhpZGRlbiA9IHY7XG4gICAgbmF2LmNsYXNzTGlzdC50b2dnbGUoSElEREVOLCB2KTtcbiAgfVxuXG4gIC8qIC0tLS0tLS0tLS0gdGhlbWUgLS0tLS0tLS0tLSAqL1xuXG4gIHZhciBuYXZTZWN0aW9ucyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXJrLXMtbmF2XSwgW2xpZ2h0LXMtbmF2XScpKTtcbiAgdmFyIGFjdGl2ZVNlY3Rpb25zID0gW107XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQWN0aXZlU2VjdGlvbihlbCkge1xuICAgIGFjdGl2ZVNlY3Rpb25zID0gYWN0aXZlU2VjdGlvbnMuZmlsdGVyKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5lbCAhPT0gZWw7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiB1cGRhdGVOYXZUaGVtZSgpIHtcbiAgICBpZiAoYWN0aXZlU2VjdGlvbnMubGVuZ3RoID09PSAwKSByZXR1cm47XG5cbiAgICAvLyBoaWdoZXIgcHJpb3JpdHkgd2luczsgb24gYSB0aWUsIGxvd2VyIGluIHRoZSBIVE1MIHdpbnNcbiAgICBhY3RpdmVTZWN0aW9ucy5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICBpZiAoYS5wcmlvcml0eSAhPT0gYi5wcmlvcml0eSkge1xuICAgICAgICByZXR1cm4gYi5wcmlvcml0eSAtIGEucHJpb3JpdHk7XG4gICAgICB9XG4gICAgICByZXR1cm4gYi5pbmRleCAtIGEuaW5kZXg7XG4gICAgfSk7XG5cbiAgICB2YXIgd2lubmVyID0gYWN0aXZlU2VjdGlvbnNbMF07XG4gICAgc2V0T25MaWdodCh3aW5uZXIuaXNMaWdodCk7XG4gIH1cblxuICBuYXZTZWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcbiAgICB2YXIgaXNMaWdodCA9IGVsLmhhc0F0dHJpYnV0ZSgnbGlnaHQtcy1uYXYnKTtcbiAgICB2YXIgaXNBcGxhID0gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKCdob21lLXdlLWtub3dfYXBsYS1iZycpO1xuICAgIHZhciBwcmlvcml0eSA9IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZSgnZGF0YS1uYXYtcHJpb3JpdHknKSB8fCBcIjBcIiwgMTApO1xuXG4gICAgU2Nyb2xsVHJpZ2dlci5jcmVhdGUoe1xuICAgICAgdHJpZ2dlcjogZWwsXG4gICAgICBzdGFydDogJ3RvcCA1MHB4JyxcbiAgICAgIGVuZDogJ2JvdHRvbSA1MHB4JyxcbiAgICAgIG9uRW50ZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWN0aXZlU2VjdGlvbnMucHVzaCh7IGVsOiBlbCwgaW5kZXg6IGluZGV4LCBpc0xpZ2h0OiBpc0xpZ2h0LCBwcmlvcml0eTogcHJpb3JpdHkgfSk7XG4gICAgICAgIHVwZGF0ZU5hdlRoZW1lKCk7XG4gICAgICB9LFxuICAgICAgb25MZWF2ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZW1vdmVBY3RpdmVTZWN0aW9uKGVsKTtcbiAgICAgICAgaWYgKGlzQXBsYSkgc2V0T25MaWdodChmYWxzZSk7XG4gICAgICAgIHVwZGF0ZU5hdlRoZW1lKCk7XG4gICAgICB9LFxuICAgICAgb25FbnRlckJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYWN0aXZlU2VjdGlvbnMucHVzaCh7IGVsOiBlbCwgaW5kZXg6IGluZGV4LCBpc0xpZ2h0OiBpc0xpZ2h0LCBwcmlvcml0eTogcHJpb3JpdHkgfSk7XG4gICAgICAgIHVwZGF0ZU5hdlRoZW1lKCk7XG4gICAgICB9LFxuICAgICAgb25MZWF2ZUJhY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmVtb3ZlQWN0aXZlU2VjdGlvbihlbCk7XG4gICAgICAgIGlmIChpc0FwbGEpIHNldE9uTGlnaHQoZmFsc2UpO1xuICAgICAgICB1cGRhdGVOYXZUaGVtZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICAvKiAtLS0tLS0tLS0tIGhpZGRlbiBvbiBmb290ZXIgLS0tLS0tLS0tLVxuICAgICBOb3QgcGFydCBvZiB0aGUgcmFua2luZyBhYm92ZTogdGhlIGZvb3RlciByZWN0IGVudGVycyB0aGUgdmlld3BvcnQgbG9uZyBiZWZvcmVcbiAgICAgaXQgaXMgdmlzaWJsZSAocGFyYWxsYXggcmV2ZWFsLCBzdGlsbCBjb3ZlcmVkIGJ5IHRoZSBzZWN0aW9uIGFib3ZlKS4gUmVhZHMgdGhlXG4gICAgIHNhbWUgcmV2ZWFsIHdpbmRvdyBhcyBpbml0Rm9vdGVyUGFyYWxsYXgoKSAtIGtlZXAgc3RhcnQvZW5kIGluIHN5bmMgd2l0aCBpdC4gKi9cblxuICB2YXIgcGFyYWxsYXhFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZvb3Rlci1wYXJhbGxheF0nKTtcbiAgdmFyIGZvb3RlckVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihISURFX1NFTCkgfHwgcGFyYWxsYXhFbDtcbiAgaWYgKCFmb290ZXJFbCkgcmV0dXJuO1xuXG4gIHZhciByZXZlYWxUcmlnZ2VyID0gKHBhcmFsbGF4RWwgJiYgcGFyYWxsYXhFbC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1mb290ZXItY29udGFpbmVyXScpKSB8fCBmb290ZXJFbDtcblxuICBmdW5jdGlvbiB1cGRhdGVIaWRkZW4oc2VsZikge1xuICAgIHNldEhpZGRlbihzZWxmLnByb2dyZXNzID49IEhJREVfQVQgJiYgIW5hdi5jbGFzc0xpc3QuY29udGFpbnMoTUVOVV9PUEVOKSk7XG4gIH1cblxuICAvLyBubyBvd24gbGlzdGVuZXJzOiBTY3JvbGxUcmlnZ2VyIGlzIExlbmlzLXN5bmNlZCBhbmQgQmFyYmEga2lsbHMgdHJpZ2dlcnNcbiAgU2Nyb2xsVHJpZ2dlci5jcmVhdGUoe1xuICAgIHRyaWdnZXI6IHJldmVhbFRyaWdnZXIsXG4gICAgc3RhcnQ6ICdjbGFtcCh0b3AgYm90dG9tKScsXG4gICAgZW5kOiAnY2xhbXAodG9wIHRvcCknLFxuICAgIG9uVXBkYXRlOiB1cGRhdGVIaWRkZW4sXG4gICAgb25SZWZyZXNoOiB1cGRhdGVIaWRkZW4sXG4gICAgb25Ub2dnbGU6IHVwZGF0ZUhpZGRlblxuICB9KTtcbn1cblxuLy8gPiBOYXYgLSBcIkNvbXBhbnlcIiBkcm9wZG93biArIG1vYmlsZSBwYW5lbC5cbi8vICAgVGhlIG1vYmlsZSBwYW5lbCBpcyB0aGUgc2FtZSAubmF2X2xpbmtzLWNvbXBvbmVudCBhcyBkZXNrdG9wLCBkcml2ZW4gYnlcbi8vICAgLmlzLW1lbnUtb3BlbiBvbiAubmF2X2NvbXBvbmVudCAtIG9uZSBzZXQgb2YgbGlua3MsIGVkaXRlZCBvbmNlLlxudmFyIG5hdk1lbnVDbGVhbnVwID0gbnVsbDtcbmZ1bmN0aW9uIGluaXROYXZNZW51KCkge1xuICB2YXIgbmF2ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5hdl9jb21wb25lbnQnKTtcbiAgaWYgKCFuYXYpIHJldHVybjtcblxuICB2YXIgZHJvcCA9IG5hdi5xdWVyeVNlbGVjdG9yKCcubmF2X2Ryb3AnKTtcbiAgdmFyIGJ1cmdlciA9IG5hdi5xdWVyeVNlbGVjdG9yKCcubmF2X2hhbWJ1cmdlcicpO1xuICB2YXIgcGFuZWwgPSBuYXYucXVlcnlTZWxlY3RvcignLm5hdl9saW5rcy1jb21wb25lbnQnKTtcblxuICBpZiAobmF2TWVudUNsZWFudXApIG5hdk1lbnVDbGVhbnVwKCk7ICAgLy8gZG9jdW1lbnQvd2luZG93IGxpc3RlbmVycyAtIEJhcmJhIHdvbid0IGNsZWFuIHRoZW0gdXBcblxuICB2YXIgT1BFTiA9ICdpcy1vcGVuJztcbiAgdmFyIE1FTlVPUEVOID0gJ2lzLW1lbnUtb3Blbic7XG4gIHZhciB0cmlnZ2VyID0gZHJvcCA/IGRyb3AucXVlcnlTZWxlY3RvcignLm5hdl9saW5rLmlzLWRyb3AnKSA6IG51bGw7XG4gIHZhciBjYW5Ib3ZlciA9ICF3aW5kb3cubWF0Y2hNZWRpYSB8fCB3aW5kb3cubWF0Y2hNZWRpYSgnKGhvdmVyOiBob3ZlciknKS5tYXRjaGVzO1xuICB2YXIgaG92ZXJUaW1lcjtcblxuICAvKiBkcm9wZG93biAoZGVza3RvcCBvbmx5OyB0cmlnZ2VyIGlzIGRpc3BsYXk6bm9uZSBhdCA8PTk5MSkgKi9cbiAgZnVuY3Rpb24gc2V0RHJvcChvcGVuKSB7XG4gICAgaWYgKCFkcm9wKSByZXR1cm47XG4gICAgZHJvcC5jbGFzc0xpc3QudG9nZ2xlKE9QRU4sIG9wZW4pO1xuICAgIGlmICh0cmlnZ2VyKSB0cmlnZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIG9wZW4gPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgfVxuXG4gIC8qIG1vYmlsZSBwYW5lbCAqL1xuICBmdW5jdGlvbiBzZXRNZW51KG9wZW4pIHtcbiAgICBuYXYuY2xhc3NMaXN0LnRvZ2dsZShNRU5VT1BFTiwgb3Blbik7XG4gICAgaWYgKGJ1cmdlcikgYnVyZ2VyLnNldEF0dHJpYnV0ZSgnYXJpYS1leHBhbmRlZCcsIG9wZW4gPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICBpZiAocGFuZWwpIHBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBvcGVuID8gJ2ZhbHNlJyA6ICd0cnVlJyk7XG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoJ25hdi1tb2JpbGUtb3BlbicsIG9wZW4pO1xuICAgIGRvY3VtZW50LmJvZHkuY2xhc3NMaXN0LnRvZ2dsZSgnbmF2LW1vYmlsZS1vcGVuJywgb3Blbik7XG4gICAgaWYgKHdpbmRvdy5sZW5pcykgb3BlbiA/IGxlbmlzLnN0b3AoKSA6IGxlbmlzLnN0YXJ0KCk7ICAvLyBvdmVyZmxvdzpoaWRkZW4gYWxvbmUgd29uJ3Qgc3RvcCBMZW5pc1xuICB9XG5cbiAgdmFyIG9uRW50ZXIgPSBmdW5jdGlvbiAoKSB7IGNsZWFyVGltZW91dChob3ZlclRpbWVyKTsgc2V0RHJvcCh0cnVlKTsgfTtcbiAgdmFyIG9uTGVhdmUgPSBmdW5jdGlvbiAoKSB7IGhvdmVyVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgc2V0RHJvcChmYWxzZSk7IH0sIDEyMCk7IH07XG4gIHZhciBvblRyaWdnZXJDbGljayA9IGZ1bmN0aW9uIChlKSB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICghY2FuSG92ZXIpIHNldERyb3AoIWRyb3AuY2xhc3NMaXN0LmNvbnRhaW5zKE9QRU4pKTsgICAvLyB0b3VjaDogY2xpY2sgPSB0b2dnbGVcbiAgfTtcbiAgdmFyIG9uRG9jQ2xpY2sgPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChkcm9wICYmIGRyb3AuY2xhc3NMaXN0LmNvbnRhaW5zKE9QRU4pICYmICFkcm9wLmNvbnRhaW5zKGUudGFyZ2V0KSkgc2V0RHJvcChmYWxzZSk7XG4gIH07XG4gIHZhciBvbkJ1cmdlciA9IGZ1bmN0aW9uICgpIHsgc2V0TWVudSghbmF2LmNsYXNzTGlzdC5jb250YWlucyhNRU5VT1BFTikpOyB9O1xuICB2YXIgb25MaW5rQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IGlmIChuYXYuY2xhc3NMaXN0LmNvbnRhaW5zKE1FTlVPUEVOKSkgc2V0TWVudShmYWxzZSk7IH07XG4gIHZhciBvbktleSA9IGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUua2V5ICE9PSAnRXNjYXBlJyAmJiBlLmtleSAhPT0gJ0VzYycpIHJldHVybjtcbiAgICBzZXREcm9wKGZhbHNlKTsgc2V0TWVudShmYWxzZSk7XG4gIH07XG4gIHZhciBvblJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gOTkyICYmIG5hdi5jbGFzc0xpc3QuY29udGFpbnMoTUVOVU9QRU4pKSBzZXRNZW51KGZhbHNlKTtcbiAgfTtcblxuICBpZiAoZHJvcCkgeyBkcm9wLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbkVudGVyKTsgZHJvcC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWxlYXZlJywgb25MZWF2ZSk7IH1cbiAgaWYgKHRyaWdnZXIpIHRyaWdnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvblRyaWdnZXJDbGljayk7XG4gIGlmIChidXJnZXIpIGJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQnVyZ2VyKTtcblxuICAvLyBTYW1lIGxpbmtzIGFzIG9uIGRlc2t0b3AgLSBjbGljayBjbG9zZXMgdGhlIHBhbmVsIChuby1vcCBvbiBkZXNrdG9wKVxuICB2YXIgbGlua3MgPSBwYW5lbFxuICAgID8gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocGFuZWwucXVlcnlTZWxlY3RvckFsbCgnLm5hdl9saW5rLCAubmF2X2Ryb3Bkb3duLWxpbmssIC5uYXZfY3RhJykpXG4gICAgOiBbXTtcbiAgbGlua3MuZm9yRWFjaChmdW5jdGlvbiAoYSkgeyBhLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25MaW5rQ2xpY2spOyB9KTtcblxuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uRG9jQ2xpY2spO1xuICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXkpO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25SZXNpemUpO1xuXG4gIG5hdk1lbnVDbGVhbnVwID0gZnVuY3Rpb24gKCkge1xuICAgIGlmIChkcm9wKSB7IGRyb3AucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VlbnRlcicsIG9uRW50ZXIpOyBkcm9wLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBvbkxlYXZlKTsgfVxuICAgIGlmICh0cmlnZ2VyKSB0cmlnZ2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25UcmlnZ2VyQ2xpY2spO1xuICAgIGlmIChidXJnZXIpIGJ1cmdlci5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQnVyZ2VyKTtcbiAgICBsaW5rcy5mb3JFYWNoKGZ1bmN0aW9uIChhKSB7IGEucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBvbkxpbmtDbGljayk7IH0pO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Eb2NDbGljayk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIG9uS2V5KTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncmVzaXplJywgb25SZXNpemUpO1xuICAgIGNsZWFyVGltZW91dChob3ZlclRpbWVyKTtcbiAgICBuYXZNZW51Q2xlYW51cCA9IG51bGw7XG4gIH07XG59XG5cbi8vID4gUGFyYWxsYXggW1RPIENIRUNLXVxuZnVuY3Rpb24gaW5pdEdsb2JhbFBhcmFsbGF4KCkge1xuICBjb25zdCBtbSA9IGdzYXAubWF0Y2hNZWRpYSgpXG5cbiAgbW0uYWRkKFxuICAgIHtcbiAgICAgIGlzTW9iaWxlOiBcIihtYXgtd2lkdGg6NDc5cHgpXCIsXG4gICAgICBpc01vYmlsZUxhbmRzY2FwZTogXCIobWF4LXdpZHRoOjc2N3B4KVwiLFxuICAgICAgaXNUYWJsZXQ6IFwiKG1heC13aWR0aDo5OTFweClcIixcbiAgICAgIGlzRGVza3RvcDogXCIobWluLXdpZHRoOjk5MnB4KVwiXG4gICAgfSxcbiAgICAoY29udGV4dCkgPT4ge1xuICAgICAgY29uc3QgeyBpc01vYmlsZSwgaXNNb2JpbGVMYW5kc2NhcGUsIGlzVGFibGV0IH0gPSBjb250ZXh0LmNvbmRpdGlvbnNcblxuICAgICAgY29uc3QgY3R4ID0gZ3NhcC5jb250ZXh0KCgpID0+IHtcbiAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcGFyYWxsYXg9XCJ0cmlnZ2VyXCJdJykuZm9yRWFjaCgodHJpZ2dlcikgPT4ge1xuICAgICAgICAgIC8vIERpc2FibGVkIG9uIHNtYWxsZXIgYnJlYWtwb2ludHM/XG4gICAgICAgICAgY29uc3QgZGlzYWJsZSA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYXJhbGxheC1kaXNhYmxlXCIpXG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgKGRpc2FibGUgPT09IFwibW9iaWxlXCIgJiYgaXNNb2JpbGUpIHx8XG4gICAgICAgICAgICAoZGlzYWJsZSA9PT0gXCJtb2JpbGVMYW5kc2NhcGVcIiAmJiBpc01vYmlsZUxhbmRzY2FwZSkgfHxcbiAgICAgICAgICAgIChkaXNhYmxlID09PSBcInRhYmxldFwiICYmIGlzVGFibGV0KVxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gT3B0aW9uYWwgaW5uZXIgdGFyZ2V0XG4gICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdHJpZ2dlci5xdWVyeVNlbGVjdG9yKCdbZGF0YS1wYXJhbGxheD1cInRhcmdldFwiXScpIHx8IHRyaWdnZXJcblxuICAgICAgICAgIC8vIERpcmVjdGlvbiBkZWNpZGVzIGJldHdlZW4geFBlcmNlbnQgYW5kIHlQZXJjZW50XG4gICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhcmFsbGF4LWRpcmVjdGlvblwiKSB8fCBcInZlcnRpY2FsXCJcbiAgICAgICAgICBjb25zdCBwcm9wID0gZGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIiA/IFwieFBlcmNlbnRcIiA6IFwieVBlcmNlbnRcIlxuXG4gICAgICAgICAgLy8gU2NydWIgdmFsdWUsIGRlZmF1bHQgJ3RydWUnIChmZWVscyByaWdodCB3aXRoIExlbmlzKVxuICAgICAgICAgIGNvbnN0IHNjcnViQXR0ciA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYXJhbGxheC1zY3J1YlwiKVxuICAgICAgICAgIGNvbnN0IHNjcnViID0gc2NydWJBdHRyID8gcGFyc2VGbG9hdChzY3J1YkF0dHIpIDogdHJ1ZVxuXG4gICAgICAgICAgLy8gU3RhcnQgcG9zaXRpb24gaW4gJVxuICAgICAgICAgIGNvbnN0IHN0YXJ0QXR0ciA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYXJhbGxheC1zdGFydFwiKVxuICAgICAgICAgIGNvbnN0IHN0YXJ0VmFsID0gc3RhcnRBdHRyICE9PSBudWxsID8gcGFyc2VGbG9hdChzdGFydEF0dHIpIDogMjBcblxuICAgICAgICAgIC8vIEVuZCBwb3NpdGlvbiBpbiAlXG4gICAgICAgICAgY29uc3QgZW5kQXR0ciA9IHRyaWdnZXIuZ2V0QXR0cmlidXRlKFwiZGF0YS1wYXJhbGxheC1lbmRcIilcbiAgICAgICAgICBjb25zdCBlbmRWYWwgPSBlbmRBdHRyICE9PSBudWxsID8gcGFyc2VGbG9hdChlbmRBdHRyKSA6IC0yMFxuXG4gICAgICAgICAgLy8gU2Nyb2xsVHJpZ2dlciBzdGFydFxuICAgICAgICAgIGNvbnN0IHNjcm9sbFN0YXJ0UmF3ID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhcmFsbGF4LXNjcm9sbC1zdGFydFwiKSB8fCBcInRvcCBib3R0b21cIlxuICAgICAgICAgIGNvbnN0IHNjcm9sbFN0YXJ0ID0gYGNsYW1wKCR7c2Nyb2xsU3RhcnRSYXd9KWBcblxuICAgICAgICAgIC8vIFNjcm9sbFRyaWdnZXIgZW5kXG4gICAgICAgICAgY29uc3Qgc2Nyb2xsRW5kUmF3ID0gdHJpZ2dlci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBhcmFsbGF4LXNjcm9sbC1lbmRcIikgfHwgXCJib3R0b20gdG9wXCJcbiAgICAgICAgICBjb25zdCBzY3JvbGxFbmQgPSBgY2xhbXAoJHtzY3JvbGxFbmRSYXd9KWBcblxuICAgICAgICAgIGdzYXAuZnJvbVRvKFxuICAgICAgICAgICAgdGFyZ2V0LFxuICAgICAgICAgICAgeyBbcHJvcF06IHN0YXJ0VmFsIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFtwcm9wXTogZW5kVmFsLFxuICAgICAgICAgICAgICBlYXNlOiBcIm5vbmVcIixcbiAgICAgICAgICAgICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgICAgICAgICAgIHRyaWdnZXIsXG4gICAgICAgICAgICAgICAgc3RhcnQ6IHNjcm9sbFN0YXJ0LFxuICAgICAgICAgICAgICAgIGVuZDogc2Nyb2xsRW5kLFxuICAgICAgICAgICAgICAgIHNjcnViLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH0pXG5cbiAgICAgIHJldHVybiAoKSA9PiBjdHgucmV2ZXJ0KClcbiAgICB9XG4gIClcbn1cblxuLy8gPiBQcmVsb2FkZXJcbmZ1bmN0aW9uIHByZWxvYWRlcigpIHtcbiAgaWYgKCF3aW5kb3cuZ3NhcCkgcmV0dXJuIG51bGw7XG5cbiAgdmFyIGxvYWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIubG9hZGVyX2NvbXBvbmVudFwiKTtcbiAgaWYgKCFsb2FkZXIpIHJldHVybiBudWxsO1xuXG4gIHZhciBjYXBMID0gbG9hZGVyLnF1ZXJ5U2VsZWN0b3IoXCIubG9hZGVyX2NhcHRpb24uaXMtbGVmdFwiKTtcbiAgdmFyIGNhcFIgPSBsb2FkZXIucXVlcnlTZWxlY3RvcihcIi5sb2FkZXJfY2FwdGlvbi5pcy1yaWdodFwiKTtcbiAgdmFyIHNxdWFyZSA9IGxvYWRlci5xdWVyeVNlbGVjdG9yKFwiLmxvYWRlcl9kZWNvLXNxdWFyZVwiKTtcbiAgdmFyIGNpcmNsZSA9IGxvYWRlci5xdWVyeVNlbGVjdG9yKFwiLmxvYWRlcl9kZWNvXCIpO1xuXG4gIHZhciBkID0gY2lyY2xlID8gKGNpcmNsZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS53aWR0aCB8fCAzMCkgOiAzMDtcbiAgdmFyIGNvdmVyU2NhbGUgPSBNYXRoLmNlaWwoTWF0aC5oeXBvdCh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KSAvIGQpICsgNDtcblxuICB2YXIgdGwgPSBnc2FwLnRpbWVsaW5lKHsgZGVsYXk6IDAuNSwgZGVmYXVsdHM6IHsgZWFzZTogXCJleHBvLm91dFwiLCBkdXJhdGlvbjogMSB9IH0pO1xuXG4gIHRsLmFkZExhYmVsKFwidGV4dHNcIilcbiAgICAudG8oY2FwTCwgeyB0b3A6IFwiNTAlXCIsIHlQZXJjZW50OiAtNTAgfSwgXCJ0ZXh0c1wiKVxuICAgIC50byhjYXBSLCB7IGJvdHRvbTogXCI1MCVcIiwgeVBlcmNlbnQ6IDUwIH0sIFwidGV4dHNcIik7XG5cbiAgdmFyIGEgPSBzcXVhcmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIGIgPSBjaXJjbGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIHZhciBoYWxmID0gKChiLmxlZnQgKyBiLndpZHRoIC8gMikgLSAoYS5sZWZ0ICsgYS53aWR0aCAvIDIpKSAvIDI7XG5cbiAgdGwuYWRkTGFiZWwoXCJzaGFwZXNcIiwgXCJ0ZXh0cys9MC40NVwiKVxuICAgIC50byhzcXVhcmUsIHsgeDogaGFsZiwgcm90YXRpb246IDkwLCBib3JkZXJSYWRpdXM6IFwiNTAlXCIsIGR1cmF0aW9uOiAxLjAsIGVhc2U6IFwicG93ZXIzLm91dFwiIH0sIFwic2hhcGVzXCIpXG4gICAgLnRvKGNpcmNsZSwgeyB4OiAtaGFsZiwgZHVyYXRpb246IDEuMCwgZWFzZTogXCJwb3dlcjMub3V0XCIgfSwgXCJzaGFwZXNcIik7XG5cbiAgLy8gQ2lyY2xlIHNjYWxlcyB0byBmdWxsIHNjcmVlbiByaWdodCBhZnRlciB0aGUgc2hhcGVzIG1lcmdlXG4gIHRsLnRvKHNxdWFyZSwgeyBhdXRvQWxwaGE6IDAsIGR1cmF0aW9uOiAwLjIgfSwgXCJzaGFwZXMrPTAuOFwiKVxuICAgIC50byhjaXJjbGUsIHsgc2NhbGU6IGNvdmVyU2NhbGUsIGR1cmF0aW9uOiAwLjgsIGVhc2U6IFwicG93ZXI0LmluXCIgfSwgXCI8XCIpO1xuXG4gIHRsLnRvKGxvYWRlciwgeyBhdXRvQWxwaGE6IDAsIGR1cmF0aW9uOiAwLjM1LCBlYXNlOiBcInBvd2VyMi5vdXRcIiB9KVxuICAgIC5zZXQobG9hZGVyLCB7IGRpc3BsYXk6IFwibm9uZVwiIH0pO1xuXG4gIC8vIC0tLSBIRVJPIEFOSU1BVElPTiAtLS1cblxuICB2YXIgaGVyb0hlYWRpbmcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zcGxpdD1cImhlYWRpbmdcIl0uaG9tZS1oZXJvX2hlYWRpbmcsIC5ob21lLWhlcm9faGVhZGluZycpO1xuICB2YXIgaGVyb1N1YnRpdGxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc3BsaXQ9XCJzdWJ0aXRsZVwiXS5ob21lLWhlcm9fc3VidGl0bGUsIC5ob21lLWhlcm9fc3VidGl0bGUnKTtcbiAgdmFyIGhlcm9CZyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuaG9tZS1oZXJvX2JhY2tncm91bmRcIik7XG5cbiAgdmFyIFNwbGl0VGV4dENsYXNzID0gd2luZG93LlNwbGl0VGV4dCB8fCBnc2FwLnBsdWdpbnM/LlNwbGl0VGV4dDtcblxuICB0bC5hZGRMYWJlbChcImhlcm9TdGFydFwiLCBcIi09MC42XCIpO1xuXG4gIGlmIChoZXJvQmcpIHtcbiAgICB0bC50byhoZXJvQmcsIHsgc2NhbGU6IDEsIGR1cmF0aW9uOiAyLjUsIGVhc2U6IFwicG93ZXIzLm91dFwiIH0sIFwiaGVyb1N0YXJ0XCIpO1xuICB9XG5cbiAgLy8gU3BsaXQgZmlyZXMgZXhhY3RseSBvbiB0aGUgZnJhbWUgdGhlIGNvdmVyIGRpc2FwcGVhcnNcbiAgdGwuYWRkKCgpID0+IHtcbiAgICBpZiAoaGVyb0hlYWRpbmcgJiYgU3BsaXRUZXh0Q2xhc3MpIHtcbiAgICAgIHZhciBzcGxpdEggPSBTcGxpdFRleHRDbGFzcy5jcmVhdGUoaGVyb0hlYWRpbmcsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIsIGF1dG9TcGxpdDogdHJ1ZSB9KTtcbiAgICAgIGlmIChzcGxpdEggJiYgc3BsaXRILmxpbmVzKSB7XG4gICAgICAgIGdzYXAuZnJvbVRvKHNwbGl0SC5saW5lcyxcbiAgICAgICAgICB7IHlQZXJjZW50OiAxMTAgfSxcbiAgICAgICAgICB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogMC44LCBzdGFnZ2VyOiAwLjEsIGVhc2U6IFwiZXhwby5vdXRcIiB9XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGhlcm9TdWJ0aXRsZSAmJiBTcGxpdFRleHRDbGFzcykge1xuICAgICAgdmFyIHNwbGl0UyA9IFNwbGl0VGV4dENsYXNzLmNyZWF0ZShoZXJvU3VidGl0bGUsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIsIGF1dG9TcGxpdDogdHJ1ZSB9KTtcbiAgICAgIGlmIChzcGxpdFMgJiYgc3BsaXRTLmxpbmVzKSB7XG4gICAgICAgIGdzYXAuZnJvbVRvKHNwbGl0Uy5saW5lcyxcbiAgICAgICAgICB7IHlQZXJjZW50OiAxMTAgfSxcbiAgICAgICAgICB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogMC44LCBzdGFnZ2VyOiAwLjEsIGVhc2U6IFwiZXhwby5vdXRcIiwgZGVsYXk6IDAuMzUgfVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSwgXCJoZXJvU3RhcnQrPTAuMlwiKTtcblxuICByZXR1cm4gdGw7XG59XG5cbi8vID4gSW50cm8gLSBIZXJvIFNlY3Rpb25cbmZ1bmN0aW9uIGluaXRIZXJvSW50cm8oc2NvcGUgPSBkb2N1bWVudCkge1xuICBjb25zdCBoZXJvID0gc2NvcGUucXVlcnlTZWxlY3RvcignW2RhdGEtaGVyb10nKTtcbiAgaWYgKCFoZXJvKSByZXR1cm47XG5cbiAgY29uc3QgZGl2aWRlck1hc2sgPSBoZXJvLnF1ZXJ5U2VsZWN0b3IoJy5kaXZpZGVyLW1hc2snKTtcbiAgY29uc3QgaW1hZ2VNYXNrID0gaGVyby5xdWVyeVNlbGVjdG9yKCcuaW1hZ2UtbWFzaycpO1xuICBjb25zdCBkb3QgPSBoZXJvLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXJldmVhbD1cImRvdFwiXScpO1xuICBjb25zdCBsYWJlbCA9IGhlcm8ucXVlcnlTZWxlY3RvcignW2RhdGEtcmV2ZWFsPVwibGFiZWxcIl0nKTtcbiAgY29uc3Qgc3BsaXRzID0gWy4uLmhlcm8ucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtc3BsaXQ9XCJoZWFkaW5nXCJdJyldO1xuXG4gIGdzYXAuc2V0KFtoZXJvLCBkb3QsIGxhYmVsLCAuLi5zcGxpdHNdLmZpbHRlcihCb29sZWFuKSwgeyBhdXRvQWxwaGE6IDEgfSk7XG5cbiAgY29uc3QgdGwgPSBnc2FwLnRpbWVsaW5lKHsgZGVmYXVsdHM6IHsgZWFzZTogXCJleHBvLm91dFwiLCBkdXJhdGlvbjogMC45IH0gfSk7XG5cbiAgY29uc3QgcmV2ZWFsU3BsaXQgPSAoZWwsIGF0KSA9PiB7XG4gICAgY29uc3QgcyA9IFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSk7XG4gICAgaWYgKHMubGluZXMubGVuZ3RoKSB0bC5mcm9tKHMubGluZXMsIHsgeVBlcmNlbnQ6IDExMCwgc3RhZ2dlcjogMC4xNSwgZHVyYXRpb246IDEuMjUgfSwgYXQpO1xuICB9O1xuXG4gIC8vIDEuIGhlYWRpbmcgKyBwYXJhZ3JhcGhcbiAgaWYgKHNwbGl0c1swXSkgcmV2ZWFsU3BsaXQoc3BsaXRzWzBdLCAwKTtcbiAgc3BsaXRzLnNsaWNlKDEpLmZvckVhY2goKGVsKSA9PiByZXZlYWxTcGxpdChlbCwgMC4xNSkpO1xuXG4gIC8vIDIuIGxpbmUgLSBtYXNrXG4gIGlmIChkaXZpZGVyTWFzaykgdGwudG8oZGl2aWRlck1hc2ssIHsgc2NhbGVYOiAwLCB0cmFuc2Zvcm1PcmlnaW46IFwicmlnaHQgY2VudGVyXCIsIGR1cmF0aW9uOiAxIH0sIDAuMik7XG5cbiAgLy8gMy4gaW1nIC0gbWFza1xuICBpZiAoaW1hZ2VNYXNrKSB0bC50byhpbWFnZU1hc2ssIHsgc2NhbGVYOiAwLCB0cmFuc2Zvcm1PcmlnaW46IFwicmlnaHQgY2VudGVyXCIsIGR1cmF0aW9uOiAxLjEgfSwgMC40KTtcblxuICAvLyA0LiBkb3QgKyBsYWJlbFxuICBpZiAoZG90KSB0bC5mcm9tKGRvdCwgeyBzY2FsZTogMCwgdHJhbnNmb3JtT3JpZ2luOiBcImNlbnRlclwiLCBlYXNlOiBcImJhY2sub3V0KDMpXCIsIGR1cmF0aW9uOiAwLjYgfSwgXCI+LTAuNVwiKTtcbiAgaWYgKGxhYmVsKSB0bC5mcm9tKGxhYmVsLCB7IGF1dG9BbHBoYTogMCwgeTogMTIsIGR1cmF0aW9uOiAwLjUgfSwgXCI8MC4xXCIpO1xuXG4gIHJldHVybiB0bDtcbn1cblxuLy8gPiBUZXh0IFJldmVhbFxuZnVuY3Rpb24gaW5pdFNjcm9sbFJldmVhbChzY29wZSA9IGRvY3VtZW50KSB7XG4gIHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNwbGl0PVwiaGVhZGluZ1wiXScpLmZvckVhY2goKGhlYWRpbmcpID0+IHtcbiAgICBpZiAoaGVhZGluZy5jbG9zZXN0KCdbZGF0YS1oZXJvXScpKSByZXR1cm47ICAgLy8gaGVybyBpcyBoYW5kbGVkIGJ5IGluaXRIZXJvSW50cm9cbiAgICBnc2FwLnNldChoZWFkaW5nLCB7IGF1dG9BbHBoYTogMSB9KTsgICAgICAgICAgLy8gRk9VQyByZXNldFxuXG4gICAgY29uc3Qgc3BsaXQgPSBTcGxpdFRleHQuY3JlYXRlKGhlYWRpbmcsIHtcbiAgICAgIHR5cGU6IFwibGluZXNcIixcbiAgICAgIGF1dG9TcGxpdDogdHJ1ZSxcbiAgICAgIG1hc2s6IFwibGluZXNcIixcbiAgICAgIG9uU3BsaXQoaW5zdGFuY2UpIHtcbiAgICAgICAgcmV0dXJuIGdzYXAuZnJvbShpbnN0YW5jZS5saW5lcywge1xuICAgICAgICAgIHlQZXJjZW50OiAxMTAsXG4gICAgICAgICAgZHVyYXRpb246IDAuOCxcbiAgICAgICAgICBzdGFnZ2VyOiAwLjEsXG4gICAgICAgICAgZWFzZTogXCJleHBvLm91dFwiLFxuICAgICAgICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgICAgICAgIHRyaWdnZXI6IGhlYWRpbmcsXG4gICAgICAgICAgICBzdGFydDogXCJ0b3AgODAlXCIsXG4gICAgICAgICAgICBvbmNlOiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc2Nyb2xsUmV2ZWFsU3BsaXRzLnB1c2goc3BsaXQpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVzdHJveVNjcm9sbFJldmVhbCgpIHtcbiAgc2Nyb2xsUmV2ZWFsU3BsaXRzLmZvckVhY2goKHNwbGl0KSA9PiBzcGxpdC5yZXZlcnQoKSk7XG4gIHNjcm9sbFJldmVhbFNwbGl0cyA9IFtdO1xufVxuXG4vLyA+IEhvcml6b250YWwgTGluZXMgUmV2ZWFsIChTZWN0aW9uIEhlYWRpbmcpXG5mdW5jdGlvbiBpbml0SEtQTGluZXMoc2NvcGUgPSBkb2N1bWVudCkge1xuICBpZiAoIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuXG4gIHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbaGtwLWxpbmVdXCIpLmZvckVhY2goKGxpbmUpID0+IHtcbiAgICBjb25zdCB2YWwgPSBsaW5lLmdldEF0dHJpYnV0ZShcImhrcC1saW5lXCIpIHx8IFwiXCI7XG4gICAgY29uc3QgaXNSaWdodCA9IHZhbC5pbmNsdWRlcyhcInJpZ2h0XCIpO1xuXG4gICAgY29uc3Qgc3RhcnRDbGlwID0gaXNSaWdodCA/IFwiaW5zZXQoMCUgMCUgMCUgMTAwJSlcIiA6IFwiaW5zZXQoMCUgMTAwJSAwJSAwJSlcIjtcblxuICAgIGdzYXAuZnJvbVRvKFxuICAgICAgbGluZSxcbiAgICAgIHsgY2xpcFBhdGg6IHN0YXJ0Q2xpcCB9LFxuICAgICAge1xuICAgICAgICBjbGlwUGF0aDogXCJpbnNldCgwJSAwJSAwJSAwJSlcIixcbiAgICAgICAgZHVyYXRpb246IDEsXG4gICAgICAgIGVhc2U6IFwicG93ZXIzLm91dFwiLFxuICAgICAgICBzY3JvbGxUcmlnZ2VyOiB7XG4gICAgICAgICAgdHJpZ2dlcjogbGluZSxcbiAgICAgICAgICBzdGFydDogXCJ0b3AgODUlXCIsXG4gICAgICAgICAgb25jZTogdHJ1ZSxcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApO1xuICB9KTtcbn1cblxuLy8gPiBTY3JvbGwgSW50byBWaWV3IC0gRmFkZSAmIFNsaWRlIFVwXG5mdW5jdGlvbiBpbml0U2l2UmV2ZWFsRmFkZSgpIHtcbiAgY29uc3QgZWxlbWVudHMgPSBnc2FwLnV0aWxzLnRvQXJyYXkoXCJbc2l2LXJldmVhbC1mYWRlXVwiKTtcbiAgZWxlbWVudHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgIGdzYXAuZnJvbVRvKFxuICAgICAgZWxlbWVudCxcbiAgICAgIHsgb3BhY2l0eTogMCwgeTogXCIyLjVyZW1cIiwgZmlsdGVyOiBcImJsdXIoOHB4KVwiIH0sXG4gICAgICB7XG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIHk6IDAsXG4gICAgICAgIGZpbHRlcjogXCJibHVyKDBweClcIixcbiAgICAgICAgZHVyYXRpb246IDEuMixcbiAgICAgICAgc3RhZ2dlcjogMC4yNSxcbiAgICAgICAgZWFzZTogXCJwb3dlcjMub3V0XCIsXG4gICAgICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgICAgICB0cmlnZ2VyOiBlbGVtZW50LFxuICAgICAgICAgIHN0YXJ0OiBcInRvcCA4MCVcIixcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApO1xuICB9KTtcbn1cblxuLy8gPiBTY3JvbGwgSW50byBWaWV3IC0gR3JpZCBTdGFnZ2VyXG5mdW5jdGlvbiBpbml0U2l2UmV2ZWFsR3JpZCgpIHtcbiAgY29uc3QgZ3JpZHMgPSBnc2FwLnV0aWxzLnRvQXJyYXkoXCJbc2l2LXJldmVhbC1ncmlkXVwiKTtcbiAgZ3JpZHMuZm9yRWFjaCgoZ3JpZCkgPT4ge1xuICAgIGNvbnN0IGl0ZW1zID0gZ3JpZC5jaGlsZHJlbjtcbiAgICBpZiAoIWl0ZW1zLmxlbmd0aCkgcmV0dXJuO1xuICAgIGdzYXAuZnJvbVRvKFxuICAgICAgaXRlbXMsXG4gICAgICB7IG9wYWNpdHk6IDAsIHk6IDQwLCBmaWx0ZXI6IFwiYmx1cig4cHgpXCIgfSxcbiAgICAgIHtcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgeTogMCxcbiAgICAgICAgZmlsdGVyOiBcImJsdXIoMHB4KVwiLFxuICAgICAgICBkdXJhdGlvbjogMC44LFxuICAgICAgICBzdGFnZ2VyOiAwLjExLFxuICAgICAgICBlYXNlOiBcInBvd2VyMy5vdXRcIixcbiAgICAgICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgICAgIHRyaWdnZXI6IGdyaWQsXG4gICAgICAgICAgc3RhcnQ6IFwidG9wIDgwJVwiLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH0pO1xufVxuXG4vLyA+IFNjcm9sbCBJbnRvIFZpZXcgLSBEaXZpZGVyIEhlaWdodFxuZnVuY3Rpb24gaW5pdERpdmlkZXJIZWlnaHQoKSB7XG4gIGNvbnN0IGRpdmlkZXJzID0gZ3NhcC51dGlscy50b0FycmF5KFwiW2RhdGEtZGl2aWRlci1oZWlnaHRdXCIpO1xuICBkaXZpZGVycy5mb3JFYWNoKChkaXZpZGVyKSA9PiB7XG4gICAgZ3NhcC5mcm9tVG8oXG4gICAgICBkaXZpZGVyLFxuICAgICAgeyBoZWlnaHQ6IFwiMCVcIiwgdHJhbnNmb3JtT3JpZ2luOiBcInRvcCBjZW50ZXJcIiB9LFxuICAgICAge1xuICAgICAgICBoZWlnaHQ6IFwiMTAwJVwiLFxuICAgICAgICBkdXJhdGlvbjogMS41LFxuICAgICAgICBlYXNlOiBcInBvd2VyMy5vdXRcIixcbiAgICAgICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgICAgIHRyaWdnZXI6IGRpdmlkZXIsXG4gICAgICAgICAgc3RhcnQ6IFwidG9wIDY1JVwiLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH0pO1xufVxuXG4vLyA+IFNjcm9sbCBJbnRvIFZpZXcgLSBWZXJ0aWNhbCBCcmFja2V0IENsaXAgUGF0aFxuZnVuY3Rpb24gaW5pdEJyYWNrZXRDbGlwKCkge1xuICBjb25zdCBicmFja2V0cyA9IGdzYXAudXRpbHMudG9BcnJheShcIltkYXRhLWJyYWNrZXQtY2xpcF1cIik7XG4gIGlmICghYnJhY2tldHMubGVuZ3RoKSByZXR1cm47XG5cbiAgYnJhY2tldHMuZm9yRWFjaCgoYnJhY2tldCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGJyYWNrZXQucXVlcnlTZWxlY3RvcihcInN2Z1wiKSB8fCBicmFja2V0O1xuXG4gICAgZ3NhcC5mcm9tVG8oXG4gICAgICB0YXJnZXQsXG4gICAgICB7XG4gICAgICAgIGNsaXBQYXRoOiBcImluc2V0KDUwJSAwJSA1MCUgMCUpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBjbGlwUGF0aDogXCJpbnNldCgwJSAwJSAwJSAwJSlcIixcbiAgICAgICAgZHVyYXRpb246IDAuOCxcbiAgICAgICAgZWFzZTogXCJwb3dlcjMub3V0XCIsXG4gICAgICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgICAgICB0cmlnZ2VyOiBicmFja2V0LFxuICAgICAgICAgIHN0YXJ0OiBcInRvcCA4MCVcIixcbiAgICAgICAgfSxcbiAgICAgIH1cbiAgICApO1xuICB9KTtcbn1cblxuLy8gPiBTY3JvbGwgSW50byBWaWV3IC0gSW1hZ2UgU2NhbGVcbmZ1bmN0aW9uIGluaXRJbWdTY2FsZSgpIHtcbiAgY29uc3QgaW1hZ2VzID0gZ3NhcC51dGlscy50b0FycmF5KFwiW2RhdGEtaW1nLXNjYWxlXVwiKTtcbiAgaW1hZ2VzLmZvckVhY2goKGltZykgPT4ge1xuICAgIGdzYXAuZnJvbVRvKFxuICAgICAgaW1nLFxuICAgICAgeyBzY2FsZTogMS41IH0sXG4gICAgICB7XG4gICAgICAgIHNjYWxlOiAxLFxuICAgICAgICBkdXJhdGlvbjogMSxcbiAgICAgICAgZWFzZTogXCJwb3dlcjMub3V0XCIsXG4gICAgICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgICAgICB0cmlnZ2VyOiBpbWcsXG4gICAgICAgICAgc3RhcnQ6IFwidG9wIDgwJVwiLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH0pO1xufVxuXG4vLyA+IFNjcm9sbCBJbnRvIFZpZXcgLSBTcXVhcmUgRmFkZSBJblxuZnVuY3Rpb24gaW5pdFNxdWFyZUZhZGUoKSB7XG4gIGNvbnN0IHNxdWFyZXMgPSBnc2FwLnV0aWxzLnRvQXJyYXkoXCJbZGF0YS1zcXVhcmUtb3BhY2l0eV1cIik7XG4gIGlmICghc3F1YXJlcy5sZW5ndGgpIHJldHVybjtcblxuICBzcXVhcmVzLmZvckVhY2goKHNxdWFyZSkgPT4ge1xuICAgIGdzYXAuZnJvbVRvKFxuICAgICAgc3F1YXJlLFxuICAgICAge1xuICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgZHVyYXRpb246IDAuOCxcbiAgICAgICAgZWFzZTogXCJwb3dlcjIub3V0XCIsXG4gICAgICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgICAgICB0cmlnZ2VyOiBzcXVhcmUsXG4gICAgICAgICAgc3RhcnQ6IFwidG9wIDkwJVwiLFxuICAgICAgICAgIHRvZ2dsZUFjdGlvbnM6IFwicGxheSBub25lIG5vbmUgcmV2ZXJzZVwiLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH0pO1xufVxuXG4vLyA+IFNjcm9sbCBJbnRvIFZpZXcgLSBIb3Jpem9udGFsIERpdmlkZXIgQ2xpcCAoTGVmdCB0byBSaWdodClcbmZ1bmN0aW9uIGluaXRIb3JEaXZpZGVyUmV2ZWFsKCkge1xuICBjb25zdCBkaXZpZGVycyA9IGdzYXAudXRpbHMudG9BcnJheShcIltkYXRhLWhvci1kaXZpZGVyLXJldmVhbF1cIik7XG4gIGlmICghZGl2aWRlcnMubGVuZ3RoKSByZXR1cm47XG5cbiAgZGl2aWRlcnMuZm9yRWFjaCgoZGl2aWRlcikgPT4ge1xuICAgIGdzYXAuZnJvbVRvKFxuICAgICAgZGl2aWRlcixcbiAgICAgIHtcbiAgICAgICAgY2xpcFBhdGg6IFwiaW5zZXQoMCUgMTAwJSAwJSAwJSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGNsaXBQYXRoOiBcImluc2V0KDAlIDAlIDAlIDAlKVwiLFxuICAgICAgICBkdXJhdGlvbjogMC44LFxuICAgICAgICBlYXNlOiBcInBvd2VyMy5vdXRcIixcbiAgICAgICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgICAgIHRyaWdnZXI6IGRpdmlkZXIsXG4gICAgICAgICAgc3RhcnQ6IFwidG9wIDkwJVwiLFxuICAgICAgICAgIHRvZ2dsZUFjdGlvbnM6IFwicGxheSBub25lIG5vbmUgcmV2ZXJzZVwiLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH0pO1xufVxuXG4vLyA+IFBhcmFsbGF4IEZvb3RlclxuY29uc3QgZm9vdGVyTW0gPSBnc2FwLm1hdGNoTWVkaWEoKTtcbmNvbnN0IEZPT1RFUl9DSVJDTEVfU1RBUlQgPSAwLjg1OyAvLyBjaXJjbGUgc2xpZGVzIGluIG92ZXIgdGhlIGxhc3QgMTUlIG9mIHRoZSByZXZlYWwgKGVuZHMgd2l0aCBpdClcblxuZnVuY3Rpb24gaW5pdEZvb3RlclBhcmFsbGF4KCkge1xuICBjb25zdCBmb290ZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZm9vdGVyLXBhcmFsbGF4XScpO1xuICBpZiAoIWZvb3RlcnMubGVuZ3RoIHx8ICF3aW5kb3cuZ3NhcCB8fCAhd2luZG93LlNjcm9sbFRyaWdnZXIpIHJldHVybjtcblxuICBmb290ZXJNbS5yZXZlcnQoKTtcblxuICBmb290ZXJzLmZvckVhY2goZWwgPT4ge1xuICAgIGNvbnN0IHRyaWdnZXJFbCA9IGVsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZvb3Rlci1jb250YWluZXJdJykgfHwgZWw7XG4gICAgY29uc3QgaW5uZXIgPSBlbC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1mb290ZXItcGFyYWxsYXgtaW5uZXJdJyk7XG4gICAgY29uc3QgZGFyayA9IGVsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLWZvb3Rlci1wYXJhbGxheC1kYXJrXScpO1xuICAgIGNvbnN0IGNpcmNsZSA9IGVsLnF1ZXJ5U2VsZWN0b3IoJy5zaXRlLWZvb3Rlcl9jaXJjbGUnKTtcblxuICAgIGlmICghaW5uZXIgJiYgIWRhcmsgJiYgIWNpcmNsZSkgcmV0dXJuO1xuXG4gICAgY29uc3QgaXNEZXNrdG9wT25seSA9IGVsLmhhc0F0dHJpYnV0ZSgnZGF0YS1mb290ZXItZGVza3RvcC1vbmx5Jyk7XG4gICAgY29uc3QgY29uZGl0aW9uID0gaXNEZXNrdG9wT25seSA/IFwiKG1pbi13aWR0aDogNzY4cHgpXCIgOiBcImFsbFwiO1xuXG4gICAgZm9vdGVyTW0uYWRkKGNvbmRpdGlvbiwgKCkgPT4ge1xuICAgICAgY29uc3QgdGwgPSBnc2FwLnRpbWVsaW5lKHtcbiAgICAgICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgICAgIHRyaWdnZXI6IHRyaWdnZXJFbCxcbiAgICAgICAgICBzdGFydDogJ2NsYW1wKHRvcCBib3R0b20pJyxcbiAgICAgICAgICBlbmQ6ICdjbGFtcCh0b3AgdG9wKScsXG4gICAgICAgICAgc2NydWI6IHRydWUsXG4gICAgICAgICAgaW52YWxpZGF0ZU9uUmVmcmVzaDogdHJ1ZVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgaWYgKGlubmVyKSB7XG4gICAgICAgIHRsLmZyb20oaW5uZXIsIHtcbiAgICAgICAgICB5UGVyY2VudDogLTI1LFxuICAgICAgICAgIGVhc2U6ICdub25lJ1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGRhcmspIHtcbiAgICAgICAgdGwuZnJvbShkYXJrLCB7XG4gICAgICAgICAgb3BhY2l0eTogMC41LFxuICAgICAgICAgIGVhc2U6ICdub25lJ1xuICAgICAgICB9LCAwKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNpcmNsZSkge1xuICAgICAgICB0bC50byhjaXJjbGUsIHtcbiAgICAgICAgICB4UGVyY2VudDogMCxcbiAgICAgICAgICB4OiAwLFxuICAgICAgICAgIGR1cmF0aW9uOiAxIC0gRk9PVEVSX0NJUkNMRV9TVEFSVCxcbiAgICAgICAgICBlYXNlOiAnbm9uZSdcbiAgICAgICAgfSwgRk9PVEVSX0NJUkNMRV9TVEFSVCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5cblxuLy8gLS0tIEhPTUUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vID4gSGVybyBcIm1vcmVcIiBidXR0b24gLSBmYWRlcyBvdXQgYWZ0ZXIgMTAlIG9mIHZpZXdwb3J0IHNjcm9sbGVkXG5mdW5jdGlvbiBpbml0SGVyb01vcmVIaWRlKCkge1xuICB2YXIgYnRuID0gbmV4dFBhZ2UucXVlcnlTZWxlY3RvcignLnAtaGVyb19tb3JlJyk7XG4gIGlmICghYnRuIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuXG4gIGZ1bmN0aW9uIHVwZGF0ZShzZWxmKSB7XG4gICAgYnRuLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWhpZGRlbicsIHNlbGYucHJvZ3Jlc3MgPj0gMSk7XG4gIH1cblxuICAvLyBubyBvd24gbGlzdGVuZXJzOiBTY3JvbGxUcmlnZ2VyIGlzIExlbmlzLXN5bmNlZCBhbmQgQmFyYmEga2lsbHMgdHJpZ2dlcnNcbiAgU2Nyb2xsVHJpZ2dlci5jcmVhdGUoe1xuICAgIHN0YXJ0OiAwLFxuICAgIGVuZDogZnVuY3Rpb24gKCkgeyByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0ICogMC4xOyB9LFxuICAgIG9uVXBkYXRlOiB1cGRhdGUsXG4gICAgb25SZWZyZXNoOiB1cGRhdGVcbiAgfSk7XG59XG5cbi8vID4gSGVybyAtIE92ZXJsYXlcbmZ1bmN0aW9uIGluaXRIZXJvT3ZlcmxheSgpIHtcbiAgdmFyIG92ZXJsYXkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2hvbWUtaGVyby1vdmVybGF5XVwiKTtcbiAgdmFyIHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2hvbWUtaGVyby1zY3JvbGxdXCIpO1xuXG4gIGlmICghb3ZlcmxheSB8fCAhdHJpZ2dlciB8fCAhd2luZG93LmdzYXAgfHwgIXdpbmRvdy5TY3JvbGxUcmlnZ2VyKSByZXR1cm47XG5cbiAgZ3NhcC50byhvdmVybGF5LCB7XG4gICAgb3BhY2l0eTogMSxcbiAgICBlYXNlOiBcInBvd2VyMi5vdXRcIixcbiAgICBzY3JvbGxUcmlnZ2VyOiB7XG4gICAgICB0cmlnZ2VyOiB0cmlnZ2VyLFxuICAgICAgc3RhcnQ6IFwiYm90dG9tIDgwJVwiLFxuICAgICAgc2NydWI6IHRydWVcbiAgICB9XG4gIH0pO1xufVxuXG4vLyA+IFdlIEtub3cgLSBDbGlwIFBhdGhcbmZ1bmN0aW9uIGluaXRXZUtub3dBcGxhKCkge1xuICB2YXIgdHJhY2sgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2hvbWUtd2stc2NydWJdXCIpO1xuICBpZiAoIXRyYWNrKSB7IGNvbnNvbGUud2FybihcIlt3a10gYnJhayBbaG9tZS13ay1zY3J1Yl1cIik7IHJldHVybjsgfVxuICB2YXIgYXBsYSA9IHRyYWNrLnF1ZXJ5U2VsZWN0b3IoXCJbaG9tZS13ay1hcGxhXVwiKTtcbiAgaWYgKCFhcGxhKSB7IGNvbnNvbGUud2FybihcIlt3a10gYnJhayBbaG9tZS13ay1hcGxhXVwiKTsgcmV0dXJuOyB9XG4gIGlmICghd2luZG93LmdzYXAgfHwgIXdpbmRvdy5TY3JvbGxUcmlnZ2VyKSByZXR1cm47XG5cbiAgY29uc29sZS5sb2coXCJbd2tdIGFwbGEgaW5pdFwiLCBhcGxhKTtcblxuICB2YXIgaXNNb2JpbGVXSyA9IHdpbmRvdy5pbm5lcldpZHRoIDwgOTkyO1xuXG4gIHZhciBTVEFSVF9ERVNLID0gMC41LCBFTkRfREVTSyA9IDAuNzU7IC8vIGRlc2t0b3AgdmFsdWVzIC0gbGVhdmUgYXMgaXNcblxuICB2YXIgU1RBUlRfTU9CSUxFID0gMC40OyAgLy8gbW9iaWxlIGtub2JcbiAgdmFyIEVORF9NT0JJTEUgPSAwLjc1OyAgIC8vIG1vYmlsZSBrbm9iXG5cbiAgdmFyIFNUQVJUID0gaXNNb2JpbGVXSyA/IFNUQVJUX01PQklMRSA6IFNUQVJUX0RFU0s7XG4gIHZhciBFTkQgPSBpc01vYmlsZVdLID8gRU5EX01PQklMRSA6IEVORF9ERVNLOyAgIC8vIHByb2dyZXNzIHdpbmRvdyBpbiB3aGljaCB0aGUgb3ZlcmxheSBzbGlkZXMgaW5cblxuICBmdW5jdGlvbiBzZXRDbGlwKHRvcCkge1xuICAgIHZhciB2ID0gXCJpbnNldChcIiArIHRvcCArIFwiJSAwJSAwJSAwJSlcIjtcbiAgICBhcGxhLnN0eWxlLmNsaXBQYXRoID0gdjtcbiAgICBhcGxhLnN0eWxlLndlYmtpdENsaXBQYXRoID0gdjtcbiAgfVxuICBzZXRDbGlwKDEwMCk7ICAgICAgICAgICAgICAgICAgIC8vIHN0YXJ0OiBoaWRkZW5cblxuICBTY3JvbGxUcmlnZ2VyLmNyZWF0ZSh7XG4gICAgdHJpZ2dlcjogdHJhY2ssXG4gICAgc3RhcnQ6IFwidG9wIHRvcFwiLFxuICAgIGVuZDogXCJib3R0b20gYm90dG9tXCIsXG4gICAgc2NydWI6IHRydWUsXG4gICAgb25VcGRhdGU6IGZ1bmN0aW9uIChzZWxmKSB7XG4gICAgICB2YXIgbG9jYWwgPSBnc2FwLnV0aWxzLmNsYW1wKDAsIDEsIChzZWxmLnByb2dyZXNzIC0gU1RBUlQpIC8gKEVORCAtIFNUQVJUKSk7XG4gICAgICBzZXRDbGlwKCgxIC0gbG9jYWwpICogMTAwKTsgIC8vIDEwMCUgLT4gMCUgPSByZXZlYWxzIGZyb20gdGhlIGJvdHRvbSB1cFxuICAgIH1cbiAgfSk7XG59XG5cbi8vID4gV2UgS25vdyAtIENyb3NzZmFkZSBWaWRlbyAvIFZlY3RvclxuZnVuY3Rpb24gaW5pdFdrSGFuZG9mZigpIHtcbiAgdmFyIGNmID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhpd192ZWN0b3ItdHJpZ2dlcicpO1xuICB2YXIgdmVjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZlY3Rvcl9zaGFwZScpO1xuICB2YXIgYXBsYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ob21lLXdlLWtub3dfYXBsYS1iZycpO1xuXG4gIGlmICghY2YgfHwgIXZlYyB8fCAhYXBsYSB8fCAhd2luZG93LmdzYXAgfHwgIXdpbmRvdy5TY3JvbGxUcmlnZ2VyKSByZXR1cm47XG5cbiAgZ3NhcC5zZXQodmVjLCB7IGF1dG9BbHBoYTogMSB9KTtcblxuICBmdW5jdGlvbiB1cGRhdGVDbGlwKCkge1xuICAgIHZhciB2ZWNSZWN0ID0gdmVjLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIHZhciBhcGxhUmVjdCA9IGFwbGEuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICB2YXIgY3V0UHggPSBhcGxhUmVjdC50b3AgLSB2ZWNSZWN0LnRvcDtcblxuICAgIGlmIChjdXRQeCA8IDApIGN1dFB4ID0gMDtcblxuICAgIGdzYXAuc2V0KHZlYywge1xuICAgICAgY2xpcFBhdGg6ICdpbnNldCgnICsgY3V0UHggKyAncHggMHB4IDBweCAwcHgpJ1xuICAgIH0pO1xuICB9XG5cbiAgU2Nyb2xsVHJpZ2dlci5jcmVhdGUoe1xuICAgIHRyaWdnZXI6IGNmLFxuICAgIHN0YXJ0OiBcInRvcCBib3R0b21cIixcbiAgICBlbmQ6IFwiYm90dG9tIHRvcFwiLFxuICAgIHNjcnViOiB0cnVlLFxuICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoKSB7XG4gICAgICB1cGRhdGVDbGlwKCk7XG4gICAgfVxuICB9KTtcblxuICB1cGRhdGVDbGlwKCk7XG59XG5cbi8vID4gV2UgS25vdyAtIFZlY3RvciBGbGlwXG5mdW5jdGlvbiBpbml0V2tGbGlwKCkge1xuICB2YXIgdmVjID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnZlY3Rvcl9zaGFwZScpO1xuICB2YXIgYXBsYSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ob21lLXdlLWtub3dfYXBsYS1iZycpO1xuICB2YXIgc3RhZ2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaG9tZS13ZS1rbm93X3N0YWdlJyk7XG4gIHZhciBiYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhvbWUtd2Uta25vd19zdGFnZSA+IC5ob21lLXdlLWtub3dfc2hhcGUnKTtcbiAgaWYgKCFzdGFnZSB8fCAhYmFjayB8fCAhd2luZG93LmdzYXAgfHwgIXdpbmRvdy5TY3JvbGxUcmlnZ2VyKSByZXR1cm47XG5cbiAgLy8gLS0tIFRBQkxFVCBBTkQgQkVMT1cgKDwgOTkycHgpIC0tLVxuICBpZiAod2luZG93LmlubmVyV2lkdGggPCA5OTIpIHtcbiAgICB2YXIgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ1tzLXZpZGVvLW92ZXJsYXldJyk7XG5cbiAgICAvLyBiYWNrIHZpc2libGUgcmlnaHQgYXdheSwgbm8gc2Nyb2xsLXRyaWdnZXJlZCBmYWRlLWluXG4gICAgZ3NhcC5zZXQoYmFjaywgeyBhdXRvQWxwaGE6IDEgfSk7XG5cbiAgICBpZiAob3ZlcmxheSkge1xuICAgICAgZ3NhcC50byhvdmVybGF5LCB7XG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIGVhc2U6IFwicG93ZXIyLm91dFwiLFxuICAgICAgICBzY3JvbGxUcmlnZ2VyOiB7XG4gICAgICAgICAgdHJpZ2dlcjogc3RhZ2UsXG4gICAgICAgICAgc3RhcnQ6IFwidG9wIDgwJVwiLFxuICAgICAgICAgIGVuZDogXCJ0b3AgNjAlXCIsXG4gICAgICAgICAgc2NydWI6IHRydWVcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gLS0tIERFU0tUT1AgKD49IDk5MnB4KSAtLS1cbiAgaWYgKCF2ZWMgfHwgIWFwbGEpIHJldHVybjtcblxuICBnc2FwLnNldChiYWNrLCB7IGF1dG9BbHBoYTogMCB9KTtcbiAgZ3NhcC5zZXQodmVjLCB7IHRyYW5zZm9ybU9yaWdpbjogXCI1MCUgNTAlXCIgfSk7XG5cbiAgdmFyIEZfREVTSyA9IDAuMzM2LCBPRkZYX0RFU0sgPSAwLjAwNCwgT0ZGWV9ERVNLID0gMC4wMDY7XG5cbiAgZnVuY3Rpb24gYXBwbHkocCkge1xuICAgIHZhciB2dyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHZhciB2aCA9IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICAgIHZhciBjb3ZlciA9IE1hdGgubWF4KHZ3LCAxLjc3NzggKiB2aCk7XG4gICAgdmFyIG9mZlggPSBPRkZYX0RFU0sgKiBjb3ZlcjtcbiAgICB2YXIgb2ZmWSA9IE9GRllfREVTSyAqIGNvdmVyO1xuICAgIHZhciB2ZWNXID0gRl9ERVNLICogY292ZXI7XG5cbiAgICB2YXIgc3IgPSBzdGFnZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICB2YXIgdHIgPSBiYWNrLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgdmFyIHR4RW5kID0gb2ZmWCArICh0ci5sZWZ0IC0gc3IubGVmdCkgKyB0ci53aWR0aCAvIDIgLSB2dyAvIDI7XG4gICAgdmFyIHR5RW5kID0gb2ZmWSArICh0ci50b3AgLSBzci50b3ApICsgdHIuaGVpZ2h0IC8gMiAtIHZoIC8gMjtcblxuICAgIHZhciBzY0VuZCA9IHRyLndpZHRoIC8gdmVjVztcblxuICAgIHZhciB0eCA9IE9GRlhfREVTSyAqIGNvdmVyICsgcCAqICh0eEVuZCAtIE9GRlhfREVTSyAqIGNvdmVyKTtcbiAgICB2YXIgdHkgPSBPRkZZX0RFU0sgKiBjb3ZlciArIHAgKiAodHlFbmQgLSBPRkZZX0RFU0sgKiBjb3Zlcik7XG4gICAgdmFyIHNjID0gMSArIHAgKiAoc2NFbmQgLSAxKTtcblxuICAgIHZlYy5zdHlsZS50cmFuc2Zvcm0gPSAndHJhbnNsYXRlKGNhbGMoLTUwJSArICcgKyB0eCArICdweCksIGNhbGMoLTUwJSArICcgKyB0eSArICdweCkpIHNjYWxlKCcgKyBzYyArICcpJztcblxuICAgIHZhciBsYW5kZWQgPSBwID49IDAuOTk5O1xuICAgIGdzYXAuc2V0KHZlYywgeyBhdXRvQWxwaGE6IGxhbmRlZCA/IDAgOiAxIH0pO1xuICAgIGdzYXAuc2V0KGJhY2ssIHsgYXV0b0FscGhhOiBsYW5kZWQgPyAxIDogMCB9KTtcbiAgfVxuXG4gIGFwcGx5KDApO1xuXG4gIFNjcm9sbFRyaWdnZXIuY3JlYXRlKHtcbiAgICB0cmlnZ2VyOiBhcGxhLFxuICAgIHN0YXJ0OiBcInRvcCB0b3BcIixcbiAgICBlbmRUcmlnZ2VyOiBzdGFnZSxcbiAgICBlbmQ6IFwidG9wIHRvcFwiLFxuICAgIHNjcnViOiB0cnVlLFxuICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoc2VsZikgeyBhcHBseShzZWxmLnByb2dyZXNzKTsgfSxcbiAgICBvblJlZnJlc2g6IGZ1bmN0aW9uICgpIHsgYXBwbHkoMCk7IH1cbiAgfSk7XG59XG5cbi8vID4gV2UgS25vdyAtIEhlYWRpbmcgRmxpcCAvIFRleHQgUmV2ZWFsXG5mdW5jdGlvbiBpbml0V2VLbm93SGVhZEZsaXAoKSB7XG4gIHZhciB0cmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbaG9tZS13ay1zY3J1Yl1cIik7XG4gIGlmICghdHJhY2sgfHwgIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlciB8fCAhd2luZG93LkZsaXAgfHwgIXdpbmRvdy5TcGxpdFRleHQpIHJldHVybjtcblxuICB2YXIgYmlnID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIltob21lLXdrLWZsaXBdXCIpO1xuICB2YXIgdGFyZ2V0ID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIltob21lLXdrLWZsaXAtdG9dXCIpO1xuICBpZiAoIWJpZyB8fCAhdGFyZ2V0KSByZXR1cm47XG5cbiAgLy8gLS0tIDEuIFRJTUlOR1MgLS0tXG4gIHZhciBGTElQX1NUQVJUID0gMC4xMCwgRkxJUF9FTkQgPSAwLjM1LCBJTl9BVCA9IDAuMDIsIE9VVF9BVCA9IDAuNjA7XG4gIHZhciBTV0FQX09VVCA9IDAuNTU7XG4gIHZhciBITF9TVEFSVCA9IDAuMTUsIEhMX0VORCA9IDAuMzc1O1xuXG4gIC8vIC0tLSBNT0JJTEUtT05MWSBUSU1JTkcgKDw5OTJweCkgLSBlZGl0IHRoZXNlIDUgbnVtYmVycyB0byBjaGFuZ2UgbW9iaWxlIG9ubHkgLS0tXG4gIHZhciBpc01vYmlsZVdLID0gd2luZG93LmlubmVyV2lkdGggPCA5OTI7XG5cbiAgdmFyIFcxX1JJU0VfU1RBUlQgPSBpc01vYmlsZVdLID8gMC4wIDogRkxJUF9TVEFSVDsgIC8vIFcxIHJpc2Ugc3RhcnQgKHRyYW5zbGF0ZVkpLCBpbmRlcGVuZGVudCBvZiB0aGUgaGVhZGluZyBmbGlwXG4gIHZhciBXMV9SSVNFX0VORCA9IGlzTW9iaWxlV0sgPyAwLjIgOiBGTElQX0VORDsgICAgLy8gVzEgcmlzZSBlbmRcblxuICB2YXIgSExfU1RBUlRfTVEgPSBpc01vYmlsZVdLID8gMCA6IEhMX1NUQVJUOyAgICAgIC8vIHdvcmQgY29sb3VyaW5nIHN0YXJ0XG4gIHZhciBITF9FTkRfTVEgPSBpc01vYmlsZVdLID8gMC40IDogSExfRU5EOyAgICAgICAvLyB3b3JkIGNvbG91cmluZyBlbmRcblxuICB2YXIgRElBTU9ORF9TV0FQID0gaXNNb2JpbGVXSyA/IDAuNTUgOiBTV0FQX09VVDsgICAgIC8vIHNpbmdsZSBzd2FwIHBvaW50OiBXMSBvdXQgKyBkaWFtb25kIHJvdGF0aW9uICsgR29hbC9XMiBpblxuXG4gIHZhciBDT0xPUl9NVVRFRCA9IFwiI0U2RUZFRlwiO1xuICB2YXIgQ09MT1JfQUNUSVZFID0gXCIjMDA1NDUzXCI7XG5cbiAgLy8gRmlyc3QgZGlhbW9uZCwgcGlja2VkIGJ5IGF0dHJpYnV0ZVxuICB2YXIgZGlhbW9uZDEgPSB0cmFjay5xdWVyeVNlbGVjdG9yKCdbaG9tZS13ay1kaWFtb25kPVwiMVwiXScpO1xuXG4gIC8vIC0tLSAyLiBXRSBLTk9XIEhFQURJTkcgLS0tXG4gIHZhciBzcGxpdEhlYWQgPSBuZXcgU3BsaXRUZXh0KGJpZywgeyB0eXBlOiBcImxpbmVzXCIsIG1hc2s6IFwibGluZXNcIiB9KTtcbiAgaWYgKHNwbGl0SGVhZC5saW5lcyAmJiBzcGxpdEhlYWQubGluZXMubGVuZ3RoKSB7XG4gICAgZ3NhcC5zZXQoYmlnLCB7IGF1dG9BbHBoYTogMCB9KTtcbiAgICBnc2FwLnNldChzcGxpdEhlYWQubGluZXMsIHsgeVBlcmNlbnQ6IDExNSB9KTtcbiAgfVxuXG4gIHZhciBoZWFkU3RhdGUgPSAtMTtcbiAgZnVuY3Rpb24gc2V0SGVhZFN0YXRlKHMpIHtcbiAgICBpZiAocyA9PT0gaGVhZFN0YXRlIHx8ICFzcGxpdEhlYWQubGluZXMubGVuZ3RoKSByZXR1cm47XG4gICAgaGVhZFN0YXRlID0gcztcblxuICAgIGlmIChzID09PSAwKSB7XG4gICAgICBnc2FwLmtpbGxUd2VlbnNPZihzcGxpdEhlYWQubGluZXMpO1xuICAgICAgZ3NhcC5zZXQoYmlnLCB7IGF1dG9BbHBoYTogMCB9KTtcbiAgICAgIGdzYXAuc2V0KHNwbGl0SGVhZC5saW5lcywgeyB5UGVyY2VudDogMTE1IH0pO1xuICAgIH0gZWxzZSBpZiAocyA9PT0gMSkge1xuICAgICAgZ3NhcC5raWxsVHdlZW5zT2Yoc3BsaXRIZWFkLmxpbmVzKTtcbiAgICAgIGdzYXAuc2V0KGJpZywgeyBhdXRvQWxwaGE6IDEgfSk7XG4gICAgICBnc2FwLnRvKHNwbGl0SGVhZC5saW5lcywgeyB5UGVyY2VudDogMCwgZHVyYXRpb246IDAuOCwgc3RhZ2dlcjogMC4xLCBlYXNlOiBcImV4cG8ub3V0XCIsIG92ZXJ3cml0ZTogXCJhdXRvXCIgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdzYXAua2lsbFR3ZWVuc09mKHNwbGl0SGVhZC5saW5lcyk7XG4gICAgICBnc2FwLnRvKHNwbGl0SGVhZC5saW5lcywge1xuICAgICAgICB5UGVyY2VudDogMTE1LCBkdXJhdGlvbjogMC40LCBzdGFnZ2VyOiAwLCBlYXNlOiBcInBvd2VyMi5pbk91dFwiLCBvdmVyd3JpdGU6IFwiYXV0b1wiLFxuICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7IGlmIChoZWFkU3RhdGUgPT09IDIpIGdzYXAuc2V0KGJpZywgeyBhdXRvQWxwaGE6IDAgfSk7IH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIC0tLSAzLiBGT1IgVEhFIE5FWFQgQkxPQ0tTIChHb2FsICYgVzIpIC0tLVxuICAvLyBkZWxheTogaW5jb21pbmcgdGV4dCBzdGFydHMgc2xpZ2h0bHkgYWZ0ZXIgdGhlIG91dGdvaW5nIG9uZSAoc2FtZSBmZWVsIGFzIEFib3V0IGpvdXJuZXkpXG4gIHZhciBSID0geyBlYXNlOiBcImV4cG8ub3V0XCIsIGR1cjogMSwgc3RhZzogMC4xLCBsaW5lWTogMTE1LCBoaWRlRWFzZTogXCJwb3dlcjIub3V0XCIsIGhpZGVEdXI6IDAuMzUsIGRlbGF5OiAwLjE1IH07XG5cbiAgZnVuY3Rpb24gcHJlcChzZWwpIHtcbiAgICB2YXIgZWwgPSB0cmFjay5xdWVyeVNlbGVjdG9yKHNlbCk7XG4gICAgaWYgKCFlbCkgcmV0dXJuIG51bGw7XG5cbiAgICB2YXIgbGF5b3V0ID0gL2ZsZXh8Z3JpZC8udGVzdChnZXRDb21wdXRlZFN0eWxlKGVsKS5kaXNwbGF5KTtcbiAgICB2YXIgdGFyZ2V0cyA9IGxheW91dCA/IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGVsLmNoaWxkcmVuKSA6IFtlbF07XG4gICAgdmFyIGxpbmVzID0gW107XG5cbiAgICB0YXJnZXRzLmZvckVhY2goZnVuY3Rpb24gKHQpIHtcbiAgICAgIC8vIFNraXAgdGhlIGRpYW1vbmQ6IG5vdCBzcGxpdCwgbm90IHBhcnQgb2YgdGhlIHlQZXJjZW50IGFuaW1hdGlvblxuICAgICAgaWYgKHQubWF0Y2hlcygnW2hvbWUtd2stZGlhbW9uZF0nKSB8fCB0LnF1ZXJ5U2VsZWN0b3IoJ1tob21lLXdrLWRpYW1vbmRdJykpIHJldHVybjtcblxuICAgICAgdmFyIHMgPSBuZXcgU3BsaXRUZXh0KHQsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSk7XG4gICAgICBpZiAocy5saW5lcyAmJiBzLmxpbmVzLmxlbmd0aCkgbGluZXMgPSBsaW5lcy5jb25jYXQocy5saW5lcyk7XG4gICAgfSk7XG5cbiAgICBpZiAoIWxpbmVzLmxlbmd0aCkgcmV0dXJuIG51bGw7XG5cbiAgICBnc2FwLnNldChlbCwgeyBhdXRvQWxwaGE6IDAgfSk7XG4gICAgZ3NhcC5zZXQobGluZXMsIHsgeVBlcmNlbnQ6IFIubGluZVkgfSk7XG4gICAgcmV0dXJuIHsgZWw6IGVsLCBsaW5lczogbGluZXMsIHNob3duOiBmYWxzZSB9O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvd1RleHQobykge1xuICAgIGlmICghbyB8fCBvLnNob3duIHx8ICFvLmxpbmVzLmxlbmd0aCkgcmV0dXJuO1xuICAgIG8uc2hvd24gPSB0cnVlO1xuICAgIGdzYXAuc2V0KG8uZWwsIHsgYXV0b0FscGhhOiAxIH0pO1xuICAgIGdzYXAudG8oby5saW5lcywgeyB5UGVyY2VudDogMCwgZHVyYXRpb246IFIuZHVyLCBzdGFnZ2VyOiBSLnN0YWcsIGVhc2U6IFIuZWFzZSwgZGVsYXk6IFIuZGVsYXksIG92ZXJ3cml0ZTogdHJ1ZSB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhpZGVUZXh0KG8pIHtcbiAgICBpZiAoIW8gfHwgIW8uc2hvd24gfHwgIW8ubGluZXMubGVuZ3RoKSByZXR1cm47XG4gICAgby5zaG93biA9IGZhbHNlO1xuICAgIGdzYXAudG8oby5saW5lcywge1xuICAgICAgeVBlcmNlbnQ6IFIubGluZVksIGR1cmF0aW9uOiBSLmhpZGVEdXIsIHN0YWdnZXI6IDAsIGVhc2U6IFIuaGlkZUVhc2UsIG92ZXJ3cml0ZTogdHJ1ZSxcbiAgICAgIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHsgaWYgKCFvLnNob3duKSBnc2FwLnNldChvLmVsLCB7IGF1dG9BbHBoYTogMCB9KTsgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIGdvYWwgPSBwcmVwKCdbaG9tZS13ay10eD1cImdvYWxcIl0nKTtcbiAgdmFyIHcyID0gcHJlcCgnW2hvbWUtd2stdHg9XCJ3MlwiXScpO1xuXG4gIC8vIC0tLSBQSEFTRSAxOiBXMSBCTE9DSyAtLS1cbiAgdmFyIHcxRWwgPSB0cmFjay5xdWVyeVNlbGVjdG9yKCdbaG9tZS13ay10eD1cIncxXCJdJyk7XG4gIHZhciB3MVdvcmRzID0gW107XG4gIHZhciBzcGxpdFcxTGluZXMgPSBbXTtcblxuICBpZiAodzFFbCkge1xuICAgIGdzYXAuc2V0KHcxRWwsIHsgb3BhY2l0eTogMSwgdmlzaWJpbGl0eTogXCJpbmhlcml0XCIsIHlQZXJjZW50OiBpc01vYmlsZVdLID8gMjUgOiAxMjUgfSk7XG5cbiAgICB2YXIgdzFUYXJnZXRzID0gL2ZsZXh8Z3JpZC8udGVzdChnZXRDb21wdXRlZFN0eWxlKHcxRWwpLmRpc3BsYXkpID8gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodzFFbC5jaGlsZHJlbikgOiBbdzFFbF07XG5cbiAgICB3MVRhcmdldHMuZm9yRWFjaChmdW5jdGlvbiAodCkge1xuICAgICAgdmFyIGlzTm90ZSA9IHQuY2xhc3NMaXN0LmNvbnRhaW5zKCdob21lLXdlLWtub3dfbm90ZScpIHx8IHQucXVlcnlTZWxlY3RvcignLmhvbWUtd2Uta25vd19ub3RlJyk7XG4gICAgICB2YXIgaXNEaWFtb25kID0gdC5tYXRjaGVzKCdbaG9tZS13ay1kaWFtb25kXScpIHx8IHQucXVlcnlTZWxlY3RvcignW2hvbWUtd2stZGlhbW9uZF0nKTtcblxuICAgICAgaWYgKGlzRGlhbW9uZCkgcmV0dXJuOyAvLyBza2lwIHRoZSBkaWFtb25kIGNvbnRhaW5lciB3aGVuIHNwbGl0dGluZyB0ZXh0XG5cbiAgICAgIHZhciBzID0gbmV3IFNwbGl0VGV4dCh0LCB7IHR5cGU6IFwibGluZXMsIHdvcmRzXCIsIG1hc2s6IFwibGluZXNcIiB9KTtcbiAgICAgIGlmIChzLmxpbmVzICYmIHMubGluZXMubGVuZ3RoKSBzcGxpdFcxTGluZXMgPSBzcGxpdFcxTGluZXMuY29uY2F0KHMubGluZXMpO1xuXG4gICAgICBpZiAocy53b3JkcyAmJiBzLndvcmRzLmxlbmd0aCkge1xuICAgICAgICBpZiAoaXNOb3RlKSB7XG4gICAgICAgICAgZ3NhcC5zZXQocy53b3JkcywgeyBjb2xvcjogQ09MT1JfQUNUSVZFLCBvcGFjaXR5OiAxIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdzYXAuc2V0KHMud29yZHMsIHsgY29sb3I6IENPTE9SX01VVEVELCBvcGFjaXR5OiAxIH0pO1xuICAgICAgICAgIHcxV29yZHMgPSB3MVdvcmRzLmNvbmNhdChzLndvcmRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIHcxRXhpdGVkID0gZmFsc2U7XG4gIHZhciBuZXh0U2hvd24gPSBmYWxzZTtcblxuICAvLyAtLS0gNC4gU0NST0xMVFJJR0dFUiAtLS1cbiAgdmFyIHRsID0gZ3NhcC50aW1lbGluZSh7XG4gICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgdHJpZ2dlcjogdHJhY2ssXG4gICAgICBzdGFydDogaXNNb2JpbGVXSyA/IFwidG9wIGJvdHRvbVwiIDogXCJ0b3AgdG9wXCIsXG4gICAgICBlbmQ6IFwiYm90dG9tIGJvdHRvbVwiLFxuICAgICAgc2NydWI6IHRydWUsXG4gICAgICBvblVwZGF0ZTogZnVuY3Rpb24gKHNlbGYpIHtcbiAgICAgICAgdmFyIHAgPSBzZWxmLnByb2dyZXNzO1xuXG4gICAgICAgIC8vIEEuIFdlIEtub3cgaGVhZGluZyByZXZlYWxcbiAgICAgICAgc2V0SGVhZFN0YXRlKHAgPCBJTl9BVCA/IDAgOiAocCA8IERJQU1PTkRfU1dBUCA/IDEgOiAyKSk7XG5cbiAgICAgICAgLy8gQi4gV29yZCBjb2xvdXIgc2NydWJcbiAgICAgICAgaWYgKHcxV29yZHMubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIHR0ID0gZ3NhcC51dGlscy5jbGFtcCgwLCAxLCAocCAtIEhMX1NUQVJUX01RKSAvIChITF9FTkRfTVEgLSBITF9TVEFSVF9NUSkpO1xuICAgICAgICAgIHZhciBoZWFkID0gdHQgKiB3MVdvcmRzLmxlbmd0aDtcbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHcxV29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBmYWN0b3IgPSBnc2FwLnV0aWxzLmNsYW1wKDAsIDEsIGhlYWQgLSBpKTtcbiAgICAgICAgICAgIHZhciBjdXJyZW50Q29sb3IgPSBnc2FwLnV0aWxzLmludGVycG9sYXRlKENPTE9SX01VVEVELCBDT0xPUl9BQ1RJVkUsIGZhY3Rvcik7XG4gICAgICAgICAgICBnc2FwLnNldCh3MVdvcmRzW2ldLCB7IGNvbG9yOiBjdXJyZW50Q29sb3IgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQy4gUmV2ZXJzZSByZXZlYWwgZm9yIFcxICsgZGlhbW9uZCByb3RhdGlvblxuICAgICAgICBpZiAocCA+PSBESUFNT05EX1NXQVAgJiYgIXcxRXhpdGVkKSB7XG4gICAgICAgICAgdzFFeGl0ZWQgPSB0cnVlO1xuXG4gICAgICAgICAgaWYgKHNwbGl0VzFMaW5lcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGdzYXAudG8oc3BsaXRXMUxpbmVzLCB7XG4gICAgICAgICAgICAgIHlQZXJjZW50OiAxMTUsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAwLjQsXG4gICAgICAgICAgICAgIHN0YWdnZXI6IDAuMDUsXG4gICAgICAgICAgICAgIGVhc2U6IFwicG93ZXIyLmluT3V0XCIsXG4gICAgICAgICAgICAgIG92ZXJ3cml0ZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGRpYW1vbmQxKSB7XG4gICAgICAgICAgICBnc2FwLnRvKGRpYW1vbmQxLCB7XG4gICAgICAgICAgICAgIHJvdGF0ZTogOTAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAwLjUsXG4gICAgICAgICAgICAgIGVhc2U6IFwiYmFjay5vdXQoMS43KVwiLFxuICAgICAgICAgICAgICBvdmVyd3JpdGU6IFwiYXV0b1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChwIDwgRElBTU9ORF9TV0FQICYmIHcxRXhpdGVkKSB7XG4gICAgICAgICAgdzFFeGl0ZWQgPSBmYWxzZTtcblxuICAgICAgICAgIGlmIChzcGxpdFcxTGluZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBnc2FwLnRvKHNwbGl0VzFMaW5lcywge1xuICAgICAgICAgICAgICB5UGVyY2VudDogMCxcbiAgICAgICAgICAgICAgZHVyYXRpb246IDAuNCxcbiAgICAgICAgICAgICAgc3RhZ2dlcjogMCxcbiAgICAgICAgICAgICAgZWFzZTogXCJwb3dlcjIub3V0XCIsXG4gICAgICAgICAgICAgIGRlbGF5OiBSLmRlbGF5LFxuICAgICAgICAgICAgICBvdmVyd3JpdGU6IHRydWVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChkaWFtb25kMSkge1xuICAgICAgICAgICAgZ3NhcC50byhkaWFtb25kMSwge1xuICAgICAgICAgICAgICByb3RhdGU6IDAsXG4gICAgICAgICAgICAgIGR1cmF0aW9uOiAwLjQsXG4gICAgICAgICAgICAgIGVhc2U6IFwicG93ZXIyLm91dFwiLFxuICAgICAgICAgICAgICBvdmVyd3JpdGU6IFwiYXV0b1wiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBELiBHb2FsICsgVzIgc3dhcCBpbiBhdCB0aGUgc2FtZSBwb2ludCBXMSBleGl0cyAobm8gZW1wdHkgZ2FwKVxuICAgICAgICB2YXIgc2hvd05leHQgPSBwID49IERJQU1PTkRfU1dBUDtcbiAgICAgICAgaWYgKHNob3dOZXh0ICE9PSBuZXh0U2hvd24pIHtcbiAgICAgICAgICBuZXh0U2hvd24gPSBzaG93TmV4dDtcbiAgICAgICAgICBpZiAoc2hvd05leHQpIHtcbiAgICAgICAgICAgIHNob3dUZXh0KGdvYWwpO1xuICAgICAgICAgICAgc2hvd1RleHQodzIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBoaWRlVGV4dChnb2FsKTtcbiAgICAgICAgICAgIGhpZGVUZXh0KHcyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHRsLnRvKHt9LCB7IGR1cmF0aW9uOiAxIH0sIDApO1xuXG4gIC8vIEhlYWRpbmcgZmxpcFxuICB0bC5hZGQoRmxpcC5maXQoYmlnLCB0YXJnZXQsIHsgZHVyYXRpb246IEZMSVBfRU5EIC0gRkxJUF9TVEFSVCwgZWFzZTogXCJub25lXCIsIHNjYWxlOiB0cnVlIH0pLCBGTElQX1NUQVJUKTtcblxuICAvLyBXMSBibG9jayByaXNlIChzdGFydC9lbmQgaW5kZXBlbmRlbnQgb2YgdGhlIGhlYWRpbmcgZmxpcCwgdHVuYWJsZSBzZXBhcmF0ZWx5IG9uIG1vYmlsZSlcbiAgaWYgKHcxRWwpIHtcbiAgICB0bC50byh3MUVsLCB7XG4gICAgICB5UGVyY2VudDogMCxcbiAgICAgIGR1cmF0aW9uOiBXMV9SSVNFX0VORCAtIFcxX1JJU0VfU1RBUlQsXG4gICAgICBlYXNlOiBcIm5vbmVcIlxuICAgIH0sIFcxX1JJU0VfU1RBUlQpO1xuICB9XG59XG5cbi8vID4gV2UgS25vdyAtIEJvdHRsZXMgJiBPdmVybGF5IEFuaW1hdGlvblxuZnVuY3Rpb24gaW5pdFdlS25vd1N0cmFpZ2h0ZW4oKSB7XG4gIHZhciB0cmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbaG9tZS13ay1zY3J1Yl1cIik7XG4gIGlmICghdHJhY2sgfHwgIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuXG4gIHZhciByb3RFbHMgPSB0cmFjay5xdWVyeVNlbGVjdG9yQWxsKFwiW2hvbWUtd2stcm90YXRlXVwiKTtcbiAgdmFyIHNwcmVhZFdyYXBzID0gdHJhY2sucXVlcnlTZWxlY3RvckFsbChcIltob21lLXdrLXNwcmVhZF1cIik7XG4gIHZhciBvdmVybGF5ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltob21lLXdrLW92ZXJsYXldXCIpO1xuICBpZiAoIXJvdEVscy5sZW5ndGggJiYgIXNwcmVhZFdyYXBzLmxlbmd0aCkgcmV0dXJuO1xuXG4gIHZhciBpc1RhYmxldERvd24gPSB3aW5kb3cubWF0Y2hNZWRpYShcIihtYXgtd2lkdGg6IDk5MXB4KVwiKS5tYXRjaGVzO1xuXG4gIHZhciBQT1NfREVTS1RPUCA9IFtcbiAgICB7IHg6IC0xMjAsIHk6IDAsIHNjYWxlOiAxLjQwIH0sXG4gICAgeyB4OiAtNTUsIHk6IDAsIHNjYWxlOiAxLjE1IH0sXG4gICAgeyB4OiAxMCwgeTogMCwgc2NhbGU6IDAuOTAgfSxcbiAgICB7IHg6IDcwLCB5OiAwLCBzY2FsZTogMC43MCB9XG4gIF07XG5cbiAgdmFyIE1PQklMRV9DT1VOVCA9IDU7XG4gIHZhciBHQVAgPSA0ODtcbiAgdmFyIFNDQUxFX1NURVAgPSAwLjE1O1xuICB2YXIgWV9TVEVQID0gMTQ7XG5cbiAgdmFyIFBPUyA9IGlzVGFibGV0RG93biA/IG51bGwgOiBQT1NfREVTS1RPUDtcbiAgdmFyIGNvdW50ID0gaXNUYWJsZXREb3duID8gTU9CSUxFX0NPVU5UIDogUE9TX0RFU0tUT1AubGVuZ3RoO1xuICB2YXIgbWlkID0gKGNvdW50IC0gMSkgLyAyO1xuXG4gIC8vIER1cGxpY2F0ZSBlbGVtZW50cyBmb3IgdGhlIG1vYmlsZSB2aWV3XG4gIGlmIChpc1RhYmxldERvd24pIHtcbiAgICBzcHJlYWRXcmFwcy5mb3JFYWNoKGZ1bmN0aW9uICh3cmFwKSB7XG4gICAgICB3aGlsZSAod3JhcC5jaGlsZHJlbi5sZW5ndGggPiAwICYmIHdyYXAuY2hpbGRyZW4ubGVuZ3RoIDwgY291bnQpIHtcbiAgICAgICAgdmFyIGNsb25lID0gd3JhcC5jaGlsZHJlblt3cmFwLmNoaWxkcmVuLmxlbmd0aCAtIDFdLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgY2xvbmUuY2xhc3NMaXN0LmFkZChcImlzLWR1cFwiKTtcbiAgICAgICAgY2xvbmUuc2V0QXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIiwgXCJ0cnVlXCIpO1xuICAgICAgICB3cmFwLmFwcGVuZENoaWxkKGNsb25lKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIC8vIEluaXRpYWwgdmFsdWVzXG4gIHNwcmVhZFdyYXBzLmZvckVhY2goZnVuY3Rpb24gKHdyYXApIHtcbiAgICB2YXIgaXRlbXMgPSB3cmFwLmNoaWxkcmVuO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgaXRlbXMubGVuZ3RoICYmIGogPCBjb3VudDsgaisrKSB7XG4gICAgICBpZiAoaXNUYWJsZXREb3duKSB7XG4gICAgICAgIHZhciBkRnJvbU1pZCA9IE1hdGguYWJzKGogLSBtaWQpO1xuICAgICAgICBnc2FwLnNldChpdGVtc1tqXSwge1xuICAgICAgICAgIC8vIENsb3NlciB0byB0aGUgbWlkZGxlID0gaGlnaGVyIHpJbmRleCwgc28gdGhlIGNlbnRyZSBib3R0bGUgc2l0cyBvbiB0b3BcbiAgICAgICAgICB6SW5kZXg6IE1hdGgucm91bmQoMTAwIC0gZEZyb21NaWQpLFxuICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogXCJjZW50ZXIgYm90dG9tXCIsXG4gICAgICAgICAgd2lsbENoYW5nZTogXCJ0cmFuc2Zvcm1cIlxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGdzYXAuc2V0KGl0ZW1zW2pdLCB7XG4gICAgICAgICAgekluZGV4OiBNYXRoLnJvdW5kKFBPU1tqXS5zY2FsZSAqIDEwMDApLFxuICAgICAgICAgIHRyYW5zZm9ybU9yaWdpbjogXCJjZW50ZXIgY2VudGVyXCIsXG4gICAgICAgICAgd2lsbENoYW5nZTogXCJ0cmFuc2Zvcm1cIlxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIHZhciB0bCA9IGdzYXAudGltZWxpbmUoe1xuICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgIHRyaWdnZXI6IHRyYWNrLFxuICAgICAgc3RhcnQ6IFwidG9wIHRvcFwiLFxuICAgICAgZW5kOiBcImJvdHRvbSBib3R0b21cIixcbiAgICAgIHNjcnViOiB0cnVlXG4gICAgfVxuICB9KTtcblxuICBpZiAoaXNUYWJsZXREb3duKSB7XG4gICAgLy8gTW9iaWxlOiByZXZlYWwgdGhyb3VnaCBibHVyIGluc3RlYWQgb2Ygb3BhY2l0eVxuICAgIGdzYXAuc2V0KHJvdEVscywgeyBhdXRvQWxwaGE6IDEsIGZpbHRlcjogXCJibHVyKDI0cHgpXCIgfSk7XG4gICAgdGwudG8oXG4gICAgICByb3RFbHMsXG4gICAgICB7IGZpbHRlcjogXCJibHVyKDBweClcIiwgcm90YXRpb246IDAsIGR1cmF0aW9uOiAwLjIyLCBlYXNlOiBcIm5vbmVcIiB9LFxuICAgICAgMFxuICAgICk7XG4gIH0gZWxzZSB7XG4gICAgdGwuZnJvbVRvKFxuICAgICAgcm90RWxzLFxuICAgICAgeyBhdXRvQWxwaGE6IDAgfSxcbiAgICAgIHsgYXV0b0FscGhhOiAxLCByb3RhdGlvbjogMCwgZHVyYXRpb246IDAuMjIsIGVhc2U6IFwibm9uZVwiIH0sXG4gICAgICAwXG4gICAgKTtcbiAgfVxuXG4gIC8vIFNwcmVhZCBhbmltYXRpb25cbiAgc3ByZWFkV3JhcHMuZm9yRWFjaChmdW5jdGlvbiAod3JhcCkge1xuICAgIHZhciBpdGVtcyA9IHdyYXAuY2hpbGRyZW47XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGggJiYgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIGlmIChpc1RhYmxldERvd24pIHtcbiAgICAgICAgdmFyIGQgPSBNYXRoLmFicyhpIC0gbWlkKTtcbiAgICAgICAgdGwuZnJvbVRvKFxuICAgICAgICAgIGl0ZW1zW2ldLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHhQZXJjZW50OiAwLFxuICAgICAgICAgICAgeVBlcmNlbnQ6IDAsXG4gICAgICAgICAgICBzY2FsZTogMVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgeFBlcmNlbnQ6IChpIC0gbWlkKSAqIEdBUCxcbiAgICAgICAgICAgIHlQZXJjZW50OiAtZCAqIFlfU1RFUCxcbiAgICAgICAgICAgIHNjYWxlOiAxIC0gZCAqIFNDQUxFX1NURVAsXG4gICAgICAgICAgICBkdXJhdGlvbjogMC4zMCxcbiAgICAgICAgICAgIGVhc2U6IFwicG93ZXIyLm91dFwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICAwLjU1XG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0bC50byhcbiAgICAgICAgICBpdGVtc1tpXSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICB4UGVyY2VudDogUE9TW2ldLngsXG4gICAgICAgICAgICB5UGVyY2VudDogUE9TW2ldLnksXG4gICAgICAgICAgICBzY2FsZTogUE9TW2ldLnNjYWxlLFxuICAgICAgICAgICAgZHVyYXRpb246IDAuMzAsXG4gICAgICAgICAgICBlYXNlOiBcInBvd2VyMi5vdXRcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgMC41NVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgaWYgKG92ZXJsYXkpIHtcbiAgICB0bC50byhcbiAgICAgIG92ZXJsYXksXG4gICAgICB7XG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIGR1cmF0aW9uOiAwLjEwLFxuICAgICAgICBlYXNlOiBcInBvd2VyMi5vdXRcIlxuICAgICAgfSxcbiAgICAgIDAuN1xuICAgICk7XG4gIH1cbn1cblxuLy8gPiBTdXBwbHkgLSBHbGFzcyBFbGVtZW50cyBTcGxpdFxuZnVuY3Rpb24gaW5pdEdsYXNzU3BsaXQoKSB7XG4gIGNvbnN0IHRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdbZ2xhc3Mtc3BsaXRdJyk7XG4gIGlmICghdHJpZ2dlcikgcmV0dXJuO1xuXG4gIC8vIG9yaWdpbmFsIFNWRyBzaGFwZXMgb3IgV2ViR0wgZ2xhc3MgcGxhY2Vob2xkZXJzIChbcGItZ2xhc3Mtc2hhcGVdKSAtIGdsYXNzIGZvbGxvd3Mgd2hhdGV2ZXIgbW92ZXMgaGVyZVxuICBjb25zdCBjaXJjbGUgPSB0cmlnZ2VyLnF1ZXJ5U2VsZWN0b3IoJy5ob21lLWNvbmNlcHRfY2lyY2xlLCBbcGItZ2xhc3Mtc2hhcGU9XCJjaXJjbGVcIl0nKTtcbiAgY29uc3Qgc3F1YXJlR2xhc3MgPSB0cmlnZ2VyLnF1ZXJ5U2VsZWN0b3IoJy5ob21lLWNvbmNlcHRfc3F1YXJlLWdsYXNzLCBbcGItZ2xhc3Mtc2hhcGU9XCJzcXVhcmVcIl0nKTtcblxuICBpZiAoIWNpcmNsZSB8fCAhc3F1YXJlR2xhc3MpIHJldHVybjtcblxuICBjb25zdCBnYXAgPSAoKSA9PiAyLjUgKiBwYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5mb250U2l6ZSk7IC8vIDQwcHhcblxuICBjb25zdCBtbSA9IGdzYXAubWF0Y2hNZWRpYSgpO1xuXG4gIG1tLmFkZCh7XG4gICAgaXNEZXNrdG9wOiAnKG1pbi13aWR0aDogNzY4cHgpJyxcbiAgICBpc01vYmlsZTogJyhtYXgtd2lkdGg6IDc2N3B4KScsXG4gIH0sIChjb250ZXh0KSA9PiB7XG4gICAgY29uc3QgeyBpc0Rlc2t0b3AgfSA9IGNvbnRleHQuY29uZGl0aW9ucztcblxuICAgIGNvbnN0IHRsID0gZ3NhcC50aW1lbGluZSh7XG4gICAgICBzY3JvbGxUcmlnZ2VyOiB7XG4gICAgICAgIHRyaWdnZXI6IHRyaWdnZXIsXG4gICAgICAgIC8vIHdob2xlIHNlY3Rpb24gb24gc2NyZWVuOiBpdHMgYm90dG9tIHJlYWNoZXMgdGhlIHZpZXdwb3J0IGJvdHRvbSwgb3IgaXQgZmlsbHMgdGhlIHZpZXdwb3J0IGlmIHRhbGxlclxuICAgICAgICBzdGFydDogKCkgPT4gKHRyaWdnZXIub2Zmc2V0SGVpZ2h0IDw9IHdpbmRvdy5pbm5lckhlaWdodCA/ICdjbGFtcChib3R0b20gYm90dG9tKScgOiAnY2xhbXAodG9wIHRvcCknKSxcbiAgICAgICAgdG9nZ2xlQWN0aW9uczogJ3BsYXkgbm9uZSBub25lIHJldmVyc2UnLFxuICAgICAgICBpbnZhbGlkYXRlT25SZWZyZXNoOiB0cnVlLFxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGlzRGVza3RvcCkge1xuICAgICAgLy8gU3RhY2tlZCBhdCBjZW50cmUgLT4gc2lkZSBieSBzaWRlLCBjaXJjbGUgbGVmdCwgc3F1YXJlIHJpZ2h0LCAyLjVyZW0gZ2FwXG4gICAgICB0bC50byhjaXJjbGUsIHtcbiAgICAgICAgeDogKCkgPT4gLShzcXVhcmVHbGFzcy5vZmZzZXRXaWR0aCArIGdhcCgpKSAvIDIsXG4gICAgICAgIGR1cmF0aW9uOiAxLjUsXG4gICAgICAgIGVhc2U6ICdleHBvLm91dCcsXG4gICAgICB9LCAwKVxuICAgICAgICAudG8oc3F1YXJlR2xhc3MsIHtcbiAgICAgICAgICB4OiAoKSA9PiAoY2lyY2xlLm9mZnNldFdpZHRoICsgZ2FwKCkpIC8gMixcbiAgICAgICAgICBkdXJhdGlvbjogMS41LFxuICAgICAgICAgIGVhc2U6ICdleHBvLm91dCcsXG4gICAgICAgIH0sIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0bC50byhjaXJjbGUsIHtcbiAgICAgICAgeTogJzEyLjkzNzVyZW0nLFxuICAgICAgICBkdXJhdGlvbjogMS41LFxuICAgICAgICBlYXNlOiAnZXhwby5vdXQnLFxuICAgICAgfSwgMCk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gPiBLZXkgUGlsbGFycyAtIEhlbGl4IC8gVmVydGljYWwgQnJhY2tldHNcbmZ1bmN0aW9uIGluaXRLcFZpZGVvU2NydWIoKSB7XG4gIHZhciB0cmFjayA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbaG9tZS1rcC1zY3J1Yl1cIik7XG4gIGlmICghdHJhY2spIHJldHVybjtcblxuICB2YXIgdmlkZW8gPSB0cmFjay5xdWVyeVNlbGVjdG9yKFwidmlkZW9cIik7XG4gIGlmICghdmlkZW8gfHwgIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuXG4gIC8vIC0tLS0gU0hBUEU6IFN0YXRpYyBkaWFtb25kIG1hc2sgb24gW2hrcC12aWRlby1tYXNrXSAtLS0tXG4gIHZhciB3cmFwID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIltoa3AtdmlkZW8tbWFza11cIik7XG4gIGlmICh3cmFwKSB7XG4gICAgdmFyIERJQU1PTkQgPSBcInVybChcXFwiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA1OTMgNTkzJyUzRSUzQ3JlY3QgeD0nODYuOCcgeT0nODYuOCcgd2lkdGg9JzQxOS40JyBoZWlnaHQ9JzQxOS40JyByeD0nNTIuMycgZmlsbD0nJTIzZmZmJyB0cmFuc2Zvcm09J3JvdGF0ZSg0NSAyOTYuNSAyOTYuNSknLyUzRSUzQy9zdmclM0VcXFwiKVwiO1xuICAgIHdyYXAuc3R5bGUud2Via2l0TWFza0ltYWdlID0gd3JhcC5zdHlsZS5tYXNrSW1hZ2UgPSBESUFNT05EO1xuICAgIHdyYXAuc3R5bGUud2Via2l0TWFza1JlcGVhdCA9IHdyYXAuc3R5bGUubWFza1JlcGVhdCA9IFwibm8tcmVwZWF0XCI7XG4gICAgd3JhcC5zdHlsZS53ZWJraXRNYXNrUG9zaXRpb24gPSB3cmFwLnN0eWxlLm1hc2tQb3NpdGlvbiA9IFwiY2VudGVyXCI7XG4gICAgd3JhcC5zdHlsZS53ZWJraXRNYXNrU2l6ZSA9IHdyYXAuc3R5bGUubWFza1NpemUgPSBcImNvbnRhaW5cIjtcbiAgfVxuXG4gIC8vIC0tLS0gUEFHSU5BVElPTiBBTkQgUFJPR1JFU1MgUklORyAtLS0tXG4gIHZhciByaW5nID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIi5ob21lLWtleS1waWxsYXJzX3JpbmctcHJvZ3Jlc3NcIilcbiAgICB8fCB0cmFjay5xdWVyeVNlbGVjdG9yQWxsKFwiLmhrcF9jaXJjbGVcIilbMV1cbiAgICB8fCB0cmFjay5xdWVyeVNlbGVjdG9yKFwiLmhrcF9jaXJjbGVcIik7XG5cbiAgLy8gLS0tLSBDT1BZIFNXQVA6IFRleHQgc3RhdGVzIHdpdGggbGluZSByZXZlYWxzIC0tLS1cbiAgdmFyIGNvcHlJdGVtcyA9IGdzYXAudXRpbHMudG9BcnJheSh0cmFjay5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtY29weV1cIikpXG4gICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuICgrYS5nZXRBdHRyaWJ1dGUoXCJkYXRhLWNvcHlcIikpIC0gKCtiLmdldEF0dHJpYnV0ZShcImRhdGEtY29weVwiKSk7IH0pO1xuXG4gIHZhciBjb3B5TGluZXMgPSBjb3B5SXRlbXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdmFyIGxpbmVzID0gW107XG4gICAgaXRlbS5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvbWUta2V5LXBpbGxhcnNfaGVhZGluZywgLmhvbWUta2V5LXBpbGxhcnNfcGFyYWdyYXBoXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICBnc2FwLnNldChlbCwgeyBhdXRvQWxwaGE6IDEgfSk7XG4gICAgICB2YXIgcyA9IFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSk7XG4gICAgICBsaW5lcyA9IGxpbmVzLmNvbmNhdChzLmxpbmVzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gbGluZXM7XG4gIH0pO1xuXG4gIGNvcHlJdGVtcy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKSB7IGdzYXAuc2V0KGl0ZW0sIHsgYXV0b0FscGhhOiAwIH0pOyB9KTtcblxuICB2YXIgY29weUN1ciA9IC0xO1xuICBmdW5jdGlvbiBzZXRDb3B5KGkpIHtcbiAgICBpZiAoaSA9PT0gY29weUN1ciB8fCAhY29weUl0ZW1zW2ldKSByZXR1cm47XG4gICAgY29weUN1ciA9IGk7XG4gICAgY29weUl0ZW1zLmZvckVhY2goZnVuY3Rpb24gKGl0LCBuKSB7XG4gICAgICBnc2FwLnNldChpdCwgeyB6SW5kZXg6IG4gPT09IGkgPyAyIDogMSwgYXV0b0FscGhhOiBuID09PSBpID8gMSA6IDAgfSk7XG4gICAgfSk7XG4gICAgZ3NhcC5zZXQoY29weUxpbmVzW2ldLCB7IHlQZXJjZW50OiAxMTAgfSk7XG4gICAgZ3NhcC50byhjb3B5TGluZXNbaV0sIHsgeVBlcmNlbnQ6IDAsIGR1cmF0aW9uOiAwLjgsIHN0YWdnZXI6IDAuMSwgZWFzZTogXCJleHBvLm91dFwiLCBvdmVyd3JpdGU6IHRydWUgfSk7XG4gIH1cblxuICAvLyBSaW5nIHN0cm9rZSBpbmxpbmUgc3R5bGluZ1xuICB0cmFjay5xdWVyeVNlbGVjdG9yQWxsKFwiLmhrcF9jaXJjbGVcIikuZm9yRWFjaChmdW5jdGlvbiAoYykge1xuICAgIGMuc3R5bGUuc3Ryb2tlID0gKGMgPT09IHJpbmcpID8gXCIjMTZBQkE5XCIgOiBcInJnYmEoMCwgMCwgMCwgMC4xNSlcIjtcbiAgfSk7XG5cbiAgdmFyIHJpbmdMZW4gPSAwO1xuICBpZiAocmluZyAmJiByaW5nLmdldFRvdGFsTGVuZ3RoKSB7XG4gICAgcmluZ0xlbiA9IHJpbmcuZ2V0VG90YWxMZW5ndGgoKTtcbiAgICByaW5nLnN0eWxlLnN0cm9rZURhc2hhcnJheSA9IHJpbmdMZW47XG4gICAgcmluZy5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gcmluZ0xlbjtcbiAgfVxuXG4gIHZhciBzdGVwcyA9IHRyYWNrLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaG9tZS1rZXktcGlsbGFyc19zdGVwXCIpO1xuICB2YXIgZG90cyA9IHRyYWNrLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaG9tZS1rZXktcGlsbGFyc19kb3RcIik7XG4gIHZhciBOID0gZG90cy5sZW5ndGggfHwgc3RlcHMubGVuZ3RoIHx8IDE7XG5cbiAgdmFyIGFjdGl2ZSA9IC0xO1xuICBmdW5jdGlvbiBzZXRBY3RpdmUoaSkge1xuICAgIGlmIChpID09PSBhY3RpdmUpIHJldHVybjtcbiAgICBhY3RpdmUgPSBpO1xuXG4gICAgc2V0Q29weShpKTtcblxuICAgIHN0ZXBzLmZvckVhY2goZnVuY3Rpb24gKGVsLCBuKSB7XG4gICAgICBlbC5jbGFzc0xpc3QudG9nZ2xlKFwiaXMtYWN0aXZlXCIsIG4gPT09IGkpO1xuICAgIH0pO1xuICAgIGRvdHMuZm9yRWFjaChmdW5jdGlvbiAoZWwsIG4pIHtcbiAgICAgIGVsLmNsYXNzTGlzdC50b2dnbGUoXCJpcy1hY3RpdmVcIiwgbiA9PT0gaSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyAtLS0tIElOVFJPIEFOSU1BVElPTiAtLS0tXG4gIHZhciBleWVicm93ID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIi5ob21lLWtleS1waWxsYXJzX2xhYmVsXCIpO1xuICB2YXIgY3RhID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIi5ob21lLWtleS1waWxsYXJzX2N0YVwiKTtcbiAgdmFyIHN0YWdlID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIi5ob21lLWtleS1waWxsYXJzX3Byb2dyZXNzLWJsb2NrXCIpO1xuICB2YXIgcGFnZXIgPSB0cmFjay5xdWVyeVNlbGVjdG9yKFwiLmhvbWUta2V5LXBpbGxhcnNfcmlnaHRcIik7XG5cbiAgdmFyIGludHJvVGwgPSBnc2FwLnRpbWVsaW5lKHtcbiAgICBzY3JvbGxUcmlnZ2VyOiB7XG4gICAgICB0cmlnZ2VyOiB0cmFjayxcbiAgICAgIHN0YXJ0OiBcInRvcCA4NSVcIixcbiAgICAgIG9uY2U6IHRydWVcbiAgICB9LFxuICAgIGRlZmF1bHRzOiB7IGVhc2U6IFwicG93ZXIyLm91dFwiIH1cbiAgfSk7XG5cbiAgaWYgKGV5ZWJyb3cpIHtcbiAgICBpbnRyb1RsLmZyb20oZXllYnJvdywgeyBhdXRvQWxwaGE6IDAsIHk6IDIwLCBkdXJhdGlvbjogMC42IH0sIDApO1xuICB9XG5cbiAgaWYgKHN0YWdlKSB7XG4gICAgaW50cm9UbC5mcm9tVG8oc3RhZ2UsXG4gICAgICB7IHJvdGF0aW9uOiAtNDUsIHNjYWxlOiAwLjgsIGF1dG9BbHBoYTogMCwgdHJhbnNmb3JtT3JpZ2luOiBcImNlbnRlciBjZW50ZXJcIiB9LFxuICAgICAgeyByb3RhdGlvbjogMCwgc2NhbGU6IDEsIGF1dG9BbHBoYTogMSwgZHVyYXRpb246IDAuOSB9LCAwLjM1XG4gICAgKTtcbiAgfVxuXG4gIGlmIChwYWdlcikge1xuICAgIGludHJvVGwuZnJvbVRvKHBhZ2VyLFxuICAgICAgeyByb3RhdGlvbjogLTQ1LCBzY2FsZTogMC44LCBhdXRvQWxwaGE6IDAsIHRyYW5zZm9ybU9yaWdpbjogXCJjZW50ZXIgY2VudGVyXCIgfSxcbiAgICAgIHsgcm90YXRpb246IDAsIHNjYWxlOiAxLCBhdXRvQWxwaGE6IDEsIGR1cmF0aW9uOiAwLjkgfSwgMC42XG4gICAgKTtcbiAgfVxuXG4gIGludHJvVGwuY2FsbChmdW5jdGlvbiAoKSB7IHNldEFjdGl2ZSgwKTsgfSwgbnVsbCwgMC40KTtcblxuICBpZiAoY3RhKSB7XG4gICAgaW50cm9UbC5mcm9tKGN0YSwgeyBhdXRvQWxwaGE6IDAsIHk6IDIwLCBkdXJhdGlvbjogMC42IH0sIDEuMSk7XG4gIH1cblxuICAvLyAtLS0tIFZJREVPIFNDUlVCIEFORCBTQ1JPTEwgU1lOQyAtLS0tXG4gIHZpZGVvLm11dGVkID0gdHJ1ZTtcbiAgdmFyIHByaW1lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBwcmltZVZpZGVvKCkge1xuICAgIGlmIChwcmltZWQpIHJldHVybjsgcHJpbWVkID0gdHJ1ZTtcbiAgICB2YXIgcCA9IHZpZGVvLnBsYXkoKTsgaWYgKHAgJiYgcC50aGVuKSBwLnRoZW4oZnVuY3Rpb24gKCkgeyB2aWRlby5wYXVzZSgpOyB9KS5jYXRjaChmdW5jdGlvbiAoKSB7IH0pO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBwcmltZVZpZGVvKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBvaW50ZXJkb3duXCIsIHByaW1lVmlkZW8pO1xuICB9XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBwcmltZVZpZGVvLCB7IG9uY2U6IHRydWUsIHBhc3NpdmU6IHRydWUgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgcHJpbWVWaWRlbywgeyBvbmNlOiB0cnVlIH0pO1xuICB2aWRlby5wYXVzZSgpO1xuXG4gIFNjcm9sbFRyaWdnZXIuY3JlYXRlKHtcbiAgICB0cmlnZ2VyOiB0cmFjayxcbiAgICBzdGFydDogXCJ0b3AgdG9wXCIsXG4gICAgZW5kOiBcImJvdHRvbSBib3R0b21cIixcbiAgICBzY3J1YjogdHJ1ZSxcbiAgICBvblVwZGF0ZTogZnVuY3Rpb24gKHNlbGYpIHtcbiAgICAgIHZhciBwID0gc2VsZi5wcm9ncmVzcztcbiAgICAgIGlmICh2aWRlby5kdXJhdGlvbikgdmlkZW8uY3VycmVudFRpbWUgPSBNYXRoLm1pbihwICogdmlkZW8uZHVyYXRpb24sIHZpZGVvLmR1cmF0aW9uIC0gMC4wNCk7XG4gICAgICBpZiAocmluZykgcmluZy5zdHlsZS5zdHJva2VEYXNob2Zmc2V0ID0gcmluZ0xlbiAqICgxIC0gcCk7XG4gICAgICBzZXRBY3RpdmUoTWF0aC5taW4oTWF0aC5mbG9vcihwICogTiksIE4gLSAxKSk7XG4gICAgfVxuICB9KTtcbn1cblxuLy8gPiBCZWZvcmUgRm9vdGVyIC0gQm90dGxlIEFuaW1hdGlvblxuZnVuY3Rpb24gaW5pdEZvb3RlckJvdHRsZVJldmVhbCgpIHtcbiAgdmFyIHNlY3Rpb24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmlzLWZvb3Rlci1ib3R0bGUtcmV2ZWFsXCIpO1xuICBpZiAoIXNlY3Rpb24gfHwgIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuICB2YXIgYm90dGxlID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmZvb3Rlci1ib3R0bGUtcmV2ZWFsX2JvdHRsZVwiKTtcbiAgdmFyIHZpZGVvID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmZvb3Rlci1ib3R0bGUtcmV2ZWFsX3ZpZGVvXCIpO1xuICB2YXIgY2xpcCA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvcihcIi5mb290ZXItYm90dGxlLXJldmVhbF92aWRlby1jbGlwXCIpIHx8IHZpZGVvO1xuICBpZiAoIWJvdHRsZSB8fCAhdmlkZW8pIHJldHVybjtcblxuICAvLyAtLS0gQVVUTy1JTkpFQ1Q6IFNWRyBGSUxURVIgJiBDU1MgLS0tXG4gIGlmICghZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJib3R0bGVNYXRjaFwiKSkge1xuICAgIHZhciBzdmdDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHN2Z0NvbnRhaW5lci5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgc3ZnQ29udGFpbmVyLmlubmVySFRNTCA9ICc8c3ZnPjxmaWx0ZXIgaWQ9XCJib3R0bGVNYXRjaFwiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz1cInNSR0JcIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPVwiZ2FtbWFcIiBhbXBsaXR1ZGU9XCIxXCIgZXhwb25lbnQ9XCIwLjg3NFwiIG9mZnNldD1cIjBcIiAvPjxmZUZ1bmNHIHR5cGU9XCJnYW1tYVwiIGFtcGxpdHVkZT1cIjFcIiBleHBvbmVudD1cIjAuODc0XCIgb2Zmc2V0PVwiMFwiIC8+PC9mZUNvbXBvbmVudFRyYW5zZmVyPjwvZmlsdGVyPjwvc3ZnPic7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzdmdDb250YWluZXIpO1xuICB9XG5cbiAgaWYgKCFkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJvdHRsZS1tYXRjaC1zdHlsZXNcIikpIHtcbiAgICB2YXIgc3R5bGVFbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgICBzdHlsZUVsLmlkID0gXCJib3R0bGUtbWF0Y2gtc3R5bGVzXCI7XG4gICAgc3R5bGVFbC50ZXh0Q29udGVudCA9IGBcbiAgICAgIC5mb290ZXItYm90dGxlLXJldmVhbF9ib3R0bGUge1xuICAgICAgICBmaWx0ZXI6IHVybCgjYm90dGxlTWF0Y2gpIGJyaWdodG5lc3ModmFyKC0tYm90dGxlLXRvbmUsIDEpKTtcbiAgICAgICAgLXdlYmtpdC1tYXNrLWltYWdlOiBsaW5lYXItZ3JhZGllbnQodG8gYm90dG9tLCAjMDAwIGNhbGMoMTAwJSAtIHZhcigtLWJvdHRsZS1mZWF0aGVyLCAwcHgpKSwgdHJhbnNwYXJlbnQgMTAwJSk7XG4gICAgICAgIG1hc2staW1hZ2U6IGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sICMwMDAgY2FsYygxMDAlIC0gdmFyKC0tYm90dGxlLWZlYXRoZXIsIDBweCkpLCB0cmFuc3BhcmVudCAxMDAlKTtcbiAgICAgIH1cbiAgICBgO1xuICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGVFbCk7XG4gIH1cblxuICAvLyAtLS0gQ09ORklHIC0tLVxuICB2YXIgQkFTRSA9IFwiaHR0cHM6Ly9wb2xwaGFybWEuZnJhMS5kaWdpdGFsb2NlYW5zcGFjZXMuY29tXCI7XG4gIHZhciBOX1RPUCA9IDE2O1xuICB2YXIgU0VRX0ZQUyA9IDI0O1xuICB2YXIgRlJBTUVfT0ZGU0VUID0gMDtcbiAgdmFyIEZBTExCQUNLX0RVUiA9IDEuOTE2NztcblxuICAvLyAtLS0gUHJlbG9hZCBQTkcgLS0tXG4gIHZhciBwYWQgPSBmdW5jdGlvbiAobikgeyByZXR1cm4gKG4gPCAxMCA/IFwiMFwiIDogXCJcIikgKyBuOyB9O1xuICB2YXIgRlIgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBOX1RPUDsgaSsrKSB7IHZhciBpbSA9IG5ldyBJbWFnZSgpOyBpbS5zcmMgPSBCQVNFICsgXCIvdG9wX1wiICsgcGFkKGkpICsgXCIucG5nXCI7IEZSLnB1c2goaW0pOyB9XG4gIGJvdHRsZS5zcmMgPSBGUlswXS5zcmM7XG5cbiAgLy8gLS0tIGlPUyBQcmltZSAtLS1cbiAgdmlkZW8ubXV0ZWQgPSB0cnVlO1xuICB2YXIgcHJpbWVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIHByaW1lVmlkZW8oKSB7XG4gICAgaWYgKHByaW1lZCkgcmV0dXJuOyBwcmltZWQgPSB0cnVlO1xuICAgIHZhciBwID0gdmlkZW8ucGxheSgpOyBpZiAocCAmJiBwLnRoZW4pIHAudGhlbihmdW5jdGlvbiAoKSB7IHZpZGVvLnBhdXNlKCk7IH0pLmNhdGNoKGZ1bmN0aW9uICgpIHsgfSk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHByaW1lVmlkZW8pO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgcHJpbWVWaWRlbyk7XG4gIH1cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIHByaW1lVmlkZW8sIHsgb25jZTogdHJ1ZSwgcGFzc2l2ZTogdHJ1ZSB9KTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCBwcmltZVZpZGVvLCB7IG9uY2U6IHRydWUgfSk7XG5cbiAgLy8gLS0tIFNjcnViIEZ1bmN0aW9uIC0tLVxuICB2YXIgY3VyRnJhbWUgPSAtMTtcbiAgZnVuY3Rpb24gYXBwbHkocCkge1xuICAgIGlmIChwIDwgMCkgcCA9IDA7IGVsc2UgaWYgKHAgPiAxKSBwID0gMTtcbiAgICB2YXIgZHVyID0gdmlkZW8uZHVyYXRpb24gfHwgRkFMTEJBQ0tfRFVSO1xuICAgIHZhciB0aSA9IE1hdGguZmxvb3IocCAqIGR1ciAqIFNFUV9GUFMpICsgRlJBTUVfT0ZGU0VUO1xuICAgIGlmICh0aSA8IDApIHRpID0gMDsgZWxzZSBpZiAodGkgPiBOX1RPUCAtIDEpIHRpID0gTl9UT1AgLSAxO1xuICAgIGlmICh0aSAhPT0gY3VyRnJhbWUpIHsgYm90dGxlLnNyYyA9IEZSW3RpXS5zcmM7IGN1ckZyYW1lID0gdGk7IH1cbiAgICBpZiAodmlkZW8uZHVyYXRpb24pIHZpZGVvLmN1cnJlbnRUaW1lID0gTWF0aC5taW4ocCAqIHZpZGVvLmR1cmF0aW9uLCB2aWRlby5kdXJhdGlvbiAtIDAuMDEpO1xuICB9XG5cbiAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlZG1ldGFkYXRhXCIsIGZ1bmN0aW9uICgpIHsgdmlkZW8ucGF1c2UoKTsgU2Nyb2xsVHJpZ2dlci5yZWZyZXNoKCk7IH0sIHsgb25jZTogdHJ1ZSB9KTtcblxuICAvLyAtLS0gUkVTUE9OU0lWRSBTQ1JPTExUUklHR0VSIC0tLVxuICB2YXIgbW0gPSBnc2FwLm1hdGNoTWVkaWEoKTtcblxuICAvLyBEZXNrdG9wIC8gVGFibGV0ICg+PSA0ODBweClcbiAgbW0uYWRkKFwiKG1pbi13aWR0aDogNDgwcHgpXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBTY3JvbGxUcmlnZ2VyLmNyZWF0ZSh7XG4gICAgICB0cmlnZ2VyOiBib3R0bGUsXG4gICAgICBzdGFydDogXCJib3R0b20gODUlXCIsXG4gICAgICBlbmRUcmlnZ2VyOiBjbGlwLFxuICAgICAgZW5kOiBcImJvdHRvbSA1MCVcIixcbiAgICAgIHNjcnViOiAxLjAsXG4gICAgICBvblVwZGF0ZTogZnVuY3Rpb24gKHNlbGYpIHsgYXBwbHkoc2VsZi5wcm9ncmVzcyk7IH0sXG4gICAgICBvblJlZnJlc2g6IGZ1bmN0aW9uIChzZWxmKSB7IGFwcGx5KHNlbGYucHJvZ3Jlc3MpOyB9LFxuICAgIH0pO1xuICB9KTtcblxuICAvLyBNb2JpbGUgKDwgNDgwcHgpIC0gbGF0ZXIgc3RhcnQgKyBsb25nZXIgcGl4ZWwgZGlzdGFuY2VcbiAgbW0uYWRkKFwiKG1heC13aWR0aDogNDc5cHgpXCIsIGZ1bmN0aW9uICgpIHtcbiAgICBTY3JvbGxUcmlnZ2VyLmNyZWF0ZSh7XG4gICAgICB0cmlnZ2VyOiBib3R0bGUsXG4gICAgICBzdGFydDogXCJ0b3AgMzAlXCIsIC8vIGZpcmVzIG9uY2UgdGhlIHRvcCBvZiB0aGUgYm90dGxlIHJlYWNoZXMgMzAlIG9mIHRoZSBzY3JlZW5cbiAgICAgIGVuZDogXCIrPTcwMFwiLCAgICAvLyA3MDBweCBvZiBzY3JvbGwgdG8gcGxheSB0aGUgc2VxdWVuY2Ugb3V0XG4gICAgICBzY3J1YjogMS4wLFxuICAgICAgb25VcGRhdGU6IGZ1bmN0aW9uIChzZWxmKSB7IGFwcGx5KHNlbGYucHJvZ3Jlc3MpOyB9LFxuICAgICAgb25SZWZyZXNoOiBmdW5jdGlvbiAoc2VsZikgeyBhcHBseShzZWxmLnByb2dyZXNzKTsgfSxcbiAgICB9KTtcbiAgfSk7XG5cbiAgYXBwbHkoMCk7XG59XG5cblxuXG4vLyAtLS0gUGFydG5lcnNoaXAgLyBJbnNpZ2h0cyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxubGV0IGJnWm9vbVR3ZWVucyA9IFtdO1xuXG5mdW5jdGlvbiBpbml0QmFja2dyb3VuZFpvb20oKSB7XG4gIGlmICghd2luZG93LmdzYXAgfHwgIXdpbmRvdy5TY3JvbGxUcmlnZ2VyKSByZXR1cm47XG5cbiAgY29uc3QgZmFkZWRIZXJvU2VjdGlvbnMgPSBuZXcgU2V0KCk7XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltkYXRhLWJnLXpvb20taW5pdF1cIikuZm9yRWFjaCgoY29udGFpbmVyKSA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1iZy16b29tLXN0YXJ0XVwiKTtcbiAgICBjb25zdCB0cmlnZ2VyID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1iZy16b29tLWVuZF1cIik7XG5cbiAgICBpZiAoIXRhcmdldCB8fCAhdHJpZ2dlcikgcmV0dXJuO1xuXG4gICAgLy8gQmFja2dyb3VuZCB6b29tXG4gICAgYmdab29tVHdlZW5zLnB1c2goXG4gICAgICBnc2FwLnRvKHRhcmdldCwge1xuICAgICAgICB3aWR0aDogXCIxMDAlXCIsXG4gICAgICAgIGhlaWdodDogXCIxMDB2aFwiLFxuICAgICAgICBlYXNlOiBcIm5vbmVcIixcbiAgICAgICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgICAgIHRyaWdnZXIsXG4gICAgICAgICAgc3RhcnQ6IFwidG9wIGJvdHRvbVwiLFxuICAgICAgICAgIGVuZDogXCJib3R0b20gYm90dG9tXCIsXG4gICAgICAgICAgc2NydWI6IHRydWUsXG4gICAgICAgICAgaW52YWxpZGF0ZU9uUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICBvblJlZnJlc2hJbml0OiAoKSA9PiB7XG4gICAgICAgICAgICBnc2FwLnNldCh0YXJnZXQsIHsgY2xlYXJQcm9wczogXCJ3aWR0aCxoZWlnaHRcIiB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIEZhZGUgb3ZlciB0aGUgbGFzdCAxMDB2aCBvZiB0aGUgaGVybyAtIGV4YWN0bHkgd2hlbiB0aGUgbmV4dCBzZWN0aW9uXG4gICAgLy8gc3RhcnRzIG92ZXJsYXBwaW5nIGl0IHZpYSBtYXJnaW4tdG9wOiAtMTAwdmguXG4gICAgY29uc3QgaGVyb1NlY3Rpb24gPSBjb250YWluZXIuY2xvc2VzdChcIi5zZWN0aW9uLmlzLWhlcm8tZmxpcFwiKTtcblxuICAgIGlmIChoZXJvU2VjdGlvbiAmJiAhZmFkZWRIZXJvU2VjdGlvbnMuaGFzKGhlcm9TZWN0aW9uKSkge1xuICAgICAgZmFkZWRIZXJvU2VjdGlvbnMuYWRkKGhlcm9TZWN0aW9uKTtcblxuICAgICAgYmdab29tVHdlZW5zLnB1c2goXG4gICAgICAgIGdzYXAudG8odGFyZ2V0LCB7XG4gICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICBlYXNlOiBcIm5vbmVcIixcbiAgICAgICAgICBzY3JvbGxUcmlnZ2VyOiB7XG4gICAgICAgICAgICB0cmlnZ2VyOiBoZXJvU2VjdGlvbixcbiAgICAgICAgICAgIHN0YXJ0OiAoKSA9PiBgYm90dG9tIGJvdHRvbSs9JHt3aW5kb3cuaW5uZXJIZWlnaHR9YCxcbiAgICAgICAgICAgIGVuZDogXCJib3R0b20gYm90dG9tXCIsXG4gICAgICAgICAgICBzY3J1YjogdHJ1ZSxcbiAgICAgICAgICAgIGludmFsaWRhdGVPblJlZnJlc2g6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cbiAgfSk7XG5cbiAgU2Nyb2xsVHJpZ2dlci5yZWZyZXNoKCk7XG59XG5cbmZ1bmN0aW9uIGRlc3Ryb3lCYWNrZ3JvdW5kWm9vbSgpIHtcbiAgYmdab29tVHdlZW5zLmZvckVhY2goKHR3ZWVuKSA9PiB7XG4gICAgdHdlZW4uc2Nyb2xsVHJpZ2dlcj8ua2lsbCgpO1xuICAgIHR3ZWVuLmtpbGwoKTtcbiAgfSk7XG5cbiAgYmdab29tVHdlZW5zID0gW107XG5cbiAgZ3NhcC5zZXQoXCJbZGF0YS1iZy16b29tLXN0YXJ0XVwiLCB7XG4gICAgY2xlYXJQcm9wczogXCJ3aWR0aCxoZWlnaHQsb3BhY2l0eVwiXG4gIH0pO1xufVxuXG4vLyA+IFRyYWNrIFJlY29yZCAoU2Nyb2xsICYgSGlnaGxpZ2h0KVxuZnVuY3Rpb24gaW5pdFRyYWNrUmVjb3JkKCkge1xuICB2YXIgd3JhcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudHJhY2stcmVjb3JkX3N0aWNreVwiKTtcbiAgaWYgKCF3cmFwKSByZXR1cm47XG4gIHZhciBiYW5kID0gd3JhcC5xdWVyeVNlbGVjdG9yKFwiLnRyYWNrLXJlY29yZF9iYW5kXCIpO1xuICB2YXIgdHJhY2sgPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoXCIudHJhY2stcmVjb3JkX3RyYWNrXCIpO1xuICB2YXIgaGVhZGluZyA9IHdyYXAucXVlcnlTZWxlY3RvcihcIltkYXRhLWhpZ2hsaWdodF1cIik7XG4gIHZhciBoZWFkaW5nMiA9IHdyYXAucXVlcnlTZWxlY3RvcihcIltkYXRhLWhpZ2hsaWdodC0yXVwiKTtcblxuICBpZiAoIWJhbmQgfHwgIXRyYWNrIHx8ICFoZWFkaW5nKSByZXR1cm47XG5cbiAgdmFyIGhhc092ZXJsYXAgPSB3cmFwLmhhc0F0dHJpYnV0ZShcImRhdGEtb3ZlcmxhcFwiKTtcblxuICB2YXIgY29sb3JTdGFydFBjdCA9IDgyO1xuICB2YXIgY29sb3JIb2xkVmggPSAyMDtcbiAgdmFyIGVuZEhvbGRWaCA9IDIwO1xuICB2YXIgZGl2aWRlckR1cmF0aW9uTXVsID0gMztcbiAgdmFyIHNjcnViID0gMTtcbiAgdmFyIGNvbG9yTXV0ZWQgPSBcIiMwMDU0NTIyYVwiO1xuICB2YXIgY29sb3JBY3RpdmUgPSBcIiMwMDU0NTNcIjtcblxuICAvLyAtLS0gVEVYVCAxIFNFVFVQIC0tLVxuICB2YXIgc3BsaXRUZXh0ID0gbmV3IFNwbGl0VGV4dChoZWFkaW5nLCB7IHR5cGU6IFwid29yZHMsIGxpbmVzXCIgfSk7XG4gIHZhciB3b3JkcyA9IHNwbGl0VGV4dC53b3JkcztcbiAgaWYgKHdvcmRzICYmIHdvcmRzLmxlbmd0aCkge1xuICAgIGdzYXAuc2V0KHdvcmRzLCB7IGNvbG9yOiBjb2xvck11dGVkIH0pO1xuICB9XG5cbiAgLy8gLS0tIFRFWFQgMiBTRVRVUCAtLS1cbiAgdmFyIHNwbGl0VGV4dDIgPSBudWxsO1xuICB2YXIgd29yZHMyID0gW107XG4gIGlmIChoZWFkaW5nMikge1xuICAgIHNwbGl0VGV4dDIgPSBuZXcgU3BsaXRUZXh0KGhlYWRpbmcyLCB7IHR5cGU6IFwid29yZHMsIGxpbmVzXCIgfSk7XG4gICAgd29yZHMyID0gc3BsaXRUZXh0Mi53b3JkcztcbiAgICBpZiAod29yZHMyICYmIHdvcmRzMi5sZW5ndGgpIHtcbiAgICAgIGdzYXAuc2V0KHdvcmRzMiwgeyBjb2xvcjogY29sb3JNdXRlZCB9KTtcbiAgICB9XG4gIH1cblxuICB2YXIgdmggPSBmdW5jdGlvbiAoKSB7IHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7IH07XG4gIHZhciBkaXN0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gTWF0aC5tYXgoMCwgdHJhY2suc2Nyb2xsV2lkdGggLSBiYW5kLmNsaWVudFdpZHRoKTsgfTtcbiAgdmFyIGJhbmRUb3AgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBNYXRoLm1heCgwLCAodmgoKSAtIGJhbmQub2Zmc2V0SGVpZ2h0KSAvIDIpOyB9O1xuICB2YXIgaG9sZEluID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdmgoKSAqIGNvbG9ySG9sZFZoIC8gMTAwOyB9O1xuICB2YXIgaG9sZE91dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZoKCkgKiBlbmRIb2xkVmggLyAxMDA7IH07XG5cbiAgdmFyIGlzTW9iaWxlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gd2luZG93LmlubmVyV2lkdGggPD0gMTsgfTtcblxuICAvLyBFeHRyYSAxMDB2aCBvbmx5IHdpdGggZGF0YS1vdmVybGFwIGFuZCBub3Qgb24gbW9iaWxlXG4gIHZhciBvdmVybGFwUGluID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gKGhhc092ZXJsYXAgJiYgIWlzTW9iaWxlKCkpID8gdmgoKSA6IDA7IH07XG5cbiAgdmFyIHRvdGFsID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaG9sZEluKCkgKyBkaXN0KCkgKyBob2xkT3V0KCkgKyBvdmVybGFwUGluKCk7IH07XG5cbiAgdmFyIGhTdGFydCA9IDAsIGhFbmQgPSAwO1xuXG4gIHZhciBzeW5jTGVuZ3RoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBkID0gZGlzdCgpO1xuICAgIHdyYXAuc3R5bGUuc2V0UHJvcGVydHkoXCItLXRyLXNjcm9sbFwiLCB0b3RhbCgpICsgXCJweFwiKTtcblxuICAgIGlmIChoZWFkaW5nMikge1xuICAgICAgdmFyIGRpc3RhbmNlQWxvbmdUcmFjayA9IGhlYWRpbmcyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSB0cmFjay5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuXG4gICAgICBoU3RhcnQgPSBkaXN0YW5jZUFsb25nVHJhY2sgLSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuODtcbiAgICAgIGhFbmQgPSBkaXN0YW5jZUFsb25nVHJhY2sgLSB3aW5kb3cuaW5uZXJXaWR0aCAqIDAuMjtcblxuICAgICAgaWYgKGhFbmQgPiBkKSB7XG4gICAgICAgIGhFbmQgPSBkO1xuICAgICAgfVxuXG4gICAgICBpZiAoaFN0YXJ0ID49IGhFbmQpIHtcbiAgICAgICAgaFN0YXJ0ID0gTWF0aC5tYXgoMCwgaEVuZCAtIHdpbmRvdy5pbm5lcldpZHRoICogMC4yKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgc3luY0xlbmd0aCgpO1xuICB2YXIgcHJveCA9IHsgcDogMCB9O1xuXG4gIGZ1bmN0aW9uIGFwcGx5VHJhY2soKSB7XG4gICAgdmFyIGEgPSBob2xkSW4oKSwgZCA9IGRpc3QoKTtcbiAgICB2YXIgcHggPSBwcm94LnAgKiB0b3RhbCgpO1xuXG4gICAgdmFyIG1vdmVkID0gTWF0aC5taW4oTWF0aC5tYXgocHggLSBhLCAwKSwgZCk7XG5cbiAgICBnc2FwLnNldCh0cmFjaywgeyB4OiAtbW92ZWQgfSk7XG5cbiAgICAvLyBURVhUIDIgY29sb3VyaW5nXG4gICAgaWYgKHdvcmRzMiAmJiB3b3JkczIubGVuZ3RoKSB7XG4gICAgICB2YXIgcHJvZ3Jlc3MyID0gZ3NhcC51dGlscy5ub3JtYWxpemUoaFN0YXJ0LCBoRW5kLCBtb3ZlZCk7XG4gICAgICBwcm9ncmVzczIgPSBnc2FwLnV0aWxzLmNsYW1wKDAsIDEsIHByb2dyZXNzMik7XG5cbiAgICAgIHZhciBoZWFkMiA9IHByb2dyZXNzMiAqIHdvcmRzMi5sZW5ndGg7XG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHdvcmRzMi5sZW5ndGg7IGorKykge1xuICAgICAgICB2YXIgZmFjdG9yMiA9IGdzYXAudXRpbHMuY2xhbXAoMCwgMSwgaGVhZDIgLSBqKTtcbiAgICAgICAgdmFyIGN1cnJlbnRDb2xvcjIgPSBnc2FwLnV0aWxzLmludGVycG9sYXRlKGNvbG9yTXV0ZWQsIGNvbG9yQWN0aXZlLCBmYWN0b3IyKTtcbiAgICAgICAgZ3NhcC5zZXQod29yZHMyW2pdLCB7IGNvbG9yOiBjdXJyZW50Q29sb3IyIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdzYXAudG8ocHJveCwge1xuICAgIHA6IDEsXG4gICAgZWFzZTogXCJub25lXCIsXG4gICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgdHJpZ2dlcjogd3JhcCxcbiAgICAgIHN0YXJ0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBcInRvcCBcIiArIGJhbmRUb3AoKSArIFwicHhcIjsgfSxcbiAgICAgIGVuZDogZnVuY3Rpb24gKCkgeyByZXR1cm4gXCIrPVwiICsgdG90YWwoKTsgfSxcbiAgICAgIHNjcnViOiBzY3J1YixcbiAgICAgIGludmFsaWRhdGVPblJlZnJlc2g6IHRydWUsXG4gICAgICBvblJlZnJlc2hJbml0OiBzeW5jTGVuZ3RoLFxuICAgICAgb25SZWZyZXNoOiBhcHBseVRyYWNrLFxuICAgIH0sXG4gICAgb25VcGRhdGU6IGFwcGx5VHJhY2ssXG4gIH0pO1xuXG4gIC8vIC0tLSBURVhUIDEgSElHSExJR0hUIC0tLVxuICB2YXIgdG9TdGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gTWF0aC5tYXgoMCwgdmgoKSAqIGNvbG9yU3RhcnRQY3QgLyAxMDAgLSBiYW5kVG9wKCkpO1xuICB9O1xuXG4gIGlmICh3b3JkcyAmJiB3b3Jkcy5sZW5ndGgpIHtcbiAgICBTY3JvbGxUcmlnZ2VyLmNyZWF0ZSh7XG4gICAgICB0cmlnZ2VyOiB3cmFwLFxuICAgICAgc3RhcnQ6IFwidG9wIFwiICsgY29sb3JTdGFydFBjdCArIFwiJVwiLFxuICAgICAgZW5kOiBmdW5jdGlvbiAoKSB7IHJldHVybiBcIis9XCIgKyAodG9TdGljaygpICsgaG9sZEluKCkpOyB9LFxuICAgICAgc2NydWI6IHNjcnViLFxuICAgICAgaW52YWxpZGF0ZU9uUmVmcmVzaDogdHJ1ZSxcbiAgICAgIG9uVXBkYXRlOiBmdW5jdGlvbiAoc2VsZikge1xuICAgICAgICB2YXIgcHJvZ3Jlc3MgPSBzZWxmLnByb2dyZXNzO1xuICAgICAgICB2YXIgaGVhZCA9IHByb2dyZXNzICogd29yZHMubGVuZ3RoO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgd29yZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgZmFjdG9yID0gZ3NhcC51dGlscy5jbGFtcCgwLCAxLCBoZWFkIC0gaSk7XG4gICAgICAgICAgdmFyIGN1cnJlbnRDb2xvciA9IGdzYXAudXRpbHMuaW50ZXJwb2xhdGUoY29sb3JNdXRlZCwgY29sb3JBY3RpdmUsIGZhY3Rvcik7XG4gICAgICAgICAgZ3NhcC5zZXQod29yZHNbaV0sIHsgY29sb3I6IGN1cnJlbnRDb2xvciB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gLS0tIFNFQ1RJT04gRU5UUkFOQ0UgLS0tXG4gIHZhciByID0geyBzdGFydDogXCJ0b3AgNzUlXCIsIGR1cmF0aW9uOiAxLCBlYXNlOiBcImV4cG8ub3V0XCIsIHN0YWdnZXI6IDAuMSB9O1xuICB2YXIgdHJhY2tUZXh0cyA9IHdyYXAucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtcmV2ZWFsPVwidHJhY2stcmVjb3JkXCJdJyk7XG4gIHZhciBkaXZDb2xzID0gd3JhcC5xdWVyeVNlbGVjdG9yQWxsKFwiLnRyYWNrLXJlY29yZF9jb2wgKyAudHJhY2stcmVjb3JkX2NvbFwiKTtcbiAgdmFyIHRyaW0gPSB3cmFwLnF1ZXJ5U2VsZWN0b3JBbGwoXCIudHJhY2stcmVjb3JkX2RhdGVzLCAudHJhY2stcmVjb3JkX2RpYW1vbmRcIik7XG5cbiAgZ3NhcC5zZXQodHJpbSwgeyBhdXRvQWxwaGE6IDAsIHk6IDEyIH0pO1xuXG4gIGlmICh0cmFja1RleHRzLmxlbmd0aCkgZ3NhcC5zZXQodHJhY2tUZXh0cywgeyBhdXRvQWxwaGE6IDAsIHk6IDIwIH0pO1xuXG4gIFNjcm9sbFRyaWdnZXIuY3JlYXRlKHtcbiAgICB0cmlnZ2VyOiB3cmFwLFxuICAgIHN0YXJ0OiByLnN0YXJ0LFxuICAgIG9uY2U6IHRydWUsXG4gICAgb25FbnRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHRyYWNrVGV4dHMubGVuZ3RoKSB7XG4gICAgICAgIGdzYXAudG8odHJhY2tUZXh0cywgeyBhdXRvQWxwaGE6IDEsIHk6IDAsIGR1cmF0aW9uOiByLmR1cmF0aW9uLCBlYXNlOiByLmVhc2UsIHN0YWdnZXI6IHIuc3RhZ2dlciB9KTtcbiAgICAgIH1cbiAgICAgIGdzYXAudG8oZGl2Q29scywge1xuICAgICAgICBcIi0tdHItZGl2XCI6IDEsXG4gICAgICAgIGR1cmF0aW9uOiByLmR1cmF0aW9uICogZGl2aWRlckR1cmF0aW9uTXVsLFxuICAgICAgICBlYXNlOiByLmVhc2UsXG4gICAgICAgIHN0YWdnZXI6IHIuc3RhZ2dlcixcbiAgICAgIH0pO1xuICAgICAgZ3NhcC50byh0cmltLCB7XG4gICAgICAgIGF1dG9BbHBoYTogMSwgeTogMCxcbiAgICAgICAgZHVyYXRpb246IHIuZHVyYXRpb24sXG4gICAgICAgIGVhc2U6IHIuZWFzZSxcbiAgICAgICAgc3RhZ2dlcjogci5zdGFnZ2VyLFxuICAgICAgfSk7XG4gICAgfSxcbiAgfSk7XG59XG5cblxuLy8gLS0tIEFib3V0IHVzIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBpbml0QWJvdXRKb3VybmV5KCkge1xuICBjb25zdCBzZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIlthYm91dC1qb3VybmV5LXNjcnViXVwiKTtcbiAgaWYgKCFzZWN0aW9uIHx8ICF3aW5kb3cuZ3NhcCB8fCAhd2luZG93LlNjcm9sbFRyaWdnZXIgfHwgIXdpbmRvdy5TcGxpdFRleHQpIHJldHVybjtcblxuICBjb25zdCB1bmljb3JuID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmFib3V0LWpvdXJuZXlfdW5pY29yblwiKTtcbiAgY29uc3QgdGV4dFdyYXAgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIuYWJvdXQtam91cm5leV90ZXh0LXdyYXBcIik7XG4gIGNvbnN0IGRpYW1vbmQgPSBzZWN0aW9uLnF1ZXJ5U2VsZWN0b3IoXCIuYWJvdXQtam91cm5leV9kaWFtb25kXCIpO1xuICBjb25zdCBzdGF0ZUVsMSA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvcihcIi5hYm91dC1qb3VybmV5X3N0YXRlLmlzLXN0YXRlLTFcIik7XG4gIGNvbnN0IHN0YXRlRWwyID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmFib3V0LWpvdXJuZXlfc3RhdGUuaXMtc3RhdGUtMlwiKTtcbiAgY29uc3Qgc2xvdDEgPSBzdGF0ZUVsMSAmJiBzdGF0ZUVsMS5xdWVyeVNlbGVjdG9yKFwiLmFib3V0LWpvdXJuZXlfZGlhbW9uZC1zbG90XCIpO1xuICBjb25zdCBzbG90MiA9IHN0YXRlRWwyICYmIHN0YXRlRWwyLnF1ZXJ5U2VsZWN0b3IoXCIuYWJvdXQtam91cm5leV9kaWFtb25kLXNsb3RcIik7XG4gIGNvbnN0IG5hdkxvZ28gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2xvZ28tbGluay1jb2xvcl1cIik7XG4gIGNvbnN0IHN0YWdlID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmFib3V0LWpvdXJuZXlfc3RhZ2VcIik7XG4gIGNvbnN0IHZpZGVvID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKFwiLmFib3V0LWpvdXJuZXlfdmlkZW9cIik7XG5cbiAgaWYgKCF1bmljb3JuIHx8ICF0ZXh0V3JhcCB8fCAhZGlhbW9uZCB8fCAhc3RhdGVFbDEgfHwgIXN0YXRlRWwyIHx8ICFzbG90MSB8fCAhc2xvdDIpIHJldHVybjtcblxuICAvLyBWaWRlbyBzcmMgY2FjaGVkIG9uY2U6IHRoZSBtYXRjaE1lZGlhIGNsZWFudXAgZnJlZXMgdGhlIGRlY29kZXIgdmlhXG4gIC8vIHJlbW92ZUF0dHJpYnV0ZShcInNyY1wiKSwgc28gaXQgaGFzIHRvIGJlIHJlc3RvcmVkIG9uIGEgYnJlYWtwb2ludCBzd2l0Y2guXG4gIGNvbnN0IHZpZGVvU3JjID0gdmlkZW8gPyB2aWRlby5nZXRBdHRyaWJ1dGUoXCJzcmNcIikgOiBudWxsO1xuXG4gIGxldCBtbSA9IGdzYXAubWF0Y2hNZWRpYSgpO1xuXG4gIG1tLmFkZCh7XG4gICAgaXNEZXNrdG9wOiBcIihtaW4td2lkdGg6IDc2OHB4KVwiLFxuICAgIGlzTW9iaWxlOiBcIihtYXgtd2lkdGg6IDc2N3B4KVwiXG4gIH0sIChjb250ZXh0KSA9PiB7XG4gICAgbGV0IHsgaXNNb2JpbGUgfSA9IGNvbnRleHQuY29uZGl0aW9ucztcbiAgICBsZXQgbmF2SXNHcmVlbiA9IGZhbHNlO1xuICAgIGxldCBhY3RpdmVTcGxpdHMgPSBbXTtcblxuICAgIGNvbnN0IGMgPSB7XG4gICAgICAvLyBcInZoXCIgPT0gbHZoOiBoZWlnaHQgYXMgd2l0aCB0aGUgU2FmYXJpIGJhciBISURERU4uIFN0YXRpYywgc28gaXQgZG9lc24ndFxuICAgICAgLy8ganVtcCB3aGVuIHRoZSBiYXIgY29sbGFwc2VzICh1bmxpa2UgXCJkdmhcIikuIENvc3Q6IHdpdGggdGhlIGJhciB2aXNpYmxlIHRoZVxuICAgICAgLy8gYm90dG9tIH4xNSUgb2YgYSAxMDB2aCBib3ggc2l0cyBiZWhpbmQgaXQgLSBpbnZpc2libGUgZm9yIGEgZnVsbC1zY3JlZW5cbiAgICAgIC8vIGNvdmVyIHZpZGVvLCBhbmQgaW4gZXhjaGFuZ2UgdGhlcmUgaXMgbmV2ZXIgYW4gZW1wdHkgc3RyaXAuXG4gICAgICB2aFVuaXQ6IFwidmhcIixcbiAgICAgIHN0aWNreUhvbGRWaDogNSxcbiAgICAgIHBpblZpZXdwb3J0czogMi41LFxuICAgICAgb3ZlcmxhcFZpZXdwb3J0czogMSxcbiAgICAgIHVuaWNvcm46IHsgbGVuOiAxMDAsIGV4aXRUb1ZoOiAtMTIwLCB4Vnc6IDIwLCB0YXJnZXRXOiBcIjIzdndcIiwgdGFyZ2V0SDogXCIzMHZ3XCIgfSxcbiAgICAgIHBvc3RTaHJpbmtIb2xkVmg6IDUsXG4gICAgICB0ZXh0SW46IDU1LFxuICAgICAgc3dhcEF0OiAyMDAsXG4gICAgICBwdXJwb3NlRW50ZXJNb21lbnQ6IDI1MCxcbiAgICAgIC8vICUgb2YgLmFib3V0LWpvdXJuZXlfc3RhZ2UgaGVpZ2h0LiAxMDAgPSBleGFjdGx5IGJlbG93IGl0cyBlZGdlLlxuICAgICAgLy8gTWVhc3VyZWQgZnJvbSB0aGUgc3RhZ2UsIG5vdCB0aGUgdmlld3BvcnQgLSBzZWUgc3RhZ2VIKCkuXG4gICAgICBpbWFnZUZyb21QZXJjZW50OiAxMDAsXG4gICAgICBpbWFnZUlubmVyU2hpZnRQZXJjZW50OiA5LFxuICAgICAgaW1hZ2VzOiBbXG4gICAgICAgIHsgc2VsOiBcIi5pcy1pbWctY2l0eVwiLCBlbnRlcjogMTAwLCBsZW46IDIwMCB9LFxuICAgICAgICB7IHNlbDogXCIuaXMtaW1nLXZpYWxzXCIsIGVudGVyOiAxNTAsIGxlbjogMTgwIH0sXG4gICAgICAgIHsgc2VsOiBcIi5pcy1pbWctYWJzdHJhY3RcIiwgZW50ZXI6IDIwMCwgbGVuOiAyMDAgfSxcbiAgICAgICAgeyBzZWw6IFwiLmlzLWltZy1oYW5kXCIsIGVudGVyOiAyNTAsIGxlbjogMjIwIH1cbiAgICAgIF0sXG4gICAgICBzY3J1YlNtb290aDogMS4yLFxuICAgICAgb3V0cm86IHtcbiAgICAgICAgc2NhbGU6IDAuOSxcbiAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgc3RhcnRzVmhCZWZvcmVFbmQ6IDE1MFxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgIGMudW5pY29ybi50YXJnZXRXID0gXCI4MHZ3XCI7XG4gICAgICBjLnVuaWNvcm4udGFyZ2V0SCA9IFwiNTBcIiArIGMudmhVbml0O1xuICAgICAgYy51bmljb3JuLnhWdyA9IDEwO1xuICAgICAgYy5pbWFnZXMgPSBjLmltYWdlcy5tYXAoKGltZywgaSkgPT4gKHsgLi4uaW1nLCBlbnRlcjogaW1nLmVudGVyICsgaSAqIDUwIH0pKTtcbiAgICB9XG5cbiAgICAvLyBNZWFzdXJlIEVYQUNUTFkgd2hhdCB0aGUgYnJvd3NlciByZXNvbHZlcyBmb3IgQ1NTIGAxMDA8dmhVbml0PmAuXG4gICAgLy8gd2luZG93LmlubmVySGVpZ2h0IGlzIG5vdCBpdDogb24gaU9TIHdpdGggdGhlIGJhciB2aXNpYmxlIGl0IGlzIH4xNSUgc21hbGxlclxuICAgIC8vIHRoYW4gQ1NTIDEwMHZoLCBzbyBKUyBwb3NpdGlvbnMgZHJpZnRlZCBmcm9tIENTUyBoZWlnaHRzIChpbWFnZXMgc3R1Y2sgb3V0IGF0XG4gICAgLy8gdGhlIGJvdHRvbSBvbiBsb2FkKS4gRm9sbG93cyBjLnZoVW5pdCwgcmVmcmVzaGVkIG9ubHkgb24gU2Nyb2xsVHJpZ2dlciByZWZyZXNoLlxuICAgIGZ1bmN0aW9uIG1lYXN1cmVWaCgpIHtcbiAgICAgIGNvbnN0IHByb2JlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIHByb2JlLnN0eWxlLmNzc1RleHQgPVxuICAgICAgICBcInBvc2l0aW9uOmFic29sdXRlO3RvcDowO2xlZnQ6MDt3aWR0aDowO2hlaWdodDoxMDBcIiArIGMudmhVbml0ICtcbiAgICAgICAgXCI7dmlzaWJpbGl0eTpoaWRkZW47cG9pbnRlci1ldmVudHM6bm9uZVwiO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChwcm9iZSk7XG4gICAgICBjb25zdCBoID0gcHJvYmUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgICAgcHJvYmUucmVtb3ZlKCk7XG4gICAgICByZXR1cm4gaDtcbiAgICB9XG5cbiAgICBsZXQgdnBIID0gbWVhc3VyZVZoKCk7XG4gICAgY29uc3QgdmggPSAobikgPT4gKHZwSCAqIG4pIC8gMTAwO1xuXG4gICAgLy8gUmVhbCBlZGdlIHRoZSBpbWFnZSBoYXMgdG8gaGlkZSBiZWhpbmQuIG9mZnNldEhlaWdodCBpcyB0aGUgbGF5b3V0IGJveCAtXG4gICAgLy8gdHJhbnNmb3JtcyBkb24ndCBtb3ZlIGl0LCBzbyBpdCBjYW4gYmUgcmVhZCBhdCBhbnkgc2Nyb2xsIHBvc2l0aW9uLlxuICAgIGNvbnN0IHN0YWdlSCA9ICgpID0+IChzdGFnZSA/IHN0YWdlLm9mZnNldEhlaWdodCA6IHZwSCk7XG5cbiAgICAvLyAtLS0gVklERU8gLyBpT1MgLS0tXG4gICAgLy8gMS4gbXV0ZWQgTVVTVCBiZSBhIHByb3BlcnR5LCBub3QganVzdCBhbiBhdHRyaWJ1dGU6IHdpdGggdGhlIGVsZW1lbnQgaW5zZXJ0ZWRcbiAgICAvLyAgICB2aWEgaW5uZXJIVE1MIChCYXJiYSkgV2ViS2l0IGRvZXNuJ3QgbWlycm9yIHRoZSBhdHRyaWJ1dGUgYW5kIGJsb2Nrc1xuICAgIC8vICAgIGF1dG9wbGF5IHNpbGVudGx5LlxuICAgIC8vIDIuIHBsYXkoKSBjYWxsZWQgaW1wZXJhdGl2ZWx5IGFuZCByZXRyaWVkLCBiZWNhdXNlIHRoZSBmaXJzdCBhdHRlbXB0IHJ1bnNcbiAgICAvLyAgICBiZWZvcmUgbWV0YWRhdGEuXG4gICAgLy8gMy4gTG93IFBvd2VyIE1vZGUgYmxvY2tzIGF1dG9wbGF5IGVudGlyZWx5IC0+IGZhbGxiYWNrIG9uIGZpcnN0IHRvdWNoLlxuICAgIGxldCB2aWRlb0xpc3RlbmVycyA9IFtdO1xuXG4gICAgaWYgKHZpZGVvKSB7XG4gICAgICBpZiAodmlkZW9TcmMgJiYgIXZpZGVvLmdldEF0dHJpYnV0ZShcInNyY1wiKSkge1xuICAgICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJzcmNcIiwgdmlkZW9TcmMpO1xuICAgICAgICB2aWRlby5sb2FkKCk7XG4gICAgICB9XG5cbiAgICAgIHZpZGVvLm11dGVkID0gdHJ1ZTtcbiAgICAgIHZpZGVvLmRlZmF1bHRNdXRlZCA9IHRydWU7XG4gICAgICB2aWRlby5wbGF5c0lubGluZSA9IHRydWU7XG4gICAgICB2aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCBcIlwiKTtcbiAgICAgIHZpZGVvLnNldEF0dHJpYnV0ZShcIndlYmtpdC1wbGF5c2lubGluZVwiLCBcIlwiKTtcblxuICAgICAgY29uc3QgdHJ5UGxheSA9ICgpID0+IHtcbiAgICAgICAgY29uc3QgcCA9IHZpZGVvLnBsYXkoKTtcbiAgICAgICAgaWYgKHAgJiYgcC5jYXRjaCkgcC5jYXRjaCgoKSA9PiB7IH0pO1xuICAgICAgfTtcblxuICAgICAgY29uc3Qgb25WaWRlbyA9ICh0YXJnZXQsIHR5cGUsIGZuLCBvcHRzKSA9PiB7XG4gICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGZuLCBvcHRzKTtcbiAgICAgICAgdmlkZW9MaXN0ZW5lcnMucHVzaChbdGFyZ2V0LCB0eXBlLCBmbl0pO1xuICAgICAgfTtcblxuICAgICAgdHJ5UGxheSgpO1xuICAgICAgb25WaWRlbyh2aWRlbywgXCJsb2FkZWRtZXRhZGF0YVwiLCB0cnlQbGF5KTtcbiAgICAgIG9uVmlkZW8odmlkZW8sIFwiY2FucGxheVwiLCB0cnlQbGF5KTtcbiAgICAgIG9uVmlkZW8oZG9jdW1lbnQsIFwidG91Y2hzdGFydFwiLCB0cnlQbGF5LCB7IHBhc3NpdmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcHJlcFN0YXRlKHN0YXRlRWwpIHtcbiAgICAgIGNvbnN0IHRhcmdldHMgPSBzdGF0ZUVsLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYWJvdXQtam91cm5leV9oZWFkaW5nLCAuYWJvdXQtam91cm5leV9jYXB0aW9uXCIpO1xuICAgICAgbGV0IGxpbmVzID0gW107XG5cbiAgICAgIHRhcmdldHMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgZ3NhcC5zZXQoZWwsIHsgYXV0b0FscGhhOiAxIH0pO1xuICAgICAgICBjb25zdCBzcGxpdCA9IFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSk7XG4gICAgICAgIGFjdGl2ZVNwbGl0cy5wdXNoKHNwbGl0KTtcbiAgICAgICAgbGluZXMgPSBsaW5lcy5jb25jYXQoc3BsaXQubGluZXMpO1xuICAgICAgfSk7XG5cbiAgICAgIGdzYXAuc2V0KGxpbmVzLCB7IHlQZXJjZW50OiAxMTAgfSk7XG4gICAgICBnc2FwLnNldChzdGF0ZUVsLCB7IGF1dG9BbHBoYTogMCB9KTtcbiAgICAgIHJldHVybiB7IGxpbmVzLCBzaG93bjogZmFsc2UsIGVsOiBzdGF0ZUVsIH07XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdGUxID0gcHJlcFN0YXRlKHN0YXRlRWwxKTtcbiAgICBjb25zdCBzdGF0ZTIgPSBwcmVwU3RhdGUoc3RhdGVFbDIpO1xuXG4gICAgZnVuY3Rpb24gc2hvd1RleHQoc3RhdGUpIHtcbiAgICAgIGlmICghc3RhdGUubGluZXMubGVuZ3RoIHx8IHN0YXRlLnNob3duKSByZXR1cm47XG4gICAgICBzdGF0ZS5zaG93biA9IHRydWU7XG4gICAgICBnc2FwLmtpbGxUd2VlbnNPZihzdGF0ZS5saW5lcyk7XG4gICAgICBnc2FwLnNldChzdGF0ZS5lbCwgeyBhdXRvQWxwaGE6IDEgfSk7XG4gICAgICBnc2FwLnRvKHN0YXRlLmxpbmVzLCB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogMC44LCBzdGFnZ2VyOiAwLjEsIGVhc2U6IFwiZXhwby5vdXRcIiwgZGVsYXk6IDAuMTUsIG92ZXJ3cml0ZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoaWRlVGV4dChzdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZS5saW5lcy5sZW5ndGggfHwgIXN0YXRlLnNob3duKSByZXR1cm47XG4gICAgICBzdGF0ZS5zaG93biA9IGZhbHNlO1xuICAgICAgZ3NhcC5raWxsVHdlZW5zT2Yoc3RhdGUubGluZXMpO1xuICAgICAgZ3NhcC50byhzdGF0ZS5saW5lcywge1xuICAgICAgICB5UGVyY2VudDogMTEwLFxuICAgICAgICBkdXJhdGlvbjogMC40LFxuICAgICAgICBzdGFnZ2VyOiAwLFxuICAgICAgICBlYXNlOiBcInBvd2VyMi5pbk91dFwiLFxuICAgICAgICBvdmVyd3JpdGU6IHRydWUsXG4gICAgICAgIG9uQ29tcGxldGU6ICgpID0+IHtcbiAgICAgICAgICBpZiAoIXN0YXRlLnNob3duKSBnc2FwLnNldChzdGF0ZS5lbCwgeyBhdXRvQWxwaGE6IDAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNsb3RZKHNsb3QpIHtcbiAgICAgIGNvbnN0IHdyID0gdGV4dFdyYXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBjb25zdCBzciA9IHNsb3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICByZXR1cm4gc3IudG9wICsgc3IuaGVpZ2h0IC8gMiAtIHdyLnRvcDtcbiAgICB9XG5cbiAgICBsZXQgZGlhWTEgPSBzbG90WShzbG90MSk7XG4gICAgbGV0IGRpYVkyID0gc2xvdFkoc2xvdDIpO1xuICAgIGxldCBkaWFtb25kU2hvd24gPSBmYWxzZTtcbiAgICBsZXQgZGlhbW9uZFJvdGF0ZWQgPSBmYWxzZTtcblxuICAgIGdzYXAuc2V0KGRpYW1vbmQsIHsgeFBlcmNlbnQ6IC01MCwgeVBlcmNlbnQ6IC01MCwgeTogZGlhWTEsIGF1dG9BbHBoYTogMCwgc2NhbGU6IDAuNywgcm90YXRpb246IC0xODAgfSk7XG5cbiAgICBmdW5jdGlvbiBvblJlZnJlc2goKSB7XG4gICAgICB2cEggPSBtZWFzdXJlVmgoKTtcbiAgICAgIGRpYVkxID0gc2xvdFkoc2xvdDEpO1xuICAgICAgZGlhWTIgPSBzbG90WShzbG90Mik7XG4gICAgICBnc2FwLnNldChkaWFtb25kLCB7IHk6IGRpYW1vbmRSb3RhdGVkID8gZGlhWTIgOiBkaWFZMSB9KTtcbiAgICB9XG5cbiAgICBTY3JvbGxUcmlnZ2VyLmFkZEV2ZW50TGlzdGVuZXIoXCJyZWZyZXNoXCIsIG9uUmVmcmVzaCk7XG5cbiAgICBmdW5jdGlvbiBzaG93RGlhbW9uZCgpIHtcbiAgICAgIGdzYXAua2lsbFR3ZWVuc09mKGRpYW1vbmQpO1xuICAgICAgZ3NhcC50byhkaWFtb25kLCB7IGF1dG9BbHBoYTogMSwgc2NhbGU6IDEsIHJvdGF0aW9uOiAwLCBkdXJhdGlvbjogMSwgZWFzZTogXCJleHBvLm91dFwiLCBvdmVyd3JpdGU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlkZURpYW1vbmQoKSB7XG4gICAgICBnc2FwLmtpbGxUd2VlbnNPZihkaWFtb25kKTtcbiAgICAgIGdzYXAudG8oZGlhbW9uZCwgeyBhdXRvQWxwaGE6IDAsIHNjYWxlOiAwLjcsIHJvdGF0aW9uOiAtMTgwLCBkdXJhdGlvbjogMC40LCBlYXNlOiBcInBvd2VyMi5pbk91dFwiLCBvdmVyd3JpdGU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc3dhcERpYW1vbmQoZGlyKSB7XG4gICAgICBnc2FwLmtpbGxUd2VlbnNPZihkaWFtb25kKTtcbiAgICAgIGdzYXAudG8oZGlhbW9uZCwge1xuICAgICAgICB5OiBkaXIgPiAwID8gZGlhWTIgOiBkaWFZMSxcbiAgICAgICAgcm90YXRpb246IGRpciA+IDAgPyBcIis9OTBcIiA6IFwiLT05MFwiLFxuICAgICAgICBkdXJhdGlvbjogMC41LFxuICAgICAgICBlYXNlOiBcImJhY2sub3V0KDEuNylcIixcbiAgICAgICAgb3ZlcndyaXRlOiB0cnVlXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBob2xkVmggPSBjLnBvc3RTaHJpbmtIb2xkVmg7XG4gICAgY29uc3QgYWN0aXZlVmggPSBjLnBpblZpZXdwb3J0cyAqIDEwMCArIGhvbGRWaDtcblxuICAgIGxldCB0ZXh0SW5BdCA9IDEsIHN3YXBBdCA9IDEsIG92ZXJsYXBBdCA9IDE7XG5cbiAgICBjb25zdCB0bCA9IGdzYXAudGltZWxpbmUoe1xuICAgICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgICB0cmlnZ2VyOiBzZWN0aW9uLFxuICAgICAgICBzdGFydDogKCkgPT4gc2VjdGlvbi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgKyB3aW5kb3cuc2Nyb2xsWSArIHZoKGMuc3RpY2t5SG9sZFZoKSxcbiAgICAgICAgZW5kOiBcImJvdHRvbSBib3R0b21cIixcbiAgICAgICAgc2NydWI6IGMuc2NydWJTbW9vdGgsXG4gICAgICAgIGludmFsaWRhdGVPblJlZnJlc2g6IHRydWUsXG4gICAgICAgIG9uVXBkYXRlOiAoc2VsZikgPT4ge1xuICAgICAgICAgIGNvbnN0IHAgPSBzZWxmLnByb2dyZXNzO1xuXG4gICAgICAgICAgaWYgKHAgPCB0ZXh0SW5BdCkge1xuICAgICAgICAgICAgaGlkZVRleHQoc3RhdGUxKTtcbiAgICAgICAgICAgIGhpZGVUZXh0KHN0YXRlMik7XG4gICAgICAgICAgfSBlbHNlIGlmIChwIDwgc3dhcEF0KSB7XG4gICAgICAgICAgICBzaG93VGV4dChzdGF0ZTEpO1xuICAgICAgICAgICAgaGlkZVRleHQoc3RhdGUyKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGlkZVRleHQoc3RhdGUxKTtcbiAgICAgICAgICAgIHNob3dUZXh0KHN0YXRlMik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHAgPj0gdGV4dEluQXQgJiYgIWRpYW1vbmRTaG93bikge1xuICAgICAgICAgICAgZGlhbW9uZFNob3duID0gdHJ1ZTtcbiAgICAgICAgICAgIHNob3dEaWFtb25kKCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChwIDwgdGV4dEluQXQgJiYgZGlhbW9uZFNob3duKSB7XG4gICAgICAgICAgICBkaWFtb25kU2hvd24gPSBmYWxzZTtcbiAgICAgICAgICAgIGhpZGVEaWFtb25kKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHAgPj0gc3dhcEF0ICYmICFkaWFtb25kUm90YXRlZCkge1xuICAgICAgICAgICAgZGlhbW9uZFJvdGF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgc3dhcERpYW1vbmQoMSk7XG4gICAgICAgICAgfSBlbHNlIGlmIChwIDwgc3dhcEF0ICYmIGRpYW1vbmRSb3RhdGVkKSB7XG4gICAgICAgICAgICBkaWFtb25kUm90YXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgc3dhcERpYW1vbmQoLTEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ3NhcC5zZXQodW5pY29ybiwgeyBvdmVyZmxvdzogXCJoaWRkZW5cIiB9KTtcblxuICAgIC8vIFRleHQgcmV2ZWFsLiBDU1M6IC5hYm91dC1qb3VybmV5X3RleHQtd3JhcCB7IG9wYWNpdHk6IDAgfVxuICAgIC8vIEJhY2sgdG8gMSBleGFjdGx5IHdoZW4gdGhlIHVuaWNvcm4gc3RhcnRzIHNocmlua2luZy4gT3BhY2l0eSwgbm90IHZpc2liaWxpdHkgLVxuICAgIC8vIGEgY2hpbGQgY2FuJ3Qgb3ZlcnJpZGUgYSBwYXJlbnQncyBvcGFjaXR5LCBzbyBhdXRvQWxwaGEgZnJvbSBwcmVwU3RhdGUoKVxuICAgIC8vIHdvbid0IHB1bmNoIGEgaG9sZSB0aHJvdWdoIGl0LlxuICAgIHRsLnNldCh0ZXh0V3JhcCwgeyBvcGFjaXR5OiAxIH0sIDApO1xuXG4gICAgdGwuZnJvbVRvKFxuICAgICAgdW5pY29ybixcbiAgICAgIHtcbiAgICAgICAgd2lkdGg6IFwiMTAwdndcIixcbiAgICAgICAgaGVpZ2h0OiBcIjEwMFwiICsgYy52aFVuaXQsXG4gICAgICAgIHg6IFwiMHZ3XCJcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHdpZHRoOiBjLnVuaWNvcm4udGFyZ2V0VyxcbiAgICAgICAgaGVpZ2h0OiBjLnVuaWNvcm4udGFyZ2V0SCxcbiAgICAgICAgeDogKCkgPT4gYCR7Yy51bmljb3JuLnhWd312d2AsXG4gICAgICAgIGVhc2U6IFwibm9uZVwiLFxuICAgICAgICBkdXJhdGlvbjogYy51bmljb3JuLmxlblxuICAgICAgfSxcbiAgICAgIDBcbiAgICApO1xuXG4gICAgY29uc3QgdW5pY29ybkV4aXRBdCA9IGMudW5pY29ybi5sZW4gKyBob2xkVmg7XG5cbiAgICB0bC50byh1bmljb3JuLCB7XG4gICAgICB5OiAoKSA9PiB2aChjLnVuaWNvcm4uZXhpdFRvVmgpLFxuICAgICAgZWFzZTogXCJub25lXCIsXG4gICAgICBkdXJhdGlvbjogYWN0aXZlVmggLSB1bmljb3JuRXhpdEF0XG4gICAgfSwgdW5pY29ybkV4aXRBdCk7XG5cbiAgICBjLmltYWdlcy5mb3JFYWNoKChpbWcpID0+IHtcbiAgICAgIGNvbnN0IGVsID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKGltZy5zZWwpO1xuICAgICAgaWYgKCFlbCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBpbm5lciA9IGVsLnF1ZXJ5U2VsZWN0b3IoXCIuYWJvdXQtam91cm5leV9pbWFnZS1pbm5lclwiKTtcbiAgICAgIGNvbnN0IGF0ID0gaW1nLmVudGVyICsgaG9sZFZoO1xuXG4gICAgICB0bC5mcm9tVG8oXG4gICAgICAgIGVsLFxuICAgICAgICB7IHk6ICgpID0+IChzdGFnZUgoKSAqIGMuaW1hZ2VGcm9tUGVyY2VudCkgLyAxMDAgfSxcbiAgICAgICAgeyB5OiAoKSA9PiAtZWwub2Zmc2V0SGVpZ2h0LCBlYXNlOiBcIm5vbmVcIiwgZHVyYXRpb246IGltZy5sZW4sIGltbWVkaWF0ZVJlbmRlcjogdHJ1ZSB9LFxuICAgICAgICBhdFxuICAgICAgKTtcblxuICAgICAgaWYgKGlubmVyKSB7XG4gICAgICAgIHRsLmZyb21UbyhcbiAgICAgICAgICBpbm5lcixcbiAgICAgICAgICB7IHlQZXJjZW50OiAwIH0sXG4gICAgICAgICAgeyB5UGVyY2VudDogYy5pbWFnZUlubmVyU2hpZnRQZXJjZW50LCBlYXNlOiBcIm5vbmVcIiwgZHVyYXRpb246IGltZy5sZW4sIGltbWVkaWF0ZVJlbmRlcjogdHJ1ZSB9LFxuICAgICAgICAgIGF0XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBvdmVybGFwVmggPSBjLm92ZXJsYXBWaWV3cG9ydHMgKiAxMDA7XG4gICAgY29uc3QgZGVzaXJlZEF4aXMgPSBjLnB1cnBvc2VFbnRlck1vbWVudCArIChjLnVuaWNvcm4ubGVuICsgaG9sZFZoKSArIG92ZXJsYXBWaDtcbiAgICBpZiAodGwuZHVyYXRpb24oKSA8IGRlc2lyZWRBeGlzKSB0bC50byh7fSwgeyBkdXJhdGlvbjogZGVzaXJlZEF4aXMgLSB0bC5kdXJhdGlvbigpIH0sIHRsLmR1cmF0aW9uKCkpO1xuXG4gICAgY29uc3QgZHVyID0gdGwuZHVyYXRpb24oKSB8fCBhY3RpdmVWaDtcblxuICAgIG92ZXJsYXBBdCA9IGR1ciAvICgxMDAgKyBkdXIpO1xuICAgIHRleHRJbkF0ID0gYy50ZXh0SW4gLyBkdXI7XG4gICAgc3dhcEF0ID0gKGMuc3dhcEF0ICsgaG9sZFZoKSAvIGR1cjtcblxuICAgIGlmIChzdGFnZSkge1xuICAgICAgY29uc3Qgb3V0cm9TdGFydCA9IE1hdGgubWF4KDAsIGR1ciAtIGMub3V0cm8uc3RhcnRzVmhCZWZvcmVFbmQpO1xuXG4gICAgICBnc2FwLnNldChzdGFnZSwgeyB0cmFuc2Zvcm1PcmlnaW46IFwiNTAlIDUwJVwiLCB3aWxsQ2hhbmdlOiBcInRyYW5zZm9ybSwgb3BhY2l0eVwiIH0pO1xuXG4gICAgICB0bC5mcm9tVG8oXG4gICAgICAgIHN0YWdlLFxuICAgICAgICB7IHNjYWxlOiAxLCBhdXRvQWxwaGE6IDEgfSxcbiAgICAgICAge1xuICAgICAgICAgIHNjYWxlOiBjLm91dHJvLnNjYWxlLFxuICAgICAgICAgIGF1dG9BbHBoYTogYy5vdXRyby5vcGFjaXR5LFxuICAgICAgICAgIGVhc2U6IFwibm9uZVwiLFxuICAgICAgICAgIGR1cmF0aW9uOiBkdXIgLSBvdXRyb1N0YXJ0XG4gICAgICAgIH0sXG4gICAgICAgIG91dHJvU3RhcnRcbiAgICAgICk7XG4gICAgfVxuXG4gICAgc2VjdGlvbi5zdHlsZS5oZWlnaHQgPSAxMDAgKyBjLnN0aWNreUhvbGRWaCArIGR1ciArIGMudmhVbml0O1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGFjdGl2ZVNwbGl0cy5mb3JFYWNoKChzcGxpdCkgPT4gc3BsaXQucmV2ZXJ0KCkpO1xuICAgICAgc2VjdGlvbi5zdHlsZS5oZWlnaHQgPSBcIlwiO1xuICAgICAgU2Nyb2xsVHJpZ2dlci5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVmcmVzaFwiLCBvblJlZnJlc2gpO1xuXG4gICAgICAvLyBWaWRlbzogZGV0YWNoIGxpc3RlbmVycyArIGZyZWUgdGhlIGRlY29kZXIuIGlPUyBjYXBzIHBhcmFsbGVsIGRlY29kZXJzIGFuZFxuICAgICAgLy8gd2l0aG91dCB0aGlzIEJhcmJhIG5hdmlnYXRpb24gbG9zZXMgcGxheWJhY2sgYWZ0ZXIgYSBmZXcgdHJhbnNpdGlvbnMuXG4gICAgICB2aWRlb0xpc3RlbmVycy5mb3JFYWNoKChbdGFyZ2V0LCB0eXBlLCBmbl0pID0+IHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGZuKSk7XG4gICAgICB2aWRlb0xpc3RlbmVycyA9IFtdO1xuICAgICAgaWYgKHZpZGVvKSB7XG4gICAgICAgIHZpZGVvLnBhdXNlKCk7XG4gICAgICAgIHZpZGVvLnJlbW92ZUF0dHJpYnV0ZShcInNyY1wiKTtcbiAgICAgICAgdmlkZW8ubG9hZCgpO1xuICAgICAgfVxuXG4gICAgICBpZiAobmF2TG9nbykgZ3NhcC5zZXQobmF2TG9nbywgeyBjbGVhclByb3BzOiBcImNvbG9yXCIgfSk7XG4gICAgICBnc2FwLnNldChbdW5pY29ybiwgZGlhbW9uZCwgc3RhdGVFbDEsIHN0YXRlRWwyXSwgeyBjbGVhclByb3BzOiBcImFsbFwiIH0pO1xuICAgICAgaWYgKHN0YWdlKSBnc2FwLnNldChzdGFnZSwgeyBjbGVhclByb3BzOiBcImFsbFwiIH0pO1xuICAgICAgZ3NhcC5zZXQodGV4dFdyYXAsIHsgY2xlYXJQcm9wczogXCJvcGFjaXR5XCIgfSk7XG4gICAgfTtcbiAgfSk7XG59XG5cblxuXG4vLyAtLS0gV0hBVCBXRSBETyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLy8gPiBXaGF0IFdlIERvIC0gSGVybzogaGVhZGluZyBmYWRlIG91dCArIHNoYXBlIHNocmluayArIHZpZGVvL21hc2sgc2hyaW5rXG5mdW5jdGlvbiBpbml0V2hhdFdlRG9IZXJvKCkge1xuICBjb25zdCBoZXJvU2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud3dkLWhlcm9fc2Nyb2xsLXRyaWdnZXJcIik7XG4gIGlmICghaGVyb1NlY3Rpb24gfHwgIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuXG4gIC8vIC53d2QtaGVyb19zaGFwZS1pbWcgb25seSBzaHJpbmtzIG9uIHNjcm9sbCBmcm9tIHRhYmxldCB1cCAtIGRpc2FibGVkIG9uIG1vYmlsZS5cbiAgLy8gQ2hlY2tlZCBvbmNlIG9uIGVudGVyLCBsaWtlIHRoZSByZXN0IG9mIHRoaXMgZnVuY3Rpb24ncyBjb25maWcgKG5vIG1hdGNoTWVkaWEgdGVhcmRvd24pLlxuICBjb25zdCBpc01vYmlsZSA9IHdpbmRvdy5tYXRjaE1lZGlhKFwiKG1heC13aWR0aDogNDc5cHgpXCIpLm1hdGNoZXM7XG5cbiAgZ3NhcC5zZXQoXCIud3dkLWhlcm9fbWFzay1pbnNpZGVcIiwge1xuICAgIGNsaXBQYXRoOiBcInBvbHlnb24oMCUgMTAwJSwgMTAwJSAxMDAlLCAxMDAlIDEwMCUsIDAlIDEwMCUpXCIsXG4gICAgdmlzaWJpbGl0eTogXCJ2aXNpYmxlXCIsXG4gIH0pO1xuXG4gIGNvbnN0IHd3ZFNocmlua1RsID0gZ3NhcC50aW1lbGluZSh7XG4gICAgc2Nyb2xsVHJpZ2dlcjogeyB0cmlnZ2VyOiBoZXJvU2VjdGlvbiwgc3RhcnQ6IFwidG9wIGJvdHRvbVwiLCBlbmQ6IFwidG9wIDUwJVwiLCBzY3J1YjogdHJ1ZSB9LFxuICB9KS50byhcIi53d2QtaGVyb193cmFwcGVyXCIsIHsgb3BhY2l0eTogMCwgZWFzZTogXCJub25lXCIgfSwgMCk7XG5cbiAgaWYgKCFpc01vYmlsZSkge1xuICAgIHd3ZFNocmlua1RsLnRvKFwiLnd3ZC1oZXJvX3NoYXBlLWltZ1wiLCB7IHdpZHRoOiBcIjcwJVwiLCBlYXNlOiBcIm5vbmVcIiB9LCAwKTtcbiAgfVxuXG4gIGdzYXAudGltZWxpbmUoe1xuICAgIHNjcm9sbFRyaWdnZXI6IHsgdHJpZ2dlcjogaGVyb1NlY3Rpb24sIHN0YXJ0OiBcInRvcCAyNSVcIiwgZW5kOiBcImJvdHRvbSBib3R0b21cIiwgc2NydWI6IHRydWUgfSxcbiAgfSlcbiAgICAuZnJvbVRvKFwiLnd3ZC1oZXJvX3ZpZGVvLXN0aWNreVwiLCB7IGhlaWdodDogXCIxMDB2aFwiIH0sIHsgaGVpZ2h0OiBcIjUwdmhcIiwgZWFzZTogXCJub25lXCIgfSwgMClcbiAgICAuZnJvbVRvKFxuICAgICAgXCIud3dkLWhlcm9fbWFzay1pbnNpZGVcIixcbiAgICAgIHsgY2xpcFBhdGg6IFwicG9seWdvbigwJSAxMDAlLCAxMDAlIDEwMCUsIDEwMCUgMTAwJSwgMCUgMTAwJSlcIiB9LFxuICAgICAgeyBjbGlwUGF0aDogXCJwb2x5Z29uKDAlIDUwJSwgMTAwJSA1MCUsIDEwMCUgMTAwJSwgMCUgMTAwJSlcIiwgZWFzZTogXCJub25lXCIgfSxcbiAgICAgIDBcbiAgICApO1xufVxuXG4vLyA+IFdoYXQgV2UgRG8gLSBzeW5jIC0taGFsZi1oZWlnaHQgd2l0aCB0aGUgaW1hZ2UgKFJlc2l6ZU9ic2VydmVyLCBubyBHU0FQKVxuZnVuY3Rpb24gaW5pdFdoYXRXZURvU3RpY2t5SW1nSGVpZ2h0KCkge1xuICBjb25zdCBpbWcgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI215LXN0aWNreS1pbWdcIik7XG4gIGlmICghaW1nKSByZXR1cm47XG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIoKGVudHJpZXMpID0+IHtcbiAgICBmb3IgKGNvbnN0IGVudHJ5IG9mIGVudHJpZXMpIHtcbiAgICAgIGltZy5zdHlsZS5zZXRQcm9wZXJ0eShcIi0taGFsZi1oZWlnaHRcIiwgYCR7ZW50cnkuY29udGVudFJlY3QuaGVpZ2h0IC8gMn1weGApO1xuICAgIH1cbiAgfSk7XG4gIG9ic2VydmVyLm9ic2VydmUoaW1nKTtcbn1cblxuLy8gQ0FSRUVSUyAtLS0gQ0FQU1VMRVMgUEFSQUxMQVggLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxubGV0IGNhcHN1bGVzVGlja2VyRm4gPSBudWxsO1xuXG5mdW5jdGlvbiBpbml0Q2Fwc3VsZXNQYXJhbGxheCgpIHtcbiAgY29uc3QgY2Fwc3VsZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmNhcHN1bGVcIik7XG4gIGlmICghY2Fwc3VsZXMubGVuZ3RoIHx8ICF3aW5kb3cuZ3NhcCkgcmV0dXJuO1xuXG4gIC8vIEJhcmJhIGRvZXNuJ3QgY2xlYXIgZ3NhcC50aWNrZXIgKG9ubHkgU2Nyb2xsVHJpZ2dlcikgLSByZW1vdmUgdGhlIHByZXZpb3VzXG4gIC8vIGNhbGxiYWNrIGJlZm9yZSBhZGRpbmcgYSBuZXcgb25lLCBzbyByZXBlYXRlZCB2aXNpdHMgZG9uJ3Qgc3RhY2sgbG9vcHMuXG4gIGlmIChjYXBzdWxlc1RpY2tlckZuKSB7XG4gICAgZ3NhcC50aWNrZXIucmVtb3ZlKGNhcHN1bGVzVGlja2VyRm4pO1xuICAgIGNhcHN1bGVzVGlja2VyRm4gPSBudWxsO1xuICB9XG5cbiAgY29uc3Qgc2V0dGVycyA9IEFycmF5LmZyb20oY2Fwc3VsZXMpLm1hcCgoZWwpID0+ICh7XG4gICAgc2V0WTogZ3NhcC5xdWlja1NldHRlcihlbCwgXCJ5XCIsIFwicHhcIiksXG4gICAgc3BlZWQ6IHBhcnNlRmxvYXQoZWwuZGF0YXNldC5zcGVlZCB8fCBcIjBcIiksXG4gIH0pKTtcblxuICBjYXBzdWxlc1RpY2tlckZuID0gZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHNjcm9sbFkgPSB3aW5kb3cuc2Nyb2xsWSB8fCB3aW5kb3cucGFnZVlPZmZzZXQgfHwgMDtcbiAgICBzZXR0ZXJzLmZvckVhY2goKHMpID0+IHMuc2V0WShzY3JvbGxZICogcy5zcGVlZCkpO1xuICB9O1xuXG4gIGdzYXAudGlja2VyLmFkZChjYXBzdWxlc1RpY2tlckZuKTtcbn1cblxuLy8gLS0tIENhcmVlcnMgSGVybyAtIHRleHQgKyBkaWFtb25kIChzaGFyZWQgdHJpZ2dlcjogd3JhcHBlciBlbnRlciArIG9uZS1vZmYgcmV2ZWFsKSAtLS1cblxuZnVuY3Rpb24gaW5pdENhcmVlcnNIZXJvUmV2ZWFsKCkge1xuICBjb25zdCB3cmFwID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignW2NhcmVlcnMtaGVybz1cInRleHQtd3JhcHBlclwiXScpOyAvLyAuY29udGVudC1zbG90XG4gIGNvbnN0IHNjcm9sbFRyaWdnZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNhcmVlcnMtaGVyb19zY3JvbGwtdHJpZ2dlclwiKTtcbiAgaWYgKCF3cmFwIHx8ICFzY3JvbGxUcmlnZ2VyIHx8ICF3aW5kb3cuZ3NhcCB8fCAhd2luZG93LlNjcm9sbFRyaWdnZXIgfHwgIXdpbmRvdy5TcGxpdFRleHQpIHJldHVybjtcblxuICBjb25zdCBoZWFkaW5nID0gd3JhcC5xdWVyeVNlbGVjdG9yKCdbY2FyZWVycy1oZXJvLXRleHQ9XCJ0ZXh0MVwiXScpO1xuICBjb25zdCBkaWFtb25kID0gd3JhcC5xdWVyeVNlbGVjdG9yKCdbY2FyZWVycy1oZXJvLXRleHQ9XCJkaWFtZW50XCJdJyk7XG4gIGNvbnN0IGNhcHRpb24gPSB3cmFwLnF1ZXJ5U2VsZWN0b3IoJ1tjYXJlZXJzLWhlcm8tdGV4dD1cInRleHQyXCJdJyk7XG4gIGlmICghaGVhZGluZyB8fCAhZGlhbW9uZCB8fCAhY2FwdGlvbikgcmV0dXJuO1xuXG4gIGxldCBtbSA9IGdzYXAubWF0Y2hNZWRpYSgpO1xuXG4gIG1tLmFkZCh7XG4gICAgaXNEZXNrdG9wOiBcIihtaW4td2lkdGg6IDc2OHB4KVwiLFxuICAgIGlzTW9iaWxlOiBcIihtYXgtd2lkdGg6IDc2N3B4KVwiXG4gIH0sIChjb250ZXh0KSA9PiB7XG4gICAgbGV0IHsgaXNEZXNrdG9wLCBpc01vYmlsZSB9ID0gY29udGV4dC5jb25kaXRpb25zO1xuICAgIGxldCBhY3RpdmVTcGxpdHMgPSBbXTtcbiAgICBsZXQgYWN0aXZlVHJpZ2dlcnMgPSBbXTtcblxuICAgIC8vIFdyYXBwZXIgZW50ZXIgLSBzY3J1YmJlZCBhZ2FpbnN0IC5jYXJlZXJzLWhlcm9fc2Nyb2xsLXRyaWdnZXIgKGRlc2t0b3Agb25seTtcbiAgICAvLyBvbiBtb2JpbGUgdGhlIHRleHQgZG9lc24ndCBtb3ZlKVxuICAgIGlmIChpc0Rlc2t0b3ApIHtcbiAgICAgIGdzYXAuc2V0KHdyYXAsIHsgeVBlcmNlbnQ6IDUwIH0pO1xuXG4gICAgICBjb25zdCBpbnRyb1R3ZWVuID0gZ3NhcC50byh3cmFwLCB7XG4gICAgICAgIHlQZXJjZW50OiAwLFxuICAgICAgICBlYXNlOiBcIm5vbmVcIixcbiAgICAgICAgc2Nyb2xsVHJpZ2dlcjoge1xuICAgICAgICAgIHRyaWdnZXI6IHNjcm9sbFRyaWdnZXIsXG4gICAgICAgICAgc3RhcnQ6IFwidG9wIGJvdHRvbVwiLFxuICAgICAgICAgIGVuZDogXCJ0b3AgdG9wXCIsXG4gICAgICAgICAgc2NydWI6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFjdGl2ZVRyaWdnZXJzLnB1c2goaW50cm9Ud2Vlbi5zY3JvbGxUcmlnZ2VyKTtcbiAgICB9XG5cbiAgICAvLyBUZXh0IC0gc3BsaXQgaW50byBsaW5lcyArIG1hc2sgKHNhbWUgYXMgQWJvdXQpXG4gICAgZnVuY3Rpb24gc2hvd0xpbmVzKGxpbmVzKSB7XG4gICAgICBnc2FwLmtpbGxUd2VlbnNPZihsaW5lcyk7XG4gICAgICBnc2FwLnRvKGxpbmVzLCB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogMC44LCBzdGFnZ2VyOiAwLjEsIGVhc2U6IFwiZXhwby5vdXRcIiwgZGVsYXk6IDAuMTUsIG92ZXJ3cml0ZTogdHJ1ZSB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0VGV4dEl0ZW0oZWwpIHtcbiAgICAgIGdzYXAuc2V0KGVsLCB7IGF1dG9BbHBoYTogMSB9KTtcbiAgICAgIGNvbnN0IHNwbGl0ID0gU3BsaXRUZXh0LmNyZWF0ZShlbCwgeyB0eXBlOiBcImxpbmVzXCIsIG1hc2s6IFwibGluZXNcIiB9KTtcbiAgICAgIGFjdGl2ZVNwbGl0cy5wdXNoKHNwbGl0KTtcbiAgICAgIGdzYXAuc2V0KHNwbGl0LmxpbmVzLCB7IHlQZXJjZW50OiAxMTAgfSk7XG4gICAgICByZXR1cm4gc3BsaXQubGluZXM7XG4gICAgfVxuXG4gICAgY29uc3QgaGVhZGluZ0xpbmVzID0gaW5pdFRleHRJdGVtKGhlYWRpbmcpO1xuICAgIGNvbnN0IGNhcHRpb25MaW5lcyA9IGluaXRUZXh0SXRlbShjYXB0aW9uKTtcblxuICAgIC8vIERpYW1vbmQgLSBwb3NpdGlvbiBzdGF5cyBhcyBpbiBtYXJrdXAsIG9ubHkgdGhlIGFwcGVhcmFuY2UgaXMgYW5pbWF0ZWRcbiAgICBnc2FwLnNldChkaWFtb25kLCB7IGF1dG9BbHBoYTogMCwgc2NhbGU6IDAuNywgcm90YXRpb246IC0xODAgfSk7XG4gICAgZnVuY3Rpb24gc2hvd0RpYW1vbmQoKSB7XG4gICAgICBnc2FwLmtpbGxUd2VlbnNPZihkaWFtb25kKTtcbiAgICAgIGdzYXAudG8oZGlhbW9uZCwgeyBhdXRvQWxwaGE6IDEsIHNjYWxlOiAxLCByb3RhdGlvbjogMCwgZHVyYXRpb246IDEsIGVhc2U6IFwiZXhwby5vdXRcIiwgb3ZlcndyaXRlOiB0cnVlIH0pO1xuICAgIH1cblxuICAgIC8vIFRleHQgKyBkaWFtb25kIHJldmVhbFxuICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgLy8gTW9iaWxlIC0gaW1tZWRpYXRlbHkgb24gbG9hZCwgbm8gc2Nyb2xsXG4gICAgICBzaG93TGluZXMoaGVhZGluZ0xpbmVzKTtcbiAgICAgIHNob3dMaW5lcyhjYXB0aW9uTGluZXMpO1xuICAgICAgc2hvd0RpYW1vbmQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRGVza3RvcCAtIG9uY2UsIHdoZW4gLmNhcHN1bGVzLXNlY3Rpb24gaGl0cyBcInRvcCB0b3BcIlxuICAgICAgY29uc3QgY2Fwc3VsZXNTZWN0aW9uID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jYXBzdWxlcy1zZWN0aW9uXCIpO1xuICAgICAgaWYgKGNhcHN1bGVzU2VjdGlvbikge1xuICAgICAgICBjb25zdCByZXZlYWxUcmlnZ2VyID0gU2Nyb2xsVHJpZ2dlci5jcmVhdGUoe1xuICAgICAgICAgIHRyaWdnZXI6IGNhcHN1bGVzU2VjdGlvbixcbiAgICAgICAgICBzdGFydDogXCJ0b3AgdG9wXCIsXG4gICAgICAgICAgb25jZTogdHJ1ZSxcbiAgICAgICAgICBvbkVudGVyOiAoKSA9PiB7XG4gICAgICAgICAgICBzaG93TGluZXMoaGVhZGluZ0xpbmVzKTtcbiAgICAgICAgICAgIHNob3dMaW5lcyhjYXB0aW9uTGluZXMpO1xuICAgICAgICAgICAgc2hvd0RpYW1vbmQoKTtcbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgYWN0aXZlVHJpZ2dlcnMucHVzaChyZXZlYWxUcmlnZ2VyKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgYWN0aXZlVHJpZ2dlcnMuZm9yRWFjaCgoc3QpID0+IHN0LmtpbGwoKSk7XG4gICAgICBhY3RpdmVTcGxpdHMuZm9yRWFjaCgoc3BsaXQpID0+IHNwbGl0LnJldmVydCgpKTtcbiAgICAgIGdzYXAuc2V0KGRpYW1vbmQsIHsgY2xlYXJQcm9wczogXCJhbGxcIiB9KTtcbiAgICAgIGdzYXAuc2V0KHdyYXAsIHsgY2xlYXJQcm9wczogXCJhbGxcIiB9KTtcbiAgICB9O1xuICB9KTtcbn1cblxuLy8gLS0tIENBUkVFUlM6IFBST0NFU1MgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmZ1bmN0aW9uIGluaXRDYXJlZXJzUHJvY2VzcygpIHtcbiAgY29uc3Qgc2VjdGlvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5pcy1jYXJlZXJzLXByb2Nlc3MnKTtcbiAgaWYgKCFzZWN0aW9uIHx8ICF3aW5kb3cuZ3NhcCB8fCAhd2luZG93LlNjcm9sbFRyaWdnZXIgfHwgIXdpbmRvdy5TcGxpdFRleHQpIHJldHVybjtcblxuICBjb25zdCBzY3J1YiA9IHNlY3Rpb24ucXVlcnlTZWxlY3RvcignLmNhcmVlcnMtcHJvY2Vzc19zY3J1YicpO1xuICBjb25zdCBsaXN0ID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuY2FyZWVycy1wcm9jZXNzX2xpc3QnKTtcbiAgY29uc3Qgc3RlcHMgPSBnc2FwLnV0aWxzLnRvQXJyYXkoc2VjdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCcuY2FyZWVycy1wcm9jZXNzX3N0ZXAnKSk7XG4gIGlmICghc2NydWIgfHwgIWxpc3QgfHwgIXN0ZXBzLmxlbmd0aCkgcmV0dXJuO1xuXG4gIGNvbnN0IHZpc3VhbFRyYWNrID0gc2VjdGlvbi5xdWVyeVNlbGVjdG9yKCcuY2FyZWVycy1wcm9jZXNzX3Zpc3VhbC13aGVlbCcpO1xuXG4gIGxldCBtbSA9IGdzYXAubWF0Y2hNZWRpYSgpO1xuXG4gIG1tLmFkZCh7XG4gICAgaXNEZXNrdG9wOiBcIihtaW4td2lkdGg6IDc2OHB4KVwiLFxuICAgIGlzTW9iaWxlOiBcIihtYXgtd2lkdGg6IDc2N3B4KVwiLFxuICB9LCAoY29udGV4dCkgPT4ge1xuICAgIGxldCB7IGlzTW9iaWxlIH0gPSBjb250ZXh0LmNvbmRpdGlvbnM7XG5cbiAgICAvLyBNb2JpbGU6IHRoZSBzZWN0aW9uIGlzIGZ1bGx5IHN0YXRpYyAoc2VlIEBtZWRpYSBpbiBDU1MpIC0gbm90aGluZyB0byB3aXJlIHVwLlxuICAgIGlmIChpc01vYmlsZSkgcmV0dXJuO1xuXG4gICAgY29uc3Qgcm93RWxzID0gc3RlcHMubWFwKChzdGVwKSA9PiBzdGVwLnF1ZXJ5U2VsZWN0b3IoJy5jYXJlZXJzLXByb2Nlc3Nfcm93JykpO1xuICAgIGNvbnN0IHRvdGFsID0gc3RlcHMubGVuZ3RoO1xuICAgIGNvbnN0IHZoUGVyU3RlcCA9IDcwOyAvLyBzY3JvbGwgZGlzdGFuY2UgcGVyIHN0ZXAsIGluIHZoIC0gdHVuZSBkdXJpbmcgUUFcbiAgICBsZXQgYWN0aXZlU3BsaXRzID0gW107XG5cbiAgICBmdW5jdGlvbiBwcmVwU3RlcChzdGVwKSB7XG4gICAgICBjb25zdCBleHBhbmRlZCA9IHN0ZXAucXVlcnlTZWxlY3RvcignLmNhcmVlcnMtcHJvY2Vzc19leHBhbmRlZCcpO1xuICAgICAgY29uc3Qgc2xpZGVFbHMgPSBbXG4gICAgICAgIGV4cGFuZGVkLnF1ZXJ5U2VsZWN0b3IoJy5jYXJlZXJzLXByb2Nlc3NfZXhwYW5kZWQtdG9wJyksXG4gICAgICAgIGV4cGFuZGVkLnF1ZXJ5U2VsZWN0b3IoJy5jYXJlZXJzLXByb2Nlc3NfY3RhJyksXG4gICAgICBdLmZpbHRlcihCb29sZWFuKTtcbiAgICAgIGNvbnN0IGRlc2NFbCA9IGV4cGFuZGVkLnF1ZXJ5U2VsZWN0b3IoJy5jYXJlZXJzLXByb2Nlc3NfZGVzY3JpcHRpb24nKTtcblxuICAgICAgZ3NhcC5zZXQoZXhwYW5kZWQsIHsgYXV0b0FscGhhOiAxIH0pO1xuICAgICAgZ3NhcC5zZXQoc2xpZGVFbHMsIHsgYXV0b0FscGhhOiAwLCB5OiAnMXJlbScgfSk7XG5cbiAgICAgIGxldCBsaW5lcyA9IFtdO1xuICAgICAgaWYgKGRlc2NFbCkge1xuICAgICAgICBnc2FwLnNldChkZXNjRWwsIHsgYXV0b0FscGhhOiAxIH0pO1xuICAgICAgICBjb25zdCBzcGxpdCA9IFNwbGl0VGV4dC5jcmVhdGUoZGVzY0VsLCB7IHR5cGU6ICdsaW5lcycsIG1hc2s6ICdsaW5lcycgfSk7XG4gICAgICAgIGFjdGl2ZVNwbGl0cy5wdXNoKHNwbGl0KTtcbiAgICAgICAgbGluZXMgPSBzcGxpdC5saW5lcztcbiAgICAgICAgZ3NhcC5zZXQobGluZXMsIHsgeVBlcmNlbnQ6IDExMCB9KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgc3RlcCwgc2xpZGVFbHMsIGxpbmVzLCBzaG93bjogZmFsc2UgfTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBzaG93U3RlcChzdGF0ZSkge1xuICAgICAgaWYgKHN0YXRlLnNob3duKSByZXR1cm47XG4gICAgICBzdGF0ZS5zaG93biA9IHRydWU7XG4gICAgICBzdGF0ZS5zdGVwLmNsYXNzTGlzdC5hZGQoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICBnc2FwLmtpbGxUd2VlbnNPZihzdGF0ZS5zbGlkZUVscyk7XG4gICAgICBnc2FwLnRvKHN0YXRlLnNsaWRlRWxzLCB7IGF1dG9BbHBoYTogMSwgeTogJzByZW0nLCBkdXJhdGlvbjogMC44LCBzdGFnZ2VyOiAwLjEsIGVhc2U6ICdleHBvLm91dCcsIGRlbGF5OiAwLjE1LCBvdmVyd3JpdGU6IHRydWUgfSk7XG5cbiAgICAgIGlmIChzdGF0ZS5saW5lcy5sZW5ndGgpIHtcbiAgICAgICAgZ3NhcC5raWxsVHdlZW5zT2Yoc3RhdGUubGluZXMpO1xuICAgICAgICBnc2FwLnRvKHN0YXRlLmxpbmVzLCB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogMC44LCBzdGFnZ2VyOiAwLjEsIGVhc2U6ICdleHBvLm91dCcsIGRlbGF5OiAwLjE1LCBvdmVyd3JpdGU6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gaGlkZVN0ZXAoc3RhdGUpIHtcbiAgICAgIGlmICghc3RhdGUuc2hvd24pIHJldHVybjtcbiAgICAgIHN0YXRlLnNob3duID0gZmFsc2U7XG4gICAgICBzdGF0ZS5zdGVwLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWFjdGl2ZScpO1xuXG4gICAgICBnc2FwLmtpbGxUd2VlbnNPZihzdGF0ZS5zbGlkZUVscyk7XG4gICAgICBnc2FwLnRvKHN0YXRlLnNsaWRlRWxzLCB7IGF1dG9BbHBoYTogMCwgeTogJy0xcmVtJywgZHVyYXRpb246IDAuNCwgZWFzZTogJ3Bvd2VyMi5pbk91dCcsIG92ZXJ3cml0ZTogdHJ1ZSB9KTtcblxuICAgICAgaWYgKHN0YXRlLmxpbmVzLmxlbmd0aCkge1xuICAgICAgICBnc2FwLmtpbGxUd2VlbnNPZihzdGF0ZS5saW5lcyk7XG4gICAgICAgIGdzYXAudG8oc3RhdGUubGluZXMsIHsgeVBlcmNlbnQ6IDExMCwgZHVyYXRpb246IDAuNCwgc3RhZ2dlcjogMCwgZWFzZTogJ3Bvd2VyMi5pbk91dCcsIG92ZXJ3cml0ZTogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdGVwU3RhdGVzID0gc3RlcHMubWFwKHByZXBTdGVwKTtcbiAgICBsZXQgYWN0aXZlSW5kZXggPSAwO1xuICAgIHNob3dTdGVwKHN0ZXBTdGF0ZXNbMF0pO1xuICAgIGdzYXAuc2V0KHJvd0VscywgeyBvcGFjaXR5OiAxIH0pO1xuICAgIGdzYXAuc2V0KHJvd0Vsc1swXSwgeyBvcGFjaXR5OiAxIH0pO1xuXG4gICAgZnVuY3Rpb24gc2V0QWN0aXZlKGluZGV4KSB7XG4gICAgICBoaWRlU3RlcChzdGVwU3RhdGVzW2FjdGl2ZUluZGV4XSk7XG4gICAgICBzaG93U3RlcChzdGVwU3RhdGVzW2luZGV4XSk7XG5cbiAgICAgIGdzYXAudG8ocm93RWxzW2FjdGl2ZUluZGV4XSwgeyBvcGFjaXR5OiAxLCBkdXJhdGlvbjogMC40LCBlYXNlOiAncG93ZXIyLm91dCcsIG92ZXJ3cml0ZTogdHJ1ZSB9KTtcbiAgICAgIGdzYXAudG8ocm93RWxzW2luZGV4XSwgeyBvcGFjaXR5OiAxLCBkdXJhdGlvbjogMC40LCBlYXNlOiAncG93ZXIyLm91dCcsIG92ZXJ3cml0ZTogdHJ1ZSB9KTtcblxuICAgICAgYWN0aXZlSW5kZXggPSBpbmRleDtcbiAgICB9XG5cbiAgICBzY3J1Yi5zdHlsZS5oZWlnaHQgPSAodG90YWwgKiB2aFBlclN0ZXAgKyAxMDApICsgJ3ZoJztcblxuICAgIGNvbnN0IHN0ZXBUcmlnZ2VyID0gU2Nyb2xsVHJpZ2dlci5jcmVhdGUoe1xuICAgICAgdHJpZ2dlcjogc2NydWIsXG4gICAgICBzdGFydDogJ3RvcCB0b3AnLFxuICAgICAgZW5kOiAnYm90dG9tIGJvdHRvbScsXG4gICAgICBzY3J1YjogMSxcbiAgICAgIGludmFsaWRhdGVPblJlZnJlc2g6IHRydWUsXG4gICAgICBvblVwZGF0ZTogKHNlbGYpID0+IHtcbiAgICAgICAgY29uc3QgaWR4ID0gTWF0aC5taW4odG90YWwgLSAxLCBNYXRoLmZsb29yKHNlbGYucHJvZ3Jlc3MgKiB0b3RhbCkpO1xuICAgICAgICBpZiAoaWR4ICE9PSBhY3RpdmVJbmRleCkgc2V0QWN0aXZlKGlkeCk7XG4gICAgICB9LFxuICAgIH0pO1xuXG4gICAgbGV0IHJvdGF0ZVR3ZWVuID0gbnVsbDtcbiAgICBpZiAodmlzdWFsVHJhY2spIHtcbiAgICAgIHJvdGF0ZVR3ZWVuID0gZ3NhcC5mcm9tVG8odmlzdWFsVHJhY2ssXG4gICAgICAgIHsgcm90YXRlOiAwIH0sXG4gICAgICAgIHtcbiAgICAgICAgICByb3RhdGU6IDMyLCAvLyBkZWdyZWVzIG9mIHJvdGF0aW9uIGFjcm9zcyB0aGUgc2VjdGlvbiAtIHRvIGJlIGFwcHJvdmVkXG4gICAgICAgICAgZWFzZTogJ25vbmUnLFxuICAgICAgICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgICAgICAgIHRyaWdnZXI6IHNlY3Rpb24sXG4gICAgICAgICAgICBzdGFydDogJ3RvcCBib3R0b20nLFxuICAgICAgICAgICAgZW5kOiAnYm90dG9tIHRvcCcsXG4gICAgICAgICAgICBzY3J1YjogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdGVwVHJpZ2dlci5raWxsKCk7XG4gICAgICBpZiAocm90YXRlVHdlZW4gJiYgcm90YXRlVHdlZW4uc2Nyb2xsVHJpZ2dlcikgcm90YXRlVHdlZW4uc2Nyb2xsVHJpZ2dlci5raWxsKCk7XG4gICAgICBzY3J1Yi5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICAgIGFjdGl2ZVNwbGl0cy5mb3JFYWNoKChzcGxpdCkgPT4gc3BsaXQucmV2ZXJ0KCkpO1xuICAgICAgc3RlcFN0YXRlcy5mb3JFYWNoKChzdGF0ZSkgPT4ge1xuICAgICAgICBnc2FwLnNldChzdGF0ZS5zbGlkZUVscywgeyBjbGVhclByb3BzOiAnYWxsJyB9KTtcbiAgICAgIH0pO1xuICAgICAgZ3NhcC5zZXQocm93RWxzLCB7IGNsZWFyUHJvcHM6ICdhbGwnIH0pO1xuICAgICAgaWYgKHZpc3VhbFRyYWNrKSBnc2FwLnNldCh2aXN1YWxUcmFjaywgeyBjbGVhclByb3BzOiAncm90YXRlJyB9KTtcbiAgICAgIHN0ZXBzLmZvckVhY2goKHN0ZXAsIGkpID0+IHN0ZXAuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJywgaSA9PT0gMCkpO1xuICAgIH07XG4gIH0pO1xufVxuXG4vLyA+IFNjcm9sbCBIaWdobGlnaHQgV29yZHMgKHdvcmQtYnktd29yZCBjb2xvciByZXZlYWwgb24gc2Nyb2xsKVxuLy8gQXR0YWNoIHdpdGggW2RhdGEtc2Nyb2xsLWhpZ2hsaWdodF0gb24gYW55IHRleHQgZWxlbWVudCAoaGVhZGluZy9wYXJhZ3JhcGgpIC1cbi8vIG5vIHdyYXBwZXIgbWFya3VwIG9yIGV4dHJhIHNjcm9sbCBkaXN0YW5jZSBuZWVkZWQsIHRoZSBlbGVtZW50IHRyaWdnZXJzIGl0c2VsZi5cbi8vIE9wdGlvbmFsIHBlci1lbGVtZW50IG92ZXJyaWRlcyAoYWxsIHZpYSBkYXRhIGF0dHJpYnV0ZXMgb24gdGhlIHNhbWUgZWxlbWVudCk6XG4vLyAgIGRhdGEtc2Nyb2xsLWhpZ2hsaWdodC1zdGFydD1cInRvcCB0b3BcIiAgICAgIFNjcm9sbFRyaWdnZXIgc3RhcnQgKGRlZmF1bHQ6IHRvcCB0b3ApXG4vLyAgIGRhdGEtc2Nyb2xsLWhpZ2hsaWdodC1lbmQ9XCJ0b3AgMzAlXCIgICAgICAgIFNjcm9sbFRyaWdnZXIgZW5kIChkZWZhdWx0OiB0b3AgMzAlKVxuLy8gICBkYXRhLXNjcm9sbC1oaWdobGlnaHQtbXV0ZWQ9XCIjMDA1NDUyMmFcIiAgICBpZGxlIHdvcmQgY29sb3IgKGRlZmF1bHQ6ICMwMDU0NTIyYSlcbi8vICAgZGF0YS1zY3JvbGwtaGlnaGxpZ2h0LWFjdGl2ZT1cIiMwMDU0NTNcIiAgICAgaGlnaGxpZ2h0ZWQgd29yZCBjb2xvciAoZGVmYXVsdDogIzAwNTQ1Mylcbi8vICAgZGF0YS1zY3JvbGwtaGlnaGxpZ2h0LXNjcnViPVwiMC41XCIgICAgICAgICAgc2NydWIgc21vb3RoaW5nLCBcInRydWVcIi9cImZhbHNlXCIvbnVtYmVyIChkZWZhdWx0OiB0cnVlKVxuZnVuY3Rpb24gaW5pdFNjcm9sbEhpZ2hsaWdodFdvcmRzKHNjb3BlID0gZG9jdW1lbnQpIHtcbiAgaWYgKCF3aW5kb3cuZ3NhcCB8fCAhd2luZG93LlNjcm9sbFRyaWdnZXIgfHwgIXdpbmRvdy5TcGxpdFRleHQpIHJldHVybjtcblxuICBjb25zdCBERUZBVUxUX1NUQVJUID0gXCJ0b3AgOTAlXCI7XG4gIGNvbnN0IERFRkFVTFRfRU5EID0gXCJ0b3AgMjAlXCI7XG4gIGNvbnN0IERFRkFVTFRfTVVURUQgPSBcIiMwMDU0NTIyYVwiO1xuICBjb25zdCBERUZBVUxUX0FDVElWRSA9IFwiIzAwNTQ1M1wiO1xuXG4gIHNjb3BlLnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLXNjcm9sbC1oaWdobGlnaHRdJykuZm9yRWFjaCgoZWwpID0+IHtcbiAgICBpZiAoZWwuX19zY3JvbGxIaWdobGlnaHRJbml0KSByZXR1cm47XG4gICAgZWwuX19zY3JvbGxIaWdobGlnaHRJbml0ID0gdHJ1ZTtcblxuICAgIGNvbnN0IHN0YXJ0ID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zY3JvbGwtaGlnaGxpZ2h0LXN0YXJ0XCIpIHx8IERFRkFVTFRfU1RBUlQ7XG4gICAgY29uc3QgZW5kID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zY3JvbGwtaGlnaGxpZ2h0LWVuZFwiKSB8fCBERUZBVUxUX0VORDtcbiAgICBjb25zdCBjb2xvck11dGVkID0gZWwuZ2V0QXR0cmlidXRlKFwiZGF0YS1zY3JvbGwtaGlnaGxpZ2h0LW11dGVkXCIpIHx8IERFRkFVTFRfTVVURUQ7XG4gICAgY29uc3QgY29sb3JBY3RpdmUgPSBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXNjcm9sbC1oaWdobGlnaHQtYWN0aXZlXCIpIHx8IERFRkFVTFRfQUNUSVZFO1xuICAgIGNvbnN0IHNjcnViQXR0ciA9IGVsLmdldEF0dHJpYnV0ZShcImRhdGEtc2Nyb2xsLWhpZ2hsaWdodC1zY3J1YlwiKTtcbiAgICBjb25zdCBzY3J1YiA9IHNjcnViQXR0ciA/IChzY3J1YkF0dHIgPT09IFwidHJ1ZVwiID8gdHJ1ZSA6IHBhcnNlRmxvYXQoc2NydWJBdHRyKSkgOiB0cnVlO1xuXG4gICAgY29uc3Qgc3BsaXQgPSBTcGxpdFRleHQuY3JlYXRlKGVsLCB7IHR5cGU6IFwid29yZHMsIGxpbmVzXCIsIG1hc2s6IFwibGluZXNcIiB9KTtcbiAgICBjb25zdCB3b3JkcyA9IHNwbGl0LndvcmRzO1xuICAgIGlmICghd29yZHMgfHwgIXdvcmRzLmxlbmd0aCkgcmV0dXJuO1xuXG4gICAgZ3NhcC5zZXQod29yZHMsIHsgY29sb3I6IGNvbG9yTXV0ZWQgfSk7XG5cbiAgICBTY3JvbGxUcmlnZ2VyLmNyZWF0ZSh7XG4gICAgICB0cmlnZ2VyOiBlbCxcbiAgICAgIHN0YXJ0LFxuICAgICAgZW5kLFxuICAgICAgc2NydWIsXG4gICAgICBpbnZhbGlkYXRlT25SZWZyZXNoOiB0cnVlLFxuICAgICAgb25VcGRhdGUoc2VsZikge1xuICAgICAgICBjb25zdCBoZWFkID0gc2VsZi5wcm9ncmVzcyAqIHdvcmRzLmxlbmd0aDtcbiAgICAgICAgd29yZHMuZm9yRWFjaCgod29yZCwgaSkgPT4ge1xuICAgICAgICAgIGNvbnN0IGZhY3RvciA9IGdzYXAudXRpbHMuY2xhbXAoMCwgMSwgaGVhZCAtIGkpO1xuICAgICAgICAgIGdzYXAuc2V0KHdvcmQsIHsgY29sb3I6IGdzYXAudXRpbHMuaW50ZXJwb2xhdGUoY29sb3JNdXRlZCwgY29sb3JBY3RpdmUsIGZhY3RvcikgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vID4gV2hhdCBXZSBEbyAtIGNhcmRzOiBzdGFjayBwaW5uZWQgdG8gdGhlIGJvdHRvbSBlZGdlIG9mIHRoZSB3aW5kb3c7IHRoZSBDT05URU5UXG4vLyA+IG9mIHRoZSBjb3ZlcmVkIGNhcmQgKGNvbDEgKyBjb2wyKSBmYWRlcyB0byAwIGFuZCBzY2FsZXMgdG8gMC45NSAtIHRoZSBjYXJkIGJveFxuLy8gPiAoYmFja2dyb3VuZCkgc3RheXMgdW50b3VjaGVkXG5sZXQgd3dkQ2FyZHNPYnNlcnZlciA9IG51bGw7XG5sZXQgd3dkQ2FyZHNSZWZyZXNoVGltZXIgPSBudWxsO1xuZnVuY3Rpb24gaW5pdFdoYXRXZURvQ2FyZHMoKSB7XG4gIGNvbnN0IHdyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnd3ZF93cmFwcGVyLmlzLW5vLWJnXCIpO1xuICBpZiAoIXdyYXBwZXIgfHwgIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuXG4gIGNvbnN0IFNDQUxFX1RPID0gMC45NTtcbiAgY29uc3QgT1BBQ0lUWV9UTyA9IDA7XG5cbiAgLy8gQWxsIGNhcmRzIHRha2UgcGFydC4gVGhlIGlzLWNsb3NlZCBjbGFzcyBpbiB0aGUgbWFya3VwIGlzIGEgbGVmdG92ZXIgZnJvbSB0aGVcbiAgLy8gb2xkIHBhZGRpbmcvcGVlayBtZWNoYW5pc20gLSB0aGUgY3VycmVudCBjb2RlIGRvZXNuJ3QgdXNlIGl0LlxuICBjb25zdCBjYXJkcyA9IEFycmF5LmZyb20od3JhcHBlci5xdWVyeVNlbGVjdG9yQWxsKFwiOnNjb3BlID4gLnd3ZF9ncmlkXCIpKTtcbiAgaWYgKGNhcmRzLmxlbmd0aCA8IDIpIHJldHVybjtcblxuICBjb25zdCBsYXlvdXQgPSBuZXcgTWFwKCk7XG5cbiAgY29uc3QgbGF5b3V0VG9wID0gKGVsKSA9PiB7XG4gICAgbGV0IHkgPSAwO1xuICAgIGxldCBub2RlID0gZWw7XG4gICAgd2hpbGUgKG5vZGUpIHtcbiAgICAgIHkgKz0gbm9kZS5vZmZzZXRUb3A7XG4gICAgICBub2RlID0gbm9kZS5vZmZzZXRQYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiB5O1xuICB9O1xuXG4gIC8vIE1lYXN1cmUgTEFZT1VUIHBvc2l0aW9uLiBvZmZzZXRUb3Agb2YgYSBwb3NpdGlvbjpzdGlja3kgZWxlbWVudCByZXR1cm5zIHRoZVxuICAvLyBwb3NpdGlvbiBBRlRFUiBzdGlja2luZyAodmVyaWZpZWQgaW4gQ2hyb21pdW0pLCBzbyBpcy1tZWFzdXJpbmcgZGlzYWJsZXMgc3RpY2t5XG4gIC8vIGZvciB0aGUgbWVhc3VyZW1lbnQuIE9uZSByZWZsb3cgcGVyIHJlZnJlc2gsIG5vdCBwZXIgc2Nyb2xsIGZyYW1lLlxuICBjb25zdCBtZWFzdXJlID0gKCkgPT4ge1xuICAgIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImlzLW1lYXN1cmluZ1wiKTtcbiAgICBjYXJkcy5mb3JFYWNoKChjYXJkKSA9PiB7XG4gICAgICBsYXlvdXQuc2V0KGNhcmQsIHsgdG9wOiBsYXlvdXRUb3AoY2FyZCksIGg6IGNhcmQub2Zmc2V0SGVpZ2h0IH0pO1xuICAgIH0pO1xuICAgIHdyYXBwZXIuY2xhc3NMaXN0LnJlbW92ZShcImlzLW1lYXN1cmluZ1wiKTtcblxuICAgIC8vIFN0aWNreSBvZmZzZXQgcGVyIGNhcmQ6IHRvcCA9IHdpbmRvdyBoZWlnaHQgLSBjYXJkIGhlaWdodCwgaS5lLiB0aGUgY2FyZFxuICAgIC8vIHBpbnMgZXhhY3RseSB3aGVuIElUUyBib3R0b20gZWRnZSB0b3VjaGVzIHRoZSBib3R0b20gb2YgdGhlIHdpbmRvdy4gQ29tcHV0ZWRcbiAgICAvLyBmcm9tIHdpbmRvdy5pbm5lckhlaWdodCAobm90IDEwMHZoLzEwMGR2aCBpbiBDU1MpIHNvIGl0IG1hdGNoZXMgdGhlIHRyaWdnZXJcbiAgICAvLyBzdGFydC9lbmQgYW5kIGRvZXNuJ3Qgaml0dGVyIHdpdGggdGhlIG1vYmlsZSBVUkwgYmFyLlxuICAgIGNhcmRzLmZvckVhY2goKGNhcmQpID0+IHtcbiAgICAgIGNhcmQuc3R5bGUudG9wID0gd2luZG93LmlubmVySGVpZ2h0IC0gbGF5b3V0LmdldChjYXJkKS5oICsgXCJweFwiO1xuICAgIH0pO1xuICB9O1xuXG4gIG1lYXN1cmUoKTtcbiAgLy8gU3RpY2t5IGlzIGVuYWJsZWQgb25seSBhZnRlciB0aGUgZmlyc3QgbWVhc3VyZW1lbnQgLSBpZiBKUyBuZXZlciByYW4sIHRoZVxuICAvLyBzZWN0aW9uIHN0YXlzIGEgcGxhaW4gc3RhY2sgaW4gbm9ybWFsIGZsb3cgaW5zdGVhZCBvZiBhIGJyb2tlbiBsYXlvdXQuXG4gIHdyYXBwZXIuY2xhc3NMaXN0LmFkZChcImlzLXN0YWNrLXJlYWR5XCIpO1xuXG4gIC8vIENhcmQgTidzIGNvbnRlbnQgZmFkZXMgaW4gc3RlcCB3aXRoIGNhcmQgTisxIHNsaWRpbmcgaW46XG4gIC8vICAgc3RhcnQgPSB0b3Agb2YgTisxIGF0IHRoZSBib3R0b20gZWRnZSBvZiB0aGUgd2luZG93IChOIHBpbnMpLFxuICAvLyAgIGVuZCAgID0gYm90dG9tIG9mIE4rMSBhdCB0aGUgYm90dG9tIGVkZ2UgKE4rMSBwaW5uZWQgdG9vLCBjb3ZlcmluZyBOKS5cbiAgLy8gRGlzdGFuY2UgPSBOKzEncyBvd24gaGVpZ2h0LCBzbyBkaWZmZXJlbnQgY2FyZCBoZWlnaHRzIHN0YXkgaW4gc3luYyBieVxuICAvLyBkZWZpbml0aW9uIC0gbm8gdmggY29uc3RhbnRzLiBUaGUgbGFzdCBjYXJkIGRvZXNuJ3QgZmFkZS5cbiAgLy8gTm8gei1pbmRleCBuZWVkZWQ6IGxhdGVyIHBvc2l0aW9uZWQgc2libGluZ3MgcGFpbnQgYWJvdmUgZWFybGllciBvbmVzLlxuICBjYXJkcy5mb3JFYWNoKChjYXJkLCBpKSA9PiB7XG4gICAgY29uc3QgbmV4dCA9IGNhcmRzW2kgKyAxXTtcbiAgICBpZiAoIW5leHQpIHJldHVybjtcblxuICAgIC8vIFdlIGFuaW1hdGUgdGhlIGNhcmQncyBJTlNJREUsIG5vdCB0aGUgY2FyZCAtIHRoZSBiYWNrZ3JvdW5kICgud3dkX2dyaWQtYmcpXG4gICAgLy8gYW5kIHRoZSBib3ggc3RheSBmdWxseSB2aXNpYmxlLCBzbyB0aGUgc3RhY2sgcmVhZHMgYXMgbGF5ZXJzLlxuICAgIGNvbnN0IGlubmVyID0gY2FyZC5xdWVyeVNlbGVjdG9yQWxsKFwiLnd3ZF9ncmlkX2NvbDEsIC53d2RfZ3JpZF9jb2wyXCIpO1xuICAgIGlmICghaW5uZXIubGVuZ3RoKSByZXR1cm47XG5cbiAgICBnc2FwLmZyb21UbyhcbiAgICAgIGlubmVyLFxuICAgICAgeyBvcGFjaXR5OiAxLCBzY2FsZTogMSB9LFxuICAgICAge1xuICAgICAgICBvcGFjaXR5OiBPUEFDSVRZX1RPLFxuICAgICAgICBzY2FsZTogU0NBTEVfVE8sXG4gICAgICAgIGVhc2U6IFwibm9uZVwiLFxuICAgICAgICBzY3JvbGxUcmlnZ2VyOiB7XG4gICAgICAgICAgdHJpZ2dlcjogd3JhcHBlciwgLy8gcmVmZXJlbmNlIChub24tc3RpY2t5KSBlbGVtZW50OyBzdGFydC9lbmQgYXJlIG51bWVyaWMgYW55d2F5XG4gICAgICAgICAgc3RhcnQ6ICgpID0+IGxheW91dC5nZXQobmV4dCkudG9wIC0gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgIGVuZDogKCkgPT4gbGF5b3V0LmdldChuZXh0KS50b3AgKyBsYXlvdXQuZ2V0KG5leHQpLmggLSB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgc2NydWI6IHRydWUsXG4gICAgICAgICAgaW52YWxpZGF0ZU9uUmVmcmVzaDogdHJ1ZSxcbiAgICAgICAgICBvblJlZnJlc2hJbml0OiBtZWFzdXJlLFxuICAgICAgICB9LFxuICAgICAgfVxuICAgICk7XG4gIH0pO1xuXG4gIC8vIERpZmZlcmVudCBjYXJkIGhlaWdodHMgLyByZXNwb25zaXZlbmVzczogYSByZWFsIGhlaWdodCBjaGFuZ2UgKG5ldyBjb250ZW50LFxuICAvLyBicmVha3BvaW50LCBsb2FkZWQgZm9udCkgc2hpZnRzIGxheW91dCBwb3NpdGlvbnMsIHNvIHN0YXJ0L2VuZCBhbmQgc3RpY2t5XG4gIC8vIG9mZnNldHMgbXVzdCBiZSByZWNvbXB1dGVkLiBEZWJvdW5jZWQgMTIwbXMgdG8gYXZvaWQgcmVmcmVzaGluZyBvbiBldmVyeSBmcmFtZS5cbiAgaWYgKHd3ZENhcmRzT2JzZXJ2ZXIpIHd3ZENhcmRzT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICBpZiAod3dkQ2FyZHNSZWZyZXNoVGltZXIpIGNsZWFyVGltZW91dCh3d2RDYXJkc1JlZnJlc2hUaW1lcik7XG5cbiAgd3dkQ2FyZHNPYnNlcnZlciA9IG5ldyBSZXNpemVPYnNlcnZlcigoKSA9PiB7XG4gICAgY2xlYXJUaW1lb3V0KHd3ZENhcmRzUmVmcmVzaFRpbWVyKTtcbiAgICB3d2RDYXJkc1JlZnJlc2hUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4gU2Nyb2xsVHJpZ2dlci5yZWZyZXNoKCksIDEyMCk7XG4gIH0pO1xuICBjYXJkcy5mb3JFYWNoKChjYXJkKSA9PiB3d2RDYXJkc09ic2VydmVyLm9ic2VydmUoY2FyZCkpO1xufVxuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIFBBUlRORVJTSElQIFZBUklBTlQgT0YgXCJIT1cgSVQgV09SS1NcIiAtIElOVFJPICsgMyBMT09QU1xuLy9cbi8vIGluaXRWaWRlb1NjcnViKCkgLSBzaGFyZWQgYnkgSG9tZSAoc3RhdHMpIGFuZCBQYXJ0bmVyc2hpcCAoc3RlcHMgdGltZWxpbmUpLlxuLy8gVHdvIHZpZGVvIGZpbGVzIHRoYXQgYXJlIG9uZSBjb250aW51b3VzIHNob3Q6IHRoZSBpbnRybyBwbGF5cyBPTkNFLFxuLy8gdGhlbiB0aGUgbWFpbiBjbGlwIGxvb3BzIGBsb29wc2AgdGltZXMuIFNjcm9sbCBpcyBzcGxpdCBwcm9wb3J0aW9uYWxseSB0byB0aGVcbi8vIHJlYWwgZmlsZSBkdXJhdGlvbnMgKHJlYWQgZnJvbSBtZXRhZGF0YSksIHNvIHRoZSBwYWNlIGlzIGNvbnN0YW50IGFuZCB0aGVcbi8vIGludHJvIC0+IGxvb3AgaGFuZC1vZmYgaXMgaW52aXNpYmxlLlxuLy9cbi8vIFN0ZXBzIHN0YXJ0IGV4YWN0bHkgd2hlcmUgdGhlIGZpcnN0IGxvb3Agc3RhcnRzIGFuZCBhcmUgc3RyZXRjaGVkIGV2ZW5seSBvdmVyXG4vLyBhbGwgbG9vcHMgKHN0ZXAgMSA9IGxvb3AgMSwgc3RlcCAyID0gbG9vcCAyLCAuLi4pLiBOb3RoaW5nIGhpZGVzIGF0IHRoZSBlbmQgLVxuLy8gdGhlIGxhc3Qgc3RlcCBzdGF5cyB2aXNpYmxlLlxuLy9cbi8vIFdlYmZsb3cgcmVxdWlyZW1lbnQ6IGEgU0VDT05EIDx2aWRlbz4gaW5zaWRlIFt2aWRlby1kaWFtb25kLW1hc2tdIHdpdGggdGhlXG4vLyBiYXNlIGNsYXNzIC5zZWN0aW9uLWJnX3ZpZGVvIFBMVVMgdGhlIGNvbWJvIGNsYXNzIC5pcy1oaXctaW50cm8gKHRoYXQgY2xhc3MgaXNcbi8vIGhvdyB0aGUgSlMgcmVjb2duaXNlcyB0aGUgaW50cm8pLCBubyBhdXRvcGxheS9sb29wIGF0dHJpYnV0ZXMsIHByZWxvYWQ9XCJhdXRvXCJcbi8vIG9uIGJvdGguIE9uIG1vYmlsZSB0aGUgaW50cm8gaXMgc2tpcHBlZDsgaWYgLnNlY3Rpb24tYmdfdmlkZW8tbW9iaWxlIGlzXG4vLyBtaXNzaW5nLCB0aGUgZGVza3RvcCBlbGVtZW50IGlzIHJldXNlZCBhbmQgbG9vcGVkLlxuLy9cbi8vIEhPTUUgaXMgdW5hZmZlY3RlZDogZXZlcnl0aGluZyBwYXJ0bmVyc2hpcC1zcGVjaWZpYyBzaXRzIGJlaGluZCB0aGUgYGhhc1N0ZXBzYFxuLy8gZmxhZywgd2hpY2ggaXMgZmFsc2Ugd2hlbiAucGFydG5lcnNoaXAtcHJvY2Vzc19zdGVwcyBpcyBhYnNlbnQuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cblxuLy8gPiBIb3cgaXQgV29ya3MgLSBWaWRlbyAvIFN0YXRzIFNlcXVlbmNlXG5mdW5jdGlvbiBpbml0VmlkZW9TY3J1YigpIHtcbiAgdmFyIHRyYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltob21lLWhpdy1zY3J1Yl1cIik7XG4gIGlmICghdHJhY2sgfHwgIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuXG4gIHZhciBpc01vYmlsZSA9IHdpbmRvdy5pbm5lcldpZHRoIDw9IDc2NztcblxuICB2YXIgdmlkZW9TZWxlY3RvciA9IGlzTW9iaWxlID8gXCIuc2VjdGlvbi1iZ192aWRlby1tb2JpbGVcIiA6IFwiLnNlY3Rpb24tYmdfdmlkZW9cIjtcblxuICAvLyBQYXJ0bmVyc2hpcDogc2FtZSBzZWN0aW9uIGFzIEhvbWUsIGJ1dCB3aXRoIGEgc3RlcCBsaXN0IGluc3RlYWQgb2Ygc3RhdHMuXG4gIC8vIFRoaXMgZmxhZyBlbmFibGVzIHRoZSBwYXJ0bmVyc2hpcCB2aWRlbyB2YXJpYW50IChpbnRybyArIGxvb3BzKS5cbiAgdmFyIGhhc1N0ZXBzID0gISF0cmFjay5xdWVyeVNlbGVjdG9yKFwiLnBhcnRuZXJzaGlwLXByb2Nlc3Nfc3RlcHNcIik7XG5cbiAgLy8gVGhlIG1hc2sgY2FuIGhvbGQgVFdPIHZpZGVvIGVsZW1lbnRzIHNoYXJpbmcgdGhlIGJhc2UgY2xhc3M6IHRoZSBtYWluXG4gIC8vIChsb29wZWQpIGNsaXAgYW5kIHRoZSBpbnRybyBtYXJrZWQgd2l0aCAuaXMtaGl3LWludHJvLiBET00gb3JkZXIgaXNcbiAgLy8gaXJyZWxldmFudC4gVGhlIGludHJvIHJ1bnMgb24gZGVza3RvcCBvbmx5LlxuICB2YXIgdmlkZW8gPSBudWxsO1xuICB2YXIgaW50cm9WaWRlbyA9IG51bGw7XG4gIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwodHJhY2sucXVlcnlTZWxlY3RvckFsbCh2aWRlb1NlbGVjdG9yKSwgZnVuY3Rpb24gKGVsKSB7XG4gICAgaWYgKGVsLmNsYXNzTGlzdC5jb250YWlucyhcImlzLWhpdy1pbnRyb1wiKSkge1xuICAgICAgaWYgKCFpc01vYmlsZSkgaW50cm9WaWRlbyA9IGVsO1xuICAgIH0gZWxzZSBpZiAoIXZpZGVvKSB7XG4gICAgICB2aWRlbyA9IGVsO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gTW9iaWxlIHdpdGhvdXQgaXRzIG93biBmaWxlOiBmYWxsIGJhY2sgdG8gdGhlIGRlc2t0b3AgZWxlbWVudCAoc2tpcHBpbmcgdGhlXG4gIC8vIGludHJvKSwgYXQgdGhlIGNvc3Qgb2YgdGhlIHBob25lIGRvd25sb2FkaW5nIHRoZSBkZXNrdG9wIGZpbGUuXG4gIGlmICghdmlkZW8gJiYgaXNNb2JpbGUpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZm9yRWFjaC5jYWxsKHRyYWNrLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2VjdGlvbi1iZ192aWRlb1wiKSwgZnVuY3Rpb24gKGVsKSB7XG4gICAgICBpZiAoIXZpZGVvICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMoXCJpcy1oaXctaW50cm9cIikpIHZpZGVvID0gZWw7XG4gICAgfSk7XG4gIH1cblxuICB2YXIgbWFzayA9IHRyYWNrLnF1ZXJ5U2VsZWN0b3IoXCJbdmlkZW8tZGlhbW9uZC1tYXNrXVwiKTtcbiAgdmFyIGhlYWRlciA9IHRyYWNrLnF1ZXJ5U2VsZWN0b3IoXCIuaG9tZS1ob3ctaXQtd29ya3NfaGVhZGVyXCIpO1xuICB2YXIgYmdHcmFkaWVudCA9IHRyYWNrLnF1ZXJ5U2VsZWN0b3IoXCIuaGl3X2JnLWdyYWRpZW50XCIpO1xuICBpZiAoIXZpZGVvIHx8ICFtYXNrKSByZXR1cm47XG4gIGlmICghaGFzU3RlcHMpIGludHJvVmlkZW8gPSBudWxsO1xuXG4gIHZhciB2aWRlb0VscyA9IGludHJvVmlkZW8gPyBbdmlkZW8sIGludHJvVmlkZW9dIDogW3ZpZGVvXTtcbiAgdmlkZW9FbHMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHsgZWwubXV0ZWQgPSB0cnVlOyB9KTtcblxuICB2YXIgcHJpbWVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gcHJpbWVWaWRlbygpIHtcbiAgICBpZiAocHJpbWVkKSByZXR1cm47XG4gICAgcHJpbWVkID0gdHJ1ZTtcbiAgICAvLyBQcmltZSBib3RoIGVsZW1lbnRzOiBpT1Mgd29uJ3Qgc2VlayBpbiBhIHZpZGVvIHRoYXQgbmV2ZXIgcGxheWVkLlxuICAgIHZpZGVvRWxzLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICB2YXIgcHIgPSBlbC5wbGF5KCk7XG4gICAgICBpZiAocHIgJiYgcHIudGhlbikge1xuICAgICAgICBwci50aGVuKGZ1bmN0aW9uICgpIHsgZWwucGF1c2UoKTsgfSkuY2F0Y2goZnVuY3Rpb24gKCkgeyB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgcHJpbWVWaWRlbyk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwb2ludGVyZG93blwiLCBwcmltZVZpZGVvKTtcbiAgfVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBwcmltZVZpZGVvLCB7IG9uY2U6IHRydWUsIHBhc3NpdmU6IHRydWUgfSk7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicG9pbnRlcmRvd25cIiwgcHJpbWVWaWRlbywgeyBvbmNlOiB0cnVlIH0pO1xuICB2aWRlb0Vscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkgeyBlbC5wYXVzZSgpOyB9KTtcblxuICB2YXIgVklERU9fRFVSQVRJT04gPSAxNTtcbiAgdmFyIGFpQmFkZ2UgPSB0cmFjay5xdWVyeVNlbGVjdG9yKFwiW2FpLWJhZGdlXVwiKTtcblxuICAvLyBQYXJ0bmVyc2hpcCB2aWRlbyBzZXF1ZW5jZSBrbm9icy4gTm90aGluZyBoYXJkY29kZWQgYWJvdXQgZmlsZSBsZW5ndGg6XG4gIC8vIHN3YXBwaW5nIHRoZSBjbGlwIGZvciBhIGxvbmdlci9zaG9ydGVyIG9uZSBjaGFuZ2VzIG5vdGhpbmcgaGVyZS5cbiAgdmFyIFBCX1ZJREVPID0ge1xuICAgIGxvb3BzOiAzLCAgICAgICAgLy8gaG93IG1hbnkgdGltZXMgdGhlIG1haW4gY2xpcCBwbGF5cyBhZnRlciB0aGUgaW50cm9cbiAgICBwbGF5U3RhcnQ6IDAsICAgIC8vIHNjcm9sbCBwcm9ncmVzcyAwLi4xIGF0IHdoaWNoIHRoZSB2aWRlbyBzdGFydHNcbiAgICBwbGF5RW5kOiAxLCAgICAgIC8vIHByb2dyZXNzIGF0IHdoaWNoIHRoZSBsYXN0IGxvb3AgZW5kcyAoMSA9IHdob2xlIHNjcm9sbCBwYXRoIHVzZWQpXG5cbiAgICAvLyBtb2JpbGUgb25seTogdmlkZW8gbW92ZW1lbnQgb24gdGhlIFkgYXhpcyAoZGVza3RvcCB1bnRvdWNoZWQpXG4gICAgbW9iaWxlWTogNzUsICAgICAgICAgIC8vIHN0YXJ0IG9mZnNldCBpbiBWSCwgKyBpcyBkb3duLiAwID0gZGlzYWJsZWRcbiAgICBtb2JpbGVZRHVyYXRpb246IDQsICAgLy8gdGltZWxpbmUgdW5pdHMgaXQgdGFrZXMgdG8gcmVhY2ggemVybyAobWFzayBncm93cyAwIC0+IDEyKVxuICAgIG1vYmlsZVlGcm9tOiAwLCAgICAgICAvLyB0aW1lbGluZSB1bml0IGl0IHN0YXJ0cyBhdFxuXG4gICAgLy8gRGVsYXkgb2YgdGhlIFdIT0xFIHN0ZXBzIHNlcXVlbmNlIG9uIG1vYmlsZSwgYXMgYSBmcmFjdGlvbiBvZiB0aGUgbG9vcFxuICAgIC8vIHBoYXNlICgwLjMzMyA9IG9uZSBmdWxsIGxvb3Agb2Ygd2FpdGluZyBhdCAzIGxvb3BzKS4gU3RlcHMgc3RpbGwgZW5kIHdpdGhcbiAgICAvLyB0aGUgbGFzdCBsb29wIC0gdGhlIHJlc3QgaXMgc3F1ZWV6ZWQgaW50byB3aGF0J3MgbGVmdC5cbiAgICBtb2JpbGVTdGVwc0RlbGF5OiAwLjE1XG4gIH07XG5cbiAgLy8gPT09PSBERUJVRyBIQVRDSCAtIFNUQVJUIChyZW1vdmUgYmVmb3JlIGhhbmRvdmVyKSA9PT09PT09PT09PT09PT09PT09PT1cbiAgLy8gQ29uc29sZSB0dW5pbmcsIG5vIGNvZGUgZWRpdHM6XG4gIC8vICAgcGJWaWRlbygpICAgICAgICAgICAgICAgICAgLT4gcHJpbnQgY3VycmVudCB2YWx1ZXNcbiAgLy8gICBwYlZpZGVvKHsgbG9vcHM6IDQgfSkgICAgICAtPiBzYXZlICsgcmVsb2FkXG4gIC8vICAgcGJWaWRlby5yZXNldCgpICAgICAgICAgICAgLT4gY2xlYXIgdGhlIG92ZXJyaWRlICsgcmVsb2FkXG4gIC8vIFZhbHVlcyBhcmUgcmVhZCBvbmNlIHdoaWxlIGJ1aWxkaW5nIHRoZSB0aW1lbGluZSwgaGVuY2UgdGhlIHJlbG9hZC5cbiAgLy8gVG8gcmVtb3ZlOiBkZWxldGUgZXZlcnl0aGluZyBkb3duIHRvIFwiREVCVUcgSEFUQ0ggLSBFTkRcIi4gTm90aGluZyBlbHNlXG4gIC8vIG5lZWRzIGNoYW5naW5nIC0gdGhlIHJlc3Qgb2YgdGhlIGNvZGUgcmVhZHMgUEJfVklERU8gd2l0aCBpdHMgZGVmYXVsdHMuXG4gIHRyeSB7XG4gICAgdmFyIHBiT3ZlcnJpZGUgPSB3aW5kb3cubG9jYWxTdG9yYWdlICYmIHdpbmRvdy5sb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInBiVmlkZW9TdGFydFwiKTtcbiAgICBpZiAocGJPdmVycmlkZSkge1xuICAgICAgcGJPdmVycmlkZSA9IEpTT04ucGFyc2UocGJPdmVycmlkZSk7XG4gICAgICBPYmplY3Qua2V5cyhQQl9WSURFTykuZm9yRWFjaChmdW5jdGlvbiAoaykge1xuICAgICAgICBpZiAodHlwZW9mIHBiT3ZlcnJpZGVba10gPT09IFwibnVtYmVyXCIpIFBCX1ZJREVPW2tdID0gcGJPdmVycmlkZVtrXTtcbiAgICAgIH0pO1xuICAgICAgY29uc29sZS5sb2coXCJbaGl3XSBQQl9WSURFTyB6IGxvY2FsU3RvcmFnZTpcIiwgUEJfVklERU8pO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkgeyAvKiBiYWQgSlNPTiAvIGJsb2NrZWQgc3RvcmFnZSAtIGZhbGwgYmFjayB0byBkZWZhdWx0cyAqLyB9XG5cbiAgaWYgKGhhc1N0ZXBzKSB7XG4gICAgd2luZG93LnBiVmlkZW8gPSBmdW5jdGlvbiAob3B0cykge1xuICAgICAgaWYgKCFvcHRzKSB7IGNvbnNvbGUudGFibGUoUEJfVklERU8pOyByZXR1cm4gUEJfVklERU87IH1cbiAgICAgIHZhciBuZXh0ID0gT2JqZWN0LmFzc2lnbih7fSwgUEJfVklERU8sIG9wdHMpO1xuICAgICAgdHJ5IHsgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwicGJWaWRlb1N0YXJ0XCIsIEpTT04uc3RyaW5naWZ5KG5leHQpKTsgfSBjYXRjaCAoZSkgeyB9XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfTtcbiAgICB3aW5kb3cucGJWaWRlby5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHRyeSB7IHdpbmRvdy5sb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbShcInBiVmlkZW9TdGFydFwiKTsgfSBjYXRjaCAoZSkgeyB9XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfTtcbiAgfVxuICAvLyA9PT09IERFQlVHIEhBVENIIC0gRU5EID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gIC8vIEhvbWU6IHNpbmdsZSBwYXNzIG9mIHRoZSBjbGlwIC0gZG8gbm90IHRvdWNoLlxuICB2YXIgVklERU9fTE9PUFMgPSBoYXNTdGVwcyA/IFBCX1ZJREVPLmxvb3BzIDogMTtcblxuICB2YXIgTUFTS19BUiA9IDgxMCAvIDg1MTtcbiAgdmFyIERJQU1PTkQgPSBcInVybChcXFwiZGF0YTppbWFnZS9zdmcreG1sLCUzQ3N2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCA4NTEgODEwJyUzRSUzQ3BhdGggZD0nTTgyOC4zNzQgMzUzLjAwOEw0ODAuMTIzIDIxLjUzNTdDNDQ5Ljk1NiAtNy4xNzg1NyA0MDEuMDQ0IC03LjE3ODU3IDM3MC44NzcgMjEuNTM1N0wyMi42MjU4IDM1My4wMDhDLTcuNTQxOTUgMzgxLjcyMiAtNy41NDE5MSA0MjguMjc3IDIyLjYyNTggNDU2Ljk5MkwzNzAuODc3IDc4OC40NjRDNDAxLjA0NCA4MTcuMTc5IDQ0OS45NTYgODE3LjE3OSA0ODAuMTIzIDc4OC40NjRMODI4LjM3NCA0NTYuOTkyQzg1OC41NDIgNDI4LjI3OCA4NTguNTQyIDM4MS43MjIgODI4LjM3NCAzNTMuMDA4WicgZmlsbD0nJTIzZmZmJy8lM0UlM0Mvc3ZnJTNFXFxcIilcIjtcbiAgbWFzay5zdHlsZS53ZWJraXRNYXNrSW1hZ2UgPSBtYXNrLnN0eWxlLm1hc2tJbWFnZSA9IERJQU1PTkQ7XG4gIG1hc2suc3R5bGUud2Via2l0TWFza1JlcGVhdCA9IG1hc2suc3R5bGUubWFza1JlcGVhdCA9IFwibm8tcmVwZWF0XCI7XG5cblxuICB2YXIgd2hhdFdlRG8gPSB0cmFjay5xdWVyeVNlbGVjdG9yKFwiLmhvbWUtaG93LWl0LXdvcmtzX3doYXQtd2UtZG9cIik7XG5cbiAgdmFyIGxpbmVzV2hhdFdlRG8gPSBbXTtcbiAgdmFyIGxpbmVzTTEgPSBbXSwgbGluZXNNMiA9IFtdLCBsaW5lc00zID0gW107XG4gIHZhciBsaW5lc1N0YXRzMSA9IFtdLCBsaW5lc1N0YXRzMiA9IFtdO1xuXG4gIGlmICh3aW5kb3cuU3BsaXRUZXh0KSB7XG4gICAgaWYgKHdoYXRXZURvKSB7XG4gICAgICB3aGF0V2VEby5xdWVyeVNlbGVjdG9yQWxsKFwiW2RhdGEtaGl3LXNwbGl0XVwiKS5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICBnc2FwLnNldChlbCwgeyBhdXRvQWxwaGE6IDEgfSk7XG4gICAgICAgIGxpbmVzV2hhdFdlRG8gPSBsaW5lc1doYXRXZURvLmNvbmNhdChTcGxpdFRleHQuY3JlYXRlKGVsLCB7IHR5cGU6IFwibGluZXNcIiwgbWFzazogXCJsaW5lc1wiIH0pLmxpbmVzKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgdmFyIG0xID0gdHJhY2sucXVlcnlTZWxlY3RvcignW3N0YXRzLW1vYmlsZT1cIjFcIl0nKTtcbiAgICAgIHZhciBtMiA9IHRyYWNrLnF1ZXJ5U2VsZWN0b3IoJ1tzdGF0cy1tb2JpbGU9XCIyXCJdJyk7XG4gICAgICB2YXIgbTMgPSB0cmFjay5xdWVyeVNlbGVjdG9yKCdbc3RhdHMtbW9iaWxlPVwiM1wiXScpO1xuXG4gICAgICBpZiAobTEpIG0xLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1oaXctc3BsaXRdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGdzYXAuc2V0KGVsLCB7IGF1dG9BbHBoYTogMSB9KTtcbiAgICAgICAgbGluZXNNMSA9IGxpbmVzTTEuY29uY2F0KFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSkubGluZXMpO1xuICAgICAgfSk7XG4gICAgICBpZiAobTIpIG0yLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1oaXctc3BsaXRdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGdzYXAuc2V0KGVsLCB7IGF1dG9BbHBoYTogMSB9KTtcbiAgICAgICAgbGluZXNNMiA9IGxpbmVzTTIuY29uY2F0KFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSkubGluZXMpO1xuICAgICAgfSk7XG4gICAgICBpZiAobTMpIG0zLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1oaXctc3BsaXRdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGdzYXAuc2V0KGVsLCB7IGF1dG9BbHBoYTogMSB9KTtcbiAgICAgICAgbGluZXNNMyA9IGxpbmVzTTMuY29uY2F0KFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSkubGluZXMpO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGF0c0Jsb2NrcyA9IHRyYWNrLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaG9tZS1ob3ctaXQtd29ya3Nfc3RhdHNcIik7XG4gICAgICB2YXIgc3RhdHMxID0gc3RhdHNCbG9ja3NbMF07XG4gICAgICB2YXIgc3RhdHMyID0gc3RhdHNCbG9ja3NbMV07XG5cbiAgICAgIGlmIChzdGF0czEpIHtcbiAgICAgICAgc3RhdHMxLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1oaXctc3BsaXRdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZ3NhcC5zZXQoZWwsIHsgYXV0b0FscGhhOiAxIH0pO1xuICAgICAgICAgIGxpbmVzU3RhdHMxID0gbGluZXNTdGF0czEuY29uY2F0KFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSkubGluZXMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0czIpIHtcbiAgICAgICAgc3RhdHMyLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1oaXctc3BsaXRdXCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgICAgZ3NhcC5zZXQoZWwsIHsgYXV0b0FscGhhOiAxIH0pO1xuICAgICAgICAgIGxpbmVzU3RhdHMyID0gbGluZXNTdGF0czIuY29uY2F0KFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSkubGluZXMpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAobGluZXNXaGF0V2VEby5sZW5ndGgpIGdzYXAuc2V0KGxpbmVzV2hhdFdlRG8sIHsgeVBlcmNlbnQ6IDExMCB9KTtcbiAgaWYgKGFpQmFkZ2UpIGdzYXAuc2V0KGFpQmFkZ2UsIHsgYXV0b0FscGhhOiAwIH0pO1xuICAvLyBCYWNrZ3JvdW5kIGdyYWRpZW50IHN0YXlzIEhvbWUtb25seS4gT24gUGFydG5lcnNoaXAgKGhhc1N0ZXBzKSB3ZSBkb24ndCB0b3VjaFxuICAvLyBpdCBhdCBhbGwgLSBuZWl0aGVyIHRoZSBzdGFydCBzdGF0ZSBub3IgdGhlIHR3ZWVuIGJlbG93LlxuICBpZiAoYmdHcmFkaWVudCAmJiBpc01vYmlsZSAmJiAhaGFzU3RlcHMpIGdzYXAuc2V0KGJnR3JhZGllbnQsIHsgb3BhY2l0eTogMCB9KTtcblxuICAvLyBTdGFydCBzaXplIGZvbGxvd3Mgd2lkdGgsIGNhcHBlZCBieSBoZWlnaHQgc28gdGhlIGRpYW1vbmQgY2xlYXJzIHRoZSBoZWFkZXIgb24gc2hvcnQgc2NyZWVuc1xuICBmdW5jdGlvbiBnZXRNYXNrU3RhcnRQeCgpIHsgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoICogMC4zNSwgNDAwKSwgd2luZG93LmlubmVySGVpZ2h0ICogMC41NSk7IH1cbiAgZnVuY3Rpb24gZ2V0TWFza0VuZFB4KCkgeyByZXR1cm4gKHdpbmRvdy5pbm5lcldpZHRoICsgd2luZG93LmlubmVySGVpZ2h0KSAqIDIuNDsgfVxuICBmdW5jdGlvbiBnZXRNYXNrUGVla1B4KCkgeyByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0ICogMC4zNTsgfVxuXG4gIHZhciBtYXNrT2JqID0geyBwcm9ncmVzczogMCB9O1xuICBmdW5jdGlvbiB1cGRhdGVNYXNrU3R5bGUoKSB7XG4gICAgdmFyIHBFYXNlZCA9IG1hc2tPYmoucHJvZ3Jlc3M7XG4gICAgdmFyIHNpemUgPSBnZXRNYXNrU3RhcnRQeCgpICsgKGdldE1hc2tFbmRQeCgpIC0gZ2V0TWFza1N0YXJ0UHgoKSkgKiBwRWFzZWQ7XG4gICAgdmFyIG9mZlkgPSBnZXRNYXNrUGVla1B4KCkgKiAoMSAtIHBFYXNlZCk7XG4gICAgbWFzay5zdHlsZS53ZWJraXRNYXNrU2l6ZSA9IG1hc2suc3R5bGUubWFza1NpemUgPSBzaXplICsgXCJweCBcIiArIChzaXplICogTUFTS19BUikgKyBcInB4XCI7XG4gICAgbWFzay5zdHlsZS53ZWJraXRNYXNrUG9zaXRpb24gPSBtYXNrLnN0eWxlLm1hc2tQb3NpdGlvbiA9IFwiY2VudGVyIGNhbGMoNzAlICsgXCIgKyBvZmZZICsgXCJweClcIjtcbiAgfVxuICB1cGRhdGVNYXNrU3R5bGUoKTtcblxuICAvLyBIb21lOiB2aWRlbyBzdGFydHMgb25seSBhZnRlciB0aGUgbWFzayBoYXMgZ3Jvd24gKDAuMTApIC0gZG8gbm90IHRvdWNoLlxuICAvLyBQYXJ0bmVyc2hpcDogdmlkZW8gcnVucyBmcm9tIHRoZSBzdGFydCwgdG9nZXRoZXIgd2l0aCB0aGUgbWFzayAocGxheVN0YXJ0IDApLlxuICB2YXIgVklERU9fU1RBUlRfUFJPRyA9IGhhc1N0ZXBzID8gUEJfVklERU8ucGxheVN0YXJ0IDogMC4wNDtcbiAgdmFyIFZJREVPX0VORF9QUk9HID0gaGFzU3RlcHMgPyBQQl9WSURFTy5wbGF5RW5kIDogMC42NTtcblxuICAvLyBJbnRybyA8LT4gbWFpbiBjbGlwIHZpc2liaWxpdHkgc3dhcC4gU3RhdGUga2VwdCBpbiBhIHZhcmlhYmxlIHNvIHdlIGRvbid0XG4gIC8vIHdyaXRlIHRvIHN0eWxlIG9uIGV2ZXJ5IHNjcm9sbCBmcmFtZS4gVXNlcyBvcGFjaXR5LCBOT1QgZGlzcGxheS92aXNpYmlsaXR5IC1cbiAgLy8gYSBkaXNwbGF5Om5vbmUgZWxlbWVudCBjYW4gbG9zZSB0aGUgYWJpbGl0eSB0byBzZWVrLCB3aGljaCB3b3VsZCBmbGFzaCBhXG4gIC8vIGJsYWNrIGZyYW1lIG9uIHRoZSBzd2FwLlxuICB2YXIgaW50cm9TaG93biA9IG51bGw7XG4gIGZ1bmN0aW9uIHNldEludHJvVmlzaWJsZShvbikge1xuICAgIGlmICghaW50cm9WaWRlbyB8fCBpbnRyb1Nob3duID09PSBvbikgcmV0dXJuO1xuICAgIGludHJvU2hvd24gPSBvbjtcbiAgICBpbnRyb1ZpZGVvLnN0eWxlLm9wYWNpdHkgPSBvbiA/IFwiMVwiIDogXCIwXCI7XG4gICAgdmlkZW8uc3R5bGUub3BhY2l0eSA9IG9uID8gXCIwXCIgOiBcIjFcIjtcbiAgfVxuXG4gIC8vIE1hcHMgd2luZG93IHByb2dyZXNzICgwLi4xKSBvbnRvIHNlcXVlbmNlIHRpbWU6IGludHJvIG9uY2UsIHRoZW4gdGhlIG1haW5cbiAgLy8gY2xpcCBWSURFT19MT09QUyB0aW1lcy4gV2l0aG91dCBhbiBpbnRybyAoSG9tZSwgbW9iaWxlKSBpdCBpcyBqdXN0IHRoZSBtYWluXG4gIC8vIGNsaXAgbG9vcGluZywgaS5lLiB0aGUgcHJldmlvdXMgYmVoYXZpb3VyLlxuICBmdW5jdGlvbiByZW5kZXJWaWRlb1RpbWUocHJvZywgYXRFbmQpIHtcbiAgICAvLyBVbnRpbCB0aGUgaW50cm8gZHVyYXRpb24gaXMga25vd24gKG1ldGFkYXRhIG5vdCBpbiB5ZXQpLCBob2xkIGl0cyBmaXJzdFxuICAgIC8vIGZyYW1lIC0gb3RoZXJ3aXNlIHRoZSBmaXJzdCBzY3JvbGwgZnJhbWVzIHdvdWxkIHBsYXkgdGhlIG1haW4gY2xpcCBhbmQgdGhlXG4gICAgLy8gbWFwcGluZyB3b3VsZCBqdW1wIG9uY2UgbWV0YWRhdGEgYXJyaXZlcy5cbiAgICBpZiAoaW50cm9WaWRlbyAmJiAhaXNGaW5pdGUoaW50cm9WaWRlby5kdXJhdGlvbikpIHtcbiAgICAgIHNldEludHJvVmlzaWJsZSh0cnVlKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgZExvb3AgPSB2aWRlby5kdXJhdGlvbiB8fCBWSURFT19EVVJBVElPTjtcbiAgICB2YXIgZEludHJvID0gaW50cm9WaWRlbyA/IChpbnRyb1ZpZGVvLmR1cmF0aW9uIHx8IDApIDogMDtcbiAgICB2YXIgdG90YWwgPSBkSW50cm8gKyBkTG9vcCAqIFZJREVPX0xPT1BTO1xuICAgIHZhciB0ID0gcHJvZyAqIHRvdGFsO1xuXG4gICAgLy8gU3RlcCBiYWNrIGEgaGFpciBhdCB0aGUgdmVyeSBlbmQ6IG1vZHVsbyB3b3VsZCByZXR1cm4gMCwganVtcGluZyB0byB0aGVcbiAgICAvLyBmaXJzdCBmcmFtZSBpbnN0ZWFkIG9mIGhvbGRpbmcgdGhlIGxhc3Qgb25lLlxuICAgIGlmIChhdEVuZCkgdCA9IE1hdGgubWF4KDAsIHRvdGFsIC0gMC4wMDEpO1xuXG4gICAgaWYgKGRJbnRybyAmJiB0IDwgZEludHJvKSB7XG4gICAgICBzZXRJbnRyb1Zpc2libGUodHJ1ZSk7XG4gICAgICBpbnRyb1ZpZGVvLmN1cnJlbnRUaW1lID0gTWF0aC5taW4odCwgZEludHJvIC0gMC4wMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgc2V0SW50cm9WaXNpYmxlKGZhbHNlKTtcbiAgICB2YXIgbHQgPSB0IC0gZEludHJvO1xuICAgIGx0ID0gKChsdCAlIGRMb29wKSArIGRMb29wKSAlIGRMb29wO1xuICAgIHZpZGVvLmN1cnJlbnRUaW1lID0gTWF0aC5taW4obHQsIGRMb29wIC0gMC4wMSk7XG4gIH1cblxuICAvLyBTdGVwcyBzdGFydCBleGFjdGx5IHdoZXJlIHRoZSBmaXJzdCBsb29wIHN0YXJ0cyBhbmQgc3ByZWFkIGV2ZW5seSBhY3Jvc3MgYWxsXG4gIC8vIGxvb3BzLiBCZWNhdXNlIC5wcm9ncmVzcygpIGlzIG5vcm1hbGlzZWQsIGNoYW5naW5nIHRoZSBsb29wIGNvdW50IG9yIGNsaXBcbiAgLy8gbGVuZ3RoIHN0cmV0Y2hlcy9zcXVlZXplcyB0aGUgc3RlcHMgYXV0b21hdGljYWxseS5cbiAgZnVuY3Rpb24gcmVuZGVyU3RlcHMocHJvZywgYXRFbmQpIHtcbiAgICBpZiAoIXN0ZXBzVGwpIHJldHVybjtcblxuICAgIHZhciBkTG9vcCA9IHZpZGVvLmR1cmF0aW9uIHx8IFZJREVPX0RVUkFUSU9OO1xuICAgIHZhciBkSW50cm8gPSBpbnRyb1ZpZGVvICYmIGlzRmluaXRlKGludHJvVmlkZW8uZHVyYXRpb24pID8gaW50cm9WaWRlby5kdXJhdGlvbiA6IDA7XG4gICAgdmFyIHRvdGFsID0gZEludHJvICsgZExvb3AgKiBWSURFT19MT09QUztcbiAgICB2YXIgbG9vcFNwYW4gPSB0b3RhbCAtIGRJbnRybztcblxuICAgIHZhciB0ID0gcHJvZyAqIHRvdGFsO1xuICAgIGlmIChhdEVuZCkgdCA9IHRvdGFsO1xuXG4gICAgdmFyIGxwID0gbG9vcFNwYW4gPiAwID8gKHQgLSBkSW50cm8pIC8gbG9vcFNwYW4gOiAwO1xuXG4gICAgLy8gTW9iaWxlOiBwdXNoIHRoZSB3aG9sZSBzZXF1ZW5jZSBkZWVwZXIgaW50byB0aGUgbG9vcCBwaGFzZSBhbmQgc3F1ZWV6ZSBpdFxuICAgIC8vIGludG8gd2hhdCdzIGxlZnQsIHNvIHRoZSBsYXN0IHN0ZXAgc3RpbGwgbGFuZHMgYXQgdGhlIGVuZC5cbiAgICB2YXIgZGVsYXkgPSBpc01vYmlsZSA/IFBCX1ZJREVPLm1vYmlsZVN0ZXBzRGVsYXkgOiAwO1xuICAgIGlmIChkZWxheSA+IDAgJiYgZGVsYXkgPCAxKSBscCA9IChscCAtIGRlbGF5KSAvICgxIC0gZGVsYXkpO1xuXG4gICAgc3RlcHNUbC5wcm9ncmVzcyhNYXRoLm1pbihNYXRoLm1heChscCwgMCksIDEpKTtcbiAgfVxuXG4gIC8vIFRoZSBzdGVwIGxpc3QgaXMgYSBzZXBhcmF0ZSBQQVVTRUQgdGltZWxpbmUgd2l0aCBub3JtYWxpc2VkIHRpbWUsIGRyaXZlbiB2aWFcbiAgLy8gLnByb2dyZXNzKCkgZnJvbSB0aGUgbG9vcCBwaGFzZSAtIG5vdCBodW5nIG9mZiB0aGUgc2NydWJiZWQgc2VjdGlvbiB0aW1lbGluZS5cbiAgdmFyIHN0ZXBzVGwgPSBoYXNTdGVwcyA/IGJ1aWxkUGFydG5lcnNoaXBTdGVwc1RpbWVsaW5lKHRyYWNrLCBpc01vYmlsZSkgOiBudWxsO1xuXG4gIC8vIFN0YXJ0IHN0YXRlOiBpbnRybyBvbiB0b3AsIG1haW4gY2xpcCB6ZXJvZWQgYW5kIGhpZGRlbiBzbyBpdCBzaG93cyBpdHMgZmlyc3RcbiAgLy8gZnJhbWUgdGhlIG1vbWVudCBpdCBpcyBzd2FwcGVkIGluLlxuICBpZiAoaW50cm9WaWRlbykge1xuICAgIHZpZGVvLnN0eWxlLm9wYWNpdHkgPSBcIjBcIjtcbiAgICBpbnRyb1ZpZGVvLnN0eWxlLm9wYWNpdHkgPSBcIjFcIjtcbiAgICBpbnRyb1Nob3duID0gdHJ1ZTtcbiAgICB0cnkgeyB2aWRlby5jdXJyZW50VGltZSA9IDA7IGludHJvVmlkZW8uY3VycmVudFRpbWUgPSAwOyB9IGNhdGNoIChlKSB7IH1cbiAgfVxuXG4gIHZhciB0bCA9IGdzYXAudGltZWxpbmUoe1xuICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgIHRyaWdnZXI6IHRyYWNrLFxuICAgICAgc3RhcnQ6ICgpID0+IFwidG9wIHRvcC09XCIgKyAod2luZG93LmlubmVySGVpZ2h0ICogMC4yNSksICAgLy8gKzI1dmggcHVzdGVnbyBzY3JvbGxhIG5hIHN0YXJjaWUgICAgICBlbmQ6IFwiYm90dG9tIGJvdHRvbVwiLFxuICAgICAgZW5kOiBoYXNTdGVwcyA/IFwiYm90dG9tIGJvdHRvbVwiIDogXCJib3R0b20gdG9wXCIsXG4gICAgICBzY3J1YjogdHJ1ZSxcbiAgICAgIG9uUmVmcmVzaDogdXBkYXRlTWFza1N0eWxlLCAvLyBzaXplIGRlcGVuZHMgb24gdmlld3BvcnQgLSByZWNvbXB1dGUgYWZ0ZXIgcmVzaXplXG4gICAgICBvblVwZGF0ZTogZnVuY3Rpb24gKHNlbGYpIHtcbiAgICAgICAgdmFyIHZpZGVvUHJvZyA9IDA7XG4gICAgICAgIGlmIChzZWxmLnByb2dyZXNzID4gVklERU9fU1RBUlRfUFJPRykge1xuICAgICAgICAgIHZpZGVvUHJvZyA9IChzZWxmLnByb2dyZXNzIC0gVklERU9fU1RBUlRfUFJPRykgLyAoVklERU9fRU5EX1BST0cgLSBWSURFT19TVEFSVF9QUk9HKTtcbiAgICAgICAgICB2aWRlb1Byb2cgPSBNYXRoLm1pbihNYXRoLm1heCh2aWRlb1Byb2csIDApLCAxKTtcbiAgICAgICAgfVxuICAgICAgICByZW5kZXJWaWRlb1RpbWUodmlkZW9Qcm9nLCB2aWRlb1Byb2cgPj0gMSk7XG4gICAgICAgIHJlbmRlclN0ZXBzKHZpZGVvUHJvZywgdmlkZW9Qcm9nID49IDEpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgdGwudG8obWFza09iaiwgeyBwcm9ncmVzczogMSwgZHVyYXRpb246IDEyLCBlYXNlOiBpc01vYmlsZSA/IFwicG93ZXIxLm91dFwiIDogXCJub25lXCIsIG9uVXBkYXRlOiB1cGRhdGVNYXNrU3R5bGUgfSwgMCk7XG5cbiAgLy8gTW9iaWxlOiBzdWJ0bGUgWSBtb3ZlbWVudCBvZiB0aGUgdmlkZW8sIHJlYWNoaW5nIHplcm8gdG9nZXRoZXIgd2l0aCB0aGUgbWFzay5cbiAgLy8gRGVza3RvcCB1bnRvdWNoZWQgLSBubyB0cmFuc2Zvcm0gb24gdGhlIHZpZGVvIHRoZXJlLlxuICBpZiAoaGFzU3RlcHMgJiYgaXNNb2JpbGUgJiYgUEJfVklERU8ubW9iaWxlWSkge1xuICAgIC8vIFdlYmZsb3cgY2VudHJlcyB0aGUgdmlkZW8gd2l0aCBhIHRyYW5zZm9ybSAodHJhbnNsYXRlIC01MCUvLTUwJSksIGFuZCBHU0FQXG4gICAgLy8gcGFyc2VzIHRoZSBjb21wdXRlZCBtYXRyaXggLSBQSVhFTFMgLSB0aGUgZmlyc3QgdGltZSBpdCB0b3VjaGVzIHRoZVxuICAgIC8vIHRyYW5zZm9ybSwgc28gdGhlIHZpZGVvIHdvdWxkIGRyaWZ0IG9mZi1jZW50cmUgYWZ0ZXIgYSBkZXZpY2Ugcm90YXRpb24uXG4gICAgLy8gUmV3cml0ZSB0aGUgY2VudHJpbmcgYXMgZ3NhcCB4UGVyY2VudC95UGVyY2VudCBmaXJzdCAocGVyY2VudGFnZXMgcmVjb21wdXRlXG4gICAgLy8gb24gZXZlcnkgcmVuZGVyKSBhbmQgb25seSB0aGVuIGFwcGx5IG91ciBvZmZzZXQgb24gdG9wLlxuICAgIGdzYXAuc2V0KHZpZGVvLCB7IGNsZWFyUHJvcHM6IFwidHJhbnNmb3JtXCIgfSk7XG5cbiAgICB2YXIgbXZXID0gdmlkZW8ub2Zmc2V0V2lkdGggfHwgMTtcbiAgICB2YXIgbXZIID0gdmlkZW8ub2Zmc2V0SGVpZ2h0IHx8IDE7XG4gICAgdmFyIG12TSA9IG5ldyBET01NYXRyaXhSZWFkT25seShnZXRDb21wdXRlZFN0eWxlKHZpZGVvKS50cmFuc2Zvcm0pO1xuICAgIHZhciBtdkJhc2VYID0gKG12TS5tNDEgLyBtdlcpICogMTAwO1xuICAgIHZhciBtdkJhc2VZID0gKG12TS5tNDIgLyBtdkgpICogMTAwO1xuXG4gICAgLy8gU3BsaXQgb2Ygcm9sZXMgaW4gdGhlIHRyYW5zZm9ybSBzbyBub3RoaW5nIG92ZXJ3cml0ZXMgYW55dGhpbmc6XG4gICAgLy8geFBlcmNlbnQveVBlcmNlbnQgPSBjZW50cmluZyBjb3BpZWQgZnJvbSB0aGUgc3R5bGVzaGVldCxcbiAgICAvLyB5IChweCkgPSBPVVIgYW5pbWF0ZWQgb2Zmc2V0LCBkZXJpdmVkIGZyb20gdmguIFRha2VuIG9uY2Ugb24gaW5pdCAtIGFmdGVyIGFcbiAgICAvLyByb3RhdGlvbiBpdCBpcyBzbGlnaHRseSBzdGFsZSwgYnV0IGl0IGFuaW1hdGVzIHRvIHplcm8gYW55d2F5LlxuICAgIHZhciBtb2JpbGVZUHggPSB3aW5kb3cuaW5uZXJIZWlnaHQgKiAoUEJfVklERU8ubW9iaWxlWSAvIDEwMCk7XG5cbiAgICBnc2FwLnNldCh2aWRlbywge1xuICAgICAgeDogMCxcbiAgICAgIHk6IG1vYmlsZVlQeCxcbiAgICAgIHhQZXJjZW50OiBtdkJhc2VYLFxuICAgICAgeVBlcmNlbnQ6IG12QmFzZVksXG4gICAgICB0cmFuc2Zvcm1PcmlnaW46IFwiNTAlIDUwJVwiXG4gICAgfSk7XG5cbiAgICB0bC50byh2aWRlbywge1xuICAgICAgeTogMCxcbiAgICAgIGR1cmF0aW9uOiBQQl9WSURFTy5tb2JpbGVZRHVyYXRpb24sXG4gICAgICBlYXNlOiBcInBvd2VyMS5vdXRcIlxuICAgIH0sIFBCX1ZJREVPLm1vYmlsZVlGcm9tKTtcbiAgfVxuXG4gIGlmICghaXNNb2JpbGUgJiYgaGVhZGVyKSB7XG4gICAgdGwudG8oaGVhZGVyLCB7IG9wYWNpdHk6IDAsIGR1cmF0aW9uOiA4LCBlYXNlOiBcIm5vbmVcIiB9LCAwKTtcbiAgfVxuXG4gIGlmIChhaUJhZGdlKSB0bC50byhhaUJhZGdlLCB7IGF1dG9BbHBoYTogMSwgZHVyYXRpb246IDUsIGVhc2U6IFwicG93ZXIxLmluT3V0XCIgfSwgNik7XG5cblxuICAvLyBQYXJ0bmVyc2hpcDogc3RlcCBsaXN0IGluc3RlYWQgb2Ygc3RhdCBibG9ja3MgLSBza2lwIHRoZSBIb21lIHN0YXRzIHBhdGguXG4gIGlmIChoYXNTdGVwcykge1xuICAgIC8vIEd1YXJkczogc29tZSBIb21lIGVsZW1lbnRzIG1heSBub3QgZXhpc3Qgb24gUGFydG5lcnNoaXAgKHNlY3Rpb24gaGVhZGVyLFxuICAgIC8vIHdoYXQtd2UtZG8gYmxvY2spLiBXaXRob3V0IHRoZW0gR1NBUCBsb2dzIFwidGFyZ2V0IG5vdCBmb3VuZFwiLlxuICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgaWYgKGhlYWRlcikgdGwudG8oaGVhZGVyLCB7IG9wYWNpdHk6IDAsIGR1cmF0aW9uOiAxLjUsIGVhc2U6IFwicG93ZXIxLm91dFwiIH0sIDApO1xuICAgICAgaWYgKGxpbmVzV2hhdFdlRG8ubGVuZ3RoKSB0bC50byhsaW5lc1doYXRXZURvLCB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogMS4yLCBzdGFnZ2VyOiAwLjA2LCBlYXNlOiBcInBvd2VyMi5vdXRcIiB9LCAxLjUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBGaXJzdCB0ZXh0IGVudGVycyBleGFjdGx5IHdoZW4gdGhlIG1hc2sgaXMgZnVsbHkgZ3Jvd24gKG1hc2tPYmogcnVuc1xuICAgICAgLy8gMCAtPiAxMiksIGluc3RlYWQgb2YgMTggbGlrZSB0aGUgSG9tZSBzdGF0cyAtIG90aGVyd2lzZSB0aGVyZSB3YXMgYSBnYXAuXG4gICAgICAvLyBJZiB0aGUgbWFzayBncm93dGggbGVuZ3RoIGNoYW5nZXMsIHRoaXMgbnVtYmVyIGZvbGxvd3MgaXQuXG4gICAgICBpZiAobGluZXNXaGF0V2VEby5sZW5ndGgpIHRsLnRvKGxpbmVzV2hhdFdlRG8sIHsgeVBlcmNlbnQ6IDAsIGR1cmF0aW9uOiA2LCBzdGFnZ2VyOiAwLjYsIGVhc2U6IFwiZXhwby5vdXRcIiB9LCAxMik7XG4gICAgfVxuXG4gICAgLy8gVGhlIHN0ZXAgbGlzdCBpcyBhbHJlYWR5IGJ1aWx0IGFib3ZlIChzdGVwc1RsKSBhbmQgcnVucyBvZmYgdGhlIGxvb3AgcGhhc2UsXG4gICAgLy8gbm90IHRoaXMgdGltZWxpbmUgLSBvbmx5IHRoZSB0ZXh0IGlzIGxlZnQgaGVyZS5cbiAgICAvLyBEZWxpYmVyYXRlbHkgV0lUSE9VVCBoaWRpbmcgbGluZXNXaGF0V2VEbyBhdCB0aGUgZW5kIChIb21lIGRvZXMgeVBlcmNlbnQ6XG4gICAgLy8gLTExMCBhdCBzbG90IDY4KSAtIHRoZSB0ZXh0IGlzIG1lYW50IHRvIHN0YXkgdmlzaWJsZS5cbiAgICBpZiAoIWlzTW9iaWxlICYmIGFpQmFkZ2UpIHtcbiAgICAgIHRsLnRvKGFpQmFkZ2UsIHsgYXV0b0FscGhhOiAwLCBkdXJhdGlvbjogNCwgZWFzZTogXCJwb3dlcjEuaW5PdXRcIiB9LCA2OCk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChpc01vYmlsZSkge1xuICAgIHZhciBtU3RhdDEgPSB0cmFjay5xdWVyeVNlbGVjdG9yKCdbc3RhdHMtbW9iaWxlPVwiMVwiXScpO1xuICAgIHZhciBtU3RhdDIgPSB0cmFjay5xdWVyeVNlbGVjdG9yKCdbc3RhdHMtbW9iaWxlPVwiMlwiXScpO1xuICAgIHZhciBtU3RhdDMgPSB0cmFjay5xdWVyeVNlbGVjdG9yKCdbc3RhdHMtbW9iaWxlPVwiM1wiXScpO1xuXG4gICAgdmFyIGwxID0gbVN0YXQxID8gbVN0YXQxLnF1ZXJ5U2VsZWN0b3IoXCIuaG9tZS1ob3ctaXQtd29ya3Nfc3RhdC1saW5lXCIpIDogbnVsbDtcbiAgICB2YXIgbDIgPSBtU3RhdDIgPyBtU3RhdDIucXVlcnlTZWxlY3RvcihcIi5ob21lLWhvdy1pdC13b3Jrc19zdGF0LWxpbmVcIikgOiBudWxsO1xuICAgIHZhciBsMyA9IG1TdGF0MyA/IG1TdGF0My5xdWVyeVNlbGVjdG9yKFwiLmhvbWUtaG93LWl0LXdvcmtzX3N0YXQtbGluZVwiKSA6IG51bGw7XG5cbiAgICBpZiAobGluZXNNMS5sZW5ndGgpIGdzYXAuc2V0KGxpbmVzTTEsIHsgeVBlcmNlbnQ6IDExMCB9KTtcbiAgICBpZiAobGluZXNNMi5sZW5ndGgpIGdzYXAuc2V0KGxpbmVzTTIsIHsgeVBlcmNlbnQ6IDExMCB9KTtcbiAgICBpZiAobGluZXNNMy5sZW5ndGgpIGdzYXAuc2V0KGxpbmVzTTMsIHsgeVBlcmNlbnQ6IDExMCB9KTtcblxuICAgIGlmIChsMSkgZ3NhcC5zZXQobDEsIHsgc2NhbGVYOiAwLCB0cmFuc2Zvcm1PcmlnaW46IFwibGVmdCBjZW50ZXJcIiB9KTtcbiAgICBpZiAobDIpIGdzYXAuc2V0KGwyLCB7IHNjYWxlWDogMCwgdHJhbnNmb3JtT3JpZ2luOiBcImxlZnQgY2VudGVyXCIgfSk7XG4gICAgaWYgKGwzKSBnc2FwLnNldChsMywgeyBzY2FsZVg6IDAsIHRyYW5zZm9ybU9yaWdpbjogXCJsZWZ0IGNlbnRlclwiIH0pO1xuXG4gICAgaWYgKG1TdGF0MikgZ3NhcC5zZXQobVN0YXQyLCB7IGF1dG9BbHBoYTogMCB9KTtcbiAgICBpZiAobVN0YXQzKSBnc2FwLnNldChtU3RhdDMsIHsgYXV0b0FscGhhOiAwIH0pO1xuXG4gICAgdGxcbiAgICAgIC50byhoZWFkZXIsIHsgb3BhY2l0eTogMCwgZHVyYXRpb246IDEuNSwgZWFzZTogXCJwb3dlcjEub3V0XCIgfSwgMClcbiAgICAgIC50byhiZ0dyYWRpZW50LCB7IG9wYWNpdHk6IDEsIGR1cmF0aW9uOiAxLjIsIGVhc2U6IFwicG93ZXIyLm91dFwiIH0sIDEuNSlcbiAgICAgIC50byhsaW5lc1doYXRXZURvLCB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogMS4yLCBzdGFnZ2VyOiAwLjA2LCBlYXNlOiBcInBvd2VyMi5vdXRcIiB9LCAxLjUpXG4gICAgICAudG8obDEsIHsgc2NhbGVYOiAxLCBkdXJhdGlvbjogMS4yLCBlYXNlOiBcInBvd2VyMi5vdXRcIiB9LCAxLjcpXG4gICAgICAudG8obGluZXNNMSwgeyB5UGVyY2VudDogMCwgZHVyYXRpb246IDEuMiwgc3RhZ2dlcjogMC4wNiwgZWFzZTogXCJwb3dlcjIub3V0XCIgfSwgMS44KVxuICAgICAgLnRvKG1TdGF0MSwgeyBhdXRvQWxwaGE6IDAsIGR1cmF0aW9uOiAwLjUgfSwgMy44KVxuICAgICAgLnRvKG1TdGF0MiwgeyBhdXRvQWxwaGE6IDEsIGR1cmF0aW9uOiAwLjUgfSwgMy44KVxuICAgICAgLnRvKGwyLCB7IHNjYWxlWDogMSwgZHVyYXRpb246IDEuMCwgZWFzZTogXCJwb3dlcjIub3V0XCIgfSwgNC4wKVxuICAgICAgLnRvKGxpbmVzTTIsIHsgeVBlcmNlbnQ6IDAsIGR1cmF0aW9uOiAxLjAsIHN0YWdnZXI6IDAuMDYsIGVhc2U6IFwicG93ZXIyLm91dFwiIH0sIDQuMSlcbiAgICAgIC50byhtU3RhdDIsIHsgYXV0b0FscGhhOiAwLCBkdXJhdGlvbjogMC41IH0sIDYuMilcbiAgICAgIC50byhtU3RhdDMsIHsgYXV0b0FscGhhOiAxLCBkdXJhdGlvbjogMC41IH0sIDYuMilcbiAgICAgIC50byhsMywgeyBzY2FsZVg6IDEsIGR1cmF0aW9uOiAxLjAsIGVhc2U6IFwicG93ZXIyLm91dFwiIH0sIDYuNClcbiAgICAgIC50byhsaW5lc00zLCB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogMS4wLCBzdGFnZ2VyOiAwLjA2LCBlYXNlOiBcInBvd2VyMi5vdXRcIiB9LCA2LjUpO1xuXG4gIH0gZWxzZSB7XG4gICAgaWYgKGxpbmVzU3RhdHMxLmxlbmd0aCkgZ3NhcC5zZXQobGluZXNTdGF0czEsIHsgeVBlcmNlbnQ6IDExMCB9KTtcbiAgICBpZiAobGluZXNTdGF0czIubGVuZ3RoKSBnc2FwLnNldChsaW5lc1N0YXRzMiwgeyB5UGVyY2VudDogMTEwIH0pO1xuICAgIGlmIChzdGF0czIpIGdzYXAuc2V0KHN0YXRzMiwgeyBhdXRvQWxwaGE6IDAgfSk7XG5cbiAgICB2YXIgbGluZXMxU2VwYXJhdG9ycyA9IHN0YXRzMSA/IHN0YXRzMS5xdWVyeVNlbGVjdG9yQWxsKFwiLmhvbWUtaG93LWl0LXdvcmtzX3N0YXQtbGluZVwiKSA6IFtdO1xuICAgIHZhciBsaW5lczJTZXBhcmF0b3JzID0gc3RhdHMyID8gc3RhdHMyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuaG9tZS1ob3ctaXQtd29ya3Nfc3RhdC1saW5lXCIpIDogW107XG4gICAgaWYgKGxpbmVzMVNlcGFyYXRvcnMubGVuZ3RoKSBnc2FwLnNldChsaW5lczFTZXBhcmF0b3JzLCB7IHNjYWxlWDogMCwgdHJhbnNmb3JtT3JpZ2luOiBcImxlZnQgY2VudGVyXCIgfSk7XG4gICAgaWYgKGxpbmVzMlNlcGFyYXRvcnMubGVuZ3RoKSBnc2FwLnNldChsaW5lczJTZXBhcmF0b3JzLCB7IHNjYWxlWDogMCwgdHJhbnNmb3JtT3JpZ2luOiBcImxlZnQgY2VudGVyXCIgfSk7XG5cbiAgICB0bFxuICAgICAgLnRvKGxpbmVzV2hhdFdlRG8sIHsgeVBlcmNlbnQ6IDAsIGR1cmF0aW9uOiA2LCBzdGFnZ2VyOiAwLjYsIGVhc2U6IFwiZXhwby5vdXRcIiB9LCAxOClcbiAgICAgIC50byhsaW5lczFTZXBhcmF0b3JzLCB7IHNjYWxlWDogMSwgZHVyYXRpb246IDYsIHN0YWdnZXI6IDAuNiwgZWFzZTogXCJwb3dlcjIub3V0XCIgfSwgMjApXG4gICAgICAudG8obGluZXNTdGF0czEsIHsgeVBlcmNlbnQ6IDAsIGR1cmF0aW9uOiA2LCBzdGFnZ2VyOiAwLjYsIGVhc2U6IFwiZXhwby5vdXRcIiB9LCAyMilcbiAgICAgIC50byhzdGF0czEsIHsgYXV0b0FscGhhOiAwLCBkdXJhdGlvbjogMyB9LCAzNClcbiAgICAgIC50byhzdGF0czIsIHsgYXV0b0FscGhhOiAxLCBkdXJhdGlvbjogMyB9LCAzNClcbiAgICAgIC5mcm9tVG8obGluZXMyU2VwYXJhdG9ycywgeyBzY2FsZVg6IDAgfSwgeyBzY2FsZVg6IDEsIGR1cmF0aW9uOiA2LCBzdGFnZ2VyOiAwLjYsIGVhc2U6IFwicG93ZXIyLm91dFwiIH0sIDM2KVxuICAgICAgLmZyb21UbyhsaW5lc1N0YXRzMiwgeyB5UGVyY2VudDogMTEwIH0sIHsgeVBlcmNlbnQ6IDAsIGR1cmF0aW9uOiA2LCBzdGFnZ2VyOiAwLjYsIGVhc2U6IFwiZXhwby5vdXRcIiB9LCAzOClcbiAgICAgIC50byhzdGF0czIsIHsgYXV0b0FscGhhOiAwLCBkdXJhdGlvbjogNCB9LCA2OClcbiAgICAgIC50byhsaW5lc1doYXRXZURvLCB7IHlQZXJjZW50OiAtMTEwLCBkdXJhdGlvbjogNCB9LCA2OCk7XG5cbiAgICBpZiAoYWlCYWRnZSkgdGwudG8oYWlCYWRnZSwgeyBhdXRvQWxwaGE6IDAsIGR1cmF0aW9uOiA0LCBlYXNlOiBcInBvd2VyMS5pbk91dFwiIH0sIDY4KTtcbiAgfVxufVxuXG5cbi8vID4gUGFydG5lcnNoaXAgLSBzdGVwIGxpc3QgaW4gdGhlIEhvdyBpdCBXb3JrcyBzZWN0aW9uIChpbnN0ZWFkIG9mIHN0YXRzKVxuLy8gQnVpbGRzIGFuZCByZXR1cm5zIGEgUEFVU0VEIHRpbWVsaW5lIHdpdGggbm9ybWFsaXNlZCB0aW1lOyBpdCBpcyBkcml2ZW4gYnlcbi8vIC5wcm9ncmVzcygpIGZyb20gdGhlIHZpZGVvIGxvb3AgcGhhc2UgKHJlbmRlclN0ZXBzIGluIGluaXRWaWRlb1NjcnViKSwgc28gdGhlXG4vLyBzdGVwcyBmb2xsb3cgdGhlIHJlYWwgY2xpcCBkdXJhdGlvbiByYXRoZXIgdGhhbiB0aW1lbGluZSB1bml0cy5cbi8vXG4vLyBUaW1lIHNjYWxlIGhlcmU6IE9ORSBVTklUID0gT05FIFNURVAsIHNvIHRocmVlIHN0ZXBzIG1ha2UgYSAzLXVuaXQgdGltZWxpbmUuXG4vLyBTdGVwcyAxLzIvMyBzdGFydCBhdCAwLzEvMiBhbmQsIHNpbmNlIC5wcm9ncmVzcygpIGlzIG5vcm1hbGlzZWQsIHNwcmVhZCBldmVubHlcbi8vIGFjcm9zcyBhbGwgbG9vcHMuXG4vL1xuLy8gVmlzdWFsbHkgdGhlIHNhbWUgbWVjaGFuaXNtIGFzIHRoZSBIb21lIHN0YXRzOiBncm93aW5nIGxpbmVzIChzY2FsZVggMC0+MSB3aXRoXG4vLyBhIHN0YWdnZXIpICsgdGV4dCByaXNpbmcgZnJvbSBiZWxvdyAoU3BsaXRUZXh0IGxpbmVzL21hc2ssIHlQZXJjZW50IDExMC0+MCkuXG4vLyBUaGUgYWN0aXZlIHN0ZXAgaGFzIGl0cyBzdWItbGlzdCBleHBhbmRlZCAoaGVpZ2h0IDAgLT4gYXV0bykgYW5kIGl0cyBoZWFkIGF0XG4vLyBvcGFjaXR5IDE7IHRoZSBvdGhlcnMgYXJlIGNvbGxhcHNlZCB3aXRoIHRoZSBoZWFkIGF0IG9wYWNpdHkgLjMuXG4vLyBOb3RoaW5nIGhpZGVzIGF0IHRoZSBlbmQgLSB0aGUgbGFzdCBzdGVwIHN0YXlzIHZpc2libGUuXG5mdW5jdGlvbiBidWlsZFBhcnRuZXJzaGlwU3RlcHNUaW1lbGluZSh0cmFjaywgaXNNb2JpbGUpIHtcbiAgdmFyIHdyYXAgPSB0cmFjay5xdWVyeVNlbGVjdG9yKFwiLnBhcnRuZXJzaGlwLXByb2Nlc3Nfc3RlcHNcIik7XG4gIGlmICghd3JhcCB8fCAhd2luZG93LmdzYXApIHJldHVybiBudWxsO1xuXG4gIHZhciBzdGVwcyA9IFtdLnNsaWNlLmNhbGwod3JhcC5xdWVyeVNlbGVjdG9yQWxsKFwiLnBhcnRuZXJzaGlwLXByb2Nlc3Nfc3RlcFwiKSk7XG4gIGlmICghc3RlcHMubGVuZ3RoKSByZXR1cm4gbnVsbDtcblxuICB2YXIgU1BBTiA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgLy8gamVkbmEgamVkbm9zdGthID0gamVkZW4ga3Jva1xuICB2YXIgVE9UQUwgPSBzdGVwcy5sZW5ndGggKiBTUEFOO1xuICB2YXIgUkVWRUFMID0gMC4zOyAgICAgICAgICAgICAgICAgICAgLy8gd2phemQgbGluaWkgaSB0eXR1bG93XG4gIHZhciBPUEVOID0gMC4yMjsgICAgICAgICAgICAgICAgICAgICAvLyByb3p3aWphbmllIC8gendpamFuaWUgcG9kLXB1bmt0b3dcbiAgdmFyIFNUQUdHRVIgPSBpc01vYmlsZSA/IDAuMDMgOiAwLjA2O1xuICB2YXIgRUFTRSA9IGlzTW9iaWxlID8gXCJwb3dlcjIub3V0XCIgOiBcImV4cG8ub3V0XCI7XG5cbiAgLy8gLS0tIEV5ZWJyb3cgXCJwYXJ0bmVyc2hpcFwiICguaHdrX3N0YXRzLXRpdGxlKSBuYWQgbGlzdGEga3Jva293IC0tLS0tLS0tLS1cbiAgLy8gVHJha3Rvd2FueSBqYWsgWkVST1dZIGVsZW1lbnQgbGlzdHk6IHdjaG9kemkgcGllcndzenksIGEgZGl2aWRlcnkgL1xuICAvLyBudW1lcnkgLyB0eXR1bHkga3Jva293IHJ1c3phamEgbyBqZWRlbiBrcm9rIHN0YWdnZXJhIHBvem5pZWouIEN6eWxpXG4gIC8vIGtvbGVqbm9zYyB0bzogcGFydG5lcnNoaXAgLT4ga3JvayAxIC0+IGtyb2sgMiAtPiBrcm9rIDMsIHcgdHltIHNhbXltXG4gIC8vIHJ5dG1pZSBjbyBkb3RhZC4gRWxlbWVudCBqZXN0IE9QQ0pPTkFMTlkgLSBiZXogbmllZ28gd3N6eXN0a28gZHppYWxhXG4gIC8vIGRva2xhZG5pZSB0YWsgamFrIHdjemVzbmllaiAoRVlFX1NISUZUID0gMCkuXG4gIC8vXG4gIC8vIFdFQkZMT1cgLSBXQVJVTkVLIEtPTklFQ1pOWTogeiB0ZWogaW5zdGFuY2ppIG11c2kgYnljIFpESkVUWSBhdHJ5YnV0XG4gIC8vIGRhdGEtc3BsaXQ9XCJoZWFkaW5nXCIgKHogLmV5ZWJyb3dfZG90IE9SQVogeiAuZXllYnJvd190ZXh0KS4gR2xvYmFsbnlcbiAgLy8gaW5pdFNjcm9sbFJldmVhbCBsYXBpZSBrYXpkeSBbZGF0YS1zcGxpdD1cImhlYWRpbmdcIl0gbmEgc3Ryb25pZSwgcm96YmlqYVxuICAvLyBnbyB3bGFzbnltIFNwbGl0VGV4dCBpIG9kcGFsYSBuYSB3bGFzbnltIFNjcm9sbFRyaWdnZXJ6ZSAoXCJ0b3AgODAlXCIsXG4gIC8vIG9uY2UpIC0gdyBwcnp5cGlldGVqIHNla2NqaSB6bmFjenkgdG8gXCJvZCByYXp1IG5hIHdlanNjaXVcIiwgbmllemFsZXpuaWVcbiAgLy8gb2QgdGVqIHNla3dlbmNqaS4gWm9zdGF3aW9ueSBhdHJ5YnV0ID0gbmFnbG93ZWsgcG9qYXdpYSBzaWUgemEgd2N6ZXNuaWVcbiAgLy8gaSBwb2R3b2puaWUgcm96Yml0eSB0ZWtzdC5cbiAgdmFyIGV5ZWJyb3dSb290ID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIi5od2tfc3RhdHMtdGl0bGVcIik7XG4gIHZhciBleWVicm93RG90ID0gZXllYnJvd1Jvb3QgPyBleWVicm93Um9vdC5xdWVyeVNlbGVjdG9yKFwiLmV5ZWJyb3dfZG90XCIpIDogbnVsbDtcbiAgdmFyIGV5ZWJyb3dUZXh0RWwgPSBleWVicm93Um9vdCA/IGV5ZWJyb3dSb290LnF1ZXJ5U2VsZWN0b3IoXCIuZXllYnJvd190ZXh0XCIpIDogbnVsbDtcbiAgLy8gTGluaWEgcm9zbmFjYSBvZCBsZXdlaiBwcnp5IGV5ZWJyb3cuIFcgbWFya3VwaWUgamVkemllIG5hIHRlaiBzYW1laiBrbGFzaWVcbiAgLy8gY28gYnJhY2tldHkgcG9kLXB1bmt0b3cgKC5wYXJ0bmVyc2hpcC1wcm9jZXNzX3N1Yi1icmFja2V0KSAtIHN6dWthbXkgamVqXG4gIC8vIHR5bGtvIFdFV05BVFJaIC5od2tfc3RhdHMtdGl0bGUsIHplYnkgbmllIHpsYXBhYyBicmFja2V0b3cgeiBrcm9rb3cgKHRlXG4gIC8vIG1hamEgd2xhc25lIHR3ZWVueSwgcGVyIGtyb2spLlxuICB2YXIgZXllYnJvd0RpdmlkZXIgPSBleWVicm93Um9vdFxuICAgID8gZXllYnJvd1Jvb3QucXVlcnlTZWxlY3RvcihcIi5wYXJ0bmVyc2hpcC1wcm9jZXNzX3N1Yi1icmFja2V0LCAucGFydG5lcnNoaXAtcHJvY2Vzc19zdGVwLWRpdmlkZXIsIC5od2tfc3RhdHMtZGl2aWRlclwiKVxuICAgIDogbnVsbDtcbiAgdmFyIGV5ZWJyb3dMaW5lcyA9IFtdO1xuXG4gIHZhciBkYXRhID0gW107XG4gIHN0ZXBzLmZvckVhY2goZnVuY3Rpb24gKHN0ZXApIHtcbiAgICBkYXRhLnB1c2goe1xuICAgICAgc3RlcDogc3RlcCxcbiAgICAgIGRpdmlkZXI6IHN0ZXAucXVlcnlTZWxlY3RvcihcIi5wYXJ0bmVyc2hpcC1wcm9jZXNzX3N0ZXAtZGl2aWRlclwiKSxcbiAgICAgIGhlYWQ6IHN0ZXAucXVlcnlTZWxlY3RvcihcIi5wYXJ0bmVyc2hpcC1wcm9jZXNzX3N0ZXAtaGVhZFwiKSxcbiAgICAgIGJhZGdlOiBzdGVwLnF1ZXJ5U2VsZWN0b3IoXCIucGFydG5lcnNoaXAtcHJvY2Vzc19udW1iZXJcIiksXG4gICAgICBsaXN0OiBzdGVwLnF1ZXJ5U2VsZWN0b3IoXCIucGFydG5lcnNoaXAtcHJvY2Vzc19zdWItbGlzdFwiKSxcbiAgICAgIGJyYWNrZXRzOiBzdGVwLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGFydG5lcnNoaXAtcHJvY2Vzc19zdWItYnJhY2tldFwiKSxcbiAgICAgIHRpdGxlTGluZXM6IFtdLFxuICAgICAgc3ViTGluZXM6IFtdXG4gICAgfSk7XG4gIH0pO1xuXG4gIC8vIFNwbGl0VGV4dCBwbyBLTEFTQUNILCBuaWUgcG8gW2RhdGEtaGl3LXNwbGl0XSAtIGF0cnlidXR5IGdpbmEgcHJ6eVxuICAvLyBpbXBvcmNpZSBcIkh0bWwgdG8gV2ViZmxvd1wiIChvZHluLWludGVncmF0aW9uLXJ1bGVzLm1kIHBrdCA2KS5cbiAgaWYgKHdpbmRvdy5TcGxpdFRleHQpIHtcbiAgICBpZiAoZXllYnJvd1RleHRFbCkge1xuICAgICAgZ3NhcC5zZXQoZXllYnJvd1RleHRFbCwgeyBhdXRvQWxwaGE6IDEgfSk7XG4gICAgICBleWVicm93TGluZXMgPSBTcGxpdFRleHQuY3JlYXRlKGV5ZWJyb3dUZXh0RWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSkubGluZXM7XG4gICAgfVxuXG4gICAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChkKSB7XG4gICAgICB2YXIgdGl0bGUgPSBkLnN0ZXAucXVlcnlTZWxlY3RvcihcIi5wYXJ0bmVyc2hpcC1wcm9jZXNzX3N0ZXAtdGl0bGVcIik7XG4gICAgICBpZiAodGl0bGUpIHtcbiAgICAgICAgZ3NhcC5zZXQodGl0bGUsIHsgYXV0b0FscGhhOiAxIH0pO1xuICAgICAgICBkLnRpdGxlTGluZXMgPSBTcGxpdFRleHQuY3JlYXRlKHRpdGxlLCB7IHR5cGU6IFwibGluZXNcIiwgbWFzazogXCJsaW5lc1wiIH0pLmxpbmVzO1xuICAgICAgfVxuICAgICAgZC5zdGVwLnF1ZXJ5U2VsZWN0b3JBbGwoXCIucGFydG5lcnNoaXAtcHJvY2Vzc19zdWItaW5kZXgsIC5wYXJ0bmVyc2hpcC1wcm9jZXNzX3N1Yi10ZXh0XCIpLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIGdzYXAuc2V0KGVsLCB7IGF1dG9BbHBoYTogMSB9KTtcbiAgICAgICAgZC5zdWJMaW5lcyA9IGQuc3ViTGluZXMuY29uY2F0KFNwbGl0VGV4dC5jcmVhdGUoZWwsIHsgdHlwZTogXCJsaW5lc1wiLCBtYXNrOiBcImxpbmVzXCIgfSkubGluZXMpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvLyBTdGFuIHN0YXJ0b3d5OiB3c3p5c3RrbyBzY2hvd2FuZSwgd3N6eXN0a2llIGtyb2tpIHp3aW5pZXRlLlxuICBpZiAoZXllYnJvd1Jvb3QpIGdzYXAuc2V0KGV5ZWJyb3dSb290LCB7IGF1dG9BbHBoYTogMSB9KTtcbiAgaWYgKGV5ZWJyb3dEaXZpZGVyKSBnc2FwLnNldChleWVicm93RGl2aWRlciwgeyBzY2FsZVg6IDAsIHRyYW5zZm9ybU9yaWdpbjogXCJsZWZ0IGNlbnRlclwiIH0pO1xuICBpZiAoZXllYnJvd0RvdCkgZ3NhcC5zZXQoZXllYnJvd0RvdCwgeyBhdXRvQWxwaGE6IDAsIHNjYWxlOiAwLCB0cmFuc2Zvcm1PcmlnaW46IFwiNTAlIDUwJVwiIH0pO1xuICBpZiAoZXllYnJvd0xpbmVzLmxlbmd0aCkgZ3NhcC5zZXQoZXllYnJvd0xpbmVzLCB7IHlQZXJjZW50OiAxMTAgfSk7XG5cbiAgdmFyIGFsbERpdmlkZXJzID0gW10sIGFsbEJhZGdlcyA9IFtdLCBhbGxUaXRsZUxpbmVzID0gW107XG4gIGRhdGEuZm9yRWFjaChmdW5jdGlvbiAoZCkge1xuICAgIGlmIChkLmRpdmlkZXIpIHsgZ3NhcC5zZXQoZC5kaXZpZGVyLCB7IHNjYWxlWDogMCwgdHJhbnNmb3JtT3JpZ2luOiBcImxlZnQgY2VudGVyXCIgfSk7IGFsbERpdmlkZXJzLnB1c2goZC5kaXZpZGVyKTsgfVxuICAgIGlmIChkLmJyYWNrZXRzLmxlbmd0aCkgZ3NhcC5zZXQoZC5icmFja2V0cywgeyBzY2FsZVg6IDAsIHRyYW5zZm9ybU9yaWdpbjogXCJsZWZ0IGNlbnRlclwiIH0pO1xuICAgIGlmIChkLmJhZGdlKSB7IGdzYXAuc2V0KGQuYmFkZ2UsIHsgYXV0b0FscGhhOiAwIH0pOyBhbGxCYWRnZXMucHVzaChkLmJhZGdlKTsgfVxuICAgIGlmIChkLnRpdGxlTGluZXMubGVuZ3RoKSB7IGdzYXAuc2V0KGQudGl0bGVMaW5lcywgeyB5UGVyY2VudDogMTEwIH0pOyBhbGxUaXRsZUxpbmVzID0gYWxsVGl0bGVMaW5lcy5jb25jYXQoZC50aXRsZUxpbmVzKTsgfVxuICAgIGlmIChkLnN1YkxpbmVzLmxlbmd0aCkgZ3NhcC5zZXQoZC5zdWJMaW5lcywgeyB5UGVyY2VudDogMTEwIH0pO1xuICAgIGlmIChkLmhlYWQpIGdzYXAuc2V0KGQuaGVhZCwgeyBvcGFjaXR5OiAwLjMgfSk7XG4gICAgaWYgKGQubGlzdCkgZ3NhcC5zZXQoZC5saXN0LCB7IGhlaWdodDogMCwgYXV0b0FscGhhOiAwLCBvdmVyZmxvdzogXCJoaWRkZW5cIiB9KTtcbiAgICBkLnN0ZXAuY2xhc3NMaXN0LnJlbW92ZShcImlzLWFjdGl2ZVwiKTtcbiAgfSk7XG4gIGdzYXAuc2V0KHdyYXAsIHsgYXV0b0FscGhhOiAxIH0pO1xuXG4gIHZhciBzdGwgPSBnc2FwLnRpbWVsaW5lKHsgcGF1c2VkOiB0cnVlIH0pO1xuXG4gIC8vIExpbmlqa2E6IHB1c3R5IHR3ZWVuIHBpbG51amFjeSwgemVieSB0aW1lbGluZSBtaWFsIERPS0xBRE5JRSBUT1RBTFxuICAvLyBqZWRub3N0ZWsuIEJleiB0ZWdvIGRsdWdvc2MgemFsZXphbGFieSBvZCB0ZWdvLCBnZHppZSBrb25jenkgc2llIG9zdGF0bmlcbiAgLy8gdHdlZW4sIGEgd3RlZHkgLnByb2dyZXNzKCkgbWFwb3dhbG9ieSBzaWUgbmEgaW5ueSBwdW5rdCBuaXogXCJrb25pZWNcbiAgLy8gb3N0YXRuaWVnbyBrcm9rdVwiLlxuICBzdGwudG8oe30sIHsgZHVyYXRpb246IFRPVEFMIH0sIDApO1xuXG4gIC8vIDApIEV5ZWJyb3cgXCJwYXJ0bmVyc2hpcFwiIC0gemVyb3d5IGVsZW1lbnQgbGlzdHkuIEtyb3BrYSB3Y2hvZHppIGphayBudW1lclxuICAvLyAgICBrcm9rdSAoYmFjay5vdXQpLCB0ZWtzdCBqYWsgdHl0dWwga3Jva3UgKGxpbmllIHogZG9sdSkuIENhbGEgcmVzenRhXG4gIC8vICAgIGxpc3R5IGplc3QgcHJ6ZXN1bmlldGEgbyBFWUVfU0hJRlQsIHplYnkgcnl0bSBzdGFnZ2VyYSBieWwgamVkZW4uXG4gIHZhciBFWUVfU0hJRlQgPSBleWVicm93Um9vdCA/IFNUQUdHRVIgOiAwO1xuICBpZiAoZXllYnJvd0RpdmlkZXIpIHN0bC50byhleWVicm93RGl2aWRlciwgeyBzY2FsZVg6IDEsIGR1cmF0aW9uOiBSRVZFQUwsIGVhc2U6IFwicG93ZXIyLm91dFwiIH0sIDApO1xuICBpZiAoZXllYnJvd0RvdCkgc3RsLnRvKGV5ZWJyb3dEb3QsIHsgYXV0b0FscGhhOiAxLCBzY2FsZTogMSwgZHVyYXRpb246IFJFVkVBTCAqIDAuNiwgZWFzZTogXCJiYWNrLm91dCgyKVwiIH0sIFJFVkVBTCAqIDAuMik7XG4gIGlmIChleWVicm93TGluZXMubGVuZ3RoKSBzdGwudG8oZXllYnJvd0xpbmVzLCB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogUkVWRUFMLCBzdGFnZ2VyOiBTVEFHR0VSLCBlYXNlOiBFQVNFIH0sIFJFVkVBTCAqIDAuMik7XG5cbiAgLy8gMSkgV2phemQgY2FsZWogbGlzdHkgLSBkb2tsYWRuaWUgdyBtb21lbmNpZSwgdyBrdG9yeW0gc3RhcnR1amUgMS4gbG9vcCxcbiAgLy8gICAgcHJ6ZXN1bmlldHkgbyBqZWRlbiBrcm9rIHN0YWdnZXJhIHd6Z2xlZGVtIGV5ZWJyb3cuXG4gIGlmIChhbGxEaXZpZGVycy5sZW5ndGgpIHN0bC50byhhbGxEaXZpZGVycywgeyBzY2FsZVg6IDEsIGR1cmF0aW9uOiBSRVZFQUwsIHN0YWdnZXI6IFNUQUdHRVIsIGVhc2U6IFwicG93ZXIyLm91dFwiIH0sIEVZRV9TSElGVCk7XG4gIGlmIChhbGxCYWRnZXMubGVuZ3RoKSBzdGwudG8oYWxsQmFkZ2VzLCB7IGF1dG9BbHBoYTogMSwgZHVyYXRpb246IFJFVkVBTCAqIDAuNiwgc3RhZ2dlcjogU1RBR0dFUiwgZWFzZTogXCJwb3dlcjEub3V0XCIgfSwgRVlFX1NISUZUICsgUkVWRUFMICogMC4yKTtcbiAgaWYgKGFsbFRpdGxlTGluZXMubGVuZ3RoKSBzdGwudG8oYWxsVGl0bGVMaW5lcywgeyB5UGVyY2VudDogMCwgZHVyYXRpb246IFJFVkVBTCwgc3RhZ2dlcjogU1RBR0dFUiwgZWFzZTogRUFTRSB9LCBFWUVfU0hJRlQgKyBSRVZFQUwgKiAwLjIpO1xuXG4gIC8vIDIpIEtyb2tpOiBha3R5d255IHNpZSByb3p3aWphLCBwb3ByemVkbmkgendpamEgKGhlaWdodCBhdXRvIDwtPiAwKS5cbiAgZGF0YS5mb3JFYWNoKGZ1bmN0aW9uIChkLCBpKSB7XG4gICAgLy8ga3JvayAxIHN0YXJ0dWplIGNod2lsZSBwbyB3amV6ZHppZSBsaW5paSwga29sZWpuZSByb3dubyBuYSBzd29qZWogamVkbm9zdGNlXG4gICAgdmFyIGF0ID0gaSA9PT0gMCA/IEVZRV9TSElGVCArIFJFVkVBTCAqIDAuNSA6IGkgKiBTUEFOO1xuXG4gICAgaWYgKGQuaGVhZCkgc3RsLnRvKGQuaGVhZCwgeyBvcGFjaXR5OiAxLCBkdXJhdGlvbjogT1BFTiwgZWFzZTogXCJwb3dlcjIub3V0XCIgfSwgYXQpO1xuICAgIC8vIGhlaWdodDogXCJhdXRvXCIgamVzdCBsaWN6b25lIHByemV6IEdTQVAgcHJ6eSBwaWVyd3N6eW0gcmVuZGVyemUgdHdlZW5hLlxuICAgIC8vIE5hIHJlc2l6ZSBva25hIHdhcnRvc2MgTklFIGplc3QgcHJ6ZWxpY3phbmEgLSBsYXlvdXQgamVkemllIG5hIGZsdWlkIHJlbSxcbiAgICAvLyB3aWVjIHcgcHJha3R5Y2Ugd2lkYWMgdG8gdHlsa28gcHJ6eSByZWN6bnltIHptaWVuaWFuaXUgc3plcm9rb3NjaSBva25hXG4gICAgLy8gdyB0cmFrY2llIHNla2NqaS5cbiAgICBpZiAoZC5saXN0KSBzdGwudG8oZC5saXN0LCB7IGhlaWdodDogXCJhdXRvXCIsIGF1dG9BbHBoYTogMSwgZHVyYXRpb246IE9QRU4sIGVhc2U6IFwicG93ZXIyLmluT3V0XCIgfSwgYXQpO1xuICAgIGlmIChkLmJyYWNrZXRzLmxlbmd0aCkgc3RsLnRvKGQuYnJhY2tldHMsIHsgc2NhbGVYOiAxLCBkdXJhdGlvbjogT1BFTiwgc3RhZ2dlcjogU1RBR0dFUiwgZWFzZTogXCJwb3dlcjIub3V0XCIgfSwgYXQgKyBPUEVOICogMC40KTtcbiAgICBpZiAoZC5zdWJMaW5lcy5sZW5ndGgpIHN0bC50byhkLnN1YkxpbmVzLCB7IHlQZXJjZW50OiAwLCBkdXJhdGlvbjogUkVWRUFMLCBzdGFnZ2VyOiBTVEFHR0VSLCBlYXNlOiBFQVNFIH0sIGF0ICsgT1BFTiAqIDAuNik7XG5cbiAgICAvLyB6YW1rbmllY2llIHRlZ28ga3Jva3UgZG9rbGFkbmllIHd0ZWR5LCBnZHkgb3R3aWVyYSBzaWUgbmFzdGVwbnlcbiAgICBpZiAoaSA8IGRhdGEubGVuZ3RoIC0gMSkge1xuICAgICAgdmFyIG9mZiA9IChpICsgMSkgKiBTUEFOO1xuICAgICAgaWYgKGQuc3ViTGluZXMubGVuZ3RoKSBzdGwudG8oZC5zdWJMaW5lcywgeyB5UGVyY2VudDogLTExMCwgZHVyYXRpb246IE9QRU4sIHN0YWdnZXI6IFNUQUdHRVIgKiAwLjUsIGVhc2U6IFwicG93ZXIyLmluXCIgfSwgb2ZmIC0gT1BFTik7XG4gICAgICBpZiAoZC5saXN0KSBzdGwudG8oZC5saXN0LCB7IGhlaWdodDogMCwgYXV0b0FscGhhOiAwLCBkdXJhdGlvbjogT1BFTiwgZWFzZTogXCJwb3dlcjIuaW5PdXRcIiB9LCBvZmYgLSBPUEVOICogMC41KTtcbiAgICAgIGlmIChkLmhlYWQpIHN0bC50byhkLmhlYWQsIHsgb3BhY2l0eTogMC4zLCBkdXJhdGlvbjogT1BFTiwgZWFzZTogXCJwb3dlcjIub3V0XCIgfSwgb2ZmIC0gT1BFTiAqIDAuNSk7XG4gICAgICBpZiAoZC5icmFja2V0cy5sZW5ndGgpIHN0bC50byhkLmJyYWNrZXRzLCB7IHNjYWxlWDogMCwgZHVyYXRpb246IE9QRU4sIGVhc2U6IFwicG93ZXIyLmluXCIgfSwgb2ZmIC0gT1BFTiAqIDAuNSk7XG4gICAgfVxuICB9KTtcblxuICBzdGwucHJvZ3Jlc3MoMCk7XG4gIHJldHVybiBzdGw7XG59XG5cblxuZnVuY3Rpb24gaW5pdEN1c3RvbU92ZXJsYXlSZXZlYWwoKSB7XG4gIGNvbnN0IHRyaWdnZXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtb3ZlcmxheS10cmlnZ2VyXScpO1xuXG4gIGlmICghdHJpZ2dlcnMubGVuZ3RoIHx8ICF3aW5kb3cuZ3NhcCB8fCAhd2luZG93LlNjcm9sbFRyaWdnZXIpIHJldHVybjtcblxuICB0cmlnZ2Vycy5mb3JFYWNoKCh0cmlnZ2VyKSA9PiB7XG4gICAgLy8gVGFyZ2V0IHNlbGVjdG9yIGNvbWVzIGZyb20gdGhlIGRlZGljYXRlZCAnZGF0YS1vdmVybGF5LXRhcmdldCcgYXR0cmlidXRlXG4gICAgY29uc3QgdGFyZ2V0U2VsZWN0b3IgPSB0cmlnZ2VyLmdldEF0dHJpYnV0ZSgnZGF0YS1vdmVybGF5LXRhcmdldCcpO1xuXG4gICAgaWYgKCF0YXJnZXRTZWxlY3RvcikgcmV0dXJuO1xuXG4gICAgY29uc3Qgb3ZlcmxheSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0U2VsZWN0b3IpO1xuICAgIGlmICghb3ZlcmxheSkgcmV0dXJuO1xuXG4gICAgZ3NhcC5zZXQob3ZlcmxheSwgeyBvcGFjaXR5OiAwIH0pO1xuXG4gICAgZ3NhcC50byhvdmVybGF5LCB7XG4gICAgICBvcGFjaXR5OiAxLFxuICAgICAgZWFzZTogXCJwb3dlcjIub3V0XCIsXG4gICAgICBzY3JvbGxUcmlnZ2VyOiB7XG4gICAgICAgIHRyaWdnZXI6IHRyaWdnZXIsXG4gICAgICAgIHN0YXJ0OiBcInRvcCBib3R0b21cIixcbiAgICAgICAgZW5kOiBcInRvcCB0b3BcIixcbiAgICAgICAgc2NydWI6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbi8vIC0tLSBHRVQgSU4gVE9VQ0ggTU9EQUwgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vID4gR2xvYmFsIC0gXCJHZXQgaW4gVG91Y2hcIiBtb2RhbDogW21vZGFsLWdldC1pbi10b3VjaC1vcGVuXSBvcGVucywgLm1vZGFsX2Nsb3NlLWJ0blxuLy8gICBjbG9zZXMsIC5tb2RhbF91bmljb3JuIGluc2lkZSBmYWRlcy9zY2FsZXMgaW4gYW5kIG91dCwgc2Nyb2xsIGxvY2sgdmlhIExlbmlzXG5sZXQgZ2V0SW5Ub3VjaE1vZGFsQ2xlYW51cCA9IG51bGw7XG5mdW5jdGlvbiBpbml0R2V0SW5Ub3VjaE1vZGFsKCkge1xuICBjb25zdCBtb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5tb2RhbF9jb21wb25lbnQnKTtcbiAgaWYgKCFtb2RhbCB8fCAhd2luZG93LmdzYXApIHJldHVybjtcbiAgbW9kYWwuc2V0QXR0cmlidXRlKCdkYXRhLWxlbmlzLXByZXZlbnQnLCAnJyk7IC8vIHNjcm9sbGluZyBvdmVyIHRoZSBtb2RhbCBzdGF5cyBpbiB0aGUgbW9kYWxcbiAgaWYgKGdldEluVG91Y2hNb2RhbENsZWFudXApIGdldEluVG91Y2hNb2RhbENsZWFudXAoKTsgLy8gZG9jdW1lbnQgbGlzdGVuZXJzIC0gQmFyYmEgd29uJ3QgY2xlYW4gdGhlbSB1cFxuXG4gIGNvbnN0IHBhbmVsID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsX3BhbmVsJykgfHwgbW9kYWw7IC8vIGZhbGxzIGJhY2sgd2hpbGUgV2ViZmxvdyBjYXRjaGVzIHVwXG4gIGNvbnN0IG92ZXJsYXkgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfb3ZlcmxheScpO1xuICBjb25zdCB1bmljb3JuID0gbW9kYWwucXVlcnlTZWxlY3RvcignLm1vZGFsX3VuaWNvcm4nKTtcbiAgY29uc3QgcmlnaHQgPSBtb2RhbC5xdWVyeVNlbGVjdG9yKCcubW9kYWxfcmlnaHQnKTsgLy8gcGFyYWxsYXggbGF5ZXIgLSB0cmF2ZWxzIGZ1cnRoZXIsIGxhbmRzIGxhdGVyXG4gIGNvbnN0IE9QRU4gPSAnaXMtb3Blbic7XG5cbiAgY29uc3QgUklHSFRfRlJPTSA9ICcyNXZoJzsgLy8gZXh0cmEgdHJhdmVsIG9uIHRvcCBvZiB0aGUgcGFuZWwncyBvd24gMTAwdmhcbiAgY29uc3QgUklHSFRfTEFHID0gMC4yNTsgICAgLy8gc2Vjb25kcyBpdCBzZXR0bGVzIGFmdGVyIHRoZSBwYW5lbFxuXG4gIC8vIFNhbWUgY3VydmUgYW5kIHRpbWluZyBhcyB0aGUgQmFyYmEgcGFnZSB0cmFuc2l0aW9uLCBzbyB0aGUgbW9kYWwgcmVhZHMgYXMgdGhlIHNhbWUgZ2VzdHVyZS5cbiAgLy8gUmUtY3JlYXRlZCBoZXJlIGJlY2F1c2UgdGhlIHBhZ2UgdHJhbnNpdGlvbiByZWdpc3RlcnMgaXQgaW5zaWRlIHJ1blBhZ2VMZWF2ZUFuaW1hdGlvbixcbiAgLy8gd2hpY2ggaGFzIG5vdCBydW4geWV0IG9uIGEgaGFyZCBsb2FkIC0gdGhlIG1vZGFsIGNhbiBvcGVuIGJlZm9yZSBhbnkgbmF2aWdhdGlvbi5cbiAgaWYgKHdpbmRvdy5DdXN0b21FYXNlKSBDdXN0b21FYXNlLmNyZWF0ZSgncGFyYWxsYXgnLCAnMC43LCAwLjA1LCAwLjEzLCAxJyk7XG4gIGNvbnN0IEVBU0UgPSB3aW5kb3cuQ3VzdG9tRWFzZSA/ICdwYXJhbGxheCcgOiAncG93ZXIzLmluT3V0JztcbiAgY29uc3QgRFVSID0gMS4yO1xuICBjb25zdCByZWR1Y2VkID0gdHlwZW9mIHJlZHVjZWRNb3Rpb24gIT09ICd1bmRlZmluZWQnICYmIHJlZHVjZWRNb3Rpb247XG5cbiAgbGV0IHRsID0gbnVsbDsgICAgICAgICAgIC8vIG9uZSB0aW1lbGluZSBvd25zIG9wZW4gYW5kIGNsb3NlLCBzbyB0aGV5IGludGVycnVwdCBlYWNoIG90aGVyIGNsZWFubHlcbiAgbGV0IHVuaWNvcm5Ud2VlbiA9IG51bGw7XG4gIGxldCB1bmljb3JuUmVhZHkgPSBudWxsOyAvLyBwcm9taXNlIC0gc2V0dGxlcyB3aGVuIHRoZSBzY2VuZSBoYXMgYSByZWFsLCBwYWludGVkIGNhbnZhc1xuICBsZXQgb3BlblNlcSA9IDA7ICAgICAgICAgLy8gZHJvcHMgYSBwZW5kaW5nIHVuaWNvcm4gcmV2ZWFsIGlmIHRoZSBtb2RhbCBjbG9zZWQgd2hpbGUgd2Ugd2FpdGVkXG5cbiAgZnVuY3Rpb24gc2NlbmVJc0xpdmUoKSB7XG4gICAgY29uc3QgY3YgPSB1bmljb3JuICYmIHVuaWNvcm4ucXVlcnlTZWxlY3RvcignY2FudmFzJyk7XG4gICAgcmV0dXJuICEhY3YgJiYgY3Yud2lkdGggPiAxICYmIGN2LmhlaWdodCA+IDE7XG4gIH1cblxuICAvLyBVbmljb3JuIHNpemVzIGl0cyBjYW52YXMgYXQgaW5pdCAtIGFuZCAubW9kYWxfY29tcG9uZW50IGlzIGRpc3BsYXk6bm9uZSB0aGVuLCBzbyB0aGVcbiAgLy8gc2NlbmUgbGFuZHMgaW4gYSAxeDEgY2FudmFzIGFuZCBzdGF5cyBibGFuay4gUmVidWlsZCBpdCB0aGUgZmlyc3QgdGltZSB0aGUgbW9kYWwgaXNcbiAgLy8gdmlzaWJsZTsgaW5pdCgpIHNraXBzIGV2ZXJ5IG5vZGUgc3RpbGwgZmxhZ2dlZCBkYXRhLXVzLWluaXRpYWxpemVkLCBzbyBvbmx5IG91cnMgZ29lcy5cbiAgZnVuY3Rpb24gZW5zdXJlTW9kYWxVbmljb3JuKCkge1xuICAgIGlmICh1bmljb3JuUmVhZHkpIHJldHVybiB1bmljb3JuUmVhZHk7XG4gICAgY29uc3QgaG9zdCA9IG1vZGFsLnF1ZXJ5U2VsZWN0b3IoJ1tkYXRhLXVzLXByb2plY3RdLFtkYXRhLXVzLXByb2plY3Qtc3JjXScpO1xuICAgIGlmICghaG9zdCB8fCB0eXBlb2YgVW5pY29yblN0dWRpbyA9PT0gJ3VuZGVmaW5lZCcpIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICBjb25zdCByID0gaG9zdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBpZiAoIXIud2lkdGggfHwgIXIuaGVpZ2h0KSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7IC8vIG5vdCBsYWlkIG91dCB5ZXQgLSByZXRyeSBvbiBuZXh0IG9wZW5cbiAgICBpZiAoc2NlbmVJc0xpdmUoKSkgcmV0dXJuICh1bmljb3JuUmVhZHkgPSBQcm9taXNlLnJlc29sdmUoKSk7XG4gICAgY29uc3QgY3YgPSBob3N0LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpO1xuICAgIGlmIChjdikgY3YucmVtb3ZlKCk7XG4gICAgaG9zdC5yZW1vdmVBdHRyaWJ1dGUoJ2RhdGEtdXMtaW5pdGlhbGl6ZWQnKTtcbiAgICB1bmljb3JuUmVhZHkgPSBVbmljb3JuU3R1ZGlvLmluaXQoKS50aGVuKHdhaXRGb3JQYWludCkuY2F0Y2goY29uc29sZS5lcnJvcik7XG4gICAgcmV0dXJuIHVuaWNvcm5SZWFkeTtcbiAgfVxuXG4gIC8vIGluaXQoKSByZXNvbHZlcyB3aGVuIHRoZSBzY2VuZSBpcyBidWlsdCwgbm90IHdoZW4gaXQgaGFzIGRyYXduIC0gd2FpdCBmb3IgYSBzaXplZCBjYW52YXNcbiAgLy8gcGx1cyBvbmUgcGFpbnRlZCBmcmFtZSwgd2l0aCBhIGNlaWxpbmcgc28gYSBicm9rZW4gc2NlbmUgc3RpbGwgcmV2ZWFscyBpbnN0ZWFkIG9mIGhhbmdpbmcuXG4gIGZ1bmN0aW9uIHdhaXRGb3JQYWludCgpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKGRvbmUpID0+IHtcbiAgICAgIGNvbnN0IHQwID0gcGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICAoZnVuY3Rpb24gdGljaygpIHtcbiAgICAgICAgaWYgKHNjZW5lSXNMaXZlKCkgfHwgcGVyZm9ybWFuY2Uubm93KCkgLSB0MCA+IDIwMDApXG4gICAgICAgICAgcmV0dXJuIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZG9uZSkpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGljayk7XG4gICAgICB9KSgpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcmV2ZWFsVW5pY29ybigpIHtcbiAgICBpZiAoIXVuaWNvcm4pIHJldHVybjtcbiAgICBjb25zdCBzZXEgPSBvcGVuU2VxO1xuICAgIGlmICh1bmljb3JuUmVhZHkgJiYgc2NlbmVJc0xpdmUoKSkgcmV0dXJuIHZvaWQgYW5pbWF0ZVVuaWNvcm4oKTtcbiAgICBpZiAodW5pY29yblR3ZWVuKSB1bmljb3JuVHdlZW4ua2lsbCgpO1xuICAgIGdzYXAuc2V0KHVuaWNvcm4sIHsgc2NhbGU6IDEuMSB9KTsgLy8gcGFyayBpdCBzbyB0aGUgZW1wdHkgY2FudmFzIG5ldmVyIHNob3dzXG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBlbnN1cmVNb2RhbFVuaWNvcm4oKS50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKHNlcSA9PT0gb3BlblNlcSAmJiBtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoT1BFTikpIGFuaW1hdGVVbmljb3JuKCk7XG4gICAgICB9KTtcbiAgICB9KSk7XG4gIH1cblxuICBmdW5jdGlvbiBhbmltYXRlVW5pY29ybigpIHtcbiAgICBpZiAodW5pY29yblR3ZWVuKSB1bmljb3JuVHdlZW4ua2lsbCgpO1xuICAgIC8vIHRoZSBmaWxlIGRlZmF1bHQgKG9zbW8sIDAuNnMpIGZpbmlzaGVzIHVuZGVyIHRoZSAxLjJzIHNsaWRlIGFuZCByZWFkcyBhcyBhIHBvcCAtXG4gICAgLy8gc2FtZSBjdXJ2ZSBhcyB0aGUgcGFuZWwsIG5lYXIgdGhlIHNhbWUgbGVuZ3RoLCBzbyB0aGUgc2NhbGUgaXMgYWN0dWFsbHkgbGVnaWJsZVxuICAgIHVuaWNvcm5Ud2VlbiA9IGdzYXAuZnJvbVRvKHVuaWNvcm4sXG4gICAgICB7IG9wYWNpdHk6IDAsIHNjYWxlOiAxLjEgfSxcbiAgICAgIHsgb3BhY2l0eTogMSwgc2NhbGU6IDEsIGR1cmF0aW9uOiAxLCBlYXNlOiBFQVNFIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gb3Blbk1vZGFsKCkge1xuICAgIGlmIChtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoT1BFTikpIHJldHVybjtcbiAgICBvcGVuU2VxKys7XG4gICAgbW9kYWwuY2xhc3NMaXN0LmFkZChPUEVOKTtcbiAgICBpZiAod2luZG93LmxlbmlzKSBsZW5pcy5zdG9wKCk7XG5cbiAgICBpZiAodGwpIHRsLmtpbGwoKTtcbiAgICBpZiAocmVkdWNlZCkge1xuICAgICAgZ3NhcC5zZXQocGFuZWwsIHsgeTogJzB2aCcgfSk7XG4gICAgICBpZiAob3ZlcmxheSkgZ3NhcC5zZXQob3ZlcmxheSwgeyBhdXRvQWxwaGE6IDAuOCB9KTtcbiAgICAgIGlmIChyaWdodCkgZ3NhcC5zZXQocmlnaHQsIHsgeTogJzB2aCcgfSk7XG4gICAgICByZXZlYWxVbmljb3JuKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRsID0gZ3NhcC50aW1lbGluZSgpO1xuICAgIGlmIChvdmVybGF5KSB0bC5mcm9tVG8ob3ZlcmxheSwgeyBhdXRvQWxwaGE6IDAgfSwgeyBhdXRvQWxwaGE6IDAuOCwgZHVyYXRpb246IERVUiwgZWFzZTogRUFTRSB9LCAwKTtcbiAgICB0bC5mcm9tVG8ocGFuZWwsIHsgeTogJzEwMHZoJyB9LCB7IHk6ICcwdmgnLCBkdXJhdGlvbjogRFVSLCBlYXNlOiBFQVNFIH0sIDApO1xuICAgIC8vIHNhbWUgZWFzZSwgbG9uZ2VyIHJpZGU6IGl0IHN0YXJ0cyBsb3dlciBhbmQgYXJyaXZlcyBhZnRlciB0aGUgcGFuZWwgaGFzIHNldHRsZWRcbiAgICBpZiAocmlnaHQpIHRsLmZyb21UbyhyaWdodCwgeyB5OiBSSUdIVF9GUk9NIH0sIHsgeTogJzB2aCcsIGR1cmF0aW9uOiBEVVIgKyBSSUdIVF9MQUcsIGVhc2U6IEVBU0UgfSwgMCk7XG4gICAgcmV2ZWFsVW5pY29ybigpOyAvLyBydW5zIG9uIGl0cyBvd24gY2xvY2sgLSB0aGUgc2NlbmUgcmV2ZWFscyB3aGVuZXZlciBpdCBoYXMgcGFpbnRlZFxuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VNb2RhbCgpIHtcbiAgICBpZiAoIW1vZGFsLmNsYXNzTGlzdC5jb250YWlucyhPUEVOKSkgcmV0dXJuO1xuICAgIG9wZW5TZXErKzsgLy8gYSBwZW5kaW5nIHVuaWNvcm4gcmV2ZWFsIG11c3Qgbm90IGZpcmUgaW50byBhIGNsb3NpbmcgbW9kYWxcbiAgICBpZiAod2luZG93LmxlbmlzICYmICFkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2X2NvbXBvbmVudC5pcy1tZW51LW9wZW4nKSkgbGVuaXMuc3RhcnQoKTtcblxuICAgIGNvbnN0IHNldHRsZSA9ICgpID0+IHtcbiAgICAgIG1vZGFsLmNsYXNzTGlzdC5yZW1vdmUoT1BFTik7XG4gICAgICBnc2FwLnNldChbcGFuZWwsIG92ZXJsYXksIHJpZ2h0XS5maWx0ZXIoQm9vbGVhbiksIHsgY2xlYXJQcm9wczogJ2FsbCcgfSk7XG4gICAgfTtcblxuICAgIGlmICh0bCkgdGwua2lsbCgpO1xuICAgIGlmIChyZWR1Y2VkKSByZXR1cm4gdm9pZCBzZXR0bGUoKTtcbiAgICB0bCA9IGdzYXAudGltZWxpbmUoeyBvbkNvbXBsZXRlOiBzZXR0bGUgfSk7XG4gICAgdGwudG8ocGFuZWwsIHsgeTogJzEwMHZoJywgZHVyYXRpb246IERVUiwgZWFzZTogRUFTRSB9LCAwKTtcbiAgICBpZiAob3ZlcmxheSkgdGwudG8ob3ZlcmxheSwgeyBhdXRvQWxwaGE6IDAsIGR1cmF0aW9uOiBEVVIsIGVhc2U6IEVBU0UgfSwgMCk7XG4gICAgdGwudG8ocmlnaHQsIHsgeTogUklHSFRfRlJPTSwgZHVyYXRpb246IERVUiwgZWFzZTogRUFTRSB9LCAwKTsgLy8gbGVhdmVzIHdpdGggdGhlIHBhbmVsLCBubyBsYWdcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uRG9jQ2xpY2soZSkge1xuICAgIGlmIChlLnRhcmdldC5jbG9zZXN0KCdbbW9kYWwtZ2V0LWluLXRvdWNoLW9wZW5dJykpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIG9wZW5Nb2RhbCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLm1vZGFsX2Nsb3NlLWJ0bicpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBjbG9zZU1vZGFsKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChvdmVybGF5ICYmIGUudGFyZ2V0ID09PSBvdmVybGF5KSBjbG9zZU1vZGFsKCk7IC8vIGNsaWNrIHRoZSBkaW0gYXJlYSB0byBkaXNtaXNzXG4gIH1cblxuICBmdW5jdGlvbiBvbktleShlKSB7XG4gICAgaWYgKChlLmtleSA9PT0gJ0VzY2FwZScgfHwgZS5rZXkgPT09ICdFc2MnKSAmJiBtb2RhbC5jbGFzc0xpc3QuY29udGFpbnMoT1BFTikpIGNsb3NlTW9kYWwoKTtcbiAgfVxuXG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25Eb2NDbGljayk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleSk7XG5cbiAgZ2V0SW5Ub3VjaE1vZGFsQ2xlYW51cCA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIG9uRG9jQ2xpY2spO1xuICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleSk7XG4gICAgaWYgKHVuaWNvcm5Ud2VlbikgdW5pY29yblR3ZWVuLmtpbGwoKTtcbiAgICBpZiAodGwpIHRsLmtpbGwoKTtcbiAgfTtcbn1cblxuLy8gLS0tIElOU0lHSFRTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyA+IEluc2lnaHRzIC0gTGF0ZXN0OiBcImxvYWQgbW9yZVwiIGJ1dHRvbiAoYWRkcyBjYXJkcyBpbiBiYXRjaGVzIG9mIDUsIGFuaW1hdGVkIHdpdGggR1NBUClcbmZ1bmN0aW9uIGluaXRJbnNpZ2h0c0xvYWRNb3JlKCkge1xuICBjb25zdCBjYXJkc1BlckxvYWQgPSA1O1xuICBjb25zdCBoYXNHc2FwID0gdHlwZW9mIHdpbmRvdy5nc2FwICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGNvbnN0IGhpZGVFbGVtZW50ID0gKGVsZW1lbnQpID0+IHtcbiAgICBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywgJ25vbmUnLCAnaW1wb3J0YW50Jyk7XG4gIH07XG5cbiAgY29uc3Qgc2hvd0VsZW1lbnQgPSAoZWxlbWVudCkgPT4ge1xuICAgIGVsZW1lbnQuc3R5bGUucmVtb3ZlUHJvcGVydHkoJ2Rpc3BsYXknKTtcbiAgICBlbGVtZW50LnJlbW92ZUF0dHJpYnV0ZSgnaGlkZGVuJyk7XG4gIH07XG5cbiAgY29uc3QgY29tcG9uZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnMtbGF0ZXN0X3RhYltkYXRhLWxvYWQtbW9yZV0nKTtcblxuICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgIGlmIChjb21wb25lbnQuZGF0YXNldC5sb2FkTW9yZUluaXRpYWxpemVkID09PSAndHJ1ZScpIHJldHVybjtcblxuICAgIGNvbnN0IGdyaWQgPSBjb21wb25lbnQucXVlcnlTZWxlY3RvcignLmlucy1sYXRlc3RfY2FyZHNfd3JhcHBlciAuaW5zLWxhdGVzdF9jYXJkcy5ncmlkLWF1dG9maWxsJyk7XG4gICAgY29uc3QgbW9yZVdyYXBwZXIgPSBjb21wb25lbnQucXVlcnlTZWxlY3RvcignLmlucy1tb3JlX3dyYXBwZXInKTtcbiAgICBjb25zdCBidXR0b24gPSBtb3JlV3JhcHBlcj8ucXVlcnlTZWxlY3RvcignW2RhdGEtbG9hZC1idXR0b25dJyk7XG5cbiAgICBpZiAoIWdyaWQgfHwgIW1vcmVXcmFwcGVyIHx8ICFidXR0b24pIHtcbiAgICAgIGNvbnNvbGUud2FybignTG9hZCBtb3JlOiBuaWVwcmF3aWTFgm93YSBzdHJ1a3R1cmEga29tcG9uZW50dScsIHsgY29tcG9uZW50LCBncmlkLCBtb3JlV3JhcHBlciwgYnV0dG9uIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNhcmRzID0gWy4uLmdyaWQucXVlcnlTZWxlY3RvckFsbCgnLmlucy1sYXRlc3RfY2FyZCcpXS5maWx0ZXIoKGNhcmQpID0+IHtcbiAgICAgIHJldHVybiBjYXJkLmNsb3Nlc3QoJy5pbnMtbGF0ZXN0X2NhcmRzLmdyaWQtYXV0b2ZpbGwnKSA9PT0gZ3JpZDtcbiAgICB9KTtcblxuICAgIGNvbXBvbmVudC5kYXRhc2V0LmxvYWRNb3JlSW5pdGlhbGl6ZWQgPSAndHJ1ZSc7XG4gICAgZ3JpZC5hcHBlbmRDaGlsZChidXR0b24pO1xuXG4gICAgYnV0dG9uLnN0eWxlLnZpc2liaWxpdHkgPSAnJztcbiAgICBidXR0b24uc3R5bGUub3BhY2l0eSA9ICcnO1xuICAgIGJ1dHRvbi5zdHlsZS50cmFuc2Zvcm0gPSAnJztcbiAgICBzaG93RWxlbWVudChidXR0b24pO1xuXG4gICAgbGV0IHZpc2libGVDYXJkcyA9IGNhcmRzUGVyTG9hZDtcbiAgICBsZXQgaXNBbmltYXRpbmcgPSBmYWxzZTtcblxuICAgIGNhcmRzLmZvckVhY2goKGNhcmQsIGluZGV4KSA9PiB7XG4gICAgICBpZiAoaW5kZXggPCB2aXNpYmxlQ2FyZHMpIHNob3dFbGVtZW50KGNhcmQpOyBlbHNlIGhpZGVFbGVtZW50KGNhcmQpO1xuICAgIH0pO1xuXG4gICAgaWYgKGNhcmRzLmxlbmd0aCA8PSBjYXJkc1BlckxvYWQpIHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgIGhpZGVFbGVtZW50KGJ1dHRvbik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZGlzYWJsZUJ1dHRvbiA9ICgpID0+IHtcbiAgICAgIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnLCAndHJ1ZScpO1xuICAgICAgYnV0dG9uLnN0eWxlLnBvaW50ZXJFdmVudHMgPSAnbm9uZSc7XG4gICAgfTtcblxuICAgIGNvbnN0IGVuYWJsZUJ1dHRvbiA9ICgpID0+IHtcbiAgICAgIGJ1dHRvbi5yZW1vdmVBdHRyaWJ1dGUoJ2FyaWEtZGlzYWJsZWQnKTtcbiAgICAgIGJ1dHRvbi5zdHlsZS5wb2ludGVyRXZlbnRzID0gJyc7XG4gICAgfTtcblxuICAgIGNvbnN0IGhpZGVCdXR0b24gPSAocGVybWFuZW50bHkpID0+IHtcbiAgICAgIGlmIChoYXNHc2FwKSBnc2FwLmtpbGxUd2VlbnNPZihidXR0b24pO1xuICAgICAgaWYgKHBlcm1hbmVudGx5KSBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG5cbiAgICAgIGlmICghaGFzR3NhcCB8fCByZWR1Y2VkTW90aW9uKSB7XG4gICAgICAgIGlmIChwZXJtYW5lbnRseSkgaGlkZUVsZW1lbnQoYnV0dG9uKTsgZWxzZSBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICghcGVybWFuZW50bHkpIHtcbiAgICAgICAgZ3NhcC50byhidXR0b24sIHsgYXV0b0FscGhhOiAwLCB5OiA4LCBzY2FsZTogMC45OCwgZHVyYXRpb246IDAuMiwgZWFzZTogJ3Bvd2VyMi5vdXQnIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGdzYXBcbiAgICAgICAgLnRpbWVsaW5lKHsgb25Db21wbGV0ZTogKCkgPT4gaGlkZUVsZW1lbnQoYnV0dG9uKSB9KVxuICAgICAgICAudG8oYnV0dG9uLCB7IGF1dG9BbHBoYTogMCwgeTogOCwgc2NhbGU6IDAuOTgsIGR1cmF0aW9uOiAwLjIsIGVhc2U6ICdwb3dlcjIub3V0JyB9KVxuICAgICAgICAudG8oYnV0dG9uLCB7XG4gICAgICAgICAgaGVpZ2h0OiAwLCBtYXJnaW5Ub3A6IDAsIG1hcmdpbkJvdHRvbTogMCwgcGFkZGluZ1RvcDogMCwgcGFkZGluZ0JvdHRvbTogMCxcbiAgICAgICAgICBkdXJhdGlvbjogMC4zLCBlYXNlOiAncG93ZXIyLmluT3V0Jywgb3ZlcmZsb3c6ICdoaWRkZW4nLFxuICAgICAgICB9LCAwLjA1KTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2hvd0J1dHRvbiA9ICgpID0+IHtcbiAgICAgIHNob3dFbGVtZW50KGJ1dHRvbik7XG4gICAgICBidXR0b24uc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xuXG4gICAgICBpZiAoIWhhc0dzYXAgfHwgcmVkdWNlZE1vdGlvbikge1xuICAgICAgICBlbmFibGVCdXR0b24oKTtcbiAgICAgICAgaXNBbmltYXRpbmcgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBnc2FwLmZyb21UbyhidXR0b24sXG4gICAgICAgIHsgYXV0b0FscGhhOiAwLCB5OiAxMCwgc2NhbGU6IDAuOTggfSxcbiAgICAgICAge1xuICAgICAgICAgIGF1dG9BbHBoYTogMSwgeTogMCwgc2NhbGU6IDEsIGR1cmF0aW9uOiAwLjQsIGVhc2U6ICdwb3dlcjMub3V0JyxcbiAgICAgICAgICBjbGVhclByb3BzOiAnb3BhY2l0eSx2aXNpYmlsaXR5LHRyYW5zZm9ybScsXG4gICAgICAgICAgb25Db21wbGV0ZTogKCkgPT4geyBlbmFibGVCdXR0b24oKTsgaXNBbmltYXRpbmcgPSBmYWxzZTsgfSxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChpc0FuaW1hdGluZykgcmV0dXJuO1xuXG4gICAgICBjb25zdCBuZXh0VmlzaWJsZUNvdW50ID0gTWF0aC5taW4odmlzaWJsZUNhcmRzICsgY2FyZHNQZXJMb2FkLCBjYXJkcy5sZW5ndGgpO1xuICAgICAgY29uc3QgbmV3Q2FyZHMgPSBjYXJkcy5zbGljZSh2aXNpYmxlQ2FyZHMsIG5leHRWaXNpYmxlQ291bnQpO1xuICAgICAgY29uc3QgaXNMYXN0QmF0Y2ggPSBuZXh0VmlzaWJsZUNvdW50ID49IGNhcmRzLmxlbmd0aDtcblxuICAgICAgaXNBbmltYXRpbmcgPSB0cnVlO1xuICAgICAgdmlzaWJsZUNhcmRzID0gbmV4dFZpc2libGVDb3VudDtcblxuICAgICAgZGlzYWJsZUJ1dHRvbigpO1xuICAgICAgaGlkZUJ1dHRvbihpc0xhc3RCYXRjaCk7XG4gICAgICBuZXdDYXJkcy5mb3JFYWNoKHNob3dFbGVtZW50KTtcblxuICAgICAgY29uc3QgY29tcGxldGVDYXJkc0FuaW1hdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaWYgKGlzTGFzdEJhdGNoKSB7IGlzQW5pbWF0aW5nID0gZmFsc2U7IHJldHVybjsgfVxuICAgICAgICBzaG93QnV0dG9uKCk7XG4gICAgICB9O1xuXG4gICAgICBpZiAoIWhhc0dzYXAgfHwgcmVkdWNlZE1vdGlvbikgeyBjb21wbGV0ZUNhcmRzQW5pbWF0aW9uKCk7IHJldHVybjsgfVxuXG4gICAgICBnc2FwLmZyb21UbyhuZXdDYXJkcyxcbiAgICAgICAgeyBhdXRvQWxwaGE6IDAsIHk6IDMyLCBzY2FsZTogMC45NzUsIGZpbHRlcjogJ2JsdXIoOHB4KScgfSxcbiAgICAgICAge1xuICAgICAgICAgIGF1dG9BbHBoYTogMSwgeTogMCwgc2NhbGU6IDEsIGZpbHRlcjogJ2JsdXIoMHB4KScsIGR1cmF0aW9uOiAwLjgsIHN0YWdnZXI6IDAuMTIsXG4gICAgICAgICAgZWFzZTogJ3Bvd2VyMy5vdXQnLCBjbGVhclByb3BzOiAnb3BhY2l0eSx2aXNpYmlsaXR5LHRyYW5zZm9ybSxmaWx0ZXInLFxuICAgICAgICAgIG9uQ29tcGxldGU6IGNvbXBsZXRlQ2FyZHNBbmltYXRpb24sXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLy8gPiBJbnNpZ2h0cyAtIExhdGVzdDogY2F0ZWdvcnkgdGFicyAoY29udGVudCBwYW5lbCBzd2l0Y2hpbmcpXG5mdW5jdGlvbiBpbml0SW5zaWdodHNUYWJzKCkge1xuICBjb25zdCBoYXNHc2FwID0gdHlwZW9mIHdpbmRvdy5nc2FwICE9PSBcInVuZGVmaW5lZFwiO1xuICBjb25zdCB0YWJOYXZpZ2F0aW9ucyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5pbnMtbGF0ZXN0X3RhYnMnKTtcblxuICB0YWJOYXZpZ2F0aW9ucy5mb3JFYWNoKCh0YWJOYXZpZ2F0aW9uKSA9PiB7XG4gICAgaWYgKHRhYk5hdmlnYXRpb24uZGF0YXNldC5pbnRhYkluaXRpYWxpemVkID09PSAndHJ1ZScpIHJldHVybjtcblxuICAgIGNvbnN0IGdyb3VwID0gdGFiTmF2aWdhdGlvbi5wYXJlbnRFbGVtZW50O1xuICAgIGNvbnN0IGJ1dHRvbnMgPSBbLi4udGFiTmF2aWdhdGlvbi5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1pbnRhYl0nKV07XG4gICAgY29uc3QgcGFuZXMgPSBbLi4uZ3JvdXAuY2hpbGRyZW5dLmZpbHRlcigoZWwpID0+IGVsLm1hdGNoZXMoJ1tkYXRhLWludGFiLXBhbmVdJykpO1xuXG4gICAgaWYgKCFidXR0b25zLmxlbmd0aCB8fCAhcGFuZXMubGVuZ3RoKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1RhYnM6IG5pZSB6bmFsZXppb25vIHByenljaXNrw7N3IGx1YiBwYW5lbGknLCB7IHRhYk5hdmlnYXRpb24sIGJ1dHRvbnMsIHBhbmVzIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbmRQYW5lID0gKHZhbHVlKSA9PiBwYW5lcy5maW5kKChwYW5lKSA9PiBwYW5lLmRhdGFzZXQuaW50YWJQYW5lID09PSB2YWx1ZSk7XG4gICAgY29uc3QgdmFsaWRCdXR0b25zID0gYnV0dG9ucy5maWx0ZXIoKGJ1dHRvbikgPT4gQm9vbGVhbihmaW5kUGFuZShidXR0b24uZGF0YXNldC5pbnRhYikpKTtcblxuICAgIGlmICghdmFsaWRCdXR0b25zLmxlbmd0aCkge1xuICAgICAgY29uc29sZS53YXJuKCdUYWJzOiB3YXJ0b8WbY2kgZGF0YS1pbnRhYiBuaWUgcGFzdWrEhSBkbyBkYXRhLWludGFiLXBhbmUnLCB7IGJ1dHRvbnMsIHBhbmVzIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRhYk5hdmlnYXRpb24uZGF0YXNldC5pbnRhYkluaXRpYWxpemVkID0gJ3RydWUnO1xuICAgIHRhYk5hdmlnYXRpb24uc2V0QXR0cmlidXRlKCdyb2xlJywgJ3RhYmxpc3QnKTtcblxuICAgIGxldCBhY3RpdmVWYWx1ZSA9IG51bGw7XG4gICAgYnV0dG9ucy5mb3JFYWNoKChiKSA9PiBiLnNldEF0dHJpYnV0ZSgncm9sZScsICd0YWInKSk7XG4gICAgcGFuZXMuZm9yRWFjaCgocCkgPT4gcC5zZXRBdHRyaWJ1dGUoJ3JvbGUnLCAndGFicGFuZWwnKSk7XG5cbiAgICBjb25zdCBhY3RpdmF0ZVRhYiA9ICh2YWx1ZSwgc2hvdWxkQW5pbWF0ZSA9IHRydWUpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldFBhbmUgPSBmaW5kUGFuZSh2YWx1ZSk7XG4gICAgICBpZiAoIXRhcmdldFBhbmUgfHwgYWN0aXZlVmFsdWUgPT09IHZhbHVlKSByZXR1cm47XG4gICAgICBhY3RpdmVWYWx1ZSA9IHZhbHVlO1xuXG4gICAgICBidXR0b25zLmZvckVhY2goKGJ1dHRvbikgPT4ge1xuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGJ1dHRvbi5kYXRhc2V0LmludGFiID09PSB2YWx1ZTtcbiAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC50b2dnbGUoJ2lzLWFjdGl2ZScsIGlzQWN0aXZlKTtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIFN0cmluZyhpc0FjdGl2ZSkpO1xuICAgICAgICBidXR0b24udGFiSW5kZXggPSBpc0FjdGl2ZSA/IDAgOiAtMTtcbiAgICAgIH0pO1xuXG4gICAgICBwYW5lcy5mb3JFYWNoKChwYW5lKSA9PiB7XG4gICAgICAgIGNvbnN0IGlzQWN0aXZlID0gcGFuZSA9PT0gdGFyZ2V0UGFuZTtcbiAgICAgICAgaWYgKGhhc0dzYXApIGdzYXAua2lsbFR3ZWVuc09mKHBhbmUpO1xuXG4gICAgICAgIGlmIChpc0FjdGl2ZSkge1xuICAgICAgICAgIHBhbmUuc3R5bGUuc2V0UHJvcGVydHkoJ2Rpc3BsYXknLCAnYmxvY2snLCAnaW1wb3J0YW50Jyk7XG4gICAgICAgICAgcGFuZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ2ZhbHNlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGhhc0dzYXApIGdzYXAuc2V0KHBhbmUsIHsgY2xlYXJQcm9wczogJ29wYWNpdHksdmlzaWJpbGl0eSx0cmFuc2Zvcm0sZmlsdGVyJyB9KTtcbiAgICAgICAgICBwYW5lLnN0eWxlLnNldFByb3BlcnR5KCdkaXNwbGF5JywgJ25vbmUnLCAnaW1wb3J0YW50Jyk7XG4gICAgICAgICAgcGFuZS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGlmICghaGFzR3NhcCB8fCByZWR1Y2VkTW90aW9uIHx8ICFzaG91bGRBbmltYXRlKSB7XG4gICAgICAgIGlmIChoYXNHc2FwKSBnc2FwLnNldCh0YXJnZXRQYW5lLCB7IGNsZWFyUHJvcHM6ICdvcGFjaXR5LHZpc2liaWxpdHksdHJhbnNmb3JtLGZpbHRlcicgfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgZ3NhcC5mcm9tVG8odGFyZ2V0UGFuZSxcbiAgICAgICAgeyBhdXRvQWxwaGE6IDAsIHk6IDI0LCBzY2FsZTogMC45ODUsIGZpbHRlcjogJ2JsdXIoOHB4KScgfSxcbiAgICAgICAge1xuICAgICAgICAgIGF1dG9BbHBoYTogMSwgeTogMCwgc2NhbGU6IDEsIGZpbHRlcjogJ2JsdXIoMHB4KScsIGR1cmF0aW9uOiAwLjY1LFxuICAgICAgICAgIGVhc2U6ICdwb3dlcjMub3V0JywgY2xlYXJQcm9wczogJ29wYWNpdHksdmlzaWJpbGl0eSx0cmFuc2Zvcm0sZmlsdGVyJyxcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhbGlkQnV0dG9ucy5mb3JFYWNoKChidXR0b24pID0+IHtcbiAgICAgIGJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBhY3RpdmF0ZVRhYihidXR0b24uZGF0YXNldC5pbnRhYik7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGNvbnN0IGluaXRpYWxCdXR0b24gPVxuICAgICAgdmFsaWRCdXR0b25zLmZpbmQoKGIpID0+IGIuY2xhc3NMaXN0LmNvbnRhaW5zKCdpcy1hY3RpdmUnKSkgfHxcbiAgICAgIHZhbGlkQnV0dG9ucy5maW5kKChiKSA9PiBiLmRhdGFzZXQuaW50YWIgPT09ICdhbGwnKSB8fFxuICAgICAgdmFsaWRCdXR0b25zWzBdO1xuXG4gICAgYWN0aXZhdGVUYWIoaW5pdGlhbEJ1dHRvbi5kYXRhc2V0LmludGFiLCBmYWxzZSk7XG4gIH0pO1xufVxuXG5cbi8vIC0tLSBTV0lQRVIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmxldCBzd2lwZXJDbGVhbnVwRm5zID0gW107XG5cbi8vID4gR2xvYmFsIC0gU3dpcGVyOiBjYXJvdXNlbCBpbml0ICguc3dpcGVyX3dyYXApIHdpdGggc2V0dGluZ3MgZnJvbSBkYXRhLXN3aXBlci0qXG4vLyAgIGF0dHJpYnV0ZXMsIG11bHRpcGxlIGluc3RhbmNlcyBwZXIgcGFnZSwgbWFudWFsIGxvb3AgZm9yIGNlbnRlcmVkIHNsaWRlcyxcbi8vICAgY3VzdG9tIHBhZ2luYXRpb25cbmZ1bmN0aW9uIGluaXRTd2lwZXJDYXJvdXNlbHMoKSB7XG4gIC8vIENsZWFuIHVwIGFmdGVyIGEgcHJldmlvdXMgdmlzaXQgdG8gYSBwYWdlIHdpdGggY2Fyb3VzZWxzIGluIHRoZSBzYW1lIFNQQVxuICAvLyBzZXNzaW9uIChCYXJiYSBjbGVhcnMgbmVpdGhlciBNdXRhdGlvbk9ic2VydmVycyBub3Igd2luZG93IGxpc3RlbmVycylcbiAgc3dpcGVyQ2xlYW51cEZucy5mb3JFYWNoKChjbGVhbnVwKSA9PiBjbGVhbnVwKCkpO1xuICBzd2lwZXJDbGVhbnVwRm5zID0gW107XG5cbiAgaWYgKHR5cGVvZiBTd2lwZXIgPT09ICd1bmRlZmluZWQnKSByZXR1cm47XG5cbiAgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlcl93cmFwJykuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgY29uc3Qgc3dpcGVyRWxlbWVudCA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyX2NvbXBvbmVudCcpO1xuICAgIGNvbnN0IHByZXZCdXR0b24gPSBjb21wb25lbnQucXVlcnlTZWxlY3RvcignW2RhdGEtc3dpcGVyLXByZXZdJyk7XG4gICAgY29uc3QgbmV4dEJ1dHRvbiA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yKCdbZGF0YS1zd2lwZXItbmV4dF0nKTtcbiAgICBjb25zdCBwYWdpbmF0aW9uRWxlbWVudCA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yKCcuc3dpcGVyX3BhZ2luYXRpb24nKTtcblxuICAgIGlmICghc3dpcGVyRWxlbWVudCkgcmV0dXJuO1xuXG4gICAgY29uc3QgYXR0cmlidXRlTmFtZXMgPSBbJ2RhdGEtc3dpcGVyLXNsaWRlcy1tb2JpbGUnLCAnZGF0YS1zd2lwZXItc2xpZGVzLWxhbmRzY2FwZScsICdkYXRhLXN3aXBlci1zbGlkZXMtdGFibGV0JywgJ2RhdGEtc3dpcGVyLXNsaWRlcy1kZXNrdG9wJywgJ2RhdGEtc3dpcGVyLWdhcCcsICdkYXRhLXN3aXBlci1zcGVlZCcsICdkYXRhLXN3aXBlci1sb29wJywgJ2RhdGEtc3dpcGVyLXJld2luZCcsICdkYXRhLXN3aXBlci1kcmFnJywgJ2RhdGEtc3dpcGVyLWtleWJvYXJkJywgJ2RhdGEtc3dpcGVyLWNlbnRlcmVkJywgJ2RhdGEtc3dpcGVyLWF1dG9wbGF5JywgJ2RhdGEtc3dpcGVyLWF1dG9wbGF5LWRlbGF5JywgJ2RhdGEtc3dpcGVyLWF1dG9wbGF5LWRpc2FibGUtb24taW50ZXJhY3Rpb24nLCAnZGF0YS1zd2lwZXItYXV0b3BsYXktcGF1c2Utb24tbW91c2UtZW50ZXInLCAnZGF0YS1zd2lwZXItYXV0b3BsYXktcmV2ZXJzZScsICdkYXRhLXN3aXBlci1lYXNpbmcnXTtcblxuICAgIGNvbnN0IGdldE51bWJlciA9ICh2YWx1ZSwgZmFsbGJhY2spID0+IHtcbiAgICAgIGNvbnN0IG51bWJlciA9IE51bWJlci5wYXJzZUZsb2F0KHZhbHVlKTtcbiAgICAgIHJldHVybiBOdW1iZXIuaXNGaW5pdGUobnVtYmVyKSA/IG51bWJlciA6IGZhbGxiYWNrO1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRCb29sZWFuID0gKHZhbHVlLCBmYWxsYmFjaykgPT4ge1xuICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHJldHVybiBmYWxsYmFjaztcbiAgICAgIHJldHVybiB2YWx1ZSA9PT0gJ3RydWUnO1xuICAgIH07XG5cbiAgICBjb25zdCByZXNvbHZlQ3NzTGVuZ3RoID0gKHZhbHVlLCBlbGVtZW50LCBmYWxsYmFjaykgPT4ge1xuICAgICAgY29uc3QgcmF3VmFsdWUgPSBTdHJpbmcodmFsdWUgfHwgZmFsbGJhY2spLnRyaW0oKTtcbiAgICAgIGNvbnN0IG51bWJlclZhbHVlID0gTnVtYmVyLnBhcnNlRmxvYXQocmF3VmFsdWUpO1xuXG4gICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKG51bWJlclZhbHVlKSAmJiByYXdWYWx1ZSA9PT0gU3RyaW5nKG51bWJlclZhbHVlKSkgcmV0dXJuIG51bWJlclZhbHVlO1xuXG4gICAgICBpZiAocmF3VmFsdWUuc3RhcnRzV2l0aCgndmFyKCcpKSB7XG4gICAgICAgIGNvbnN0IHByb3BlcnR5TmFtZSA9IHJhd1ZhbHVlLnNsaWNlKDQsIC0xKS5zcGxpdCgnLCcpWzBdLnRyaW0oKTtcbiAgICAgICAgY29uc3QgcHJvcGVydHlWYWx1ZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShwcm9wZXJ0eU5hbWUpLnRyaW0oKTtcbiAgICAgICAgcmV0dXJuIHJlc29sdmVDc3NMZW5ndGgocHJvcGVydHlWYWx1ZSwgZWxlbWVudCwgZmFsbGJhY2spO1xuICAgICAgfVxuXG4gICAgICBpZiAocmF3VmFsdWUuZW5kc1dpdGgoJ3JlbScpKSB7XG4gICAgICAgIHJldHVybiBudW1iZXJWYWx1ZSAqIE51bWJlci5wYXJzZUZsb2F0KGdldENvbXB1dGVkU3R5bGUoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5mb250U2l6ZSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyYXdWYWx1ZS5lbmRzV2l0aCgnZW0nKSkge1xuICAgICAgICByZXR1cm4gbnVtYmVyVmFsdWUgKiBOdW1iZXIucGFyc2VGbG9hdChnZXRDb21wdXRlZFN0eWxlKGVsZW1lbnQpLmZvbnRTaXplKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE51bWJlci5pc0Zpbml0ZShudW1iZXJWYWx1ZSkgPyBudW1iZXJWYWx1ZSA6IE51bWJlci5wYXJzZUZsb2F0KGZhbGxiYWNrKTtcbiAgICB9O1xuXG4gICAgY29uc3QgcmVhZFNldHRpbmdzID0gKCkgPT4ge1xuICAgICAgY29uc3Qgc2xpZGVzTW9iaWxlID0gZ2V0TnVtYmVyKGNvbXBvbmVudC5kYXRhc2V0LnN3aXBlclNsaWRlc01vYmlsZSwgMSk7XG4gICAgICBjb25zdCBzbGlkZXNMYW5kc2NhcGUgPSBnZXROdW1iZXIoY29tcG9uZW50LmRhdGFzZXQuc3dpcGVyU2xpZGVzTGFuZHNjYXBlLCBzbGlkZXNNb2JpbGUpO1xuICAgICAgY29uc3Qgc2xpZGVzVGFibGV0ID0gZ2V0TnVtYmVyKGNvbXBvbmVudC5kYXRhc2V0LnN3aXBlclNsaWRlc1RhYmxldCwgc2xpZGVzTGFuZHNjYXBlKTtcbiAgICAgIGNvbnN0IHNsaWRlc0Rlc2t0b3AgPSBnZXROdW1iZXIoY29tcG9uZW50LmRhdGFzZXQuc3dpcGVyU2xpZGVzRGVza3RvcCwgc2xpZGVzVGFibGV0KTtcbiAgICAgIGNvbnN0IHNob3VsZExvb3AgPSBnZXRCb29sZWFuKGNvbXBvbmVudC5kYXRhc2V0LnN3aXBlckxvb3AsIGZhbHNlKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2xpZGVzTW9iaWxlLFxuICAgICAgICBzbGlkZXNMYW5kc2NhcGUsXG4gICAgICAgIHNsaWRlc1RhYmxldCxcbiAgICAgICAgc2xpZGVzRGVza3RvcCxcbiAgICAgICAgZ2FwOiByZXNvbHZlQ3NzTGVuZ3RoKGNvbXBvbmVudC5kYXRhc2V0LnN3aXBlckdhcCwgY29tcG9uZW50LCAnMCcpLFxuICAgICAgICBzcGVlZDogZ2V0TnVtYmVyKGNvbXBvbmVudC5kYXRhc2V0LnN3aXBlclNwZWVkLCA2MDApLFxuICAgICAgICBzaG91bGRMb29wLFxuICAgICAgICBzaG91bGRSZXdpbmQ6IHNob3VsZExvb3AgPyBmYWxzZSA6IGdldEJvb2xlYW4oY29tcG9uZW50LmRhdGFzZXQuc3dpcGVyUmV3aW5kLCBmYWxzZSksXG4gICAgICAgIHNob3VsZERyYWc6IGdldEJvb2xlYW4oY29tcG9uZW50LmRhdGFzZXQuc3dpcGVyRHJhZywgdHJ1ZSksXG4gICAgICAgIHNob3VsZFVzZUtleWJvYXJkOiBnZXRCb29sZWFuKGNvbXBvbmVudC5kYXRhc2V0LnN3aXBlcktleWJvYXJkLCB0cnVlKSxcbiAgICAgICAgc2hvdWxkQ2VudGVyOiBnZXRCb29sZWFuKGNvbXBvbmVudC5kYXRhc2V0LnN3aXBlckNlbnRlcmVkLCBmYWxzZSksXG4gICAgICAgIHNob3VsZEF1dG9wbGF5OiBnZXRCb29sZWFuKGNvbXBvbmVudC5kYXRhc2V0LnN3aXBlckF1dG9wbGF5LCBmYWxzZSksXG4gICAgICAgIGF1dG9wbGF5RGVsYXk6IGdldE51bWJlcihjb21wb25lbnQuZGF0YXNldC5zd2lwZXJBdXRvcGxheURlbGF5LCAzMDAwKSxcbiAgICAgICAgYXV0b3BsYXlEaXNhYmxlT25JbnRlcmFjdGlvbjogZ2V0Qm9vbGVhbihjb21wb25lbnQuZGF0YXNldC5zd2lwZXJBdXRvcGxheURpc2FibGVPbkludGVyYWN0aW9uLCBmYWxzZSksXG4gICAgICAgIGF1dG9wbGF5UGF1c2VPbk1vdXNlRW50ZXI6IGdldEJvb2xlYW4oY29tcG9uZW50LmRhdGFzZXQuc3dpcGVyQXV0b3BsYXlQYXVzZU9uTW91c2VFbnRlciwgdHJ1ZSksXG4gICAgICAgIGF1dG9wbGF5UmV2ZXJzZTogZ2V0Qm9vbGVhbihjb21wb25lbnQuZGF0YXNldC5zd2lwZXJBdXRvcGxheVJldmVyc2UsIGZhbHNlKSxcbiAgICAgICAgZWFzaW5nOiBjb21wb25lbnQuZGF0YXNldC5zd2lwZXJFYXNpbmcgfHwgJ2N1YmljLWJlemllcigwLjIyLCAxLCAwLjM2LCAxKScsXG4gICAgICB9O1xuICAgIH07XG5cbiAgICBjb25zdCBnZXRDdXJyZW50U2xpZGVzUGVyVmlldyA9IChzZXR0aW5ncykgPT4ge1xuICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDk5MikgcmV0dXJuIHNldHRpbmdzLnNsaWRlc0Rlc2t0b3A7XG4gICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gNzY4KSByZXR1cm4gc2V0dGluZ3Muc2xpZGVzVGFibGV0O1xuICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoID49IDQ4MCkgcmV0dXJuIHNldHRpbmdzLnNsaWRlc0xhbmRzY2FwZTtcbiAgICAgIHJldHVybiBzZXR0aW5ncy5zbGlkZXNNb2JpbGU7XG4gICAgfTtcblxuICAgIGNvbnN0IGFwcGx5RWFzaW5nID0gKHN3aXBlckluc3RhbmNlLCBzZXR0aW5ncykgPT4ge1xuICAgICAgY29tcG9uZW50LnN0eWxlLnNldFByb3BlcnR5KCctLXN3aXBlci1lYXNpbmcnLCBzZXR0aW5ncy5lYXNpbmcpO1xuXG4gICAgICBjb25zdCB3cmFwcGVyID0gc3dpcGVySW5zdGFuY2UgJiYgc3dpcGVySW5zdGFuY2Uud3JhcHBlckVsID8gc3dpcGVySW5zdGFuY2Uud3JhcHBlckVsIDogY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXJfbGlzdCcpO1xuXG4gICAgICBpZiAod3JhcHBlcikgd3JhcHBlci5zdHlsZS50cmFuc2l0aW9uVGltaW5nRnVuY3Rpb24gPSBzZXR0aW5ncy5lYXNpbmc7XG4gICAgfTtcblxuICAgIGNvbnN0IHByZXBhcmVNYW51YWxMb29wID0gKHNldHRpbmdzKSA9PiB7XG4gICAgICBjb25zdCBsaXN0ID0gY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3IoJy5zd2lwZXJfbGlzdCcpO1xuICAgICAgaWYgKCFsaXN0KSByZXR1cm4geyBlbmFibGVkOiBmYWxzZSwgb3JpZ2luYWxDb3VudDogMCB9O1xuXG4gICAgICBsaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoXCJbZGF0YS1zd2lwZXItbG9vcC1maWxsPSd0cnVlJ11cIikuZm9yRWFjaCgoc2xpZGUpID0+IHNsaWRlLnJlbW92ZSgpKTtcblxuICAgICAgY29uc3Qgb3JpZ2luYWxTbGlkZXMgPSBBcnJheS5mcm9tKGxpc3QucXVlcnlTZWxlY3RvckFsbCgnLnN3aXBlcl9pdGVtJykpO1xuICAgICAgY29uc3Qgc2hvdWxkVXNlTWFudWFsTG9vcCA9IHNldHRpbmdzLnNob3VsZExvb3AgJiYgc2V0dGluZ3Muc2hvdWxkQ2VudGVyICYmIG9yaWdpbmFsU2xpZGVzLmxlbmd0aCA+IDE7XG5cbiAgICAgIGlmICghc2hvdWxkVXNlTWFudWFsTG9vcCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIG9yaWdpbmFsQ291bnQ6IG9yaWdpbmFsU2xpZGVzLmxlbmd0aCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgYmVmb3JlRnJhZ21lbnQgPSBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICBjb25zdCBhZnRlckZyYWdtZW50ID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgICBvcmlnaW5hbFNsaWRlcy5mb3JFYWNoKChzbGlkZSkgPT4ge1xuICAgICAgICBjb25zdCBiZWZvcmVDbG9uZSA9IHNsaWRlLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgY29uc3QgYWZ0ZXJDbG9uZSA9IHNsaWRlLmNsb25lTm9kZSh0cnVlKTtcblxuICAgICAgICBiZWZvcmVDbG9uZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtc3dpcGVyLWxvb3AtZmlsbCcsICd0cnVlJyk7XG4gICAgICAgIGFmdGVyQ2xvbmUuc2V0QXR0cmlidXRlKCdkYXRhLXN3aXBlci1sb29wLWZpbGwnLCAndHJ1ZScpO1xuXG4gICAgICAgIGJlZm9yZUZyYWdtZW50LmFwcGVuZENoaWxkKGJlZm9yZUNsb25lKTtcbiAgICAgICAgYWZ0ZXJGcmFnbWVudC5hcHBlbmRDaGlsZChhZnRlckNsb25lKTtcbiAgICAgIH0pO1xuXG4gICAgICBsaXN0Lmluc2VydEJlZm9yZShiZWZvcmVGcmFnbWVudCwgb3JpZ2luYWxTbGlkZXNbMF0pO1xuICAgICAgbGlzdC5hcHBlbmRDaGlsZChhZnRlckZyYWdtZW50KTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgb3JpZ2luYWxDb3VudDogb3JpZ2luYWxTbGlkZXMubGVuZ3RoLFxuICAgICAgICBzdGFydEluZGV4OiBvcmlnaW5hbFNsaWRlcy5sZW5ndGggKyBNYXRoLmZsb29yKGdldEN1cnJlbnRTbGlkZXNQZXJWaWV3KHNldHRpbmdzKSAvIDIpLFxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgY29uc3Qgbm9ybWFsaXplTWFudWFsTG9vcCA9IChzd2lwZXJJbnN0YW5jZSwgbWFudWFsTG9vcCkgPT4ge1xuICAgICAgaWYgKCFtYW51YWxMb29wLmVuYWJsZWQgfHwgIXN3aXBlckluc3RhbmNlIHx8IHN3aXBlckluc3RhbmNlLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICBjb25zdCBvcmlnaW5hbENvdW50ID0gbWFudWFsTG9vcC5vcmlnaW5hbENvdW50O1xuICAgICAgY29uc3QgYWN0aXZlSW5kZXggPSBzd2lwZXJJbnN0YW5jZS5hY3RpdmVJbmRleDtcblxuICAgICAgaWYgKGFjdGl2ZUluZGV4IDwgb3JpZ2luYWxDb3VudCkge1xuICAgICAgICBzd2lwZXJJbnN0YW5jZS5zbGlkZVRvKGFjdGl2ZUluZGV4ICsgb3JpZ2luYWxDb3VudCwgMCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmIChhY3RpdmVJbmRleCA+PSBvcmlnaW5hbENvdW50ICogMikge1xuICAgICAgICBzd2lwZXJJbnN0YW5jZS5zbGlkZVRvKGFjdGl2ZUluZGV4IC0gb3JpZ2luYWxDb3VudCwgMCwgZmFsc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBnZXRQYWdpbmF0aW9uSW5kZXggPSAoc3dpcGVySW5zdGFuY2UsIG1hbnVhbExvb3ApID0+IHtcbiAgICAgIGlmICghc3dpcGVySW5zdGFuY2UgfHwgc3dpcGVySW5zdGFuY2UuZGVzdHJveWVkIHx8ICFtYW51YWxMb29wLm9yaWdpbmFsQ291bnQpIHJldHVybiAwO1xuXG4gICAgICBjb25zdCBzb3VyY2VJbmRleCA9IG1hbnVhbExvb3AuZW5hYmxlZCA/IHN3aXBlckluc3RhbmNlLmFjdGl2ZUluZGV4IC0gbWFudWFsTG9vcC5vcmlnaW5hbENvdW50IDogdHlwZW9mIHN3aXBlckluc3RhbmNlLnJlYWxJbmRleCA9PT0gJ251bWJlcicgPyBzd2lwZXJJbnN0YW5jZS5yZWFsSW5kZXggOiBzd2lwZXJJbnN0YW5jZS5hY3RpdmVJbmRleDtcblxuICAgICAgcmV0dXJuICgoc291cmNlSW5kZXggJSBtYW51YWxMb29wLm9yaWdpbmFsQ291bnQpICsgbWFudWFsTG9vcC5vcmlnaW5hbENvdW50KSAlIG1hbnVhbExvb3Aub3JpZ2luYWxDb3VudDtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2V0UGFnaW5hdGlvbkFjdGl2ZUluZGV4ID0gKGFjdGl2ZUluZGV4KSA9PiB7XG4gICAgICBpZiAoIXBhZ2luYXRpb25FbGVtZW50KSByZXR1cm47XG5cbiAgICAgIGNvbnN0IGRvdHMgPSBBcnJheS5mcm9tKHBhZ2luYXRpb25FbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zd2lwZXJfcGFnaW5hdGlvbl9kb3QnKSk7XG5cbiAgICAgIGRvdHMuZm9yRWFjaCgoZG90LCBpbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBpc0FjdGl2ZSA9IGluZGV4ID09PSBhY3RpdmVJbmRleDtcblxuICAgICAgICBkb3QuY2xhc3NMaXN0LnRvZ2dsZSgnaXMtYWN0aXZlJywgaXNBY3RpdmUpO1xuICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdhcmlhLWN1cnJlbnQnLCBpc0FjdGl2ZSA/ICd0cnVlJyA6ICdmYWxzZScpO1xuICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgaXNBY3RpdmUgPyBgQ3VycmVudCBzbGlkZSAke2luZGV4ICsgMX1gIDogYEdvIHRvIHNsaWRlICR7aW5kZXggKyAxfWApO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZVBhZ2luYXRpb24gPSAoc3dpcGVySW5zdGFuY2UsIG1hbnVhbExvb3ApID0+IHtcbiAgICAgIGlmICghcGFnaW5hdGlvbkVsZW1lbnQgfHwgIW1hbnVhbExvb3Aub3JpZ2luYWxDb3VudCkgcmV0dXJuO1xuICAgICAgc2V0UGFnaW5hdGlvbkFjdGl2ZUluZGV4KGdldFBhZ2luYXRpb25JbmRleChzd2lwZXJJbnN0YW5jZSwgbWFudWFsTG9vcCkpO1xuICAgIH07XG5cbiAgICBjb25zdCB1cGRhdGVNYW51YWxMb29wTmF2aWdhdGlvbiA9IChzd2lwZXJJbnN0YW5jZSwgbWFudWFsTG9vcCkgPT4ge1xuICAgICAgaWYgKCFtYW51YWxMb29wLmVuYWJsZWQgfHwgIXN3aXBlckluc3RhbmNlIHx8IHN3aXBlckluc3RhbmNlLmRlc3Ryb3llZCkgcmV0dXJuO1xuXG4gICAgICBbcHJldkJ1dHRvbiwgbmV4dEJ1dHRvbl0uZm9yRWFjaCgoYnV0dG9uKSA9PiB7XG4gICAgICAgIGlmICghYnV0dG9uKSByZXR1cm47XG4gICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdpcy1kaXNhYmxlZCcsICdpcy1sb2NrZWQnKTtcbiAgICAgICAgYnV0dG9uLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZSgnYXJpYS1kaXNhYmxlZCcsICdmYWxzZScpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGJ1aWxkUGFnaW5hdGlvbiA9IChtYW51YWxMb29wKSA9PiB7XG4gICAgICBpZiAoIXBhZ2luYXRpb25FbGVtZW50IHx8ICFtYW51YWxMb29wLm9yaWdpbmFsQ291bnQpIHJldHVybjtcblxuICAgICAgcGFnaW5hdGlvbkVsZW1lbnQucmVwbGFjZUNoaWxkcmVuKCk7XG5cbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBtYW51YWxMb29wLm9yaWdpbmFsQ291bnQ7IGluZGV4ICs9IDEpIHtcbiAgICAgICAgY29uc3QgZG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG5cbiAgICAgICAgZG90LmNsYXNzTmFtZSA9ICdzd2lwZXJfcGFnaW5hdGlvbl9kb3QnO1xuICAgICAgICBkb3QudHlwZSA9ICdidXR0b24nO1xuICAgICAgICBkb3Quc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYEdvIHRvIHNsaWRlICR7aW5kZXggKyAxfWApO1xuXG4gICAgICAgIGRvdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICBpZiAoIXN3aXBlciB8fCBzd2lwZXIuZGVzdHJveWVkKSByZXR1cm47XG5cbiAgICAgICAgICBzZXRQYWdpbmF0aW9uQWN0aXZlSW5kZXgoaW5kZXgpO1xuXG4gICAgICAgICAgaWYgKG1hbnVhbExvb3AuZW5hYmxlZCkge1xuICAgICAgICAgICAgc3dpcGVyLnNsaWRlVG8obWFudWFsTG9vcC5vcmlnaW5hbENvdW50ICsgaW5kZXgpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3dpcGVyLnBhcmFtcy5sb29wICYmIHR5cGVvZiBzd2lwZXIuc2xpZGVUb0xvb3AgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvTG9vcChpbmRleCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN3aXBlci5zbGlkZVRvKGluZGV4KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHBhZ2luYXRpb25FbGVtZW50LmFwcGVuZENoaWxkKGRvdCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGNyZWF0ZVN3aXBlciA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHNldHRpbmdzID0gcmVhZFNldHRpbmdzKCk7XG4gICAgICBhcHBseUVhc2luZyhudWxsLCBzZXR0aW5ncyk7XG5cbiAgICAgIGNvbnN0IG1heFNsaWRlc1BlclZpZXcgPSBNYXRoLm1heChzZXR0aW5ncy5zbGlkZXNNb2JpbGUsIHNldHRpbmdzLnNsaWRlc0xhbmRzY2FwZSwgc2V0dGluZ3Muc2xpZGVzVGFibGV0LCBzZXR0aW5ncy5zbGlkZXNEZXNrdG9wKTtcblxuICAgICAgY29uc3QgbWFudWFsTG9vcCA9IHByZXBhcmVNYW51YWxMb29wKHNldHRpbmdzKTtcbiAgICAgIGNvbnN0IGxvb3BBZGRpdGlvbmFsU2xpZGVzID0gc2V0dGluZ3Muc2hvdWxkTG9vcCAmJiAhbWFudWFsTG9vcC5lbmFibGVkID8gTWF0aC5jZWlsKG1heFNsaWRlc1BlclZpZXcpIDogMDtcblxuICAgICAgYnVpbGRQYWdpbmF0aW9uKG1hbnVhbExvb3ApO1xuXG4gICAgICByZXR1cm4gbmV3IFN3aXBlcihzd2lwZXJFbGVtZW50LCB7XG4gICAgICAgIGluaXRpYWxTbGlkZTogbWFudWFsTG9vcC5lbmFibGVkID8gbWFudWFsTG9vcC5zdGFydEluZGV4IDogMCxcbiAgICAgICAgc2xpZGVzUGVyVmlldzogc2V0dGluZ3Muc2xpZGVzTW9iaWxlLFxuICAgICAgICBjZW50ZXJlZFNsaWRlczogc2V0dGluZ3Muc2hvdWxkQ2VudGVyLFxuICAgICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgICAgc3BhY2VCZXR3ZWVuOiBzZXR0aW5ncy5nYXAsXG4gICAgICAgIHNwZWVkOiBzZXR0aW5ncy5zcGVlZCxcbiAgICAgICAgbG9vcDogc2V0dGluZ3Muc2hvdWxkTG9vcCAmJiAhbWFudWFsTG9vcC5lbmFibGVkLFxuICAgICAgICBsb29wQWRkaXRpb25hbFNsaWRlcyxcbiAgICAgICAgcmV3aW5kOiBtYW51YWxMb29wLmVuYWJsZWQgPyBmYWxzZSA6IHNldHRpbmdzLnNob3VsZFJld2luZCxcbiAgICAgICAgd2F0Y2hPdmVyZmxvdzogIW1hbnVhbExvb3AuZW5hYmxlZCxcbiAgICAgICAgYWxsb3dUb3VjaE1vdmU6IHNldHRpbmdzLnNob3VsZERyYWcsXG4gICAgICAgIHNpbXVsYXRlVG91Y2g6IHNldHRpbmdzLnNob3VsZERyYWcsXG4gICAgICAgIGdyYWJDdXJzb3I6IHNldHRpbmdzLnNob3VsZERyYWcsXG4gICAgICAgIGF1dG9wbGF5OiBzZXR0aW5ncy5zaG91bGRBdXRvcGxheVxuICAgICAgICAgID8ge1xuICAgICAgICAgICAgZGVsYXk6IHNldHRpbmdzLmF1dG9wbGF5RGVsYXksXG4gICAgICAgICAgICBkaXNhYmxlT25JbnRlcmFjdGlvbjogc2V0dGluZ3MuYXV0b3BsYXlEaXNhYmxlT25JbnRlcmFjdGlvbixcbiAgICAgICAgICAgIHBhdXNlT25Nb3VzZUVudGVyOiBzZXR0aW5ncy5hdXRvcGxheVBhdXNlT25Nb3VzZUVudGVyLFxuICAgICAgICAgICAgcmV2ZXJzZURpcmVjdGlvbjogc2V0dGluZ3MuYXV0b3BsYXlSZXZlcnNlLFxuICAgICAgICAgICAgc3RvcE9uTGFzdFNsaWRlOiBmYWxzZSxcbiAgICAgICAgICAgIHdhaXRGb3JUcmFuc2l0aW9uOiB0cnVlLFxuICAgICAgICAgIH1cbiAgICAgICAgICA6IGZhbHNlLFxuICAgICAgICBrZXlib2FyZDogc2V0dGluZ3Muc2hvdWxkVXNlS2V5Ym9hcmRcbiAgICAgICAgICA/IHtcbiAgICAgICAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBvbmx5SW5WaWV3cG9ydDogdHJ1ZSxcbiAgICAgICAgICB9XG4gICAgICAgICAgOiBmYWxzZSxcbiAgICAgICAgbmF2aWdhdGlvbjpcbiAgICAgICAgICBuZXh0QnV0dG9uICYmIHByZXZCdXR0b25cbiAgICAgICAgICAgID8ge1xuICAgICAgICAgICAgICBuZXh0RWw6IG5leHRCdXR0b24sXG4gICAgICAgICAgICAgIHByZXZFbDogcHJldkJ1dHRvbixcbiAgICAgICAgICAgICAgZGlzYWJsZWRDbGFzczogJ2lzLWRpc2FibGVkJyxcbiAgICAgICAgICAgICAgbG9ja0NsYXNzOiAnaXMtbG9ja2VkJyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogZmFsc2UsXG4gICAgICAgIGJyZWFrcG9pbnRzOiB7XG4gICAgICAgICAgNDgwOiB7XG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiBzZXR0aW5ncy5zbGlkZXNMYW5kc2NhcGUsXG4gICAgICAgICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgICAgICAgIHNwYWNlQmV0d2Vlbjogc2V0dGluZ3MuZ2FwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgNzY4OiB7XG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiBzZXR0aW5ncy5zbGlkZXNUYWJsZXQsXG4gICAgICAgICAgICBzbGlkZXNQZXJHcm91cDogMSxcbiAgICAgICAgICAgIHNwYWNlQmV0d2Vlbjogc2V0dGluZ3MuZ2FwLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgOTkyOiB7XG4gICAgICAgICAgICBzbGlkZXNQZXJWaWV3OiBzZXR0aW5ncy5zbGlkZXNEZXNrdG9wLFxuICAgICAgICAgICAgc2xpZGVzUGVyR3JvdXA6IDEsXG4gICAgICAgICAgICBzcGFjZUJldHdlZW46IHNldHRpbmdzLmdhcCxcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uIChzd2lwZXJJbnN0YW5jZSkge1xuICAgICAgICAgICAgY29uc3QgaW5zdGFuY2UgPSBzd2lwZXJJbnN0YW5jZSB8fCB0aGlzO1xuXG4gICAgICAgICAgICBhcHBseUVhc2luZyhpbnN0YW5jZSwgc2V0dGluZ3MpO1xuICAgICAgICAgICAgbm9ybWFsaXplTWFudWFsTG9vcChpbnN0YW5jZSwgbWFudWFsTG9vcCk7XG4gICAgICAgICAgICB1cGRhdGVNYW51YWxMb29wTmF2aWdhdGlvbihpbnN0YW5jZSwgbWFudWFsTG9vcCk7XG4gICAgICAgICAgICB1cGRhdGVQYWdpbmF0aW9uKGluc3RhbmNlLCBtYW51YWxMb29wKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNsaWRlQ2hhbmdlOiBmdW5jdGlvbiAoc3dpcGVySW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHVwZGF0ZVBhZ2luYXRpb24oc3dpcGVySW5zdGFuY2UgfHwgdGhpcywgbWFudWFsTG9vcCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzbGlkZUNoYW5nZVRyYW5zaXRpb25TdGFydDogZnVuY3Rpb24gKHN3aXBlckluc3RhbmNlKSB7XG4gICAgICAgICAgICB1cGRhdGVQYWdpbmF0aW9uKHN3aXBlckluc3RhbmNlIHx8IHRoaXMsIG1hbnVhbExvb3ApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgYmVmb3JlVHJhbnNpdGlvblN0YXJ0OiBmdW5jdGlvbiAoc3dpcGVySW5zdGFuY2UpIHtcbiAgICAgICAgICAgIGFwcGx5RWFzaW5nKHN3aXBlckluc3RhbmNlIHx8IHRoaXMsIHNldHRpbmdzKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldFRyYW5zaXRpb246IGZ1bmN0aW9uIChzd2lwZXJJbnN0YW5jZSkge1xuICAgICAgICAgICAgYXBwbHlFYXNpbmcoc3dpcGVySW5zdGFuY2UgfHwgdGhpcywgc2V0dGluZ3MpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdG91Y2hTdGFydDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgc3dpcGVyRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdpcy1kcmFnZ2luZycpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdG91Y2hFbmQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHN3aXBlckVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnaXMtZHJhZ2dpbmcnKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNsaWRlQ2hhbmdlVHJhbnNpdGlvbkVuZDogZnVuY3Rpb24gKHN3aXBlckluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHN3aXBlckluc3RhbmNlIHx8IHRoaXM7XG5cbiAgICAgICAgICAgIG5vcm1hbGl6ZU1hbnVhbExvb3AoaW5zdGFuY2UsIG1hbnVhbExvb3ApO1xuICAgICAgICAgICAgdXBkYXRlTWFudWFsTG9vcE5hdmlnYXRpb24oaW5zdGFuY2UsIG1hbnVhbExvb3ApO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgdHJhbnNpdGlvbkVuZDogZnVuY3Rpb24gKHN3aXBlckluc3RhbmNlKSB7XG4gICAgICAgICAgICBjb25zdCBpbnN0YW5jZSA9IHN3aXBlckluc3RhbmNlIHx8IHRoaXM7XG5cbiAgICAgICAgICAgIG5vcm1hbGl6ZU1hbnVhbExvb3AoaW5zdGFuY2UsIG1hbnVhbExvb3ApO1xuICAgICAgICAgICAgdXBkYXRlTWFudWFsTG9vcE5hdmlnYXRpb24oaW5zdGFuY2UsIG1hbnVhbExvb3ApO1xuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgbGV0IHN3aXBlciA9IGNyZWF0ZVN3aXBlcigpO1xuICAgIGxldCByZWZyZXNoRnJhbWU7XG5cbiAgICBjb25zdCByZWZyZXNoU3dpcGVyID0gKCkgPT4ge1xuICAgICAgaWYgKHJlZnJlc2hGcmFtZSkgY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVmcmVzaEZyYW1lKTtcblxuICAgICAgcmVmcmVzaEZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgaWYgKHN3aXBlciAmJiAhc3dpcGVyLmRlc3Ryb3llZCkgc3dpcGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSk7XG4gICAgICAgIHN3aXBlciA9IGNyZWF0ZVN3aXBlcigpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IHVwZGF0ZUdhcCA9ICgpID0+IHtcbiAgICAgIGlmICghc3dpcGVyIHx8IHN3aXBlci5kZXN0cm95ZWQpIHJldHVybjtcblxuICAgICAgY29uc3Qgc2V0dGluZ3MgPSByZWFkU2V0dGluZ3MoKTtcblxuICAgICAgc3dpcGVyLnBhcmFtcy5zcGFjZUJldHdlZW4gPSBzZXR0aW5ncy5nYXA7XG4gICAgICBPYmplY3Qua2V5cyhzd2lwZXIucGFyYW1zLmJyZWFrcG9pbnRzIHx8IHt9KS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgc3dpcGVyLnBhcmFtcy5icmVha3BvaW50c1trZXldLnNwYWNlQmV0d2VlbiA9IHNldHRpbmdzLmdhcDtcbiAgICAgIH0pO1xuXG4gICAgICBhcHBseUVhc2luZyhzd2lwZXIsIHNldHRpbmdzKTtcbiAgICAgIHN3aXBlci51cGRhdGUoKTtcbiAgICB9O1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgICBjb25zdCBzaG91bGRSZWZyZXNoID0gbXV0YXRpb25zLnNvbWUoKG11dGF0aW9uKSA9PiBhdHRyaWJ1dGVOYW1lcy5pbmNsdWRlcyhtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lKSk7XG4gICAgICBpZiAoc2hvdWxkUmVmcmVzaCkgcmVmcmVzaFN3aXBlcigpO1xuICAgIH0pO1xuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShjb21wb25lbnQsIHtcbiAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICBhdHRyaWJ1dGVGaWx0ZXI6IGF0dHJpYnV0ZU5hbWVzLFxuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHVwZGF0ZUdhcCk7XG5cbiAgICAvLyBSZWdpc3RlciBjbGVhbnVwIGZvciB0aGlzIGluc3RhbmNlIC0gcnVucyBvbiB0aGUgbmV4dCBpbml0U3dpcGVyQ2Fyb3VzZWxzKClcbiAgICAvLyAobmV4dCBCYXJiYSB2aXNpdCB0byBhIHBhZ2Ugd2l0aCBjYXJvdXNlbHMpLCBiZWZvcmUgbmV3IGluc3RhbmNlcyBhcmUgbWFkZS5cbiAgICBzd2lwZXJDbGVhbnVwRm5zLnB1c2goKCkgPT4ge1xuICAgICAgaWYgKHJlZnJlc2hGcmFtZSkgY2FuY2VsQW5pbWF0aW9uRnJhbWUocmVmcmVzaEZyYW1lKTtcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB1cGRhdGVHYXApO1xuICAgICAgaWYgKHN3aXBlciAmJiAhc3dpcGVyLmRlc3Ryb3llZCkgc3dpcGVyLmRlc3Ryb3kodHJ1ZSwgdHJ1ZSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG4vLyA+IEhvdyBpdCBXb3JrcyAtIHdob2xlIG1hc2sgKHNoYXBlICsgdmlkZW8pIHNsaWRlcyBpbiBmcm9tIGJlbG93LCBkZXNrdG9wIG9ubHkgKEhvbWUgKyBQYXJ0bmVyc2hpcClcbmZ1bmN0aW9uIGluaXRIaXdNYXNrU2xpZGVJbigpIHtcbiAgdmFyIHRyYWNrID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIltob21lLWhpdy1zY3J1Yl1cIik7XG4gIGlmICghdHJhY2sgfHwgIXdpbmRvdy5nc2FwIHx8ICF3aW5kb3cuU2Nyb2xsVHJpZ2dlcikgcmV0dXJuO1xuICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gNzY3KSByZXR1cm47IC8vIGRlc2t0b3Agb25seVxuXG4gIHZhciBtYXNrID0gdHJhY2sucXVlcnlTZWxlY3RvcihcIlt2aWRlby1kaWFtb25kLW1hc2tdXCIpO1xuICBpZiAoIW1hc2spIHJldHVybjtcblxuICBnc2FwLmZyb21UbyhtYXNrLFxuICAgIHsgeVBlcmNlbnQ6IDUwIH0sXG4gICAge1xuICAgICAgeVBlcmNlbnQ6IDAsXG4gICAgICBlYXNlOiBcIm5vbmVcIixcbiAgICAgIHNjcm9sbFRyaWdnZXI6IHtcbiAgICAgICAgdHJpZ2dlcjogdHJhY2ssXG4gICAgICAgIHN0YXJ0OiBcInRvcCBib3R0b21cIixcbiAgICAgICAgZW5kOiAoKSA9PiBcInRvcCB0b3AtPVwiICsgKHdpbmRvdy5pbm5lckhlaWdodCAqIDAuMjUpLFxuICAgICAgICBzY3J1YjogdHJ1ZVxuICAgICAgfVxuICAgIH1cbiAgKTtcbn1cblxuXG4vLyAtLS0gR0xPQkUgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8vID4gQnVuZGxlcyBob3N0ZWQgb24gRE8gU3BhY2VzIChnbG9iZSwgZ2xhc3MpIC0gZWFjaCBzY3JpcHQgaXMgbG9hZGVkIG9uY2UsIG9uIHRoZSBmaXJzdCBwYWdlIHRoYXQgbmVlZHMgaXRcbmNvbnN0IFNQQUNFX0JBU0UgPSBcImh0dHBzOi8vcG9scGhhcm1hLmZyYTEuY2RuLmRpZ2l0YWxvY2VhbnNwYWNlcy5jb20vXCI7XG5jb25zdCBzcGFjZVNjcmlwdHMgPSB7fTtcblxuZnVuY3Rpb24gbG9hZFNwYWNlU2NyaXB0KGZpbGUsIGdsb2JhbE5hbWUpIHtcbiAgaWYgKHdpbmRvd1tnbG9iYWxOYW1lXSkgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuICBpZiAoIXNwYWNlU2NyaXB0c1tmaWxlXSkge1xuICAgIHNwYWNlU2NyaXB0c1tmaWxlXSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGNvbnN0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gICAgICBzY3JpcHQuc3JjID0gU1BBQ0VfQkFTRSArIGZpbGU7XG4gICAgICBzY3JpcHQub25sb2FkID0gcmVzb2x2ZTtcbiAgICAgIHNjcmlwdC5vbmVycm9yID0gKCkgPT4geyBkZWxldGUgc3BhY2VTY3JpcHRzW2ZpbGVdOyByZWplY3QobmV3IEVycm9yKGZpbGUgKyBcIiBmYWlsZWQgdG8gbG9hZFwiKSk7IH07IC8vIGFsbG93IHJldHJ5IG9uIG5leHQgZW50ZXJcbiAgICAgIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gc3BhY2VTY3JpcHRzW2ZpbGVdO1xufVxuXG4vLyA+IEdsb2JlIHNlY3Rpb24gLSBzY3JvbGwtZHJpdmVuIFRocmVlLmpzIGdsb2JlOyBidW5kbGUgKyBnZW9tZXRyeSBvbiBETyBTcGFjZXMsIGxvYWRlZCBvbmx5IG9uIHBhZ2VzIHdpdGggI3BiLWdsb2JlXG5sZXQgZ2xvYmVBcGkgPSBudWxsO1xubGV0IGdsb2JlQWJvcnQgPSBudWxsO1xuXG5mdW5jdGlvbiBpbml0UGJHbG9iZSgpIHtcbiAgY29uc3Qgc2VjdGlvbiA9IG5leHRQYWdlLnF1ZXJ5U2VsZWN0b3IoXCIjcGItZ2xvYmVcIik7IC8vIGVsZW1lbnQsIG5vdCBzZWxlY3RvcjogYm90aCBCYXJiYSBjb250YWluZXJzIGV4aXN0IGR1cmluZyBzeW5jIHRyYW5zaXRpb25cbiAgaWYgKCFzZWN0aW9uKSByZXR1cm47XG5cbiAgZGVzdHJveVBiR2xvYmUoKTtcbiAgY29uc3QgYWJvcnQgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gIGdsb2JlQWJvcnQgPSBhYm9ydDtcblxuICBsb2FkU3BhY2VTY3JpcHQoXCJnbG9iZS12MS5qc1wiLCBcIkdsb2JlQXBwXCIpXG4gICAgLnRoZW4oKCkgPT4gd2luZG93Lkdsb2JlQXBwLmluaXRHbG9iZSh7IGhvc3Q6IHNlY3Rpb24sIGJpblVybDogU1BBQ0VfQkFTRSArIFwiZ2xvYmUtdjEuYmluXCIsIHNpZ25hbDogYWJvcnQuc2lnbmFsIH0pKVxuICAgIC50aGVuKChhcGkpID0+IHtcbiAgICAgIGlmIChhYm9ydC5zaWduYWwuYWJvcnRlZCkgeyBhcGkuZGVzdHJveSgpOyByZXR1cm47IH0gLy8gbGVmdCB0aGUgcGFnZSB3aGlsZSB0aGUgc2NyaXB0IHdhcyBsb2FkaW5nXG4gICAgICBnbG9iZUFwaSA9IGFwaTtcbiAgICAgIGlmIChhcGkuc3RpY2t5QnJva2VuKSBjb25zb2xlLndhcm4oXCJbZ2xvYmVdIHN0aWNreSBicm9rZW4gYnk6XCIsIGFwaS5zdGlja3lCcm9rZW4pO1xuICAgIH0pXG4gICAgLmNhdGNoKChlKSA9PiB7IGlmIChlLm5hbWUgIT09IFwiQWJvcnRFcnJvclwiKSBjb25zb2xlLndhcm4oXCJbZ2xvYmVdXCIsIGUpOyB9KTtcbn1cblxuZnVuY3Rpb24gZGVzdHJveVBiR2xvYmUoKSB7XG4gIGlmIChnbG9iZUFib3J0KSB7IGdsb2JlQWJvcnQuYWJvcnQoKTsgZ2xvYmVBYm9ydCA9IG51bGw7IH1cbiAgaWYgKGdsb2JlQXBpKSB7IGdsb2JlQXBpLmRlc3Ryb3koKTsgZ2xvYmVBcGkgPSBudWxsOyB9XG59XG5cblxuLy8gLS0tIEdMQVNTIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyA+IFdlYkdMIGdsYXNzIHNoYXBlcy4gRWFjaCBbcGItZ2xhc3NdIHdyYXBwZXIgPSBvbmUgaW5zdGFuY2U7IGluc2lkZSBpdCBbcGItZ2xhc3Mtc2hhcGU9XCJjaXJjbGVcIl0gYW5kL29yXG4vLyBbcGItZ2xhc3Mtc2hhcGU9XCJzcXVhcmVcIl0gKHNxdWFyZSA9IHdpdGggaG9sZSkuIEdsYXNzIGRyYXdzIGVhY2ggc2hhcGUgd2hlcmV2ZXIgaXRzIHBsYWNlaG9sZGVyIGlzIHJpZ2h0IG5vd1xuLy8gKHBvc2l0aW9uICsgc2l6ZSwgaW5jbC4gR1NBUCAvIFdlYmZsb3cgSVggdHJhbnNmb3JtcykgLT4gbW90aW9uIGNvbWVzIGZyb20gdGhlIGV4aXN0aW5nIGludGVyYWN0aW9ucy5cbi8vIERlZmF1bHQgbG9vayA9IHRoZSBmbGF0IENTUyBzaGFwZTogc3R5bGUuY3NzIGRyYXdzIGl0IGluIGV2ZXJ5IEVNUFRZIHBsYWNlaG9sZGVyIChvciB0aGUgcGxhY2Vob2xkZXIncyBvd24gY29udGVudFxuLy8gaXMgdXNlZCkuIEl0IHN0YXlzIHVudGlsIHRoZSBnbGFzcyBpcyByZWFkeSBBTkQgdGhlIHNoYXBlIGlzIG9mZiBzY3JlZW4gKG5ldmVyIHN3YXBzIGluIGZyb250IG9mIHRoZSB1c2VyKSwgYW5kXG4vLyBjb21lcyBiYWNrIHdoZW5ldmVyIGdsYXNzIGNhbid0IHJ1bi5cbi8vIEZsb3c6IGluc3RhbnQgY2hlY2sgKHRvdWNoIGRldmljZSAvIFNhdmUtRGF0YSAvIGxvdyBtZW1vcnkgLyBmZXcgY29yZXMgLyBubyBXZWJHTDIgLyByZW1lbWJlcmVkIFwib2ZmXCIpIC0+IENTUyBzaGFwZXMsXG4vLyBidW5kbGUgbmV2ZXIgZG93bmxvYWRlZC4gT3RoZXJ3aXNlIGluIGlkbGUgdGltZSBhZnRlciBsb2FkOiBidW5kbGUgKyBvbmUgc2hhcmVkIGVuZ2luZSAoR2xhc3NBcHAud2FybTogb25lIFdlYkdMXG4vLyBjb250ZXh0LCBnZW9tZXRyeSBpbiBhIHdvcmtlciwgR1BVICsgQ1BVIHRlc3QpIC0+IGluc3RhbmNlcyAofjIgbXMgZWFjaCkuIFdhdGNoZG9nOiBnbGFzcyBiZWxvdyB+MzAgZnBzIC0+IGJhY2sgdG9cbi8vIENTUyBzaGFwZXMgd2hlbiBvZmYgc2NyZWVuLiBNZWFzdXJlZCByZXN1bHRzIGFyZSByZW1lbWJlcmVkIGZvciBHTEFTU19TVE9SRV9EQVlTIChsb2NhbFN0b3JhZ2UpLlxuLy8gUmVmcmFjdHMgW3BiLWdsYXNzLWJhY2tkcm9wXSBlbGVtZW50cyBvZiB0aGUgd3JhcHBlcidzIHNlY3Rpb24gLyBmb290ZXIuIEJ1bmRsZSBvbiBETyBTcGFjZXMgKHNvdXJjZTogLi4vZ2xhc3MpLlxuLy8gW3BiLWdsYXNzLXRpbHRdIG9uIHRoZSB3cmFwcGVyID0gc2hhcGVzIHRpbHQgdG93YXJkIHRoZSBtb3VzZSBvdmVyIGl0cyBzZWN0aW9uIChlbXB0eSA9IEdMQVNTX1RJTFQsIG9yIGEgbnVtYmVyKS5cbi8vIENvbnNvbGU6IEdsYXNzQXBwLmluZm8oKSAoZW5naW5lKSwgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oXCJwYi1nbGFzc1wiKSA9IGZvcmdldCB0aGUgZGVjaXNpb24uXG5jb25zdCBHTEFTU19GSUxFID0gXCJnbGFzcy05MDgxODE2Yi5qc1wiOyAvLyBzZXQgYnkgYG5wbSBydW4gYnVpbGRgIGluIC4uL2dsYXNzIChoYXNoZWQgbmFtZSA9IG5vIGNhY2hlIHByb2JsZW1zKSAtIGRvbid0IGVkaXQgYnkgaGFuZFxuLy8gdHVuZWQgaW4gdGhlIGdsYXNzLXRlc3QgcHJvdG90eXBlIGJ5IHRoZSBkZXNpZ25lciAoMjAyNi0xMC0yMSk7IGtleXMgPSBidW5kbGUgREVGQVVMVFMsIG5vIHJlYnVpbGQgbmVlZGVkXG5jb25zdCBHTEFTU19QQVJBTVMgPSB7XG4gIC8vIGdsYXNzXG4gIGlvcjogMS40NSxcbiAgcmVmcmFjdGlvbjogNzAsXG4gIGRpc3BlcnNpb246IDAuMDYsXG4gIGZyZXNuZWw6IDAuMzUsXG4gIHJlZmxlY3Rpb25zOiAxLjEsXG4gIHRpbnQ6IFwiI2VhZmZmOVwiLFxuICAvLyBzaGFwZSB0aGlja25lc3NcbiAgZGVwdGg6IDgsXG4gIGNpcmNsZUJldmVsOiAyNixcbiAgY2lyY2xlQmV2ZWxEZXB0aDogMTgsXG4gIHNxdWFyZUJldmVsOiA1LjcsIC8vIGtlZXAgPCA1LjggKHdhbGwgbmV4dCB0byB0aGUgaG9sZSlcbiAgc3F1YXJlQmV2ZWxEZXB0aDogMTEsXG4gIC8vIG92ZXJsYXAgLyBsYXllcmluZ1xuICBsYXllckdhcDogMTQsXG4gIG1heEJlbmQ6IDU1LFxuICBzaGFkb3c6IDAsXG4gIHNoYWRvd0JsdXI6IDE2LFxuICBzaGFkb3dPZmZzZXQ6IDE0LFxufTtcbmNvbnN0IEdMQVNTX1RJTFQgPSAwLjI4OyAvLyBkZWZhdWx0IFtwYi1nbGFzcy10aWx0XSBzdHJlbmd0aCAocHJvdG90eXBlIHZhbHVlLCByYWQgYXQgdGhlIHNlY3Rpb24gZWRnZSlcbmNvbnN0IEdMQVNTX1NUT1JFID0gXCJwYi1nbGFzc1wiOyAvLyBsb2NhbFN0b3JhZ2Uga2V5OiB7IG9rLCByZWFzb24sIHQgfVxuY29uc3QgR0xBU1NfU1RPUkVfREFZUyA9IDMwO1xuY29uc3QgZ2xhc3NMaXZlID0gbmV3IE1hcCgpOyAvLyBob3N0IC0+IGFwaVxubGV0IGdsYXNzU3RhdGUgPSBcImlkbGVcIjsgLy8gaWRsZSAtPiB3YXJtaW5nIC0+IG9uIHwgb2ZmXG5sZXQgZ2xhc3NSZWFkeSA9IG51bGw7IC8vIFByb21pc2Ugb2YgdGhlIHdhcm0gZW5naW5lXG5sZXQgZ2xhc3NUaWNrZXIgPSBmYWxzZTtcblxuZnVuY3Rpb24gZ2xhc3NNZW1vKHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgaWYgKHZhbHVlKSB7IGxvY2FsU3RvcmFnZS5zZXRJdGVtKEdMQVNTX1NUT1JFLCBKU09OLnN0cmluZ2lmeSh7IC4uLnZhbHVlLCB0OiBEYXRlLm5vdygpIH0pKTsgcmV0dXJuIG51bGw7IH1cbiAgICBjb25zdCBzYXZlZCA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oR0xBU1NfU1RPUkUpIHx8IFwibnVsbFwiKTtcbiAgICByZXR1cm4gc2F2ZWQgJiYgRGF0ZS5ub3coKSAtIHNhdmVkLnQgPCBHTEFTU19TVE9SRV9EQVlTICogODY0ZTUgPyBzYXZlZCA6IG51bGw7XG4gIH0gY2F0Y2ggKGUpIHsgcmV0dXJuIG51bGw7IH0gLy8gcHJpdmF0ZSBtb2RlIC8gYmxvY2tlZCBzdG9yYWdlXG59XG5cbi8vID4gSW5zdGFudCBkZWNpc2lvbiAtIG5vIGRvd25sb2FkLCBubyBHUFUgd29yay4gUmV0dXJucyB3aHkgdGhlIENTUyBzaGFwZXMgc3RheSwgb3IgbnVsbCA9IHRyeSBnbGFzcy5cbmZ1bmN0aW9uIGdsYXNzU2tpcFJlYXNvbigpIHtcbiAgaWYgKHdpbmRvdy5tYXRjaE1lZGlhKFwiKGhvdmVyOiBub25lKSwgKHBvaW50ZXI6IGNvYXJzZSlcIikubWF0Y2hlcykgcmV0dXJuIFwidG91Y2ggZGV2aWNlXCI7XG4gIGNvbnN0IGNvbm4gPSBuYXZpZ2F0b3IuY29ubmVjdGlvbjtcbiAgaWYgKGNvbm4gJiYgY29ubi5zYXZlRGF0YSkgcmV0dXJuIFwic2F2ZS1kYXRhXCI7XG4gIGlmIChuYXZpZ2F0b3IuZGV2aWNlTWVtb3J5ICYmIG5hdmlnYXRvci5kZXZpY2VNZW1vcnkgPD0gNCkgcmV0dXJuIFwibG93IG1lbW9yeVwiO1xuICBpZiAobmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3kgJiYgbmF2aWdhdG9yLmhhcmR3YXJlQ29uY3VycmVuY3kgPD0gNCkgcmV0dXJuIFwiZmV3IENQVSBjb3Jlc1wiO1xuICBpZiAodHlwZW9mIFdlYkdMMlJlbmRlcmluZ0NvbnRleHQgPT09IFwidW5kZWZpbmVkXCIpIHJldHVybiBcIm5vIFdlYkdMMlwiO1xuICBjb25zdCBzYXZlZCA9IGdsYXNzTWVtbygpO1xuICBpZiAoc2F2ZWQgJiYgIXNhdmVkLm9rKSByZXR1cm4gXCJyZW1lbWJlcmVkOiBcIiArIHNhdmVkLnJlYXNvbjtcbiAgcmV0dXJuIG51bGw7XG59XG5cbi8vID4gRmxhdCBzaGFwZXMgPSBDU1MgKFtwYi1nbGFzcy1zaGFwZV06ZW1wdHkgaW4gc3R5bGUuY3NzKSBvciB0aGUgcGxhY2Vob2xkZXIncyBvd24gY29udGVudCAtIG5vdGhpbmcgdG8gaW5qZWN0IGhlcmUuXG5cbmZ1bmN0aW9uIGdsYXNzUGFyYW1zKGhvc3QpIHtcbiAgaWYgKCFob3N0Lmhhc0F0dHJpYnV0ZShcInBiLWdsYXNzLXRpbHRcIikpIHJldHVybiBHTEFTU19QQVJBTVM7XG4gIGNvbnN0IHRpbHQgPSBwYXJzZUZsb2F0KGhvc3QuZ2V0QXR0cmlidXRlKFwicGItZ2xhc3MtdGlsdFwiKSk7XG4gIHJldHVybiB7IC4uLkdMQVNTX1BBUkFNUywgdGlsdDogaXNOYU4odGlsdCkgPyBHTEFTU19USUxUIDogdGlsdCB9O1xufVxuXG4vLyA+IEdsYXNzIG9mZiBmb3IgdGhpcyBwYWdlIGxvYWQuIHJlbWVtYmVyID0gbWVhc3VyZWQgcmVzdWx0IChzbG93IEdQVSAvIENQVSwgd2F0Y2hkb2cpIC0+IHNraXAgb24gdGhlIG5leHQgdmlzaXRzIHRvby5cbi8vIGdlbnRsZSA9IGVhY2ggaW5zdGFuY2UgaGFuZHMgYmFjayB0byBpdHMgQ1NTIHNoYXBlIHRoZSBuZXh0IHRpbWUgaXQncyBvZmYgc2NyZWVuICh3YXRjaGRvZyksIGVsc2UgaW1tZWRpYXRlbHkuXG5mdW5jdGlvbiBnbGFzc09mZihyZWFzb24sIHJlbWVtYmVyLCBnZW50bGUpIHtcbiAgaWYgKGdsYXNzU3RhdGUgPT09IFwib2ZmXCIpIHJldHVybjtcbiAgZ2xhc3NTdGF0ZSA9IFwib2ZmXCI7XG4gIGNvbnNvbGUuaW5mbyhcIltnbGFzc10gQ1NTIHNoYXBlczpcIiwgcmVhc29uKTtcbiAgaWYgKHJlbWVtYmVyKSBnbGFzc01lbW8oeyBvazogZmFsc2UsIHJlYXNvbiB9KTtcbiAgZ2xhc3NMaXZlLmZvckVhY2goKGFwaSkgPT4gKGdlbnRsZSA/IGFwaS5yZXRpcmUoKSA6IGFwaS5kZXN0cm95KCkpKTtcbiAgaWYgKCFnZW50bGUpIGdsYXNzTGl2ZS5jbGVhcigpO1xufVxuXG5mdW5jdGlvbiBpbml0UGJHbGFzcygpIHtcbiAgY29uc3QgaG9zdHMgPSBbLi4uZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltwYi1nbGFzc11cIildLmZpbHRlcigoaCkgPT4gIWdsYXNzTGl2ZS5oYXMoaCkpO1xuICBpZiAoIWhvc3RzLmxlbmd0aCkgcmV0dXJuO1xuICBpZiAoZ2xhc3NTdGF0ZSA9PT0gXCJvZmZcIikgcmV0dXJuOyAvLyBDU1Mgc2hhcGVzIHN0YXlcbiAgaWYgKGdsYXNzU3RhdGUgPT09IFwiaWRsZVwiKSB7XG4gICAgY29uc3Qgc2tpcCA9IGdsYXNzU2tpcFJlYXNvbigpO1xuICAgIGlmIChza2lwKSB7IGdsYXNzT2ZmKHNraXAsIGZhbHNlKTsgcmV0dXJuOyB9XG4gICAgZ2xhc3NTdGF0ZSA9IFwid2FybWluZ1wiO1xuICAgIGdsYXNzUmVhZHkgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gKHdpbmRvdy5yZXF1ZXN0SWRsZUNhbGxiYWNrID8gcmVxdWVzdElkbGVDYWxsYmFjayhyZXNvbHZlLCB7IHRpbWVvdXQ6IDI1MDAgfSkgOiBzZXRUaW1lb3V0KHJlc29sdmUsIDMwMCkpKVxuICAgICAgLnRoZW4oKCkgPT4gbG9hZFNwYWNlU2NyaXB0KEdMQVNTX0ZJTEUsIFwiR2xhc3NBcHBcIikpXG4gICAgICAudGhlbigoKSA9PiB3aW5kb3cuR2xhc3NBcHAud2FybSh7XG4gICAgICAgIHBhcmFtczogR0xBU1NfUEFSQU1TLFxuICAgICAgICB3b3JrZXJVcmw6IFNQQUNFX0JBU0UgKyBHTEFTU19GSUxFLCAvLyB0aGUgd29ya2VyIGxvYWRzIHRoZSBzYW1lIGJ1bmRsZSBmb3IgdGhlIGdlb21ldHJ5XG4gICAgICAgIG9uU2xvdzogKGUpID0+IGdsYXNzT2ZmKGUubWVzc2FnZSwgdHJ1ZSwgdHJ1ZSksXG4gICAgICB9KSlcbiAgICAgIC50aGVuKChpbmZvKSA9PiB7XG4gICAgICAgIGlmIChnbGFzc1N0YXRlICE9PSBcIndhcm1pbmdcIikgdGhyb3cgbmV3IEVycm9yKFwiZ2xhc3MgdHVybmVkIG9mZiB3aGlsZSB3YXJtaW5nXCIpO1xuICAgICAgICBnbGFzc1N0YXRlID0gXCJvblwiO1xuICAgICAgICBnbGFzc01lbW8oeyBvazogdHJ1ZSwgcmVhc29uOiBpbmZvLmdwdSB9KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgY29uc3QgbXNnID0gZSAmJiBlLm1lc3NhZ2UgPyBlLm1lc3NhZ2UgOiBTdHJpbmcoZSk7XG4gICAgICAgIGdsYXNzT2ZmKG1zZywgL3Nsb3d8c29mdHdhcmUvLnRlc3QobXNnKSk7IC8vIG5ldHdvcmsgLyBidW5kbGUgZXJyb3JzIGFyZSBub3QgcmVtZW1iZXJlZFxuICAgICAgICB0aHJvdyBlO1xuICAgICAgfSk7XG4gIH1cbiAgZ2xhc3NSZWFkeS50aGVuKCgpID0+IGdsYXNzQ3JlYXRlKGhvc3RzKSkuY2F0Y2goKCkgPT4geyB9KTtcbn1cblxuLy8gb25lIGluc3RhbmNlIHBlciBpZGxlIHNsb3QgKGVhY2ggfjIgbXMgKyBpdHMgYmFja2Ryb3AgcGFpbnQpIC0gc3ByZWFkLCBub3Qgb25lIGJsb2NrXG5mdW5jdGlvbiBnbGFzc0NyZWF0ZShob3N0cykge1xuICBpZiAoIWdsYXNzVGlja2VyKSB7XG4gICAgZ2xhc3NUaWNrZXIgPSB0cnVlO1xuICAgIGdzYXAudGlja2VyLmFkZCgoKSA9PiBnbGFzc0xpdmUuZm9yRWFjaCgoYXBpKSA9PiBhcGkudXBkYXRlKCkpKTsgLy8gYWZ0ZXIgR1NBUCBtb3ZlZCB0aGUgcGxhY2Vob2xkZXJzXG4gIH1cbiAgY29uc3QgbmV4dCA9ICgpID0+IHtcbiAgICBpZiAoZ2xhc3NTdGF0ZSAhPT0gXCJvblwiKSByZXR1cm47XG4gICAgY29uc3QgaG9zdCA9IGhvc3RzLnNoaWZ0KCk7XG4gICAgaWYgKCFob3N0KSByZXR1cm47XG4gICAgaWYgKGhvc3QuaXNDb25uZWN0ZWQgJiYgIWdsYXNzTGl2ZS5oYXMoaG9zdCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGdsYXNzTGl2ZS5zZXQoaG9zdCwgd2luZG93LkdsYXNzQXBwLmluaXRHbGFzcyh7XG4gICAgICAgICAgaG9zdCxcbiAgICAgICAgICBiYWNrZHJvcFJvb3Q6IGhvc3QuY2xvc2VzdChcInNlY3Rpb24sIGZvb3RlclwiKSB8fCBob3N0LnBhcmVudEVsZW1lbnQsXG4gICAgICAgICAgcGFyYW1zOiBnbGFzc1BhcmFtcyhob3N0KSxcbiAgICAgICAgICBxdWFsaXR5OiBcImhpZ2hcIixcbiAgICAgICAgICBvbkZhaWw6IChlKSA9PiBnbGFzc09mZihlLm1lc3NhZ2UsIGZhbHNlKSxcbiAgICAgICAgfSkpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbZ2xhc3NdXCIsIGUubWVzc2FnZSwgaG9zdCk7IC8vIHRoaXMgd3JhcHBlciBrZWVwcyBpdHMgQ1NTIHNoYXBlc1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoaG9zdHMubGVuZ3RoKSAod2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2sgPyByZXF1ZXN0SWRsZUNhbGxiYWNrKG5leHQsIHsgdGltZW91dDogNTAwIH0pIDogc2V0VGltZW91dChuZXh0LCAxNikpO1xuICB9O1xuICBuZXh0KCk7XG59XG5cbi8vIGNvbnRhaW5lciA9IGxlYXZpbmcgQmFyYmEgcGFnZSAoZm9vdGVyIG91dHNpZGUgaXQga2VlcHMgaXRzIGdsYXNzKTsgbm8gY29udGFpbmVyID0gZXZlcnl0aGluZy4gVGhlIGVuZ2luZSBzdGF5cy5cbmZ1bmN0aW9uIGRlc3Ryb3lQYkdsYXNzKGNvbnRhaW5lcikge1xuICBbLi4uZ2xhc3NMaXZlLmtleXMoKV0uZm9yRWFjaCgoaCkgPT4ge1xuICAgIGlmIChjb250YWluZXIgJiYgIWNvbnRhaW5lci5jb250YWlucyhoKSAmJiBoLmlzQ29ubmVjdGVkKSByZXR1cm47XG4gICAgZ2xhc3NMaXZlLmdldChoKS5kZXN0cm95KCk7XG4gICAgZ2xhc3NMaXZlLmRlbGV0ZShoKTtcbiAgfSk7XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxPQUFLLGVBQWUsWUFBWSxXQUFXLGVBQWUsSUFBSTtBQUU5RCxVQUFRLG9CQUFvQjtBQUU1QixNQUFJLFFBQVE7QUFDWixNQUFJLFdBQVc7QUFDZixNQUFJLDJCQUEyQjtBQUMvQixNQUFJLHFCQUFxQixDQUFDO0FBRTFCLE1BQU0sV0FBVyxPQUFPLE9BQU8sVUFBVTtBQUN6QyxNQUFNLG1CQUFtQixPQUFPLE9BQU8sa0JBQWtC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RSxRQUFRLEdBQUcsaUJBQWlCLGNBQWMsQ0FBQztBQUNsRSxVQUFJLEdBQUksTUFBSyxJQUFJLElBQUksRUFBRSxRQUFRLEdBQUcsaUJBQWlCLGNBQWMsQ0FBQztBQUNsRSxVQUFJLEdBQUksTUFBSyxJQUFJLElBQUksRUFBRSxRQUFRLEdBQUcsaUJBQWlCLGNBQWMsQ0FBQztBQUVsRSxVQUFJLE9BQVEsTUFBSyxJQUFJLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQztBQUM3QyxVQUFJLE9BQVEsTUFBSyxJQUFJLFFBQVEsRUFBRSxXQUFXLEVBQUUsQ0FBQztBQUU3QyxTQUNHLEdBQUcsUUFBUSxFQUFFLFNBQVMsR0FBRyxVQUFVLEtBQUssTUFBTSxhQUFhLEdBQUcsQ0FBQyxFQUMvRCxHQUFHLFlBQVksRUFBRSxTQUFTLEdBQUcsVUFBVSxLQUFLLE1BQU0sYUFBYSxHQUFHLEdBQUcsRUFDckUsR0FBRyxlQUFlLEVBQUUsVUFBVSxHQUFHLFVBQVUsS0FBSyxTQUFTLE1BQU0sTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUN4RixHQUFHLElBQUksRUFBRSxRQUFRLEdBQUcsVUFBVSxLQUFLLE1BQU0sYUFBYSxHQUFHLEdBQUcsRUFDNUQsR0FBRyxTQUFTLEVBQUUsVUFBVSxHQUFHLFVBQVUsS0FBSyxTQUFTLE1BQU0sTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUNsRixHQUFHLFFBQVEsRUFBRSxXQUFXLEdBQUcsVUFBVSxJQUFJLEdBQUcsR0FBRyxFQUMvQyxHQUFHLFFBQVEsRUFBRSxXQUFXLEdBQUcsVUFBVSxJQUFJLEdBQUcsR0FBRyxFQUMvQyxHQUFHLElBQUksRUFBRSxRQUFRLEdBQUcsVUFBVSxHQUFLLE1BQU0sYUFBYSxHQUFHLENBQUcsRUFDNUQsR0FBRyxTQUFTLEVBQUUsVUFBVSxHQUFHLFVBQVUsR0FBSyxTQUFTLE1BQU0sTUFBTSxhQUFhLEdBQUcsR0FBRyxFQUNsRixHQUFHLFFBQVEsRUFBRSxXQUFXLEdBQUcsVUFBVSxJQUFJLEdBQUcsR0FBRyxFQUMvQyxHQUFHLFFBQVEsRUFBRSxXQUFXLEdB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