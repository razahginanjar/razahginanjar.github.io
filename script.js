(function () {
      document.documentElement.classList.add("js-enabled");

      var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-links a"));
      var sections = Array.prototype.slice.call(document.querySelectorAll("main section[id]"));

      function setActiveNav(id) {
        navLinks.forEach(function (link) {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      }

      if ("IntersectionObserver" in window) {
        var navObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              setActiveNav(entry.target.id);
            }
          });
        }, { rootMargin: "-42% 0px -48% 0px", threshold: 0 });

        sections.forEach(function (section) {
          navObserver.observe(section);
        });

        var revealObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        }, { rootMargin: "0px 0px -12% 0px", threshold: 0.1 });

        document.querySelectorAll(".reveal").forEach(function (item) {
          revealObserver.observe(item);
        });
      } else {
        document.querySelectorAll(".reveal").forEach(function (item) {
          item.classList.add("is-visible");
        });
      }

      var filterButtons = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
      var skillChips = Array.prototype.slice.call(document.querySelectorAll("[data-skill]"));

      filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          var filter = button.getAttribute("data-filter");

          filterButtons.forEach(function (item) {
            item.classList.toggle("is-active", item === button);
          });

          skillChips.forEach(function (chip) {
            var show = filter === "all" || chip.getAttribute("data-skill") === filter;
            chip.classList.toggle("is-hidden", !show);
          });
        });
      });

      var toast = document.querySelector(".toast");
      var toastTimer;

      function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add("is-visible");
        window.clearTimeout(toastTimer);
        toastTimer = window.setTimeout(function () {
          toast.classList.remove("is-visible");
        }, 1800);
      }

      function fallbackCopy(text) {
        var area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.left = "-9999px";
        document.body.appendChild(area);
        area.select();
        document.execCommand("copy");
        document.body.removeChild(area);
      }

      document.querySelectorAll(".copy-action").forEach(function (button) {
        button.addEventListener("click", function () {
          var text = button.getAttribute("data-copy");
          var original = button.textContent;

          var done = function () {
            button.textContent = "Copied";
            showToast("Copied to clipboard");
            window.setTimeout(function () {
              button.textContent = original;
            }, 1400);
          };

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(done).catch(function () {
              fallbackCopy(text);
              done();
            });
          } else {
            fallbackCopy(text);
            done();
          }
        });
      });
    }());
