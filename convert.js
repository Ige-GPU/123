// 공용 변환 유틸 — 단건(app.js)·대량(batch.js) 변환기에서 함께 사용
// 상세주소 한글 → 영문 자동 변환
//   "101동 1001호" → "Apt 101-1001"
//   "3층 302호"     → "#302, 3F"
//   "지하 1층"       → "B1"
//   "가동 203호"     → "Apt A-203"  (가·나·다 동 → A·B·C)
//   "B동 101호"      → "Apt B-101"
//   "302호"          → "#302"
function convertDetailKo(raw) {
  const s = (raw || "").trim();
  if (!s || !/[가-힣]/.test(s)) return s;

  // 가·나·다 … → A·B·C (단일 한글 동 라벨만)
  const WING = { "가":"A","나":"B","다":"C","라":"D","마":"E","바":"F","사":"G",
                 "아":"H","자":"I","차":"J","카":"K","타":"L","파":"M","하":"N" };
  const dongLabel = (d) => (d.length === 1 && WING[d]) ? WING[d] : d.toUpperCase();

  const dong = s.match(/([0-9A-Za-z가-힣])\s*동(?!\s*[로길])/);   // 도로명 '…동로' 오인 방지
  const dongNum = s.match(/(\d+)\s*동/);
  const ho = s.match(/([0-9A-Za-z]+(?:-[0-9A-Za-z]+)?)\s*호/);
  const basement = s.match(/지하\s*(\d+)?/);
  const floor = basement ? null : s.match(/(\d+)\s*층/);

  // 동 라벨은 숫자(101동)면 숫자, 한글/영문(가동·B동)이면 라벨화
  const dongVal = dongNum ? dongNum[1] : (dong ? dongLabel(dong[1]) : null);

  const parts = [];
  if (dongVal && ho) {
    parts.push("Apt " + dongVal + "-" + ho[1]);
  } else if (ho) {
    parts.push("#" + ho[1]);
  } else if (dongVal) {
    parts.push("Bldg " + dongVal);
  }
  if (floor && !(dongVal && ho)) parts.push(floor[1] + "F");
  if (basement) parts.push("B" + (basement[1] || "1"));

  if (parts.length === 0) return s; // 변환 규칙에 안 걸리면 원문 유지
  return parts.join(", ");
}
