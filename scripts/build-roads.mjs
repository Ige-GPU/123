// 도로명별 정적 SEO 페이지 생성기 (프로그래매틱 SEO)
//
// 사용법:  node scripts/build-roads.mjs
// 입력:    roads-data.json  (ko, eng, sido, sigungu, zip, landmark)
// 출력:    roads/<slug>.html  +  roads/index.html (허브) + sitemap-roads.xml
//
// 전체 주소 DB(juso.go.kr 무료 제공)를 같은 형식의 JSON으로 변환해 넣으면
// 수만 개 페이지로 그대로 확장된다.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://example.com"; // 배포 시 실제 도메인으로 교체

const roads = JSON.parse(readFileSync(join(ROOT, "roads-data.json"), "utf8"));
mkdirSync(join(ROOT, "roads"), { recursive: true });

const slug = (eng) => eng.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function regionEng(sido) {
  const map = {
    "서울특별시": "Seoul", "부산광역시": "Busan", "대구광역시": "Daegu",
    "인천광역시": "Incheon", "광주광역시": "Gwangju", "대전광역시": "Daejeon",
    "울산광역시": "Ulsan", "세종특별자치시": "Sejong", "경기도": "Gyeonggi-do",
    "강원특별자치도": "Gangwon-do", "충청북도": "Chungcheongbuk-do", "충청남도": "Chungcheongnam-do",
    "전북특별자치도": "Jeonbuk-do", "전라남도": "Jeollanam-do", "경상북도": "Gyeongsangbuk-do",
    "경상남도": "Gyeongsangnam-do", "제주특별자치도": "Jeju-do",
  };
  return map[sido] || sido;
}

function page(r, prev, next) {
  const fullKo = [r.sido, r.sigungu, r.ko].filter(Boolean).join(" ");
  const stateEng = regionEng(r.sido);
  const title = `${r.ko} 영문주소 변환 - ${r.sigungu || r.sido}`;
  const desc = `${fullKo}의 영문주소 표기와 우편번호(${r.zip}). 도로명 ${r.ko}은 영문으로 ${r.eng}. 해외직구·국제배송 주소로 바로 사용하세요.`;
  const canonical = `${SITE}/roads/${slug(r.eng)}.html`;

  const nav = [
    prev ? `<a href="${slug(prev.eng)}.html">← ${esc(prev.ko)}</a>` : "",
    next ? `<a href="${slug(next.eng)}.html">${esc(next.ko)} →</a>` : "",
  ].filter(Boolean).join(" &nbsp;·&nbsp; ");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(desc)}">
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#0f172a">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(desc)}">
  <meta property="og:image" content="${SITE}/og-image.png">
  <script src="../theme.js" defer></script>
  <link rel="stylesheet" href="../style.css">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Place",
    "name": "${esc(fullKo)}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "${esc(r.eng)}",
      "addressLocality": "${esc(r.sigungu || stateEng)}",
      "addressRegion": "${esc(stateEng)}",
      "postalCode": "${esc(r.zip)}",
      "addressCountry": "KR"
    }
  }
  </script>
