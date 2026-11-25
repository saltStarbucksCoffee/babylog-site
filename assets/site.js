/* 宝宝印记 BabyLog — 官网共享脚本：七语言切换 + App Store 链接注入 */
(function () {
  "use strict";

  var LANGUAGES = ["zh-Hans", "zh-TW", "zh-HK", "zh-MO", "en", "ja", "ko"];
  var HTML_LANG = {
    "zh-Hans": "zh-Hans", "zh-TW": "zh-TW", "zh-HK": "zh-HK",
    "zh-MO": "zh-MO", "en": "en", "ja": "ja", "ko": "ko"
  };
  var DEFAULT_LANG = "zh-Hans";
  var LANG_KEY = "babylog-lang";
  var STORE_FALLBACK = "https://apps.apple.com/app/id6814028524";

  var dictionary = null;

  function readStorage() {
    try { return localStorage.getItem(LANG_KEY); } catch (e) { return null; }
  }

  function writeStorage(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* 隐私模式忽略 */ }
  }

  /* ?lang= 优先；其次记住的选择；最后按浏览器语言匹配，未覆盖的语言回退英语。 */
  function preferredLang() {
    var query = null;
    try {
      query = new URLSearchParams(window.location.search).get("lang");
    } catch (e) { /* 老浏览器忽略 */ }
    if (query && LANGUAGES.indexOf(query) !== -1) return query;

    var saved = readStorage();
    if (saved && LANGUAGES.indexOf(saved) !== -1) return saved;

    var tag = String((navigator.languages && navigator.languages[0]) || navigator.language || "").toLowerCase();
    if (tag.indexOf("zh") === 0) {
      if (tag.indexOf("hant") !== -1 || /-(tw|hk|mo)\b/.test(tag)) {
        if (/-hk\b/.test(tag)) return "zh-HK";
        if (/-mo\b/.test(tag)) return "zh-MO";
        return "zh-TW";
      }
      return "zh-Hans";
    }
    if (tag.indexOf("ja") === 0) return "ja";
    if (tag.indexOf("ko") === 0) return "ko";
    if (tag.indexOf("en") === 0) return "en";
    return "en";
  }

  function text(lang, key) {
    if (!dictionary || !dictionary.keys[key]) return null;
    var value = dictionary.keys[key][lang];
    return typeof value === "string" && value !== "" ? value : null;
  }

  function applyLang(lang) {
    var nodes = document.querySelectorAll(
      "[data-i18n], [data-i18n-content], [data-i18n-alt], [data-i18n-src], [data-i18n-aria]"
    );
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key;
      var value;
      // 逐个属性独立判断：同一元素常同时带 data-i18n-alt 与 data-i18n-src，
      // 用 else-if 会让配图永远轮不到切换。
      if ((key = el.getAttribute("data-i18n"))) {
        value = text(lang, key);
        if (value !== null) el.textContent = value;
      }
      if ((key = el.getAttribute("data-i18n-content"))) {
        value = text(lang, key);
        if (value !== null) el.setAttribute("content", value);
      }
      if ((key = el.getAttribute("data-i18n-alt"))) {
        value = text(lang, key);
        if (value !== null) el.setAttribute("alt", value);
      }
      if ((key = el.getAttribute("data-i18n-src"))) {
        // 配图随语言切换：截图本身是分语言生成的，不能只换文字。
        value = text(lang, key);
        if (value !== null && el.getAttribute("src") !== value) el.setAttribute("src", value);
      }
      if ((key = el.getAttribute("data-i18n-aria"))) {
        value = text(lang, key);
        if (value !== null) el.setAttribute("aria-label", value);
      }
    }
    document.documentElement.setAttribute("lang", HTML_LANG[lang] || DEFAULT_LANG);

    var selects = document.querySelectorAll(".lang-select");
    for (var j = 0; j < selects.length; j++) selects[j].value = lang;
  }

  function applyStoreLinks(url) {
    var links = document.querySelectorAll("[data-appstore]");
    for (var i = 0; i < links.length; i++) links[i].setAttribute("href", url || STORE_FALLBACK);
  }

  function bindLanguageSelect() {
    var selects = document.querySelectorAll(".lang-select");
    for (var i = 0; i < selects.length; i++) {
      selects[i].addEventListener("change", function (event) {
        var lang = event.target.value;
        if (LANGUAGES.indexOf(lang) === -1) return;
        writeStorage(lang);
        applyLang(lang);
      });
    }
  }

  function init() {
    var lang = preferredLang();
    // ?lang= 深链进入后记住选择，否则跳到隐私页/支持页时语言会掉回默认。
    if (location.search.indexOf("lang=") !== -1) writeStorage(lang);
    bindLanguageSelect();
    applyLang(lang);

    fetch("assets/i18n.json", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (data) {
        dictionary = data;
        applyStoreLinks(data._meta && data._meta.appStoreURL);
        applyLang(lang);
      })
      .catch(function () {
        /* 字典加载失败（file:// 预览等）时保留 HTML 内嵌的简体中文兜底 */
        applyStoreLinks(STORE_FALLBACK);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();