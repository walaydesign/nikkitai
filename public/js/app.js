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

  fetch("header.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("header").innerHTML = html;
      header();
    });

  function header() {
    document
      .querySelector(".header-menu")
      ?.addEventListener("click", function () {
        this.classList.toggle("active");
        document.querySelector(".header-nav__list")?.classList.toggle("active");
      });

    // nav-item
    const currentPage = location.pathname.split("/").pop();
    document.querySelectorAll(".nav-item").forEach((item) => {
      const href = item.getAttribute("href");
      console.log("currentPage=" + currentPage + ",href=" + href);
      if (href === currentPage) {
        item.classList.add("active");
      }
    });
  }

  // footer
  fetch("footer.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("footer").innerHTML = html;
    });

})();
