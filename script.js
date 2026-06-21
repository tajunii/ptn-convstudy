const SHEET_URL =
"여기에 CSV 공유 주소 입력";

let data = [];
let current = null;

async function loadData() {

    const response = await fetch(SHEET_URL);

    const csv = await response.text();

    const rows =
        csv
        .trim()
        .split("\n")
        .slice(1);

    data = rows.map(row => {

        const cols = row.split(",");

        return {

            jp: cols[4],

            kr: cols[5]

        };

    });

    nextQuestion();
}

function nextQuestion() {

    current =
        data[
            Math.floor(
                Math.random() * data.length
            )
        ];

    question.textContent =
        current.kr;

    answer.classList.remove(
        "reveal"
    );

    nextBtn.style.display =
        "none";
}

answerBtn.addEventListener(
"click",

() => {

    jpText.textContent =
        current.jp;

    answer.classList.add(
        "reveal"
    );

    nextBtn.style.display =
        "block";

});

nextBtn.addEventListener(
"click",

() => {

    nextQuestion();

});

loadData();