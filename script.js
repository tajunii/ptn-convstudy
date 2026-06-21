const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRTUWrzsscnZ3sHRvSenqLY4o1c-mkvZLYV9GDTdhjvwkyBI7AYjkIRGFKX3Qjdftb7NL5m6HGnAYwS/pub?gid=1779898264&single=true&output=csv";

let data = [];
let remainingIndices = [];
let current = null;

// 안정성을 위해 DOM 요소를 명시적으로 가져옵니다.
const questionEl = document.getElementById('question');
const answerBtn = document.getElementById('answerBtn');
const answerEl = document.getElementById('answer');
const jpTextEl = document.getElementById('jpText');
const nextBtn = document.getElementById('nextBtn');

async function loadData() {
    try {
        const response = await fetch(SHEET_URL);
        const csv = await response.text();
        
        // 첫 번째 줄(헤더)을 제외하고 데이터 파싱
        const rows = csv.trim().split("\n").slice(1);

        data = rows.map(row => {
            const cols = row.split(",");
            return {
                jp: cols[4] ? cols[4].replace(/['"]+/g, '').trim() : '',
                kr: cols[5] ? cols[5].replace(/['"]+/g, '').trim() : ''
                audio: cols[6] ? cols[6].replace(/['"]+/g, '').trim() : '' // 이 줄 추가
            };
        }).filter(item => item.jp && item.kr); // 빈 데이터 걸러내기

        if (data.length > 0) {
            resetRemainingIndices();
            nextQuestion();
        } else {
            questionEl.textContent = "데이터를 찾을 수 없습니다.";
            answerBtn.style.display = "none";
        }
    } catch (error) {
        console.error("데이터 로드 실패:", error);
        questionEl.textContent = "데이터를 불러오는데 실패했습니다.";
        answerBtn.style.display = "none";
    }
}

function resetRemainingIndices() {
    remainingIndices = data.map((_, index) => index);
}

function playJapaneseAudio(text) {
    // Web Speech API 대신 Google 번역의 오디오 스트림(MP3)을 임시로 재생합니다.
    const audioUrl = `https://github.com/tajunii/ptn-convstudy/blob/main/audio/0001.mp3`;
    const audio = new Audio(audioUrl);
    audio.play().catch(e => console.error("음성 재생 실패:", e));
}

function nextQuestion() {
    // 모든 문제를 다 풀었으면 다시 섞기
    if (remainingIndices.length === 0) {
        resetRemainingIndices();
    }

    // 남은 문제 중에서 랜덤하게 선택 (중복 방지)
    const randomIndex = Math.floor(Math.random() * remainingIndices.length);
    const dataIndex = remainingIndices[randomIndex];
    current = data[dataIndex];
    
    // 선택된 문제는 목록에서 제거
    remainingIndices.splice(randomIndex, 1);
    
    // UI 초기화
    questionEl.textContent = current.kr;
    answerEl.classList.remove("reveal");
    
    // 버튼 상태 토글
    nextBtn.style.display = "none";
    answerBtn.style.display = "inline-block";
    
    // TV 리모컨 사용자를 위해 버튼에 포커스 이동
    answerBtn.focus();
}

answerBtn.addEventListener("click", () => {
    if (!current) return;

    jpTextEl.textContent = current.jp;
    answerEl.classList.add("reveal");

    if (current.audio) {
        playJapaneseAudio(current.audio);    

    // 정답을 보여줄 때 일본어 음성 재생
    playJapaneseAudio(current.jp);
    
    // 버튼 상태 토글
    answerBtn.style.display = "none";
    nextBtn.style.display = "inline-block";
    
    // 정답 확인 후 다음 문제 버튼으로 포커스 이동
    nextBtn.focus();
});

nextBtn.addEventListener("click", () => {
    nextQuestion();
});

// 앱 시작
loadData();

const audio = new Audio();

function playJapaneseAudio(filename) {
    if (!filename) return;
    const audioUrl = `https://raw.githubusercontent.com/tajunii/ptn-convstudy/main/audio/${filename}`;
    audio.src = audioUrl;
    audio.play().catch(e => console.error("오디오 재생 실패:", e));
}