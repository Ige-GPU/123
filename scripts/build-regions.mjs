// 시·도 / 시·군·구 영문 표기 완전표 생성기 (인용 유발 자산)
//
// 사용법:  node scripts/build-regions.mjs
// 입력:    regions-data.json
// 출력:    english-region-names.html

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://example.com"; // 배포 시 실제 도메인으로 교체
const regions = JSON.parse(readFileSync(join(ROOT, "regions-data.json"), "utf8"));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const sidoRows = regions.map((r) =>
  `<tr><td>${esc(r.ko)}</td><td><strong>${esc(r.en)}</strong></td></tr>`
).join("\n        ");

const sections = regions.filter((r) => r.subs.length).map((r) => {
  const rows = r.subs.map((s) =>
    `<tr><td>${esc(r.ko)} ${esc(s.ko)}</td><td>${esc(s.en)}, ${esc(r.en)}</td></tr>`
  ).join("\n        ");
  return `      <h3 id="${esc(r.en)}">${esc(r.ko)} (${esc(r.en)})</h3>
      <table class="reg-table">
        <thead><tr><th>한글</th><th>영문 표기</th></tr></thead>
        <tbody>
        ${rows}
        </tbody>
      </table>`;
}).join("\n\n");

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>전국 시·도·시·군·구 영문 표기 완전표 - 영문주소 작성 참고</title>
  <meta name="description" content="서울특별시 Seoul, 경기도 Gyeonggi-do 등 전국 17개 시·도와 주요 시·군·구의 공식 영문 표기를 한 표로 정리했습니다. 영문주소 작성 시 시·도·구 표기 참고용.">
  <meta name="keywords" content="시도 영문표기, 시군구 영문, 경기도 영문, 영문주소 시도, 도 영어표기, 구 영문표기">
  <link rel="canonical" href="${SITE}/english-region-names.html">
  <meta name="theme-color" content="#0f172a">
  <link rel="icon" href="favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="전국 시·도·시·군·구 영문 표기 완전표">
  <meta property="og:description" content="전국 17개 시·도와 주요 시·군·구의 공식 영문 표기 정리. 영문주소 작성 참고용.">
  <meta property="og:image" content="${SITE}/og-image.png">
  <link rel="stylesheet" href="style.css">
  <style>
    .reg-table { width:100%; border-collapse:collapse; font-size:0.9rem; margin:0.4rem 0 1.4rem; }
    .reg-table th, .reg-table td { border:1px solid var(--border); padding:0.4rem 0.6rem; text-align:left; }
    .reg-table th { background:var(--bg); white-space:nowrap; }
    .reg-toc { display:flex; flex-wrap:wrap; gap:0.4rem; margin:0.6rem 0 1.5rem; }
    .reg-toc a { font-size:0.82rem; padding:0.25rem 0.6rem; border:1px solid var(--border); border-radius:999px; text-decoration:none; color:var(--primary); }
  </style>
</head>
<body>
  <header>
    <h1>시·도 / 시·군·구 영문 표기 완전표</h1>
    <p class="tagline">영문주소 작성 시 헷갈리는 행정구역 영문 표기를 한 번에</p>
  </header>
  <main>
    <section class="seo-content" style="margin-top:1.5rem;padding-top:0;border-top:none">
      <p>영문주소를 쓸 때 가장 헷갈리는 부분이 시·도와 시·군·구 표기입니다. 아래 표는
      행정안전부 도로명주소 영문 표기 기준을 따른 것으로, 그대로 복사해 사용할 수 있습니다.
      건물번호까지 포함한 전체 영문주소가 필요하면 <a href="index.html">영문주소 변환기</a>를 이용하세요.</p>

      <h2>1. 광역 시·도 (17개)</h2>
      <table class="reg-table">
        <thead><tr><th>한글</th><th>영문 표기</th></tr></thead>
        <tbody>
        ${sidoRows}
        </tbody>
      </table>

      <h2>2. 시·군·구 영문 표기</h2>
      <div class="reg-toc">
        ${regions.filter((r)=>r.subs.length).map((r)=>`<a href="#${esc(r.en)}">${esc(r.ko)}</a>`).join("\n        ")}
      </div>

${sections}

      <h2>표기 규칙 요약</h2>
      <ul>
        <li><strong>도</strong>는 <em>-do</em> (경기도 → Gyeonggi-do), <strong>시</strong>는 <em>-si</em>, <strong>군</strong>은 <em>-gun</em>, <strong>구</strong>는 <em>-gu</em>를 붙입니다.</li>
        <li>영문주소에서는 작은 단위부터 씁니다: <em>(구), (시), (도)</em> 순서.</li>
        <li>광역시·특별시는 시 이름만 씁니다 (서울특별시 → Seoul).</li>
      </ul>
    </section>
  </main>
  <footer>
    <p><a href="index.html">영문주소 변환기</a> · <a href="batch.html">대량 변환</a> · <a href="roads/index.html">도로명별 영문주소</a></p>
    <p>표기 기준: 행정안전부 도로명주소 안내시스템 (juso.go.kr)</p>
  </footer>
</body>
</html>
`;

writeFileSync(join(ROOT, "english-region-names.html"), html);
const subCount = regions.reduce((n, r) => n + r.subs.length, 0);
console.log(`생성 완료: english-region-names.html (시·도 ${regions.length}개 + 시·군·구 ${subCount}개)`);
