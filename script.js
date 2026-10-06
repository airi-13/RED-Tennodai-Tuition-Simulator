const CONFIG = {
  middle12: {
    label: "中1・2",
    lesson: 9900,
    test: 4500,
    pack1: {
      name: "週4パック",
      monthly: 29700,
      maxLessons: 4
    },
    unlimited: 47520
  },
  middle3high1: {
    label: "中3・高1",
    lesson: 11800,
    test: 5800,
    pack1: {
      name: "週6パック",
      monthly: 39600,
      maxLessons: 6
    },
    unlimited: 56640
  }
};

let grade = "middle12";
let subjects = 2;
let lessons = 2;
let testSubjects = 2;

const yen = n => `${n.toLocaleString("ja-JP")}円`;

function annualPack(monthly) {
  return monthly * 12;
}

function update() {
  const c = CONFIG[grade];

  // 絶対条件
  lessons = Math.max(lessons, subjects);
  testSubjects = Math.max(testSubjects, subjects);

  document.getElementById("subjectValue").textContent = subjects;
  document.getElementById("lessonValue").textContent = lessons;
  document.getElementById("testValue").textContent = testSubjects;

  document.getElementById("lessonMinus").disabled = lessons <= subjects;
  document.getElementById("testMinus").disabled = testSubjects <= subjects;
  document.getElementById("subjectMinus").disabled = subjects <= 1;

  document.getElementById("lessonPlus").disabled = lessons >= 10;
  document.getElementById("testPlus").disabled = testSubjects >= 10;
  document.getElementById("subjectPlus").disabled = subjects >= 10;

  const regularLessonMonthly = c.lesson * lessons;
  const regularTestMonthly = c.test * testSubjects;

  // ユーザー指定：
  // 月額は「通常授業のみ」～「通常授業＋テスト対策」
  const regularMonthlyMin = regularLessonMonthly;
  const regularMonthlyMax = regularLessonMonthly + regularTestMonthly;

  // 年間は、テスト対策を年3回として計算
  const regularAnnual =
    regularLessonMonthly * 12 +
    regularTestMonthly * 3;

  const pack1Annual = annualPack(c.pack1.monthly);
  const unlimitedAnnual = annualPack(c.unlimited);

  document.getElementById("summary").textContent =
    `${c.label} ／ 通常${subjects}教科 ／ 週${lessons}コマ ／ テスト対策${testSubjects}教科`;

  document.getElementById("regularMonthly").textContent =
    `${yen(regularMonthlyMin)}～${yen(regularMonthlyMax)}`;

  document.getElementById("regularAnnual").textContent =
    yen(regularAnnual);

  document.getElementById("pack1Name").textContent = c.pack1.name;
  document.getElementById("pack1Note").textContent =
    `週${c.pack1.maxLessons}コマまで`;

  document.getElementById("pack1Monthly").textContent =
    yen(c.pack1.monthly);
  document.getElementById("pack1Annual").textContent =
    yen(pack1Annual);

  document.getElementById("unlimitedMonthly").textContent =
    yen(c.unlimited);
  document.getElementById("unlimitedAnnual").textContent =
    yen(unlimitedAnnual);

  const status = document.getElementById("pack1Status");
  if (lessons <= c.pack1.maxLessons) {
    const diff = regularAnnual - pack1Annual;
    status.className = "status ok";
    status.textContent =
      `${c.pack1.name}は現在の週${lessons}コマに対応しています。` +
      (diff > 0
        ? ` 通常料金より年間${yen(diff)}お得です。`
        : diff === 0
          ? " 通常料金と年間料金が同額です。"
          : ` 通常料金より年間${yen(Math.abs(diff))}高くなります。`);
  } else {
    status.className = "status";
    status.textContent =
      `現在の週${lessons}コマでは${c.pack1.name}の上限（週${c.pack1.maxLessons}コマ）を超えるため利用できません。`;
  }

  const recommendation = document.getElementById("recommendation");

  const candidates = [
    { name: "通常料金", annual: regularAnnual, available: true },
    {
      name: c.pack1.name,
      annual: pack1Annual,
      available: lessons <= c.pack1.maxLessons
    },
    { name: "無制限", annual: unlimitedAnnual, available: true }
  ].filter(x => x.available);

  const cheapest = candidates.reduce((a, b) =>
    a.annual <= b.annual ? a : b
  );

  if (cheapest.name === "通常料金") {
    recommendation.textContent =
      "この条件では、年間料金だけを見ると通常料金が最も低くなります。";
  } else {
    const diff = regularAnnual - cheapest.annual;
    recommendation.textContent =
      `${cheapest.name}がおすすめです。通常料金と比べて年間${yen(Math.abs(diff))}` +
      `${diff >= 0 ? "お得です。" : "高くなります。"}`
  }
}

document.querySelectorAll(".grade-choices .choice").forEach(btn => {
  btn.addEventListener("click", () => {
    grade = btn.dataset.grade;
    document.querySelectorAll(".grade-choices .choice")
      .forEach(x => x.classList.remove("active"));
    btn.classList.add("active");
    update();
  });
});

document.getElementById("subjectMinus").addEventListener("click", () => {
  if (subjects > 1) {
    subjects--;
    update();
  }
});

document.getElementById("subjectPlus").addEventListener("click", () => {
  if (subjects < 10) {
    subjects++;
    update();
  }
});

document.getElementById("lessonMinus").addEventListener("click", () => {
  if (lessons > subjects) {
    lessons--;
    update();
  }
});

document.getElementById("lessonPlus").addEventListener("click", () => {
  if (lessons < 10) {
    lessons++;
    update();
  }
});

document.getElementById("testMinus").addEventListener("click", () => {
  if (testSubjects > subjects) {
    testSubjects--;
    update();
  }
});

document.getElementById("testPlus").addEventListener("click", () => {
  if (testSubjects < 10) {
    testSubjects++;
    update();
  }
});

update();
