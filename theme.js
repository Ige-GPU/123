// 다크모드: 저장된 설정 적용 + 토글 버튼 주입 (이모지 대신 SVG 아이콘)
(function () {
  var KEY = "theme";
  var MOON = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  var saved = stored();
  if (saved) document.documentElement.setAttribute("data-theme", saved);

  function current() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr) return attr;
    return (window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }

  var btn = document.createElement("button");
  btn.type = "button";
  btn.className = "theme-toggle";

  function paint() {
    var dark = current() === "dark";
    btn.innerHTML = dark ? SUN : MOON;
    btn.setAttribute("aria-label", dark ? "라이트 모드로 전환" : "다크 모드로 전환");
  }

  function apply(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(KEY, t); } catch (e) {}
    paint();
  }

  btn.addEventListener("click", function () {
    apply(current() === "dark" ? "light" : "dark");
  });

  function init() { document.body.appendChild(btn); paint(); }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
