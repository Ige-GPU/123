# 배포 가이드 (jusoshift.com)

## 1. API 키 (가장 먼저)
1. https://business.juso.go.kr → 회원가입/로그인
2. [API신청] → 검색 API → **영문주소** 선택
3. 개발용 키(즉시·90일) 발급 → 운영용 키는 도메인 등록 후
4. 발급 승인키를 `config.js`의 `apiKey`에 입력

## 2. GitHub Pages 켜기
- 저장소 Settings → Pages → Source: **GitHub Actions** 선택
- (이미 `.github/workflows/pages.yml` 있음 → main 브랜치 푸시 시 자동 배포)

## 3. 도메인 연결 (jusoshift.com)
- 저장소에 `CNAME` 파일 있음(= jusoshift.com)
- Settings → Pages → Custom domain 에 `jusoshift.com` 입력
- 도메인 등록처(가비아/네임칩 등) DNS에 아래 추가:

**Apex 도메인(jusoshift.com) — A 레코드 4개:**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
**www 서브도메인 — CNAME:**
```
www  →  <github계정>.github.io
```
- Pages에서 "Enforce HTTPS" 체크 (인증서 자동 발급, 몇 분~수십 분 소요)

## 4. 배포 후 (살아난 다음)
- Google Search Console + 네이버 서치어드바이저 등록 → sitemap.xml 제출
- 트래픽 잡히면 AdSense 신청 → ads.txt의 pub ID 교체
- juso.go.kr 운영용 키(도메인 제한)로 전환
