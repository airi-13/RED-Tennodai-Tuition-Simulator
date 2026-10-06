const CONFIG = {
middle12: {
label: "中1・2",

```
// 通常授業：1コマあたり月額
lesson: 9900,

// テスト対策：1教科・1回
test: 4500,

// 講習：1教科・1回
course: 12200,

// パック
pack1: {
  name: "週4パック",
  monthly: 29700,
  maxLessons: 4
},

// 無制限
unlimited: 47520
```

},

middle3high1: {
label: "中3・高1",

```
// 通常授業：1コマあたり月額
lesson: 11800,

// テスト対策：1教科・1回
test: 5800,

// 講習：1教科・1回
course: 14700,

// パック
pack1: {
  name: "週6パック",
  monthly: 39600,
  maxLessons: 6
},

// 無制限
unlimited: 56640
```

}
};

// 諸経費
const ADMIN_FEE_MONTHLY = 2650;
const ADMIN_FEE_ANNUAL = ADMIN_FEE_MONTHLY * 12;

// 現在の選択
let grade = "middle12";
let subjects = 2;
let lessons = 2;
let testSubjects = 2;

// 金額表示
function yen(value) {
return value.toLocaleString("ja-JP") + "円";
}

// 年間パック料金
function annualPack(monthly) {
return monthly * 12;
}

// 画面更新
function update() {

const config = CONFIG[grade];

/*

* 条件調整
*
* 通常授業教科数 ≦ 通常授業コマ数
* 通常授業教科数 ≦ テスト対策教科数
*
* 教科数を増やした場合だけ、
* 必要なコマ数・テスト対策教科数を自動的に引き上げる。
  */
  lessons = Math.max(lessons, subjects);
  testSubjects = Math.max(testSubjects, subjects);

// =========================
// 通常料金
// =========================

const regularLessonMonthly =
config.lesson * lessons;

// 月額表示：
// 通常授業料 ～ 通常授業料＋テスト対策料金
const regularMonthlyMin =
regularLessonMonthly;

const regularMonthlyMax =
regularLessonMonthly +
config.test * testSubjects;

/*

* 年間費用
*
* 週1コマあたり料金 × 週コマ数 × 11
* ＋ 通常受講教科数 × 講習料金 × 3
* ＋ テスト対策料金 × 教科数 × 3
* ＋ 諸経費
  */
  const regularAnnual =
  config.lesson * lessons * 11 +
  subjects * config.course * 3 +
  config.test * testSubjects * 3 +
  ADMIN_FEE_ANNUAL;

// =========================
// パック
// =========================

const pack1Monthly =
config.pack1.monthly;

const pack1Annual =
annualPack(pack1Monthly) +
ADMIN_FEE_ANNUAL;

// =========================
// 無制限
// =========================

const unlimitedMonthly =
config.unlimited;

const unlimitedAnnual =
annualPack(unlimitedMonthly) +
ADMIN_FEE_ANNUAL;

// =========================
// 料金表示
// =========================

document.getElementById("regularMonthly").textContent =
yen(regularMonthlyMin) + "～" + yen(regularMonthlyMax);

document.getElementById("regularAnnual").textContent =
yen(regularAnnual);

document.getElementById("packMonthly").textContent =
yen(pack1Monthly);

document.getElementById("packAnnual").textContent =
yen(pack1Annual);

document.getElementById("unlimitedMonthly").textContent =
yen(unlimitedMonthly);

document.getElementById("unlimitedAnnual").textContent =
yen(unlimitedAnnual);

// =========================
// 詳細表示
// =========================

document.getElementById("regularMonthlyRange").textContent =
yen(regularMonthlyMin) +
"～" +
yen(regularMonthlyMax) +
"/月";

document.getElementById("packDetailTitle").textContent =
config.pack1.name;

document.getElementById("packDetailValue").textContent =
yen(pack1Monthly) + "/月";

document.getElementById("unlimitedDetailValue").textContent =
yen(unlimitedMonthly) + "/月";

// =========================
// 学年によるパック名変更
// =========================

document.getElementById("packColumnName").textContent =
config.pack1.name;

document.getElementById("rulesPackName").textContent =
config.pack1.name;

// =========================
// 比較表
// =========================

document.getElementById("regularLessonRule").textContent =
"週" + lessons + "コマ";

document.getElementById("packLessonRule").textContent =
"週" + config.pack1.maxLessons + "コマまで";

document.getElementById("regularSubjectRule").textContent =
subjects + "教科";

// =========================
// パック利用可否
// =========================

const packStatus =
document.getElementById("packStatus");

if (lessons <= config.pack1.maxLessons) {

```
packStatus.textContent =
  config.pack1.name +
  "は、現在選択している週" +
  lessons +
  "コマの受講に対応しています。";
```

} else {

```
packStatus.textContent =
  "現在の週" +
  lessons +
  "コマでは" +
  config.pack1.name +
  "の上限を超えるため、通常料金または無制限をご利用ください。";
```

}

// =========================
// おすすめプラン
// =========================

const availablePlans = [
{
name: "通常料金",
annual: regularAnnual
}
];

if (lessons <= config.pack1.maxLessons) {

```
availablePlans.push({
  name: config.pack1.name,
  annual: pack1Annual
});
```

}

availablePlans.push({
name: "無制限",
annual: unlimitedAnnual
});

availablePlans.sort((a, b) =>
a.annual - b.annual
);

const cheapest =
availablePlans[0];

document.getElementById("recommendTitle").textContent =
cheapest.name;

document.getElementById("recommendText").textContent =
"年間費用のシミュレーションでは、" +
cheapest.name +
"が最も低い料金です。";

// =========================
// カウンター表示
// =========================

document.getElementById("subjectCount").textContent =
subjects;

document.getElementById("lessonCount").textContent =
lessons;

document.getElementById("testSubjectCount").textContent =
testSubjects;

// =========================
// −ボタンの無効化
// =========================

document.getElementById("subjectMinus").disabled =
subjects <= 1;

document.getElementById("lessonMinus").disabled =
lessons <= subjects;

document.getElementById("testSubjectMinus").disabled =
testSubjects <= subjects;

// =========================
// ＋ボタンの無効化
// 最大5教科
// =========================

document.getElementById("subjectPlus").disabled =
subjects >= 5;

document.getElementById("testSubjectPlus").disabled =
testSubjects >= 5;

// 週コマ数は最大10コマ
document.getElementById("lessonPlus").disabled =
lessons >= 10;

// =========================
// 学年ボタン
// =========================

document.querySelectorAll(".grade-btn").forEach(button => {

```
button.classList.toggle(
  "active",
  button.dataset.grade === grade
);
```

});

}

