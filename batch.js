(function () {
  "use strict";

  const MAX_LINES = 50;
  const CALL_GAP_MS = 150; // 무료 API 부하 방지용 호출 간격

  const input = document.getElementById("batch-input");
  const btn = document.getElementById("batch-btn");
  const statusEl = document.getElementById("batch-status");
  const resultEl = document.getElementById("batch-result");
  const rowsEl = document.getElementById("batch-rows");
  const copyBtn = document.getElementById("batch-copy");
  const csvBtn = document.getElementById("batch-csv");

  let results = [];

  // 작성 형식: 한 줄 = "주소" 또는 "주소 | 상세주소".
  // 엑셀에서 주소·상세주소 두 열을 붙여넣으면 탭 구분으로 자동 인식한다.
  function parseLine(line) {
    const sep = line.indexOf("\t") !== -1 ? "\t" : "|";
    const parts = line.split(sep).map(function (s) { return s.trim(); });
    return { addr: parts[0], detail: convertDetailKo(parts[1] || "") };
  }

  btn.addEventListener("click", async function () {
    const lines = input.value.split("\n").map(function (s) { return s.trim(); }).filter(Boolean);
    if (lines.length === 0) {
      showStatus("주소를 한 줄에 하나씩 입력해 주세요.");
      return;
    }
    if (lines.length > MAX_LINES) {
      showStatus("한 번에 최대 " + MAX_LINES + "건까지 변환됩니다. 앞 " + MAX_LINES + "건만 처리합니다.");
      lines.length = MAX_LINES;
    }

    btn.disabled = true;
    results = [];
    rowsEl.innerHTML = "";
    resultEl.hidden = false;

    for (let i = 0; i < lines.length; i++) {
      showStatus("변환 중… " + (i + 1) + " / " + lines.length);
      const item = parseLine(lines[i]);
      let row;
      try {
        row = await convertOne(item.addr, item.detail);
      } catch (e) {
        row = { kor: item.addr, detail: item.detail, eng: "(오류: " + e.message + ")", zip: "", ok: false };
      }
      results.push(row);
      appendRow(i + 1, row);
      if (i < lines.length - 1) await sleep(CALL_GAP_MS);
    }

    const okCount = results.filter(function (r) { return r.ok; }).length;
    showStatus("완료: " + okCount + "건 변환, " + (results.length - okCount) + "건 실패");
    btn.disabled = false;
  });

  function convertOne(keyword, detail) {
    return new Promise(function (resolve, reject) {
      const params = new URLSearchParams({
        confmKey: JUSO_CONFIG.apiKey,
        currentPage: "1",
        countPerPage: "1",
        keyword: keyword,
        resultType: "json",
      });
      jsonp(JUSO_CONFIG.endpoint + "?" + params.toString(), function (data) {
        const common = data && data.results && data.results.common;
        if (!common) return reject(new Error("응답 오류"));
        if (common.errorCode === "E0001") return reject(new Error("API 키 오류"));
        if (common.errorCode !== "0") return reject(new Error(common.errorMessage || "검색 오류"));
        const juso = (data.results.juso || [])[0];
        if (!juso) return resolve({ kor: keyword, detail: detail, eng: "(결과 없음)", zip: "", ok: false });
        resolve({
          kor: keyword,
          detail: detail,
          eng: (detail ? detail + ", " : "") + juso.roadAddr +
               (juso.zipNo ? ", " + juso.zipNo : "") + ", Republic of Korea",
          zip: juso.zipNo || "",
          ok: true,
        });
      }, function () {
        reject(new Error("서버 연결 실패"));
      });
    });
  }

  function jsonp(url, onSuccess, onError) {
    const cbName = "jusoBatchCb_" + Date.now() + "_" + Math.floor(Math.random() * 1e6);
    const script = document.createElement("script");
    const timer = setTimeout(function () { cleanup(); onError(); }, 10000);

    window[cbName] = function (data) { cleanup(); onSuccess(data); };

    function cleanup() {
      clearTimeout(timer);
      delete window[cbName];
      script.remove();
    }

    script.src = url + "&callback=" + cbName;
    script.onerror = function () { cleanup(); onError(); };
    document.body.appendChild(script);
  }

  function appendRow(num, row) {
    const tr = document.createElement("tr");
    if (!row.ok) tr.className = "row-fail";
    [num, row.kor, row.detail || "", row.eng, row.zip].forEach(function (v) {
      const td = document.createElement("td");
      td.textContent = v;
      tr.appendChild(td);
    });
    rowsEl.appendChild(tr);
  }

  copyBtn.addEventListener("click", function () {
    const tsv = ["한글주소\t상세주소\t영문주소\t우편번호"].concat(
      results.map(function (r) { return r.kor + "\t" + (r.detail || "") + "\t" + r.eng + "\t" + r.zip; })
    ).join("\n");
    navigator.clipboard.writeText(tsv).then(function () {
      copyBtn.textContent = "복사됨!";
      setTimeout(function () { copyBtn.textContent = "전체 복사 (엑셀 붙여넣기용)"; }, 1500);
    });
  });

  csvBtn.addEventListener("click", function () {
    const esc = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
    const csv = "﻿한글주소,상세주소,영문주소,우편번호\n" + results.map(function (r) {
      return [r.kor, r.detail || "", r.eng, r.zip].map(esc).join(",");
    }).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "영문주소_변환결과.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function showStatus(msg) {
    statusEl.textContent = msg;
    statusEl.hidden = false;
  }
})();
