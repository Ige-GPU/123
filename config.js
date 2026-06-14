// juso.go.kr 영문주소 API 설정
//
// 1. https://business.juso.go.kr 접속 → 회원가입 (무료)
// 2. [API 신청] → "검색 API" → "영문주소" 선택
//    - 개발용 키: 즉시 발급, 90일 유효
//    - 운영용 키: 사이트 도메인 등록 후 발급, 기간 무제한
// 3. 발급받은 승인키를 아래에 입력
const JUSO_CONFIG = {
  // 개발 단계에서는 juso.go.kr이 제공하는 테스트 키를 신청해 넣으세요.
  apiKey: "YOUR_JUSO_API_KEY",
  endpoint: "https://business.juso.go.kr/addrlink/addrEngApiJsonp.do",
  countPerPage: 10,
  // 위젯에서 본 사이트로 유도할 주소 (배포 시 실제 도메인으로 교체)
  siteUrl: "https://example.com/",
};
