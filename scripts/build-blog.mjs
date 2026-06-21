// 블로그 장문 글 생성기 — 애드센스 '가치 있는 콘텐츠' 보강용
// 사용법: node scripts/build-blog.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://jusoshift.com";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const NAV = '<nav class="site-nav" aria-label="주요 메뉴"><div class="site-nav-inner"><a href="../index.html" class="nav-logo">영문주소 변환기</a><div class="nav-links"><a href="../index.html">홈</a><a href="../batch.html">대량 변환</a><a href="../english-region-names.html">표기표</a><a href="../blog/index.html">블로그</a><a href="../guide-amazon.html">직구 가이드</a></div></div></nav>';
const FOOT = '<footer>\n    <p class="foot-links"><a href="../index.html">홈</a> · <a href="../batch.html">대량 변환</a> · <a href="../english-region-names.html">표기표</a> · <a href="../blog/index.html">블로그</a> · <a href="../about.html">사이트 소개</a> · <a href="../privacy.html">개인정보처리방침</a> · <a href="../terms.html">이용약관</a> · <a href="mailto:contact@jusoshift.com">문의</a></p>\n    <p>주소 데이터 제공: 행정안전부 도로명주소 안내시스템 (juso.go.kr)</p>\n    <p>&copy; 2026 영문주소 변환기 (jusoshift.com)</p>\n  </footer>';

function page(a) {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1734267557550376" crossorigin="anonymous"></script>
  <title>${esc(a.title)} | 영문주소 변환기</title>
  <meta name="description" content="${esc(a.desc)}">
  <meta name="keywords" content="${esc(a.kw)}">
  <link rel="canonical" href="${SITE}/blog/${a.slug}.html">
  <meta name="theme-color" content="#0f172a">
  <link rel="icon" href="../favicon.svg" type="image/svg+xml">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(a.title)}">
  <meta property="og:description" content="${esc(a.desc)}">
  <meta property="og:image" content="${SITE}/og-image.png">
  <link rel="stylesheet" href="../style.css">
  <script src="../theme.js" defer></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": ${JSON.stringify(a.title)},
    "description": ${JSON.stringify(a.desc)},
    "image": "${SITE}/og-image.png",
    "datePublished": "${a.date}",
    "dateModified": "${a.date}",
    "author": { "@type": "Organization", "name": "영문주소 변환기" },
    "publisher": { "@type": "Organization", "name": "영문주소 변환기",
      "logo": { "@type": "ImageObject", "url": "${SITE}/icon-512.png" } },
    "mainEntityOfPage": "${SITE}/blog/${a.slug}.html"
  }
  </script>
</head>
<body>
  ${NAV}
  <header>
    <h1>${esc(a.h1)}</h1>
    <p class="tagline">${esc(a.tagline)}</p>
    <p class="lang-switch"><a href="index.html">← 블로그 목록</a></p>
  </header>
  <main>
    <article class="seo-content" style="margin-top:1.5rem;padding-top:0;border-top:none">
      <p class="post-meta" style="color:var(--text-light);font-size:.82rem">${a.date} · ${esc(a.cat)}</p>
${a.body}
      <p style="margin-top:1.5rem"><a href="../index.html"><strong>→ 영문주소 변환기로 바로 변환하기</strong></a></p>
    </article>
  </main>
  ${FOOT}
