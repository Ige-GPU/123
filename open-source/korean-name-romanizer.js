/*!
 * korean-name-romanizer
 * 한글 이름을 여권식 로마자로 변환합니다. (통용 성씨 표기 + 국어의 로마자 표기법)
 * MIT License · https://jusoshift.com/  (영문주소 변환기)
 */

const CHO = ["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"];
const JUNG = ["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"];
const JONG = ["","k","k","k","n","n","n","t","l","k","m","l","l","l","p","l","m","p","p","t","t","ng","t","t","k","t","p","t"];

// 여권에서 통용되는 성씨 표기 (표준 로마자와 다른 관용 표기 우선)
const SURNAMES = {
  "김":"KIM","이":"LEE","박":"PARK","최":"CHOI","정":"JUNG","강":"KANG","조":"CHO","윤":"YOON",
  "장":"JANG","임":"LIM","한":"HAN","오":"OH","서":"SEO","신":"SHIN","권":"KWON","황":"HWANG",
  "안":"AHN","송":"SONG","전":"JEON","홍":"HONG","유":"YOO","고":"KO","문":"MOON","양":"YANG",
  "손":"SON","배":"BAE","백":"BAEK","허":"HUH","남":"NAM","심":"SHIM","노":"NOH","하":"HA",
  "곽":"KWAK","성":"SUNG","차":"CHA","주":"JOO","우":"WOO","구":"KOO","민":"MIN","류":"RYU",
  "나":"NA","진":"JIN","지":"JI","엄":"UM","채":"CHAE","원":"WON","천":"CHUN","방":"BANG",
  "공":"KONG","현":"HYUN","함":"HAM","변":"BYUN","염":"YEOM","여":"YEO","추":"CHOO","도":"DO",
  "소":"SO","석":"SUK","선":"SUN","설":"SEOL","마":"MA","길":"GIL","연":"YEON","위":"WI",
  "표":"PYO","명":"MYUNG","기":"KI","금":"KEUM","왕":"WANG","반":"BAN","옥":"OK","육":"YOOK",
  "인":"IN","맹":"MAENG","제":"JE","모":"MO","탁":"TAK","국":"KOOK","은":"EUN","편":"PYUN","용":"YONG",
  "남궁":"NAMGOONG","황보":"HWANGBO","제갈":"JEGAL","선우":"SUNWOO","독고":"DOKGO","사공":"SAGONG","서문":"SEOMOON"
};

/** 한 음절을 로마자로 변환 */
export function romanizeSyllable(ch) {
  const code = ch.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return ch;
  return CHO[Math.floor(code / 588)] + JUNG[Math.floor((code % 588) / 28)] + JONG[code % 28];
}

/** 한글 문자열 전체를 로마자로 변환 */
export function romanize(str) {
  return Array.prototype.map.call(str, romanizeSyllable).join("");
}

/**
 * 한글 이름 → 여권식 로마자 (예: "홍길동" → "HONG GILDONG")
 * @param {string} raw 한글 이름
 * @returns {string} "성 이름" 형태의 대문자 로마자, 변환 불가 시 ""
 */
export function romanizeName(raw) {
  const s = (raw || "").replace(/\s+/g, "").trim();
  if (!s || !/^[가-힣]+$/.test(s)) return "";
  let surname, given;
  if (s.length >= 3 && SURNAMES[s.slice(0, 2)]) {
    surname = SURNAMES[s.slice(0, 2)];
    given = s.slice(2);
  } else {
    surname = SURNAMES[s[0]] || romanize(s[0]).toUpperCase();
    given = s.slice(1);
  }
  if (!given) return surname;
  return surname + " " + romanize(given).toUpperCase();
}

export default romanizeName;