// =========================
// 学年ボタン
// =========================

document.querySelectorAll(".grade-btn").forEach(button => {

button.addEventListener("click", () => {

```
grade = button.dataset.grade;

update();
```

});

});

// =========================
// 通常授業教科数
// =========================

document.getElementById("subjectMinus")
.addEventListener("click", () => {

```
if (subjects > 1) {

  subjects--;

  update();

}
```

});

document.getElementById("subjectPlus")
.addEventListener("click", () => {

```
if (subjects < 5) {

  subjects++;

  update();

}
```

});

// =========================
// 通常授業週コマ数
// =========================

document.getElementById("lessonMinus")
.addEventListener("click", () => {

```
if (lessons > subjects) {

  lessons--;

  update();

}
```

});

document.getElementById("lessonPlus")
.addEventListener("click", () => {

```
if (lessons < 10) {

  lessons++;

  update();

}
```

});

// =========================
// テスト対策教科数
// =========================

document.getElementById("testSubjectMinus")
.addEventListener("click", () => {

```
if (testSubjects > subjects) {

  testSubjects--;

  update();

}
```

});

document.getElementById("testSubjectPlus")
.addEventListener("click", () => {

```
if (testSubjects < 5) {

  testSubjects++;

  update();

}
```

});

// =========================
// 初期表示
// =========================

update();