</body>
</html>
`;
}

const A = [
{
  slug: "road-address-suffixes", date: "2026-06-20", cat: "주소 상식",
  title: "도로명주소 대로·로·길·번길 차이 완벽 정리",
  h1: "도로명주소 대로·로·길·번길 차이", tagline: "도로 폭과 위계로 나뉘는 도로명 규칙",
  desc: "도로명주소의 대로·로·길·번길은 무엇이 다를까요? 도로 폭과 차로 수에 따른 구분 기준, 건물번호 부여 방식, 영문 표기(-daero, -ro, -gil)까지 한 번에 정리했습니다.",
  kw: "도로명주소, 대로 로 길 차이, 번길, 건물번호, 도로명 영문표기, 도로명주소 규칙",
  body: `      <p>도로명주소를 보다 보면 <strong>세종대로, 테헤란로, 한글길, 12번길</strong>처럼 끝이 제각각인 걸 볼 수 있습니다. 이 접미어는 아무렇게나 붙는 게 아니라 <strong>도로의 폭과 위계</strong>에 따라 정해진 규칙입니다. 의미를 알면 주소를 훨씬 쉽게 이해할 수 있습니다.</p>

      <h2>대로 · 로 · 길의 구분 기준</h2>
      <p>행정안전부 도로명 부여 기준에 따르면 세 가지는 도로 폭(또는 차로 수)으로 나뉩니다.</p>
      <ul>
        <li><strong>대로(大路)</strong> — 폭 약 40m 이상 또는 왕복 8차로 이상의 큰 도로. 예) 세종대로, 강남대로</li>
        <li><strong>로(路)</strong> — 폭 약 12~40m 또는 왕복 2~7차로의 도로. 예) 테헤란로, 판교역로</li>
        <li><strong>길</strong> — 위 기준에 못 미치는 좁은 길. 예) 인사동길</li>
      </ul>
      <p>즉 같은 지역이라도 큰길은 '대로', 중간 도로는 '로', 골목은 '길'로 갈립니다.</p>

      <h2>'번길'은 무엇인가요?</h2>
      <p><strong>번길</strong>은 주된 도로(로/대로)에서 갈라져 나온 작은 길에 붙습니다. 예를 들어 '세종로12번길'은 세종로에서 갈라진 골목이라는 뜻입니다. 숫자는 그 골목이 본 도로의 어느 지점에서 갈라지는지를 나타냅니다. 그래서 '○○로'와 '○○로△번길'은 서로 가까이 붙어 있는 경우가 많습니다.</p>

      <h2>건물번호는 어떻게 매겨질까?</h2>
      <p>도로명 뒤의 숫자(건물번호)는 도로가 시작하는 지점을 기준으로 약 20m 간격으로 부여됩니다. <strong>도로 진행 방향의 왼쪽은 홀수, 오른쪽은 짝수</strong>가 원칙입니다. 따라서 같은 도로에서 번호가 비슷하면 서로 가까운 위치이고, 홀짝으로 길의 어느 편인지도 가늠할 수 있습니다.</p>

      <h2>영문 표기 규칙</h2>
      <p>이 접미어들은 영문주소에서도 그대로 음역됩니다.</p>
      <ul>
        <li>대로 → <em>-daero</em> (세종대로 → Sejong-daero)</li>
        <li>로 → <em>-ro</em> (테헤란로 → Teheran-ro)</li>
        <li>길 → <em>-gil</em> (인사동길 → Insadong-gil)</li>
        <li>번길 → <em>beon-gil</em> 또는 도로명에 통합되어 표기</li>
      </ul>
      <p>해외직구나 국제배송에서 영문주소를 쓸 때 이 표기를 임의로 바꾸면 안 됩니다. 정확한 정부 공식 표기는 <a href="../index.html">영문주소 변환기</a>에서 한글 주소를 입력해 그대로 확인·복사할 수 있습니다.</p>

      <h2>정리</h2>
      <p>도로명주소의 끝 글자는 곧 그 도로의 크기와 성격을 알려주는 신호입니다. 대로 → 로 → 길 → 번길 순으로 작아진다고 기억하면 쉽고, 영문으로는 -daero / -ro / -gil로 음역된다는 것만 알아두면 영문주소 작성도 헷갈리지 않습니다.</p>`
},
{
  slug: "road-vs-jibun", date: "2026-06-20", cat: "주소 상식",
  title: "도로명주소와 지번주소 차이, 그리고 변환하는 법",
  h1: "도로명주소 vs 지번주소", tagline: "두 주소 체계의 차이와 올바른 사용법",
  desc: "도로명주소와 지번주소는 무엇이 다를까요? 두 체계의 구조 차이, 언제 어떤 주소를 써야 하는지, 그리고 영문으로 변환할 때 주의할 점을 정리했습니다.",
  kw: "도로명주소, 지번주소, 주소 차이, 지번 영문, 도로명 지번 변환, 영문주소",
  body: `      <p>한국에는 <strong>도로명주소</strong>와 <strong>지번주소</strong> 두 가지 주소 체계가 있습니다. 2014년부터 도로명주소가 공식 주소로 전면 시행됐지만, 여전히 지번주소도 함께 쓰여 헷갈리는 분이 많습니다. 두 체계의 차이를 정리해 봅니다.</p>

      <h2>지번주소란?</h2>
      <p>지번주소는 토지에 매겨진 번호(지번)를 기준으로 한 전통적 주소입니다. 구조는 <em>시·도 + 시·군·구 + 읍·면·동 + 지번(번지)</em>입니다. 예) <em>서울특별시 강남구 역삼동 736-1</em>. 땅을 기준으로 하다 보니, 한 필지가 나뉘거나 합쳐지면 번호 체계가 복잡해지는 단점이 있었습니다.</p>

      <h2>도로명주소란?</h2>
      <p>도로명주소는 <em>도로명 + 건물번호</em>를 기준으로 합니다. 구조는 <em>시·도 + 시·군·구 + 도로명 + 건물번호</em>입니다. 예) <em>서울특별시 강남구 테헤란로 152</em>. 도로를 따라 번호가 순서대로 매겨져 위치를 직관적으로 찾기 쉽고, 길찾기·내비게이션·긴급출동에 유리합니다.</p>

      <h2>언제 어떤 주소를 쓰나요?</h2>
      <ul>
        <li><strong>공식 문서·우편·택배</strong> — 도로명주소가 원칙입니다.</li>
        <li><strong>부동산 등기·토지 관련</strong> — 지번이 함께 필요할 수 있습니다.</li>
        <li><strong>해외직구·국제배송</strong> — 도로명주소를 영문으로 변환해 사용하는 것이 표준입니다.</li>
      </ul>

      <h2>영문으로 변환할 때</h2>
      <p>영문주소는 도로명주소를 기준으로 작성하는 것이 권장됩니다. 도로명 체계가 국제 주소 형식(거리명 + 번호)과 잘 맞기 때문입니다. 예를 들어 <em>테헤란로 152</em>는 <em>152 Teheran-ro</em>가 됩니다. 다만 일부 해외 사이트나 서류는 지번 기반 영문주소를 받기도 하므로, <a href="../index.html">영문주소 변환기</a>는 도로명·지번 두 가지 영문 표기를 모두 보여줍니다. 상황에 맞는 형식을 골라 복사하면 됩니다.</p>

      <h2>정리</h2>
      <p>지번주소는 '땅 번호', 도로명주소는 '길 번호'라고 생각하면 쉽습니다. 일상과 배송에서는 도로명주소가 표준이며, 영문 변환도 도로명을 기준으로 하는 것이 안전합니다. 두 표기가 모두 필요할 때는 변환기에서 한 번에 확인하세요.</p>`
},
{
  slug: "zipcode-meaning", date: "2026-06-20", cat: "우편 상식",
  title: "우편번호 5자리의 의미와 정확히 조회하는 법",
  h1: "우편번호 5자리의 의미", tagline: "국가기초구역번호와 조회 방법",
  desc: "우편번호 5자리는 무엇을 뜻할까요? 2015년 개편된 국가기초구역번호 체계의 의미, 정확히 조회하는 방법, 영문주소·해외배송에서 우편번호의 역할까지 설명합니다.",
  kw: "우편번호, 우편번호 조회, 우편번호 5자리, 국가기초구역번호, 영문주소 우편번호, 직구 우편번호",
  body: `      <p>2015년 8월, 한국의 우편번호가 기존 <strong>6자리에서 5자리</strong>로 개편되었습니다. 단순히 자릿수만 준 것이 아니라 체계 자체가 바뀌었는데, 이 숫자가 무엇을 의미하는지 알아봅니다.</p>

      <h2>국가기초구역번호란?</h2>
      <p>현재의 5자리 우편번호는 <strong>국가기초구역번호</strong>를 기반으로 합니다. 전국을 일정한 구역으로 나누고 각 구역에 고유 번호를 부여한 것으로, 우편뿐 아니라 통계·소방·경찰 등 여러 행정에 공통으로 쓰입니다. 그래서 우편번호 하나로 지역 구역을 비교적 정확히 특정할 수 있습니다.</p>

      <h2>5자리가 가리키는 것</h2>
      <p>대략적으로 <strong>앞자리는 광역 지역(시·도, 시·군·구)</strong>을, <strong>뒷자리로 갈수록 더 세부적인 배달 구역</strong>을 나타냅니다. 같은 동네라도 구역이 다르면 우편번호가 달라질 수 있어, 아파트 단지나 큰 건물은 별도 번호를 갖기도 합니다.</p>

      <h2>정확히 조회하는 방법</h2>
      <ul>
        <li><strong>행정안전부 주소 안내(juso.go.kr)</strong> — 도로명·건물명으로 검색하면 우편번호가 함께 나옵니다.</li>
        <li><strong>우체국 우편번호 검색</strong> — 우체국 홈페이지에서도 조회할 수 있습니다.</li>
        <li><strong>영문주소 변환기</strong> — 한글 주소를 입력하면 영문 주소와 함께 5자리 우편번호를 한 번에 보여줍니다.</li>
      </ul>

      <h2>영문주소·해외배송에서의 역할</h2>
      <p>영문주소를 쓸 때 우편번호는 도시·국가명 앞(또는 뒤)에 들어갑니다. 예) <em>110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em>. 해외배송과 통관 과정에서 우편번호는 <strong>배송 구역 분류의 핵심 정보</strong>이므로 빠뜨리면 배송이 지연될 수 있습니다. 특히 직구 시에는 구 6자리 우편번호가 아니라 <strong>현재의 5자리</strong>를 정확히 입력해야 합니다.</p>

      <h2>정리</h2>
      <p>우편번호 5자리는 단순한 숫자가 아니라 전국을 나눈 국가기초구역을 가리키는 코드입니다. 영문주소·해외배송에서는 반드시 최신 5자리를 포함해야 하며, 한글 주소만 알면 <a href="../index.html">변환기</a>에서 영문주소와 우편번호를 동시에 확인할 수 있습니다.</p>`
},
{
  slug: "change-address-after-moving", date: "2026-06-21", cat: "이사 가이드",
  title: "이사 후 주소 변경 한 번에 끝내기: 전입신고부터 일괄변경까지",
  h1: "이사 후 주소 변경 총정리", tagline: "전입신고·우편물 이전·금융 주소까지",
  desc: "이사 후 꼭 해야 하는 주소 변경을 한 번에 정리했습니다. 전입신고 방법과 기한, 우편물 주거이전 서비스, 금융·카드·통신 주소 변경, 영문주소 갱신까지 체크리스트로 안내합니다.",
  kw: "이사 주소변경, 전입신고, 우편물 주거이전, 주소 일괄변경, 이사 체크리스트, 카드 주소변경",
  body: `      <p>이사를 하면 단순히 짐만 옮기는 게 아니라 <strong>여러 곳의 등록 주소</strong>를 바꿔야 합니다. 빠뜨리면 우편물·고지서가 옛 집으로 가거나 본인 확인에 문제가 생길 수 있습니다. 순서대로 정리해 드립니다.</p>

      <h2>1. 전입신고 (가장 먼저, 14일 이내)</h2>
      <p>새 거주지로 이사하면 <strong>전입한 날부터 14일 이내</strong>에 전입신고를 해야 합니다. 방법은 두 가지입니다.</p>
      <ul>
        <li><strong>정부24(온라인)</strong> — 공동인증서 등으로 로그인 후 전입신고 메뉴에서 처리</li>
        <li><strong>주민센터(오프라인)</strong> — 신분증을 들고 관할 주민센터 방문</li>
      </ul>
      <p>전입신고를 하면 주민등록상 주소가 갱신되고, 이것이 다른 주소 변경의 기준이 됩니다.</p>

      <h2>2. 우편물 주거이전 서비스</h2>
      <p>예전 주소로 오는 우편물을 새 주소로 자동 전송해 주는 우체국 서비스입니다. 신청하면 일정 기간(보통 3개월) 동안 옛 주소로 온 우편물을 새 집으로 보내줘, 주소 변경을 미처 못 한 곳의 우편물도 놓치지 않습니다.</p>

      <h2>3. 금융·카드·통신 주소 변경</h2>
      <p>전입신고만으로는 은행·카드사·통신사 주소가 자동으로 바뀌지 않습니다. 각 사 앱이나 고객센터에서 따로 변경해야 합니다. 청구서·카드 재발급·본인확인 우편이 새 주소로 가도록 다음을 점검하세요.</p>
      <ul>
        <li>은행·증권 계좌의 등록 주소</li>
        <li>신용·체크카드 청구지 주소</li>
        <li>통신사(휴대폰·인터넷) 청구·설치 주소</li>
        <li>보험·국민연금·건강보험 등</li>
      </ul>

      <h2>4. 자동차·운전면허</h2>
      <p>차량을 보유했다면 자동차 등록 주소와 운전면허 주소도 갱신 대상입니다. 과태료 고지서 등이 옛 주소로 가지 않도록 챙기세요.</p>

      <h2>5. 영문주소도 갱신</h2>
      <p>해외직구나 해외 서비스를 이용한다면 등록해 둔 <strong>영문 배송지</strong>도 새 주소로 바꿔야 합니다. 새 한글 주소를 <a href="../index.html">영문주소 변환기</a>에 입력하면 정확한 영문주소·우편번호가 바로 나오니, 아마존·알리익스프레스 등의 주소록을 업데이트하세요.</p>

      <h2>이사 후 주소 변경 체크리스트</h2>
      <ul>
        <li>✅ 전입신고(14일 이내)</li>
        <li>✅ 우편물 주거이전 신청</li>
        <li>✅ 은행·카드·통신·보험 주소 변경</li>
        <li>✅ 자동차·운전면허 주소</li>
        <li>✅ 해외직구 영문 배송지 갱신</li>
      </ul>`
},
{
  slug: "receive-international-parcel", date: "2026-06-21", cat: "해외배송",
  title: "해외에서 한국으로 택배 받기: 영문주소·EMS 작성법",
  h1: "해외→한국 택배 받는 영문주소 작성법", tagline: "EMS·국제특송 수취인 주소 완벽 정리",
  desc: "해외에서 한국으로 물건을 받을 때 영문 주소를 어떻게 써야 할까요? 수취인 영문주소 순서, 이름·전화번호 표기, 개인통관고유부호, 우편번호까지 EMS·국제배송 작성법을 정리했습니다.",
  kw: "해외 한국 택배, EMS 영문주소, 국제배송 주소, 수취인 영문주소, 해외 직구 배송, 통관",
  body: `      <p>해외 친구가 한국으로 선물을 보내거나, 해외 쇼핑몰에서 한국으로 직배송을 받을 때 가장 중요한 것이 <strong>수취인(받는 사람) 영문주소</strong>입니다. 주소가 부정확하면 배송이 지연되거나 반송될 수 있습니다.</p>

      <h2>영문주소는 작은 단위부터</h2>
      <p>한국 주소는 큰 단위(시·도)부터 쓰지만, 국제배송 영문주소는 <strong>작은 단위(건물번호)부터</strong> 씁니다. 예를 들어 <em>서울특별시 중구 세종대로 110</em>은 <em>110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em> 순서로 작성합니다.</p>

      <h2>수취인 정보 3종 세트</h2>
      <ul>
        <li><strong>이름(Name)</strong> — 여권 영문 이름. 예) HONG GILDONG</li>
        <li><strong>전화번호(Tel)</strong> — 국제 형식. 010-1234-5678 → <em>+82-10-1234-5678</em> (앞 0 제거)</li>
        <li><strong>주소(Address)</strong> — 영문 도로명주소 + 우편번호 + Republic of Korea</li>
      </ul>
      <p>동·호수가 있으면 영문주소 맨 앞에 붙입니다. 예) <em>Apt 101-1001, 110 Sejong-daero, …</em></p>

      <h2>개인통관고유부호 (직배송 통관)</h2>
      <p>해외에서 한국으로 직배송되는 물품은 통관 과정에서 <strong>개인통관고유부호(P로 시작하는 13자리)</strong>가 필요할 수 있습니다. 누락하면 통관이 보류되니, 발송 전에 미리 발급받아 두는 것이 좋습니다. 명의(이름·전화번호)는 실제 수취인과 일치해야 합니다.</p>

      <h2>EMS 송장 작성 팁</h2>
      <ul>
        <li>우편번호 5자리를 정확히 — 구 6자리 아님</li>
        <li>전화번호는 통관·배송 연락에 쓰이므로 반드시 +82 형식</li>
        <li>건물명·회사명이 있으면 함께 적으면 더 정확</li>
      </ul>

      <h2>한 번에 준비하기</h2>
      <p>수취인의 한글 주소만 알면 <a href="../index.html">영문주소 변환기</a>에서 영문 주소·우편번호를 즉시 확인할 수 있고, 이름 로마자 변환과 전화번호 +82 변환도 같은 화면에서 처리됩니다. 해외에 있는 발송인에게 변환된 정보를 그대로 전달하면 됩니다.</p>`
},
{
  slug: "romanize-korean-name", date: "2026-06-21", cat: "영문 표기",
  title: "한글 이름 영문 표기법: 여권 로마자 규칙과 주의점",
  h1: "한글 이름 영문 표기법", tagline: "여권 로마자 규칙과 흔한 실수",
  desc: "한글 이름을 영문으로 어떻게 써야 할까요? 국어의 로마자 표기법 기본 규칙, 성과 이름의 순서, 여권 표기 우선 원칙, 가족 간 성씨 통일까지 영문 이름 작성의 모든 것을 정리했습니다.",
  kw: "영문 이름, 한글 이름 영문 표기, 여권 영문이름, 로마자 표기법, 이름 영어 변환, 성씨 영문",
  body: `      <p>해외직구 배송지, 비자 서류, 항공권 예약 등에서 <strong>한글 이름의 영문 표기</strong>가 필요합니다. 그런데 같은 이름도 사람마다 다르게 쓰는 경우가 많아 혼란스럽습니다. 기준을 정리해 봅니다.</p>

      <h2>기본은 '국어의 로마자 표기법'</h2>
      <p>한글 이름의 영문 표기는 문화체육관광부가 고시한 <strong>국어의 로마자 표기법</strong>을 따르는 것이 원칙입니다. 소리 나는 대로 로마자로 옮기는 방식으로, 예를 들어 '민수'는 <em>Minsu</em>, '영희'는 <em>Yeonghui</em>가 됩니다.</p>

      <h2>성과 이름의 순서</h2>
      <p>영문 표기에서는 <strong>성(姓)을 먼저</strong> 쓰고 이름을 뒤에 씁니다. 예) 홍길동 → <em>HONG GILDONG</em>. 이름은 붙여 쓰거나(GILDONG) 음절 사이에 하이픈을 넣어(Gil-dong) 쓸 수 있습니다. 여권에서는 보통 이름을 붙여 쓰거나 하이픈으로 연결합니다.</p>

      <h2>성씨는 '통용 표기'를 우선</h2>
      <p>성씨는 표준 로마자 표기와 실제 통용되는 표기가 다른 경우가 많습니다. 대표적인 예입니다.</p>
      <ul>
        <li>김 → <em>Kim</em> (표준대로면 Gim이지만 Kim이 통용)</li>
        <li>이 → <em>Lee</em> (또는 Yi, I)</li>
        <li>박 → <em>Park</em></li>
        <li>최 → <em>Choi</em>, 정 → <em>Jung/Jeong</em></li>
      </ul>
      <p>이미 가족·친척이 특정 표기를 써왔다면 그 표기를 따르는 것이 좋습니다.</p>

      <h2>여권이 있다면 여권 표기가 최우선</h2>
      <p>가장 중요한 원칙입니다. <strong>여권에 영문 이름이 등록되어 있다면 반드시 여권과 동일하게</strong> 써야 합니다. 항공권·비자·국제 결제는 여권 이름과 일치해야 하며, 다르면 탑승 거부나 서류 반려로 이어질 수 있습니다. 통관 시에도 명의가 일치해야 합니다.</p>

      <h2>가족 간 성씨 통일</h2>
      <p>같은 가족인데 성씨 영문 표기가 제각각이면(예: 아빠 Lee, 자녀 Yi) 서류상 혼동이 생깁니다. 가족은 성씨 표기를 통일하는 것이 좋습니다.</p>

      <h2>빠르게 변환하기</h2>
      <p>한글 이름을 <a href="../index.html">영문주소 변환기</a>의 이름 변환 기능에 입력하면 통용 성씨 표기와 로마자 규칙을 적용한 영문 이름을 바로 보여줍니다. 다만 여권이 있다면 반드시 여권 표기를 우선하세요.</p>`
},
{
  slug: "building-types-english-address", date: "2026-06-22", cat: "영문 표기",
  title: "아파트·빌라·오피스텔·주택 영문주소 표기법",
  h1: "건물 유형별 영문주소 표기법", tagline: "아파트·빌라·오피스텔·단독주택 사례",
  desc: "아파트, 빌라, 오피스텔, 단독주택은 영문주소를 어떻게 쓸까요? 건물 유형별 동·호수 표기 방법과 실제 예시를 정리했습니다.",
  kw: "아파트 영문주소, 빌라 영문주소, 오피스텔 영문주소, 동호수 영문 표기, 건물 영문주소",
  body: `      <p>같은 도로명주소라도 사는 건물이 아파트냐 빌라냐에 따라 상세주소(동·호수) 표기가 조금씩 달라집니다. 건물 유형별로 영문주소를 어떻게 쓰는지 사례로 정리합니다.</p>

      <h2>아파트</h2>
      <p>아파트는 동과 호수가 명확합니다. 영문에서는 <em>Apt 동-호</em> 형태로 맨 앞에 붙입니다.</p>
      <ul>
        <li>101동 1001호 → <em>Apt 101-1001, [도로명주소]</em></li>
        <li>가동 203호(한글 동) → <em>Apt A-203</em></li>
      </ul>

      <h2>오피스텔</h2>
      <p>오피스텔도 아파트와 동일하게 처리합니다. 다만 호수가 4자리 이상(예: 1205호)인 경우가 많으니 그대로 적습니다. 예) <em>#1205</em> 또는 <em>Apt 1205</em>.</p>

      <h2>빌라·연립·다세대</h2>
      <p>빌라는 동 없이 호수만 있는 경우가 흔합니다. 이때는 <em>#호수</em>로 적습니다. 예) 302호 → <em>#302</em>. 건물명이 있으면 함께 적으면 더 정확합니다.</p>

      <h2>단독주택</h2>
      <p>단독주택은 보통 동·호수가 없어 도로명주소만으로 충분합니다. 별도 상세주소 없이 <em>123 Sejong-daero, Jung-gu, Seoul</em>처럼 작성합니다.</p>

      <h2>층·지하 표기</h2>
      <ul>
        <li>3층 302호 → <em>#302, 3F</em></li>
        <li>지하 1층 → <em>B1</em></li>
      </ul>

      <h2>한 번에 정확히</h2>
      <p>건물 유형이 헷갈려도, <a href="../index.html">영문주소 변환기</a> 상세주소 칸에 "101동 1001호"처럼 한글로 입력하면 <em>Apt 101-1001</em>로 자동 변환되어 영문주소 앞에 붙습니다. 도로명·우편번호는 자동으로 채워지니 그대로 복사해 쓰면 됩니다.</p>`
},
{
  slug: "english-address-format-rules", date: "2026-06-22", cat: "영문 표기",
  title: "영문주소 띄어쓰기·대소문자·특수문자 규칙",
  h1: "영문주소 표기 규칙", tagline: "띄어쓰기·대소문자·하이픈·쉼표",
  desc: "영문주소를 쓸 때 띄어쓰기, 대소문자, 하이픈, 쉼표는 어떻게 처리할까요? 헷갈리는 표기 규칙과 흔한 실수를 정리했습니다.",
  kw: "영문주소 규칙, 영문주소 띄어쓰기, 영문주소 대소문자, 영문주소 하이픈, 영문주소 쉼표",
  body: `      <p>영문주소는 사소한 띄어쓰기나 기호 하나로 인식이 달라질 수 있습니다. 자주 헷갈리는 표기 규칙을 정리합니다.</p>

      <h2>쉼표로 단위를 구분</h2>
      <p>영문주소는 각 단위를 <strong>쉼표(,)</strong>로 구분합니다. 예) <em>110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em>. 쉼표가 없으면 물류 시스템이 단위를 헷갈릴 수 있습니다.</p>

      <h2>하이픈(-)의 사용</h2>
      <p>도로명 접미어(-daero, -ro, -gil)와 동-호수(101-1001)에 하이픈을 씁니다. 도로명의 하이픈은 정부 표기 그대로 유지해야 하며 임의로 띄어쓰면 안 됩니다.</p>

      <h2>대소문자</h2>
      <p>일반적으로 각 단어의 <strong>첫 글자만 대문자</strong>로 씁니다(예: Sejong-daero, Jung-gu). 다만 이름은 여권 표기를 따르며 전부 대문자로 쓰는 경우도 많습니다(HONG GILDONG). 쇼핑몰 입력칸은 대소문자를 가리지 않는 경우가 대부분입니다.</p>

      <h2>건물번호와 도로명 순서</h2>
      <p>영문에서는 <strong>건물번호가 도로명 앞</strong>에 옵니다. 한국식으로 "Sejong-daero 110"이 아니라 "<em>110 Sejong-daero</em>"가 맞습니다.</p>

      <h2>특수문자·약물</h2>
      <p>호수를 나타내는 <em>#</em>(넘버 기호)는 흔히 쓰이며(#302), 생략해도 됩니다. 마침표는 약어 뒤에만(Apt., Fl.) 선택적으로 씁니다. 한글·특수 기호는 영문주소에 넣지 않습니다.</p>

      <h2>정리</h2>
      <p>핵심은 ① 쉼표로 단위 구분, ② 건물번호 먼저, ③ 도로명 하이픈 유지입니다. 규칙이 헷갈리면 <a href="../index.html">변환기</a>가 정부 표기 그대로 출력해 주니 그대로 복사하는 것이 가장 안전합니다.</p>`
},
{
  slug: "visa-study-address-proof", date: "2026-06-22", cat: "서류 준비",
  title: "비자·유학 서류용 영문 주소 증명과 표기법",
  h1: "비자·유학 서류용 영문 주소", tagline: "거주지 영문 증명과 표기 주의점",
  desc: "비자 신청, 유학, 해외 취업 서류에 필요한 영문 거주지 주소를 어떻게 작성하고 증명할까요? 영문주소 표기 원칙과 증빙 서류를 정리했습니다.",
  kw: "비자 영문주소, 유학 영문주소, 거주지 증명 영문, 영문 주소증명, 영문주소 서류",
  body: `      <p>비자 신청서, 입학 원서, 해외 취업 서류에는 거의 항상 <strong>영문 거주지 주소(Address)</strong>를 적는 칸이 있습니다. 잘못 쓰면 서류가 반려될 수 있어 주의가 필요합니다.</p>

      <h2>기본 표기 원칙</h2>
      <p>서류용 영문주소도 일반 영문주소와 동일하게 <strong>작은 단위부터</strong> 씁니다. 예) <em>Apt 101-1001, 110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em>. 동·호수, 우편번호, 국가명을 빠짐없이 적는 것이 좋습니다.</p>

      <h2>여권 이름과 일치</h2>
      <p>주소와 함께 적는 이름은 반드시 <strong>여권 영문 이름과 동일</strong>해야 합니다. 비자·항공·입학 서류는 신원 일치가 중요하므로, 주소 변환기로 만든 이름이라도 여권이 있으면 여권 표기를 우선하세요.</p>

      <h2>주소 증빙이 필요한 경우</h2>
      <p>일부 비자·은행 절차는 거주지 증명(Proof of Address)을 요구합니다. 다음 서류가 흔히 인정됩니다.</p>
      <ul>
        <li>영문 주민등록등본(주민센터·정부24에서 영문 발급)</li>
        <li>영문 거주사실증명</li>
        <li>공과금 고지서, 은행 명세서(영문)</li>
      </ul>
      <p>이때 서류상 영문주소와 신청서에 적은 영문주소를 <strong>동일하게</strong> 맞추는 것이 중요합니다.</p>

      <h2>실수 줄이기</h2>
      <p>서류는 한 번 제출하면 수정이 번거로우므로, 영문주소를 <a href="../index.html">변환기</a>로 정확히 만들어 복사해 두고 모든 서류에 동일하게 사용하세요. 정부 공식 표기라 증빙 서류와도 잘 맞습니다.</p>`
},
{
  slug: "ems-dhl-fedex-address", date: "2026-06-23", cat: "국제배송",
  title: "국제특송(EMS·DHL·FedEx) 영문주소·라벨 작성 팁",
  h1: "국제특송 영문주소 작성 팁", tagline: "EMS·DHL·FedEx 송장 작성법",
  desc: "EMS, DHL, FedEx로 국제 발송·수취할 때 영문주소와 송장을 어떻게 작성할까요? 운송장 항목별 작성법과 통관 주의점을 정리했습니다.",
  kw: "EMS 영문주소, DHL 주소작성, FedEx 송장, 국제특송 주소, 운송장 영문, 국제배송 라벨",
  body: `      <p>EMS·DHL·FedEx 같은 국제특송은 송장(운송장)의 주소가 정확해야 빠르고 안전하게 배송됩니다. 항목별 작성법을 정리합니다.</p>

      <h2>수취인(Recipient) 항목</h2>
      <ul>
        <li><strong>Name</strong> — 여권 영문 이름</li>
        <li><strong>Address</strong> — 영문 도로명주소(작은 단위부터) + 우편번호 + Republic of Korea</li>
        <li><strong>Postal Code</strong> — 5자리 우편번호</li>
        <li><strong>Tel</strong> — +82 국제 형식 (010 → +82-10)</li>
      </ul>

      <h2>전화번호는 필수</h2>
      <p>국제특송은 통관·배송 단계에서 수취인에게 연락하는 경우가 많아 <strong>전화번호 누락 시 지연</strong>될 수 있습니다. 반드시 +82 형식으로 적으세요.</p>

      <h2>통관 정보</h2>
      <p>한국 수취 시 개인통관고유부호(P+13자리)가 필요할 수 있습니다. DHL·FedEx는 통관 단계에서 별도로 요청하기도 하므로 미리 준비해 두면 좋습니다. 명의는 수취인과 일치해야 합니다.</p>

      <h2>라벨 작성 팁</h2>
      <ul>
        <li>주소는 영문 대문자/소문자 모두 무방하나 또렷하게</li>
        <li>건물명·회사명이 있으면 함께 기재</li>
        <li>국가명(Republic of Korea)은 가장 크게/마지막 줄에</li>
      </ul>

      <h2>빠른 준비</h2>
      <p>수취인의 한글 주소만 있으면 <a href="../index.html">영문주소 변환기</a>에서 영문주소·우편번호·이름·전화번호를 한 화면에서 준비할 수 있습니다. 발송인에게 그대로 전달하면 송장 작성이 간단해집니다.</p>`
},
{
  slug: "shopping-mall-address-fields", date: "2026-06-23", cat: "해외직구",
  title: "해외 쇼핑몰 주소 입력칸 용어 완벽 해설",
  h1: "해외 쇼핑몰 주소 입력칸 용어", tagline: "Address Line·City·State·ZIP 뜻과 입력법",
  desc: "Address Line 1, City, State, Province, ZIP Code… 해외 쇼핑몰의 영어 주소 입력칸이 헷갈리시나요? 각 칸의 의미와 한국 주소를 어떻게 넣는지 정리했습니다.",
  kw: "Address Line, State Province, ZIP Code, 해외 쇼핑몰 주소, 직구 주소 입력칸, City 입력",
  body: `      <p>해외 쇼핑몰에서 가장 막히는 부분이 영어로 된 주소 입력칸입니다. 각 칸이 무엇을 의미하고 한국 주소의 어느 부분을 넣어야 하는지 정리합니다. 예시 주소: <em>서울특별시 중구 세종대로 110</em>.</p>

      <h2>Address Line 1 / Street Address</h2>
      <p>도로명 주소(건물번호 + 도로명)를 넣습니다. → <em>110 Sejong-daero</em></p>

      <h2>Address Line 2</h2>
      <p>동·호수 등 상세주소를 넣습니다(없으면 비워둠). → <em>Apt 101-1001</em></p>

      <h2>City</h2>
      <p>시·군·구를 넣습니다. 서울처럼 광역시는 구를 넣는 경우가 많습니다. → <em>Jung-gu</em></p>

      <h2>State / Province / Region</h2>
      <p>시·도를 넣습니다. → <em>Seoul</em>. 여기에 "Korea"를 넣는 실수가 흔하니 주의하세요.</p>

      <h2>ZIP / Postal Code</h2>
      <p>5자리 우편번호. → <em>04524</em></p>

      <h2>Country</h2>
      <p><em>South Korea</em> 또는 <em>Republic of Korea</em>를 선택/입력합니다.</p>

      <h2>쇼핑몰마다 칸 이름이 다릅니다</h2>
      <p>아마존은 State, 알리익스프레스는 Province, 이베이는 State/Province로 부르는 등 명칭이 제각각입니다. <a href="../index.html">영문주소 변환기</a>는 아마존·알리·이베이·아이허브별 입력 양식으로 결과를 자동 분해해, 각 칸에 넣을 값을 그대로 복사할 수 있게 해줍니다.</p>`
},
{
  slug: "verify-english-address", date: "2026-06-24", cat: "해외직구",
  title: "영문주소 오타·오류 점검과 검증하는 법",
  h1: "영문주소 검증하는 법", tagline: "배송 사고를 막는 주소 확인 습관",
  desc: "어렵게 만든 영문주소, 제대로 됐는지 어떻게 확인할까요? 흔한 오류 유형과 영문주소를 검증하는 간단한 방법을 정리했습니다.",
  kw: "영문주소 확인, 영문주소 검증, 영문주소 오타, 배송 주소 확인, 직구 주소 점검",
  body: `      <p>주소를 잘못 적으면 결제까지 마친 물건이 반송되거나 분실될 수 있습니다. 발송 전에 영문주소를 점검하는 방법을 정리합니다.</p>

      <h2>흔한 오류 유형</h2>
      <ul>
        <li>큰 단위부터 써서 순서가 거꾸로</li>
        <li>동·호수 누락</li>
        <li>우편번호를 구 6자리로 잘못 입력</li>
        <li>State 칸에 "Korea"를 넣음</li>
        <li>전화번호가 +82 형식이 아님</li>
      </ul>

      <h2>1. 공식 데이터로 만들었는지 확인</h2>
      <p>직접 음역하면 도로명 철자가 틀리기 쉽습니다. 행정안전부 공식 데이터를 쓰는 <a href="../index.html">변환기</a>로 만들면 철자·우편번호 오류를 원천 차단할 수 있습니다.</p>

      <h2>2. 지도로 위치 교차 확인</h2>
      <p>변환 결과의 한글 주소를 지도에서 검색해, 실제 우리 집 위치가 맞는지 눈으로 확인하면 동·호수를 제외한 주소 오류를 거의 잡을 수 있습니다.</p>

      <h2>3. 칸별로 끊어 읽기</h2>
      <p>쇼핑몰 입력 후, Address Line 1 / City / State / ZIP을 하나씩 소리 내어 확인하세요. 특히 City와 State가 바뀌지 않았는지 점검합니다.</p>

      <h2>4. 전화번호·통관부호 일치</h2>
      <p>전화번호는 +82 형식인지, 개인통관고유부호 명의가 수취인과 같은지 마지막으로 확인합니다.</p>

      <h2>정리</h2>
      <p>"공식 데이터로 생성 → 지도로 위치 확인 → 칸별 점검"의 3단계만 습관화하면 주소로 인한 배송 사고는 거의 사라집니다.</p>`
},
{
  slug: "english-address-abbreviations", date: "2026-06-24", cat: "영문 표기",
  title: "영문주소 줄임말·약어 정리 (Apt·Fl·Rm·Bldg·St·Rd)",
  h1: "영문주소 약어 정리", tagline: "헷갈리는 주소 약어 한눈에",
  desc: "Apt, Fl, Rm, Bldg, St, Rd, Ave… 영문주소에 자주 나오는 약어의 뜻을 표로 정리했습니다. 한국 주소를 영문으로 쓸 때 어떤 약어를 쓰는지도 안내합니다.",
  kw: "영문주소 약어, Apt 뜻, Fl Rm Bldg, 영문 주소 줄임말, St Rd Ave 차이",
  body: `      <p>영문주소에는 다양한 약어가 등장합니다. 뜻을 알면 입력이 한결 쉬워집니다. 자주 쓰는 약어를 정리했습니다.</p>

      <h2>건물·실 관련</h2>
      <ul>
        <li><strong>Apt</strong> — Apartment(아파트/세대). 예) Apt 101-1001</li>
        <li><strong>Fl / F</strong> — Floor(층). 예) 3F</li>
        <li><strong>Rm</strong> — Room(호/실). 예) Rm 302</li>
        <li><strong>Bldg</strong> — Building(건물/동)</li>
        <li><strong>B1, B2</strong> — Basement(지하 1·2층)</li>
        <li><strong>#</strong> — Number(호수). 예) #302</li>
      </ul>

      <h2>도로 관련 (참고)</h2>
      <p>영미권 주소에 쓰이는 도로 약어입니다. 한국 도로명은 음역(-ro, -daero, -gil)을 쓰므로 직접 쓸 일은 적지만 알아두면 좋습니다.</p>
      <ul>
        <li><strong>St</strong> — Street, <strong>Rd</strong> — Road</li>
        <li><strong>Ave</strong> — Avenue, <strong>Blvd</strong> — Boulevard</li>
        <li><strong>Ln</strong> — Lane, <strong>Dr</strong> — Drive</li>
      </ul>

      <h2>한국 주소에서 주로 쓰는 약어</h2>
      <p>한국 주소를 영문으로 쓸 때는 상세주소에 <strong>Apt(동-호), #(호수), F(층), B(지하)</strong> 정도만 쓰면 충분합니다. 도로명은 약어가 아니라 음역 그대로(Sejong-daero 등) 씁니다.</p>

      <h2>정리</h2>
      <p>약어는 어디까지나 보조 표기입니다. <a href="../index.html">변환기</a>는 동·호수를 자동으로 Apt·#·F 형태로 변환해 주니, 약어를 외울 필요 없이 결과를 그대로 사용하면 됩니다.</p>`
},
];

A.forEach((a) => writeFileSync(join(ROOT, "blog", `${a.slug}.html`), page(a)));
console.log(`블로그 글 ${A.length}편 생성:`, A.map((a) => a.slug).join(", "));
