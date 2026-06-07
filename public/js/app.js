/* app.js — Nikki Life blog: vanilla-JS behaviours + data-driven rendering */
(function () {
  // Scroll Reveal Animation
  const observerOptions = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

  // Smooth Scroll for Nav Links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });


  // header
  document
    .querySelector(".header-menu")
    ?.addEventListener("click", function () {
      this.classList.toggle("active");
      document.querySelector(".header-nav__list")?.classList.toggle("active");
    });

  var BLOG = window.BLOG,
    SITE = window.SITE;
  var $ = function (s, r) {
    return (r || document).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || document).querySelectorAll(s));
  };
  function param(n) {
    return new URLSearchParams(location.search).get(n);
  }

  /* ---------- markup builders ---------- */
  function cardHTML(a) {
    return (
      "" +
      '<a class="reveal group block p-3 rounded-[30px] transition-all duration-500 hover:-translate-y-2.5 hover:shadow-card" href="article.html?id=' +
      a.id +
      '">' +
      '<div class="blob overflow-hidden mb-4 h-[220px]"><img src="' +
      a.img +
      '" alt="" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"></div>' +
      '<div class="flex items-center gap-3">' +
      '<span class="font-sans font-bold text-xs tracking-[0.15em] text-taupe">' +
      a.cat +
      "</span>" +
      '<span class="font-sans text-xs text-inksoft">' +
      a.date +
      "</span>" +
      "</div>" +
      '<h3 class="font-serif text-[22px] text-ink mt-2 mb-2 leading-snug">' +
      a.title +
      "</h3>" +
      '<p class="text-sm text-inksoft leading-relaxed">' +
      a.excerpt +
      "</p>" +
      "</a>"
    );
  }
  function featHTML(a) {
    return (
      "" +
      '<a class="flex gap-3.5 items-center group" href="article.html?id=' +
      a.id +
      '">' +
      '<div class="flex-none w-16 h-16 rounded-2xl overflow-hidden"><img src="' +
      a.img +
      '" alt="" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"></div>' +
      '<div><div class="font-sans text-[11px] tracking-[0.12em] text-taupe">' +
      a.cat +
      "</div>" +
      '<div class="font-serif text-[15px] text-ink leading-snug mt-0.5 group-hover:text-espresso">' +
      a.title +
      "</div></div>" +
      "</a>"
    );
  }
  function emptyHTML(title, sub) {
    var chips = BLOG.popularTags
      .slice(0, 5)
      .map(function (t) {
        return (
          '<a class="font-sans text-[13px] text-taupe bg-cream px-4 py-1.5 rounded-full hover:bg-greige transition" href="tag.html?tag=' +
          encodeURIComponent(t) +
          '">#' +
          t +
          "</a>"
        );
      })
      .join("");
    return (
      '<div class="reveal text-center py-16 px-6 col-span-full">' +
      '<div class="w-[88px] h-[88px] rounded-full bg-cream grid place-items-center text-taupe text-3xl mx-auto mb-6"><i class="fa-solid fa-feather-pointed"></i></div>' +
      '<h3 class="font-serif text-2xl text-ink mb-3">' +
      title +
      "</h3>" +
      '<p class="text-[15px] text-inksoft max-w-[360px] mx-auto mb-7">' +
      sub +
      "</p>" +
      '<div class="flex flex-wrap gap-2.5 justify-center">' +
      chips +
      "</div></div>"
    );
  }

  /* ---------- scroll reveal (capture/print safe) ---------- */
  function setupReveal() {
    var fold = function () {
      return window.innerHeight - 60;
    };
    var els = $$(".reveal");
    els.forEach(function (el) {
      if (el.getBoundingClientRect().top > fold()) el.classList.add("pending");
    });
    var check = function () {
      els.forEach(function (el) {
        if (
          el.classList.contains("pending") &&
          el.getBoundingClientRect().top < fold()
        )
          el.classList.remove("pending");
      });
    };
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
  }

  /* ---------- lightbox ---------- */
  var lb;
  function ensureLightbox() {
    if (lb) return lb;
    lb = document.createElement("div");
    lb.className =
      "lightbox fixed inset-0 z-[100] flex items-center justify-center p-6";
    lb.style.background = "rgba(49,44,41,.78)";
    lb.style.backdropFilter = "blur(6px)";
    lb.innerHTML =
      "" +
      '<button class="lb-close absolute top-7 right-7 w-12 h-12 rounded-full bg-white/90 text-ink text-xl grid place-items-center hover:scale-105 transition"><i class="fa-solid fa-xmark"></i></button>' +
      '<div class="box bg-white rounded-[30px] overflow-hidden max-w-[720px] w-full shadow-media">' +
      '<div class="aspect-video overflow-hidden bg-ink"><img class="lb-img w-full h-full object-cover" alt=""></div>' +
      '<div class="px-7 pt-6 pb-7"><span class="lb-cat font-sans font-bold text-xs tracking-[0.15em] text-taupe"></span>' +
      '<h3 class="lb-ttl font-serif text-2xl text-ink mt-2"></h3></div>' +
      "</div>";
    document.body.appendChild(lb);
    var close = function () {
      lb.classList.remove("open");
    };
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.closest(".lb-close")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
    return lb;
  }
  function openLightbox(item) {
    var el = ensureLightbox();
    $(".lb-img", el).src = item.thumb || item.img;
    $(".lb-cat", el).textContent = item.cat || "";
    $(".lb-ttl", el).textContent = item.title || item.ttl || "";
    el.classList.add("open");
  }

  /* ---------- shared chrome: mobile nav, nav active, form, marquee ---------- */
  function setupChrome() {
    var page = document.body.getAttribute("data-page");
    var navKey =
      page === "about"
        ? "about"
        : ["list", "search", "tag", "article"].indexOf(page) >= 0
          ? "articles"
          : "";
    $$("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === navKey)
        a.classList.add("text-espresso", "font-medium");
    });
    var burger = $("#burger"),
      menu = $("#mobile-menu");
    if (burger && menu)
      burger.addEventListener("click", function () {
        menu.classList.toggle("hidden");
      });

    $$("form[data-fake]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var ok = f.getAttribute("data-ok") || "謝謝你的訊息！我會盡快回覆 ♡";
        f.innerHTML =
          '<div class="text-center py-6 font-serif text-2xl text-espresso">' +
          ok +
          "</div>";
      });
    });
    $$("form[data-search]").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var v = (f.querySelector("input").value || "").trim();
        if (v) location.href = "search.html?q=" + encodeURIComponent(v);
      });
    });
    var track = $("#marquee-track");
    if (track && SITE) {
      var loop = SITE.brands.concat(SITE.brands);
      track.innerHTML = loop
        .map(function (b) {
          return (
            '<div class="w-[220px] flex-none flex items-center justify-center px-[18px]">' +
            '<span class="' +
            b.cls +
            ' text-inksoft opacity-65 hover:opacity-100 hover:text-taupe transition-all duration-300 whitespace-nowrap">' +
            b.name +
            "</span></div>"
          );
        })
        .join("");
    }
  }

  /* ---------- page renderers ---------- */
  function renderHome() {
    var g = $("#featured-grid");
    if (g) {
      g.innerHTML = BLOG.articles.slice(0, 6).map(cardHTML).join("");
    }
    var vg = $("#video-grid");
    if (vg)
      vg.innerHTML = SITE.videos
        .map(function (v) {
          return (
            '<div class="reveal group cursor-pointer js-light" data-img="' +
            v.img +
            '" data-cat="' +
            v.cat +
            '" data-ttl="' +
            v.title +
            '">' +
            '<div class="rounded-[30px] overflow-hidden shadow-card mb-3.5 aspect-video"><img src="' +
            v.img +
            '" alt="" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"></div>' +
            '<h4 class="font-serif text-[17px] text-ink px-1.5 leading-relaxed">' +
            v.title +
            "</h4></div>"
          );
        })
        .join("");
    var sh = $("#shorts");
    if (sh)
      sh.innerHTML = SITE.shorts
        .map(function (s) {
          return (
            '<div class="reveal w-[150px] cursor-pointer js-light" data-img="' +
            s.img +
            '" data-cat="SHORTS" data-ttl="' +
            s.label +
            '" style="transform:rotate(' +
            s.rot +
            'deg)">' +
            '<img src="' +
            s.img +
            '" alt="" class="w-full aspect-[9/16] object-cover shadow-media rounded-md"><p class="text-center mt-3 text-sm font-medium text-ink">' +
            s.label +
            "</p></div>"
          );
        })
        .join("");
    bindLight();
  }
  // function renderAbout() {
  //   var r = $("#roles");
  //   if (r)
  //     r.innerHTML = SITE.roles
  //       .map(function (x) {
  //         return (
  //           '<div class="reveal flex gap-5 items-start bg-white border border-taupe/15 rounded-[30px] px-8 py-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card">' +
  //           '<div class="flex-none w-16 h-16 rounded-full bg-cream grid place-items-center text-taupe text-[26px]"><i class="fa-solid ' +
  //           x.ic +
  //           '"></i></div>' +
  //           '<div><h3 class="font-serif text-[22px] text-ink font-medium mt-1 mb-2">' +
  //           x.title +
  //           "</h3>" +
  //           '<p class="text-sm text-inksoft leading-relaxed">' +
  //           x.desc +
  //           "</p></div></div>"
  //         );
  //       })
  //       .join("");
  //   var g = $("#gallery");
  //   if (g)
  //     g.innerHTML = SITE.gallery
  //       .map(function (x) {
  //         return (
  //           '<div class="reveal mb-5 break-inside-avoid rounded-3xl overflow-hidden shadow-soft relative group cursor-pointer js-light" data-img="' +
  //           x.img +
  //           '" data-cat="' +
  //           x.tag +
  //           '" data-ttl="' +
  //           x.ttl +
  //           '">' +
  //           '<img src="' +
  //           x.img +
  //           '" alt="" class="w-full block transition-transform duration-700 group-hover:scale-105">' +
  //           '<div class="absolute inset-x-0 bottom-0 pt-7 pb-3.5 px-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" style="background:linear-gradient(transparent,rgba(49,44,41,.6))">' +
  //           '<div class="font-sans text-[11px] tracking-[0.15em] opacity-85">' +
  //           x.tag +
  //           "</div>" +
  //           '<div class="font-serif text-[17px] mt-0.5">' +
  //           x.ttl +
  //           "</div></div></div>"
  //         );
  //       })
  //       .join("");
  //   bindLight();
  // }
  function fillSidebar() {
    var sf = $("#side-featured");
    if (sf) sf.innerHTML = BLOG.articles.slice(0, 5).map(featHTML).join("");
  }
  function renderList() {
    var g = $("#card-grid");
    if (g) g.innerHTML = BLOG.articles.map(cardHTML).join("");
    fillSidebar();
  }
  function renderSearch() {
    var q = param("q") || "";
    var res = BLOG.search(q);
    var qt = $("#result-q");
    if (qt) qt.textContent = "「" + q + "」";
    var cl = $("#result-count");
    if (cl)
      cl.innerHTML =
        '找到 <b class="text-taupe font-bold">' +
        res.length +
        "</b> 篇相關文章";
    var si = $("#side-search-input");
    if (si) si.value = q;
    var g = $("#card-grid");
    if (g)
      g.innerHTML = res.length
        ? res.map(cardHTML).join("")
        : emptyHTML(
            "沒有找到相關文章",
            "找不到與「" + q + "」相符的內容。換個關鍵字，或試試這些熱門標籤：",
          );
    fillSidebar();
  }
  function renderTag() {
    var tag = param("tag"),
      cat = param("cat");
    var arts, label, titleHTML;
    if (cat) {
      arts = BLOG.byCat(cat);
      label = "分類";
      titleHTML = '分類：<span class="text-espresso italic">' + cat + "</span>";
    } else {
      arts = BLOG.byTag(tag || "");
      label = "標籤";
      titleHTML =
        '標籤：<span class="text-espresso italic">#' + (tag || "") + "</span>";
    }
    var lb2 = $("#crumb-label");
    if (lb2) lb2.textContent = label;
    var eb = $("#result-eyebrow");
    if (eb) eb.textContent = cat ? "Category" : "Tagged";
    var t = $("#result-title");
    if (t) t.innerHTML = titleHTML;
    var cl = $("#result-count");
    if (cl)
      cl.innerHTML =
        '共 <b class="text-taupe font-bold">' + arts.length + "</b> 篇文章";
    var g = $("#card-grid");
    if (g)
      g.innerHTML = arts.length
        ? arts.map(cardHTML).join("")
        : emptyHTML(
            "這個分類還沒有文章",
            "再等等，好內容正在路上。先看看其他熱門標籤：",
          );
    fillSidebar();
  }
  function renderArticle() {
    var id = param("id");
    var arts = BLOG.articles;
    var idx = arts.findIndex(function (a) {
      return a.id === id;
    });
    if (idx < 0) idx = 0;
    var a = arts[idx];
    var prev = arts[(idx - 1 + arts.length) % arts.length];
    var next = arts[(idx + 1) % arts.length];
    var related = arts
      .filter(function (x, i) {
        return i !== idx && x.cat === a.cat;
      })
      .slice(0, 3);
    var k = 1;
    while (related.length < 3) {
      var c = arts[(idx + k) % arts.length];
      if (c.id !== a.id && related.indexOf(c) < 0) related.push(c);
      k++;
      if (k > arts.length) break;
    }

    document.title = a.title + " — Nikki Life";
    $("#a-crumb-cat").textContent = a.cat;
    $("#a-cat").textContent = a.cat;
    $("#a-date").innerHTML =
      '<i class="fa-regular fa-calendar mr-1.5"></i>' + a.date;
    $("#a-title").textContent = a.title;
    $("#a-img").src = a.img;
    $("#a-prose").innerHTML = BLOG.body
      .map(function (b) {
        if (b.type === "lead") return '<p class="lead">' + b.text + "</p>";
        if (b.type === "h2") return "<h2>" + b.text + "</h2>";
        if (b.type === "quote")
          return "<blockquote>" + b.text + "</blockquote>";
        return "<p>" + b.text + "</p>";
      })
      .join("");
    $("#a-tags").innerHTML =
      '<span class="font-sans text-[13px] text-inksoft">標籤</span>' +
      (a.tags || [])
        .map(function (t) {
          return (
            '<a class="font-sans text-[13px] text-taupe bg-cream px-[18px] py-1.5 rounded-full hover:bg-greige transition" href="tag.html?tag=' +
            encodeURIComponent(t) +
            '">#' +
            t +
            "</a>"
          );
        })
        .join("");

    $("#a-prev").href = "article.html?id=" + prev.id;
    $("#a-prev .pn-ttl").textContent = prev.title;
    $("#a-next").href = "article.html?id=" + next.id;
    $("#a-next .pn-ttl").textContent = next.title;
    $("#a-related").innerHTML = related.map(cardHTML).join("");
  }

  function bindLight() {
    $$(".js-light").forEach(function (el) {
      if (el._b) return;
      el._b = 1;
      el.addEventListener("click", function () {
        openLightbox({
          thumb: el.getAttribute("data-img"),
          cat: el.getAttribute("data-cat"),
          title: el.getAttribute("data-ttl"),
        });
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.getAttribute("data-page");
    setupChrome();
    if (page === "home") renderHome();
    else if (page === "about") renderAbout();
    else if (page === "list") renderList();
    else if (page === "search") renderSearch();
    else if (page === "tag") renderTag();
    else if (page === "article") renderArticle();
    setupReveal();
  });
})();
