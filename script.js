const SHEET_URL =
"https://docs.google.com/spreadsheets/d/e/2PACX-1vRTUWrzsscnZ3sHRvSenqLY4o1c-mkvZLYV9GDTdhjvwkyBI7AYjkIRGFKX3Qjdftb7NL5m6HGnAYwS/pub?gid=1779898264&single=true&output=csv";

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