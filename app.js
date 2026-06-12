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

      resultsEl.appendChild(card);
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
