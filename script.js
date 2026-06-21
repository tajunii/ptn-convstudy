const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRTUWrzsscnZ3sHRvSenqLY4o1c-mkvZLYV9GDTdhjvwkyBI7AYjkIRGFKX3Qjdftb7NL5m6HGnAYwS/pub?gid=1779898264&single=true&output=csv";

let data = [];
let remainingIndices = [];
let current = null;

// DOM
const questionEl = document.getElementById("question");
const answerBtn = document.getElementById("answerBtn");
const answerEl = document.getElementById("answer");
const jpTextEl = document.getElementById("jpText");
const nextBtn = document.getElementById("nextBtn");
const audioBtn = document.getElementById("audioBtn");

// 오디오 객체
const audio = new Audio();


// mp3 재생
function playJapaneseAudio(filename) {
    if (!filename) return;

    const audioUrl =
        `https://raw.githubusercontent.com/tajunii/ptn-convstudy/main/audio/${filename}`;

    audio.src = audioUrl;

    audio.play().catch(error => {
        console.error("오디오 재생 실패:", error);
    });
}


// 데이터 로드
async function loadData() {

    try {

        const response = await fetch(SHEET_URL);
        const csv = await response.text();

        // 헤더 제거
        const rows = csv.trim().split("\n").slice(1);

        data = rows.map(row => {

            const cols = row.split(",");

            return {

                jp: cols[4]
                    ? cols[4].replace(/['"]+/g, "").trim()
                    : "",

                kr: cols[5]
                    ? cols[5].replace(/['"]+/g, "").trim()
                    : "",

                audio: cols[6]
                    ? cols[6].replace(/['"]+/g, "").trim()
                    : ""

            };

        }).filter(item => item.jp && item.kr);

        if (data.length > 0) {

            resetRemainingIndices();
            nextQuestion();

        } else {

            questionEl.textContent = "데이터를 찾을 수 없습니다.";
            answerBtn.style.display = "none";

        }

    } catch (error) {

        console.error(error);

        questionEl.textContent =
            "데이터를 불러오는데 실패했습니다.";

        answerBtn.style.display = "none";
    }
}


// 한 바퀴용 문제 목록 생성
function resetRemainingIndices() {

    remainingIndices = data.map((_, index) => index);

}


// 다음 문제
function nextQuestion() {

    // 한 바퀴 끝나면 다시 시작
    if (remainingIndices.length === 0) {

        resetRemainingIndices();

    }

    // 남은 문제 중 랜덤 선택
    const randomIndex =
        Math.floor(Math.random() * remainingIndices.length);

    const dataIndex = remainingIndices[randomIndex];

    current = data[dataIndex];

    // 출제한 문제 제거
    remainingIndices.splice(randomIndex, 1);

    // 화면 초기화
    questionEl.textContent = current.kr;

    answerEl.classList.remove("reveal");

    answerBtn.style.display = "inline-block";

    nextBtn.style.display = "none";

    answerBtn.focus();

}


// 정답 보기
answerBtn.addEventListener("click", () => {

    if (!current) return;

    jpTextEl.textContent = current.jp;

    answerEl.classList.add("reveal");

    // 자동 재생
    playJapaneseAudio(current.audio);

    answerBtn.style.display = "none";

    nextBtn.style.display = "inline-block";

    nextBtn.focus();

});


// 다시 듣기
audioBtn.addEventListener("click", () => {

    if (!current) return;

    playJapaneseAudio(current.audio);

});


// 다음 문제
nextBtn.addEventListener("click", () => {

    nextQuestion();

});


// 시작
loadData();