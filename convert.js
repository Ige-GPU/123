// 공용 변환 유틸 — 단건(app.js)·대량(batch.js) 변환기에서 함께 사용
// "101동 1001호" → "Apt 101-1001", "3층 302호" → "#302, 3F", "지하 1층" → "B1"
function convertDetailKo(raw) {
  const s = (raw || "").trim();
  if (!s || !/[가-힣]/.test(s)) return s;

  const dong = s.match(/(\d+)\s*동/);
  const ho = s.match(/(\d+)\s*호/);
  const basement = s.match(/지하\s*(\d+)?\s*층?/);
  const floor = basement ? null : s.match(/(\d+)\s*층/);

  const parts = [];
  if (dong && ho) {
    parts.push("Apt " + dong[1] + "-" + ho[1]);
  } else if (ho) {
    parts.push("#" + ho[1]);
  }
  if (floor && !(dong && ho)) parts.push(floor[1] + "F");
  if (basement) parts.push("B" + (basement[1] || "1"));

  if (parts.length === 0) return s; // 변환 규칙에 안 걸리면 원문 유지
  return parts.join(", ");
}
