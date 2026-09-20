/* 宝宝印记 BabyLog — 官网共享脚本：中英切换 + App Store 链接注入 */
(function () {
  "use strict";

  /* TODO: App 上架后把这里换成 App Store 链接，例如：
     var APP_STORE_URL = "https://apps.apple.com/cn/app/id1234567890"; */
  var APP_STORE_URL = "";

  var LANG_KEY = "babylog-lang";

  function currentLang() {
    var saved = null;
    try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* 隐私模式下忽略 */ }
    if (saved === "zh" || saved === "en") return saved;
    if (typeof navigator !== "undefined" && navigator.language &&
        navigator.language.toLowerCase().indexOf("zh") !== 0) return "en";
    return "zh";
  }

  function applyLang(lang) {
    var nodes = document.querySelectorAll("[data-zh]");
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var text = el.getAttribute(lang === "en" ? "data-en" : "data-zh");
      if (text == null) continue;
      if (el.getAttribute("data-rich") === "1") {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    }
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "zh-CN");
    var btns = document.querySelectorAll(".lang-btn");
    for (var j = 0; j < btns.length; j++) {
      btns[j].textContent = lang === "en" ? "中文" : "EN";
      btns[j].setAttribute("aria-label",
        lang === "en" ? "切换到中文" : "Switch to English");
    }
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* 忽略 */ }
  }

  function bindToggle() {
    var btns = document.querySelectorAll(".lang-btn");
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function () {
        var next = document.documentElement.getAttribute("lang") === "en" ? "zh" : "en";
        applyLang(next);
      });
    }
  }

  function bindStoreLinks() {
    var links = document.querySelectorAll("[data-appstore]");
    for (var i = 0; i < links.length; i++) {
      if (APP_STORE_URL) {
        links[i].setAttribute("href", APP_STORE_URL);
      } else {
        links[i].setAttribute("href", "#");
        links[i].addEventListener("click", function (e) { e.preventDefault(); });
        links[i].setAttribute("title", "App Store 链接待上架后配置 / coming soon");
      }
    }
  }

  function init() {
    applyLang(currentLang());
    bindToggle();
    bindStoreLinks();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
