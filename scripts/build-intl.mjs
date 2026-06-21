// 영어·일본어 콘텐츠 글 생성기 (다국어 콘텐츠 보강)
// 사용법: node scripts/build-intl.mjs
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://jusoshift.com";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const T = {
  en: {
    nav: ["Home", "Bulk", "Region Table", "Blog", "Guides"],
    backToHome: "← Address Converter",
    cta: "→ Convert your address now",
    foot: '<a href="../en/">Home</a> · <a href="../batch.html">Bulk</a> · <a href="../english-region-names.html">Region Table</a> · <a href="../about.html">About</a> · <a href="../privacy.html">Privacy</a> · <a href="../terms.html">Terms</a> · <a href="mailto:contact@jusoshift.com">Contact</a>',
    data: "Address data: Korea road-name address system (juso.go.kr)",
    copyr: "&copy; 2026 jusoshift.com · Korean Address Converter",
    home: "../en/",
  },
  ja: {
    nav: ["ホーム", "一括変換", "表記表", "ブログ", "ガイド"],
    backToHome: "← 住所変換ツール",
    cta: "→ 今すぐ住所を変換する",
    foot: '<a href="../ja/">ホーム</a> · <a href="../batch.html">一括変換</a> · <a href="../english-region-names.html">表記表</a> · <a href="../about.html">サイト紹介</a> · <a href="../privacy.html">プライバシー</a> · <a href="../terms.html">利用規約</a> · <a href="mailto:contact@jusoshift.com">お問い合わせ</a>',
    data: "住所データ：韓国 道路名住所システム（juso.go.kr）",
    copyr: "&copy; 2026 jusoshift.com · 韓国住所 英語変換",
    home: "../ja/",
  },
};

