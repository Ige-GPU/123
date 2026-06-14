# korean-name-romanizer

한글 이름을 **여권식 로마자**로 변환하는 가벼운 JavaScript 라이브러리입니다.
의존성 0개, 약 2KB.

> 통용 성씨 표기(김 → KIM, 이 → LEE …)와 국어의 로마자 표기법을 함께 적용합니다.

## 설치

```bash
npm install korean-name-romanizer
```

또는 파일을 그대로 복사해 사용해도 됩니다.

## 사용법

```js
import romanizeName from "korean-name-romanizer";

romanizeName("홍길동");   // "HONG GILDONG"
romanizeName("김민수");   // "KIM MINSU"
romanizeName("남궁선영"); // "NAMGOONG SEONYEONG"  (복성 처리)
```

개별 함수도 제공합니다.

```js
import { romanize, romanizeSyllable } from "korean-name-romanizer";

romanize("세종대로");      // "sejongdaero"
romanizeSyllable("강");    // "gang"
```

## 주의

- 여권 영문 이름은 개인이 다르게 표기한 경우가 있으므로, 여권이 있다면 여권 표기를 우선하세요.
- 성씨는 통용 표기를 따르지만 일부 가문은 다른 표기를 쓸 수 있습니다.

## 한글 주소도 영문으로?

이 라이브러리는 **[영문주소 변환기](https://example.com/)** 에서 사용하는 로직의 일부입니다.
도로명·지번 주소를 영문으로 변환하고 해외직구 배송지 양식까지 만들어 주는 무료 도구는
[영문주소 변환기](https://example.com/)에서 사용할 수 있습니다.

## License

MIT
