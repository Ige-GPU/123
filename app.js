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

    hideStatus();
    renderResults(list);
    renderPagination();
  }

  function renderResults(list) {
    resultsEl.innerHTML = "";
    list.forEach(function (juso) {
      const card = document.createElement("article");
      card.className = "result-card";

      card.appendChild(row("영문 도로명", juso.roadAddr, true));
      if (juso.jibunAddr) card.appendChild(row("영문 지번", juso.jibunAddr, true));
      if (juso.korAddr) card.appendChild(row("한글 주소", juso.korAddr, false));
      if (juso.zipNo) card.appendChild(row("우편번호", juso.zipNo, true));

      card.appendChild(mallSection(juso));
      if (juso.korAddr) card.appendChild(mapSection(juso.korAddr));
      resultsEl.appendChild(card);
    });
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
  // 영문 도로명주소 "110 Sejong-daero, Jung-gu, Seoul" 형태를
  // 마지막 항목 = State(시/도), 그 앞 = City(시/군/구), 나머지 = 거리 주소로 분해한다.
  function parseEng(roadAddr) {
    const parts = roadAddr.split(",").map(function (s) { return s.trim(); }).filter(Boolean);
    if (parts.length >= 3) {
      return {
        line1: parts.slice(0, parts.length - 2).join(", "),
        city: parts[parts.length - 2],
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
    const detail = document.getElementById("detail").value.trim();

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
    mall.fields(addr, zip, detail).forEach(function (pair) {
      const value = pair[1] || "";
      if (!value && pair[0].indexOf("2") !== -1) return; // 상세주소 미입력 시 2번 줄 생략
      body.appendChild(row(pair[0], value || "—", Boolean(value)));
    });
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