function page(lang, a) {
  const t = T[lang];
  const nav = `<nav class="site-nav"><div class="site-nav-inner"><a href="${t.home}" class="nav-logo">jusoshift</a><div class="nav-links"><a href="${t.home}">${t.nav[0]}</a><a href="../batch.html">${t.nav[1]}</a><a href="../english-region-names.html">${t.nav[2]}</a></div></div></nav>`;
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <script>(function(){try{var t=localStorage.getItem('theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1734267557550376" crossorigin="anonymous"></script>
  <title>${esc(a.title)} | jusoshift</title>
  <meta name="description" content="${esc(a.desc)}">
  <link rel="canonical" href="${SITE}/${lang}/${a.slug}.html">
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
    "datePublished": "2026-06-25", "dateModified": "2026-06-25",
    "author": { "@type": "Organization", "name": "jusoshift" },
    "publisher": { "@type": "Organization", "name": "jusoshift", "logo": { "@type": "ImageObject", "url": "${SITE}/icon-512.png" } },
    "mainEntityOfPage": "${SITE}/${lang}/${a.slug}.html"
  }
  </script>
</head>
<body>
  ${nav}
  <header>
    <h1>${esc(a.h1)}</h1>
    <p class="tagline">${esc(a.tagline)}</p>
    <p class="lang-switch"><a href="${t.home}">${t.backToHome}</a></p>
  </header>
  <main>
    <article class="seo-content" style="margin-top:1.5rem;padding-top:0;border-top:none">
${a.body}
      <p style="margin-top:1.5rem"><a href="${t.home}"><strong>${t.cta}</strong></a></p>
    </article>
  </main>
  <footer>
    <p class="foot-links">${t.foot}</p>
    <p>${t.data}</p>
    <p>${t.copyr}</p>
  </footer>
</body>
</html>
`;
}

const EN = [
{
  slug: "how-to-write-korean-address-in-english",
  title: "How to Write a Korean Address in English",
  h1: "How to Write a Korean Address in English", tagline: "A simple guide for overseas shopping and shipping",
  desc: "Learn how to convert a Korean address into a standard English format. Understand the order, apartment unit notation, postal code, and country name with clear examples.",
  body: `      <p>If you shop on Amazon, AliExpress, or send a parcel to Korea, you need the Korean address written in English. The tricky part is that Korean and English addresses are written in <strong>opposite order</strong>.</p>
      <h2>Smallest unit first</h2>
      <p>A Korean address goes from the largest unit (province/city) to the smallest. In English, you write the <strong>smallest unit (building number) first</strong>. For example, <em>서울특별시 중구 세종대로 110</em> becomes <em>110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em>.</p>
      <h2>Apartment and unit numbers</h2>
      <p>Put the unit details at the very front. 101동 1001호 → <em>Apt 101-1001</em>. So the full address is <em>Apt 101-1001, 110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em>.</p>
      <h2>Postal code and country</h2>
      <p>Always include the <strong>5-digit postal code</strong> and <em>Republic of Korea</em> (or South Korea). The postal code is essential for customs and delivery sorting.</p>
      <h2>Region names</h2>
      <p>Provinces use <em>-do</em> (Gyeonggi-do), cities use <em>-si</em>, districts use <em>-gu</em>. Metropolitan cities use only the city name (Seoul). When unsure, the <a href="../english-region-names.html">region name table</a> lists the official English spelling.</p>
      <h2>The fastest way</h2>
      <p>Instead of memorizing the rules, type the Korean address into the <a href="../en/">converter</a> and copy the official English result, complete with postal code and shopping-site field mapping.</p>`
},
{
  slug: "korean-address-format-explained",
  title: "Korean Address Format Explained: Road Name vs Lot Number",
  h1: "Korean Address Format Explained", tagline: "Road-name vs lot-number addresses",
  desc: "Korea uses two address systems: road-name and lot-number. Learn the difference, when each is used, and which one to use for international shipping.",
  body: `      <p>Korea has two address systems, which can be confusing for newcomers: the <strong>road-name address</strong> and the older <strong>lot-number (jibun) address</strong>.</p>
      <h2>Road-name address</h2>
      <p>Structure: <em>Province + City/District + Road name + Building number</em>. Example: <em>Teheran-ro 152</em>. This has been the official system since 2014 and is best for navigation and delivery.</p>
      <h2>Lot-number address</h2>
      <p>Structure: <em>Province + City + Neighborhood (dong) + Lot number</em>. Example: <em>Yeoksam-dong 736-1</em>. It is based on land parcels and is still used in real-estate contexts.</p>
      <h2>Which to use for shipping?</h2>
      <p>For international shipping and online shopping, use the <strong>road-name address</strong> converted to English. Its structure (street name + number) matches international address formats. The <a href="../en/">converter</a> shows both road-name and lot-number English forms so you can pick what a site requires.</p>
      <h2>Building number logic</h2>
      <p>Building numbers are assigned along the road at roughly 20m intervals, with odd numbers on one side and even on the other. So similar numbers are physically close.</p>`
},
{
  slug: "sending-a-parcel-to-korea",
  title: "Sending a Parcel to Korea: Address, Name, and Phone Format",
  h1: "Sending a Parcel to Korea", tagline: "Get the recipient details right",
  desc: "Sending a package to Korea via EMS, DHL, or FedEx? Here is how to write the recipient's English address, romanized name, +82 phone number, and customs code.",
  body: `      <p>When sending a package to Korea, the recipient details must be accurate or the parcel may be delayed or returned. Here is the checklist.</p>
      <h2>Recipient address</h2>
      <p>Write the English road-name address, smallest unit first, with the postal code and country: <em>110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em>. Add unit details at the front (Apt 101-1001).</p>
      <h2>Name</h2>
      <p>Use the recipient's passport English name (e.g., HONG GILDONG). Consistency with the passport matters for customs.</p>
      <h2>Phone number</h2>
      <p>Use the international format. 010-1234-5678 becomes <em>+82-10-1234-5678</em> (drop the leading 0). Couriers often call the recipient during customs or delivery, so this is important.</p>
      <h2>Personal Customs Clearance Code</h2>
      <p>Direct shipments to Korea may require a Personal Customs Clearance Code (a 13-digit code starting with P). The name on the code must match the recipient.</p>
      <h2>Prepare in one place</h2>
      <p>With the recipient's Korean address, the <a href="../en/">converter</a> gives the English address, postal code, romanized name, and +82 phone format on one screen.</p>`
},
];

const JA = [
{
  slug: "how-to-write-korean-address-in-english",
  title: "韓国の住所を英語で書く方法",
  h1: "韓国の住所を英語で書く方法", tagline: "海外通販・国際発送のための基本",
  desc: "韓国の住所を標準的な英語表記に変換する方法を解説。書く順序、部屋番号の表記、郵便番号、国名まで例とともに分かりやすく紹介します。",
  body: `      <p>AmazonやAliExpressで買い物をしたり、韓国へ荷物を送るとき、韓国の住所を英語で書く必要があります。難しいのは、韓国語と英語では<strong>順序が逆</strong>になる点です。</p>
      <h2>小さい単位から書く</h2>
      <p>韓国の住所は大きい単位（道・市）から書きますが、英語では<strong>小さい単位（建物番号）から</strong>書きます。例：<em>서울특별시 중구 세종대로 110</em> → <em>110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em>。</p>
      <h2>部屋番号</h2>
      <p>詳細住所（棟・号）は先頭に付けます。101동 1001호 → <em>Apt 101-1001</em>。全体では <em>Apt 101-1001, 110 Sejong-daero, …</em> となります。</p>
      <h2>郵便番号と国名</h2>
      <p>末尾に<strong>5桁の郵便番号</strong>と <em>Republic of Korea</em> を付けます。郵便番号は通関・配送の仕分けに不可欠です。</p>
      <h2>地域名の表記</h2>
      <p>道は <em>-do</em>、市は <em>-si</em>、区は <em>-gu</em> を付けます。広域市は市名のみ（Seoul）。迷ったら<a href="../english-region-names.html">地域名 英語表</a>で公式表記を確認できます。</p>
      <h2>最も速い方法</h2>
      <p>規則を覚えなくても、<a href="../ja/">変換ツール</a>に韓国語の住所を入力すれば、公式の英語表記が郵便番号付きで出力され、そのままコピーできます。</p>`
},
{
  slug: "korean-address-format-explained",
  title: "韓国の道路名住所とは？仕組みを解説",
  h1: "韓国の道路名住所とは？", tagline: "道路名住所と地番住所の違い",
  desc: "韓国には道路名住所と地番住所の2つの体系があります。それぞれの違いと、国際発送でどちらを使うべきかを解説します。",
  body: `      <p>韓国には2つの住所体系があり、初めての方は戸惑いがちです。<strong>道路名住所</strong>と、古くからの<strong>地番（ジボン）住所</strong>です。</p>
      <h2>道路名住所</h2>
      <p>構造：<em>道・市/区 + 道路名 + 建物番号</em>。例：<em>Teheran-ro 152</em>。2014年から公式の住所体系で、配送やナビに適しています。</p>
      <h2>地番住所</h2>
      <p>構造：<em>道・市 + 洞（dong）+ 地番</em>。例：<em>Yeoksam-dong 736-1</em>。土地区画に基づくもので、不動産関連で今も使われます。</p>
      <h2>発送にはどちらを使う？</h2>
      <p>国際発送やオンラインショッピングでは、<strong>道路名住所</strong>を英語に変換して使います。「通り名＋番号」の構造が国際的な住所形式に合うためです。<a href="../ja/">変換ツール</a>は道路名・地番の英語表記を両方表示します。</p>
      <h2>建物番号の仕組み</h2>
      <p>建物番号は道路に沿って約20m間隔で付けられ、片側が奇数、反対側が偶数です。番号が近ければ物理的にも近い場所です。</p>`
},
{
  slug: "sending-a-parcel-to-korea",
  title: "韓国へ荷物を送る：住所・氏名・電話番号の書き方",
  h1: "韓国へ荷物を送る", tagline: "受取人情報を正確に",
  desc: "EMS・DHL・FedExで韓国へ荷物を送る際の、受取人の英語住所・ローマ字氏名・+82電話番号・通関コードの書き方を解説します。",
  body: `      <p>韓国へ荷物を送るとき、受取人情報が正確でないと遅延や返送の原因になります。チェックリストを紹介します。</p>
      <h2>受取人の住所</h2>
      <p>英語の道路名住所を小さい単位から、郵便番号と国名を付けて書きます：<em>110 Sejong-daero, Jung-gu, Seoul, 04524, Republic of Korea</em>。棟・号は先頭に（Apt 101-1001）。</p>
      <h2>氏名</h2>
      <p>受取人のパスポート英字氏名（例：HONG GILDONG）を使います。通関のため、パスポートとの一致が重要です。</p>
      <h2>電話番号</h2>
      <p>国際形式で書きます。010-1234-5678 → <em>+82-10-1234-5678</em>（先頭の0を取る）。通関・配送時に連絡が入ることが多いため重要です。</p>
      <h2>個人通関固有符号</h2>
      <p>韓国への直送には個人通関固有符号（Pで始まる13桁）が必要な場合があります。符号の名義は受取人と一致している必要があります。</p>
      <h2>まとめて準備</h2>
      <p>受取人の韓国語住所さえあれば、<a href="../ja/">変換ツール</a>で英語住所・郵便番号・ローマ字氏名・+82電話番号を一画面で準備できます。</p>`
},
];

mkdirSync(join(ROOT, "en"), { recursive: true });
mkdirSync(join(ROOT, "ja"), { recursive: true });
EN.forEach((a) => writeFileSync(join(ROOT, "en", `${a.slug}.html`), page("en", a)));
JA.forEach((a) => writeFileSync(join(ROOT, "ja", `${a.slug}.html`), page("ja", a)));
console.log(`EN ${EN.length}편, JA ${JA.length}편 생성`);
