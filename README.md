# 영문주소 변환기

한글 주소(도로명/지번)를 공식 영문 주소로 변환하는 정적 웹사이트입니다.
행정안전부 [도로명주소 개발자센터](https://business.juso.go.kr) 영문주소 API를 사용하며,
서버 없이 동작하므로 호스팅 비용이 들지 않습니다.

## 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 메인 페이지 (검색 UI + SEO 콘텐츠 + 광고 슬롯) |
| `app.js` | juso.go.kr 영문주소 API 호출(JSONP), 결과 렌더링, 복사/페이지네이션 |
| `config.js` | API 승인키 설정 |
| `style.css` | 스타일 |

## 시작하기

### 1. API 키 발급 (무료, 5분)

1. <https://business.juso.go.kr> 회원가입
2. **API 신청 → 검색 API → 영문주소** 선택
3. 개발용 키(90일)를 먼저 받아 테스트하고, 도메인이 정해지면 운영용 키(무기한)로 전환
4. 발급받은 승인키를 `config.js`의 `apiKey`에 입력

### 2. 로컬 테스트

```bash
python3 -m http.server 8000
# http://localhost:8000 접속
```

### 3. 무료 호스팅 배포

- **GitHub Pages**: 저장소 Settings → Pages → 브랜치 선택 (가장 간단)
- **Cloudflare Pages / Vercel / Netlify**: 저장소 연결만 하면 자동 배포, 커스텀 도메인 무료 연결

배포 후 `index.html`의 `canonical` URL과 `robots.txt`의 사이트맵 주소를 실제 도메인으로 바꾸세요.

### 4. 수익화 (AdSense)

1. 커스텀 도메인 연결 (AdSense는 자체 도메인 권장, 연 1~2만 원)
2. <https://adsense.google.com> 에서 사이트 등록 → 심사 (보통 며칠~몇 주)
3. 승인되면 `index.html` 상단의 AdSense 스크립트 주석을 해제하고 `ca-pub-XXXX`를 본인 ID로 교체
4. `ad-top`, `ad-bottom` 슬롯에 광고 단위 코드 삽입
5. 루트에 `ads.txt` 파일 추가 (AdSense가 안내해 줌)

### 5. SEO (트래픽의 핵심)

벤치마크한 jusoen.com은 트래픽의 약 74%가 구글 자연검색 유입입니다. 할 일:

- [Google Search Console](https://search.google.com/search-console)과 [네이버 서치어드바이저](https://searchadvisor.naver.com)에 사이트 등록 및 사이트맵 제출
- "영문주소 변환", "주소 영어로", "해외직구 주소 쓰는법" 등 검색어를 겨냥한 콘텐츠 페이지 추가
- 페이지 하단 FAQ/가이드 콘텐츠를 꾸준히 보강 (검색 노출과 AdSense 심사 모두에 유리)

## 현실적인 기대치

- 트래픽이 쌓이기까지 보통 수개월이 걸립니다. 도메인 신뢰도와 콘텐츠 양이 핵심입니다.
- 한국어 사이트 AdSense RPM(1천 노출당 수익)은 대략 $1~5 수준으로, 월 10만 방문 규모가 되어야 의미 있는 수익이 납니다.
- 동일 키워드에 jusoen.com, jusoga.com, juso24.com 등 기존 경쟁자가 있으므로, 차별화(예: 영문주소 + 통관부호 안내, 직구 가이드 결합)를 권장합니다.

## 추가 페이지 / 자산 (A·B 작업)

| 경로 | 역할 |
|---|---|
| `favicon.svg` / `og-image.png` | 파비콘·소셜 공유 이미지 (모든 페이지 메타에 연결됨) |
| `404.html` | GitHub Pages 404 페이지 |
| `widget.html` | 임베드용 미니 변환기 (iframe 삽입 대상) |
| `embed.html` | 위젯 설치 안내 + 복사용 iframe 코드 |
| `open-api.html` | 행정안전부 영문주소 API 사용법 (개발자 유입·백링크용) |
| `roads/` | 도로명별 정적 SEO 페이지 (프로그래매틱 SEO) |
| `scripts/build-roads.mjs` | 도로 페이지 생성기 |
| `roads-data.json` | 도로 시드 데이터 |

### 도로 페이지 생성/확장

```bash
node scripts/build-roads.mjs
```

`roads-data.json`에 `{ ko, eng, sido, sigungu, zip, landmark }` 형식으로 도로를 추가하면
`roads/<slug>.html`과 허브(`roads/index.html`), `sitemap-roads.xml`이 다시 생성됩니다.
juso.go.kr 무료 주소 DB를 같은 형식으로 변환해 넣으면 수만 페이지로 확장됩니다.

### 배포 시 도메인 교체

`example.com`을 실제 도메인으로 일괄 치환하세요(canonical, og:url, sitemap, build-roads.mjs의 `SITE`).
Search Console 인증과 GA4는 각 HTML `<head>`의 주석 처리된 자리에 값만 채우면 됩니다.
