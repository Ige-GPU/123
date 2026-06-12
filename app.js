(function () {
  "use strict";

  const form = document.getElementById("search-form");
  const input = document.getElementById("keyword");
  const statusEl = document.getElementById("status");
  const resultsEl = document.getElementById("results");
  const paginationEl = document.getElementById("pagination");
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");
  const pageInfo = document.getElementById("page-info");

  document.getElementById("year").textContent = new Date().getFullYear();

  // ---- 최근 검색 (localStorage) ----
  const RECENT_KEY = "recentSearches";
  const RECENT_MAX = 5;

  function getRecent() {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveRecent(keyword) {
    const list = getRecent().filter(function (k) { return k !== keyword; });
    list.unshift(keyword);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
    } catch (e) { /* 시크릿 모드 등 저장 불가 환경 무시 */ }
    renderRecent();
  }

  function removeRecent(keyword) {
    const list = getRecent().filter(function (k) { return k !== keyword; });
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(list));
    } catch (e) { /* ignore */ }
    renderRecent();
  }

  function renderRecent() {
    const box = document.getElementById("recent");
    const chips = document.getElementById("recent-chips");
    const list = getRecent();
    box.hidden = list.length === 0;
    chips.innerHTML = "";
    list.forEach(function (keyword) {
      const chip = document.createElement("span");
      chip.className = "recent-chip";

      const go = document.createElement("button");
      go.type = "button";
      go.textContent = keyword;
      go.addEventListener("click", function () {
        input.value = keyword;
        currentKeyword = keyword;
        currentPage = 1;
        search();
      });

      const del = document.createElement("button");
      del.type = "button";
      del.className = "recent-del";
      del.setAttribute("aria-label", keyword + " 기록 삭제");
      del.textContent = "×";
      del.addEventListener("click", function () { removeRecent(keyword); });

      chip.appendChild(go);
      chip.appendChild(del);
      chips.appendChild(chip);
    });
  }

  renderRecent();

  // ---- 상세주소 한글 → 영문 자동 변환 ----
  // "101동 1001호" → "Apt 101-1001", "3층 302호" → "#302, 3F", "지하 1층" → "B1"
  function convertDetail(raw) {
    const s = (raw || "").trim();
    if (!s || !/[가-힣]/.test(s)) return s;

    const dong = s.match(/(\d+)\s*동/);
    const ho = s.match(/(\d+)\s*호/);
    const basement = s.match(/지하\s*(\d+)?\s*층?/);
    const floor = basement ? null : s.match(/(\d+)\s*층/);

    const parts = [];
    if (dong && ho) {
      parts.push("Apt " + dong[1] + "-" + ho[1]);
    } else if (ho) {
      parts.push("#" + ho[1]);
    }
    if (floor && !(dong && ho)) parts.push(floor[1] + "F");
    if (basement) parts.push("B" + (basement[1] || "1"));

    if (parts.length === 0) return s; // 변환 규칙에 안 걸리면 원문 유지
    return parts.join(", ");
  }

  const detailInput = document.getElementById("detail");
  const detailPreview = document.getElementById("detail-preview");
  const detailPreviewText = document.getElementById("detail-preview-text");

  detailInput.addEventListener("input", function () {
    const raw = detailInput.value.trim();
    const converted = convertDetail(raw);
    const show = raw !== "" && converted !== raw;
    detailPreview.hidden = !show;
    if (show) detailPreviewText.textContent = converted;
  });

  // ---- 한글 이름 로마자 변환 (국어의 로마자 표기법 + 통용 성씨 표기) ----
  const CHO = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
  const JUNG = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
  const JONG = ["","k","k","k","n","n","n","t","l","k","m","l","l","l","p","l","m","p","p","t","t","ng","t","t","k","t","p","t"];

  const SURNAMES = {
    "김":"KIM","이":"LEE","박":"PARK","최":"CHOI","정":"JUNG","강":"KANG","조":"CHO","윤":"YOON",
    "장":"JANG","임":"LIM","한":"HAN","오":"OH","서":"SEO","신":"SHIN","권":"KWON","황":"HWANG",
    "안":"AHN","송":"SONG","전":"JEON","홍":"HONG","유":"YOO","고":"KO","문":"MOON","양":"YANG",
    "손":"SON","배":"BAE","백":"BAEK","허":"HUH","남":"NAM","심":"SHIM","노":"NOH","하":"HA",
    "곽":"KWAK","성":"SUNG","차":"CHA","주":"JOO","우":"WOO","구":"KOO","민":"MIN","류":"RYU",
    "나":"NA","진":"JIN","지":"JI","엄":"UM","채":"CHAE","원":"WON","천":"CHUN","방":"BANG",
    "공":"KONG","현":"HYUN","함":"HAM","변":"BYUN","염":"YEOM","여":"YEO","추":"CHOO","도":"DO",
    "소":"SO","석":"SUK","선":"SUN","설":"SEOL","마":"MA","길":"GIL","연":"YEON","위":"WI",
    "표":"PYO","명":"MYUNG","기":"KI","금":"KEUM","왕":"WANG","반":"BAN","옥":"OK","육":"YOOK",
    "인":"IN","맹":"MAENG","제":"JE","모":"MO","탁":"TAK","국":"KOOK","은":"EUN","편":"PYUN","용":"YONG",
    "남궁":"NAMGOONG","황보":"HWANGBO","제갈":"JEGAL","선우":"SUNWOO","독고":"DOKGO","사공":"SAGONG","서문":"SEOMOON"
  };

  function romanizeSyllable(ch) {
    const code = ch.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return ch;
    return CHO[Math.floor(code / 588)] + JUNG[Math.floor((code % 588) / 28)] + JONG[code % 28];
  }

  function romanize(str) {
    return Array.prototype.map.call(str, romanizeSyllable).join("");
  }

  function convertName(raw) {
    const s = raw.replace(/\s+/g, "").trim();
    if (!s || !/^[가-힣]+$/.test(s)) return "";
    let surname, given;
    if (s.length >= 3 && SURNAMES[s.slice(0, 2)]) {
      surname = SURNAMES[s.slice(0, 2)];
      given = s.slice(2);
    } else {
      surname = SURNAMES[s[0]] || romanize(s[0]).toUpperCase();
      given = s.slice(1);
    }
    if (!given) return surname;
    return surname + " " + romanize(given).toUpperCase();
  }

  // ---- 전화번호 → +82 국제 형식 ----
  function convertPhone(raw) {
    const digits = (raw || "").replace(/\D/g, "");
    if (digits.length < 9 || digits.length > 11 || digits[0] !== "0") return "";
    let head, rest;
    if (digits.startsWith("02")) {
      head = "2";
      rest = digits.slice(2);
    } else {
      head = digits.slice(1, 3);
      rest = digits.slice(3);
    }
    return "+82-" + head + "-" + rest.slice(0, -4) + "-" + rest.slice(-4);
  }

  function bindConverter(inputId, outId, copyId, convert) {
    const inp = document.getElementById(inputId);
    const out = document.getElementById(outId);
    const copy = document.getElementById(copyId);
    inp.addEventListener("input", function () {
      const result = convert(inp.value);
      out.textContent = result;
      copy.hidden = !result;
    });
    copy.addEventListener("click", function () {
      navigator.clipboard.writeText(out.textContent).then(function () {
        copy.textContent = "복사됨!";
        setTimeout(function () { copy.textContent = "복사"; }, 1500);
      });
    });
  }

  bindConverter("kname", "kname-out", "kname-copy", convertName);
  bindConverter("kphone", "kphone-out", "kphone-copy", convertPhone);

  let currentKeyword = "";
  let currentPage = 1;
  let totalCount = 0;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    currentKeyword = input.value.trim();
    currentPage = 1;
    if (currentKeyword.length < 2) {
      showStatus("두 글자 이상 입력해 주세요.");
      return;
    }
    search();
  });

  prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      search();
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentPage * JUSO_CONFIG.countPerPage < totalCount) {
      currentPage++;
      search();
    }
  });

  function search() {
    showStatus("검색 중…");
    resultsEl.innerHTML = "";
    paginationEl.hidden = true;
    jsonp(buildUrl(currentKeyword, currentPage), handleResponse, function () {
      showStatus("주소 서버에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    });
  }

  function buildUrl(keyword, page) {
    const params = new URLSearchParams({
      confmKey: JUSO_CONFIG.apiKey,
      currentPage: String(page),
      countPerPage: String(JUSO_CONFIG.countPerPage),
      keyword: keyword,
      resultType: "json",
    });
    return JUSO_CONFIG.endpoint + "?" + params.toString();
  }

  // juso.go.kr는 CORS를 지원하지 않아 JSONP 전용 엔드포인트를 사용한다.
  function jsonp(url, onSuccess, onError) {
    const cbName = "jusoCb_" + Date.now();
    const script = document.createElement("script");
    const timer = setTimeout(function () {
      cleanup();
      onError();
    }, 10000);

    window[cbName] = function (data) {
      cleanup();
      onSuccess(data);
    };

    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      script.remove();
    }

    script.src = url + "&callback=" + cbName;
    script.onerror = function () {
      cleanup();
      onError();
    };
    document.body.appendChild(script);
  }

  function handleResponse(data) {
    const common = data && data.results && data.results.common;
    if (!common) {
      showStatus("응답을 해석할 수 없습니다.");
      return;
    }
    if (common.errorCode !== "0") {
      if (common.errorCode === "E0001") {
        showStatus("API 승인키가 유효하지 않습니다. config.js에 발급받은 키를 입력했는지 확인하세요.");
      } else {
        showStatus(common.errorMessage || "검색 중 오류가 발생했습니다.");
      }
      return;
    }

    totalCount = parseInt(common.totalCount, 10) || 0;
    const list = data.results.juso || [];
    if (totalCount === 0 || list.length === 0) {
      showStatus("검색 결과가 없습니다. 동/건물명 또는 도로명+번호로 다시 검색해 보세요.");
      return;
    }

    saveRecent(currentKeyword);

    hideStatus();
    renderResults(list);
    renderPagination();
  }

  function renderResults(list) {
    resultsEl.innerHTML = "";
    list.forEach(function (juso) {
      const card = document.createElement("article");
      card.className = "result-card";

      const zip = juso.zipNo || "";
      const fullEng = juso.roadAddr + (zip ? ", " + zip : "") + ", Republic of Korea";

      if (juso.korAddr) card.appendChild(addrBlock("한글 주소", juso.korAddr));
      card.appendChild(addrBlock("영문 주소", fullEng));
      if (juso.jibunAddr) card.appendChild(addrBlock("영문 지번 주소", juso.jibunAddr));

      // 항목별 영문 주소
      const a = parseEng(juso.roadAddr);
      const detail = convertDetail(document.getElementById("detail").value.trim());
      const block = document.createElement("div");
      block.className = "addr-block";
      const title = document.createElement("h3");
      title.className = "block-title";
      title.textContent = "항목별 영문 주소";
      block.appendChild(title);
      [
        ["Street Address 1 (Address Line 1)", a.line1],
        ["Street Address 2 (Address Line 2)", detail],
        ["City", a.city],
        ["State / Province / Region", a.state],
        ["Zip Code (Postal Code)", zip],
        ["Country", "Republic of Korea"],
      ].forEach(function (pair) {
        block.appendChild(fieldRow(pair[0], pair[1]));
      });
      card.appendChild(block);

      card.appendChild(mallSection(juso));
      if (juso.korAddr) card.appendChild(mapSection(juso.korAddr));
      resultsEl.appendChild(card);
    });
  }

  const COPY_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_SVG = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';

  function copyIcon(value) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "icon-copy";
    btn.setAttribute("aria-label", "복사");
    btn.innerHTML = COPY_SVG;
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(value).then(function () {
        btn.innerHTML = CHECK_SVG;
        btn.classList.add("copied");
        setTimeout(function () {
          btn.innerHTML = COPY_SVG;
          btn.classList.remove("copied");
        }, 1500);
      });
    });
    return btn;
  }

  function addrBlock(title, value) {
    const block = document.createElement("div");
    block.className = "addr-block";
    const h3 = document.createElement("h3");
    h3.className = "block-title";
    h3.textContent = title;
    block.appendChild(h3);
    const line = document.createElement("p");
    line.className = "addr-value";
    const span = document.createElement("span");
    span.textContent = value;
    line.appendChild(span);
    line.appendChild(copyIcon(value));
    block.appendChild(line);
    return block;
  }

  function fieldRow(label, value) {
    const div = document.createElement("div");
    div.className = "field-row";
    const labelEl = document.createElement("span");
    labelEl.className = "field-label";
    labelEl.textContent = label;
    const right = document.createElement("span");
    right.className = "field-value";
    right.textContent = value || "";
    div.appendChild(labelEl);
    div.appendChild(right);
    if (value) div.appendChild(copyIcon(value));
    return div;
  }

  // 구글 지도 임베드 — API 키 없이 동작하며 클릭 시에만 로드한다.
  function mapSection(korAddr) {
    const wrap = document.createElement("div");
    wrap.className = "map-section";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "map-toggle";
    toggle.textContent = "지도에서 위치 확인 ▾";
    wrap.appendChild(toggle);

    const holder = document.createElement("div");
    holder.className = "map-holder";
    holder.hidden = true;
    wrap.appendChild(holder);

    toggle.addEventListener("click", function () {
      holder.hidden = !holder.hidden;
      toggle.textContent = holder.hidden ? "지도에서 위치 확인 ▾" : "지도 닫기 ▴";
      if (!holder.hidden && !holder.firstChild) {
        const iframe = document.createElement("iframe");
        iframe.src = "https://www.google.com/maps?q=" + encodeURIComponent(korAddr) + "&output=embed&hl=ko";
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        iframe.title = korAddr + " 지도";
        holder.appendChild(iframe);
      }
    });

    return wrap;
  }

  // ---- 쇼핑몰 입력 양식 매핑 ----
  // 영문 도로명주소 "175 Sebyeong-ro, Deokjin-gu, Jeonju-si, Jeonbuk-do"를
  // 첫 항목 = 거리 주소, 마지막 = State(시/도), 나머지 = City(시/군/구)로 분해한다.
  function parseEng(roadAddr) {
    const parts = roadAddr.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (parts.length >= 3) {
      return {
        line1: parts[0],
        city: parts.slice(1, parts.length - 1).join(", "),
        state: parts[parts.length - 1],
      };
    }
    if (parts.length === 2) {
      return { line1: parts[0], city: parts[1], state: parts[1] };
    }
    return { line1: roadAddr, city: "", state: "" };
  }

  const MALLS = [
    {
      name: "아마존",
      fields: function (a, zip, detail) {
        return [
          ["Address Line 1", a.line1],
          ["Address Line 2", detail],
          ["City", a.city],
          ["State / Province", a.state],
          ["ZIP Code", zip],
          ["Country", "South Korea"],
        ];
      },
    },
    {
      name: "알리익스프레스",
      fields: function (a, zip, detail) {
        return [
          ["Province", a.state],
          ["City", a.city],
          ["Street Address", a.line1 + (detail ? ", " + detail : "")],
          ["ZIP Code", zip],
          ["Country/Region", "South Korea"],
        ];
      },
    },
    {
      name: "이베이",
      fields: function (a, zip, detail) {
        return [
          ["Street address", a.line1],
          ["Street address 2", detail],
          ["City", a.city],
          ["State/Province", a.state],
          ["Postal code", zip],
          ["Country", "Korea, South"],
        ];
      },
    },
    {
      name: "아이허브",
      fields: function (a, zip, detail) {
        return [
          ["주소 1", a.line1],
          ["주소 2", detail],
          ["도시", a.city],
          ["지역", a.state],
          ["우편번호", zip],
        ];
      },
    },
  ];

  function mallSection(juso) {
    const wrap = document.createElement("div");
    wrap.className = "mall-section";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mall-toggle";
    toggle.textContent = "쇼핑몰 입력 양식으로 보기 ▾";
    wrap.appendChild(toggle);

    const panel = document.createElement("div");
    panel.className = "mall-panel";
    panel.hidden = true;
    wrap.appendChild(panel);

    toggle.addEventListener("click", function () {
      panel.hidden = !panel.hidden;
      toggle.textContent = panel.hidden
        ? "쇼핑몰 입력 양식으로 보기 ▾"
        : "쇼핑몰 입력 양식 닫기 ▴";
      if (!panel.hidden) renderMallPanel(panel, juso);
    });

    return wrap;
  }

  function renderMallPanel(panel, juso) {
    panel.innerHTML = "";
    const addr = parseEng(juso.roadAddr);
    const detail = convertDetail(document.getElementById("detail").value.trim());

    const tabs = document.createElement("div");
    tabs.className = "mall-tabs";
    const body = document.createElement("div");
    body.className = "mall-fields";

    MALLS.forEach(function (mall, i) {
      const tab = document.createElement("button");
      tab.type = "button";
      tab.textContent = mall.name;
      tab.className = i === 0 ? "active" : "";
      tab.addEventListener("click", function () {
        tabs.querySelectorAll("button").forEach(function (b) { b.className = ""; });
        tab.className = "active";
        renderFields(body, mall, addr, juso.zipNo || "", detail);
      });
      tabs.appendChild(tab);
    });

    panel.appendChild(tabs);
    panel.appendChild(body);
    renderFields(body, MALLS[0], addr, juso.zipNo || "", detail);
  }

  function renderFields(body, mall, addr, zip, detail) {
    body.innerHTML = "";
    const lines = [];
    mall.fields(addr, zip, detail).forEach(function (pair) {
      const value = pair[1] || "";
      if (!value && pair[0].indexOf("2") !== -1) return; // 상세주소 미입력 시 2번 줄 생략
      body.appendChild(row(pair[0], value || "—", Boolean(value)));
      if (value) lines.push(pair[0] + ": " + value);
    });

    const copyAll = document.createElement("button");
    copyAll.type = "button";
    copyAll.className = "copy-all-btn";
    copyAll.textContent = mall.name + " 양식 전체 복사";
    copyAll.addEventListener("click", function () {
      navigator.clipboard.writeText(lines.join("\n")).then(function () {
        copyAll.textContent = "복사됨!";
        setTimeout(function () { copyAll.textContent = mall.name + " 양식 전체 복사"; }, 1500);
      });
    });
    body.appendChild(copyAll);
  }

  function row(label, value, copyable) {
    const div = document.createElement("div");
    div.className = "result-row";

    const labelEl = document.createElement("span");
    labelEl.className = "label";
    labelEl.textContent = label;

    const valueEl = document.createElement("span");
    valueEl.className = "value";
    valueEl.textContent = value;

    div.appendChild(labelEl);
    div.appendChild(valueEl);

    if (copyable) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copy-btn";
      btn.textContent = "복사";
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(value).then(function () {
          btn.textContent = "복사됨!";
          setTimeout(function () { btn.textContent = "복사"; }, 1500);
        });
      });
      div.appendChild(btn);
    }
    return div;
  }

  function renderPagination() {
    const totalPages = Math.ceil(totalCount / JUSO_CONFIG.countPerPage);
    if (totalPages <= 1) {
      paginationEl.hidden = true;
      return;
    }
    paginationEl.hidden = false;
    pageInfo.textContent = currentPage + " / " + totalPages + " (" + totalCount.toLocaleString() + "건)";
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPages;
  }

  function showStatus(msg) {
    statusEl.textContent = msg;
    statusEl.hidden = false;
  }

  function hideStatus() {
    statusEl.hidden = true;
  }
})();