</head>
<body>
  <header>
    <h1>${esc(r.ko)} 영문주소</h1>
    <p class="tagline">${esc(fullKo)}</p>
  </header>
  <main>
    <section class="result-card" style="margin-top:1.5rem">
      <div class="addr-block">
        <h3 class="block-title">한글 도로명</h3>
        <p class="addr-value"><span>${esc(fullKo)}</span></p>
      </div>
      <div class="addr-block">
        <h3 class="block-title">영문 도로명 표기</h3>
        <p class="addr-value"><span><strong>${esc(r.eng)}</strong>, ${esc(stateEng)}</span></p>
      </div>
      <div class="addr-block">
        <h3 class="block-title">우편번호</h3>
        <p class="addr-value"><span>${esc(r.zip)}</span></p>
      </div>
    </section>

    <section class="search-box" style="margin-top:1.2rem">
      <p class="hint" style="margin:0 0 .6rem">정확한 건물번호까지 포함한 영문주소가 필요하면 아래에서 변환하세요.</p>
      <a class="copy-all-btn" href="../index.html?q=${encodeURIComponent(r.ko)}">${esc(r.ko)} 상세 영문주소 변환하기 →</a>
    </section>

    <section class="seo-content">
      <h2>${esc(r.ko)}는 어떤 도로인가요?</h2>
      <p>${esc(r.ko)}(영문 표기: <em>${esc(r.eng)}</em>)는 ${esc(r.sido)}${r.sigungu ? " " + esc(r.sigungu) : ""}에 위치한 도로명입니다.${r.landmark ? " 주변에 " + esc(r.landmark) + " 등이 있습니다." : ""} 우편번호는 ${esc(r.zip)} 일대입니다.</p>

      <h2>영문주소로 어떻게 쓰나요?</h2>
      <p>한국식 주소는 큰 단위부터 쓰지만 영문주소는 작은 단위부터 씁니다. 예를 들어
      <em>${esc(fullKo)} 123</em>은 영문으로
      <em>123 ${esc(r.eng)}, …, ${esc(stateEng)}, ${esc(r.zip)}, Republic of Korea</em> 순으로 작성합니다
      (시·군·구 영문 표기는 변환기에서 정확히 확인하세요). 동·호수가 있으면 맨 앞에 붙입니다.</p>

      <h2>해외직구·국제배송에 사용하기</h2>
      <p>이 영문주소는 아마존, 알리익스프레스, 이베이 등 해외 쇼핑몰 배송지와 EMS 국제배송에 그대로 사용할 수 있습니다.
      쇼핑몰별 입력칸(Address Line 1, City, State, ZIP)에 맞춰 나누려면
      <a href="../index.html?q=${encodeURIComponent(r.ko)}">영문주소 변환기</a>를 이용하세요.</p>
    </section>

    ${nav ? `<nav class="pagination" style="border-top:1px solid var(--border);padding-top:1rem">${nav}</nav>` : ""}
  </main>
  <footer>
    <p><a href="../index.html">영문주소 변환기</a> · <a href="../batch.html">대량 변환</a> · <a href="index.html">전체 도로명 목록</a></p>
    <p>주소 데이터 제공: 행정안전부 도로명주소 안내시스템 (juso.go.kr)</p>
  </footer>
</body>
</html>
`;
}

function hub(list) {
  const byRegion = {};
  list.forEach((r) => { (byRegion[r.sido] ??= []).push(r); });
  const sections = Object.entries(byRegion).map(([sido, rs]) => {
    const links = rs.map((r) => `<li><a href="${slug(r.eng)}.html">${esc(r.ko)} <span style="color:var(--text-light)">(${esc(r.eng)})</span></a></li>`).join("\n        ");
    return `      <h2>${esc(sido)}</h2>\n      <ul>\n        ${links}\n      </ul>`;
  }).join("\n\n");

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>도로명별 영문주소 목록 - 전국 주요 도로</title>
  <meta name="description" content="전국 주요 도로명의 영문주소 표기와 우편번호를 한눈에. 세종대로, 테헤란로, 판교역로 등 도로별 영문주소 변환 페이지 모음.">
  <link rel="canonical" href="${SITE}/roads/index.html">
  <meta name="theme-color" content="#0f172a">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <script src="../theme.js" defer></script>
  <link rel="stylesheet" href="../style.css">
</head>
<body>
  <header>
    <h1>도로명별 영문주소</h1>
    <p class="tagline">도로명을 선택하면 영문 표기와 우편번호를 확인할 수 있습니다</p>
  </header>
  <main>
    <section class="seo-content" style="margin-top:1.5rem;padding-top:0;border-top:none">
${sections}
    </section>
  </main>
  <footer>
    <p><a href="../index.html">영문주소 변환기</a> · <a href="../batch.html">대량 변환</a></p>
  </footer>
</body>
</html>
`;
}

// --- 생성 ---
const sorted = [...roads];
sorted.forEach((r, i) => {
  const html = page(r, sorted[i - 1], sorted[i + 1]);
  writeFileSync(join(ROOT, "roads", `${slug(r.eng)}.html`), html);
});
writeFileSync(join(ROOT, "roads", "index.html"), hub(sorted));

// 도로 페이지용 사이트맵
const urls = [
  `${SITE}/roads/index.html`,
  ...sorted.map((r) => `${SITE}/roads/${slug(r.eng)}.html`),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><priority>0.6</priority></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(ROOT, "sitemap-roads.xml"), sitemap);

console.log(`생성 완료: ${sorted.length}개 도로 페이지 + 허브 + sitemap-roads.xml`);
