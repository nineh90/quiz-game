var page = 0;
var correctAnswers = 0;
let questions;
var answerWasGiven = false;

function readFile(input) {
    let file = input.files[0];

    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function() {
        questions = JSON.parse(reader.result);
        questions = shuffle(questions);
        if(questions) {
            document.getElementById('start-screen-btn').disabled = false;
        }
    };

    reader.onerror = function() {
        console.log(reader.error);
    };
}

function loadGame() {
    setCurrentPageText();
    setCurrentQuestionText();
    setAnswerText();
    setSubmitBtnHandler();
    showGame();
}

function showGame() {
    document.getElementById("start-screen").style.display = 'none';
    document.getElementById("game").style.display = 'flex';
}

function loadQuestionJSOn(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

function setCurrentPageText() {
    let pageText = document.getElementById('page-text');
    pageText.innerHTML ='Frage: ' + parseFloat(page + 1);
}

function setCurrentQuestionText() {
    let questionText = document.getElementById('question-text');
    questionText.innerHTML = questions[page]['question'];
}

function setAnswerText() {
    let currentAnswers = questions[page].answers;
    for (var i = 0 ; i < currentAnswers.length ; i++) {
        let answerButton = document.createElement('button');
        answerButton.innerHTML = currentAnswers[i].answer;
        answerButton.classList = "answer-button list-group-item list-group-item-action";
        answerButton.id = "answer-button_" + i;
        answerButton.onclick = function() { // Note this is a function
            answerBtnClickHandler(this);
          };
        document.getElementById("question-wrapper").appendChild(answerButton);
    }
}

function answerBtnClickHandler(self) {
    let currentID = self.id;
    let currentBtnByID = document.getElementById(currentID);
    let cuttedId = parseFloat(currentBtnByID.id.substring(currentBtnByID.id.search('_') + 1));
    if (!currentBtnByID.parentElement.classList.contains('disabled')) {
        if(questions[page].answers[cuttedId].result) {
            currentBtnByID.classList.add('success');
            correctAnswers++;
        } else {
            currentBtnByID.classList.add('error');
            for(let i = 0 ; i < questions[page].answers.length ; i++) {
                if (questions[page].answers[i].result) {
                    document.getElementById('answer-button_' + i).classList.add('success');
                }
            }
        }
        currentBtnByID.parentElement.classList.add('disabled');
        document.getElementById('submit-btn').classList.remove('disabled');
        answerWasGiven = true;
    }
}

function setSubmitBtnHandler() {    
    document.getElementById('submit-btn').onclick = function() { // Note this is a function
        if (page < questions.length - 1) {
            if (answerWasGiven) {
                answerWasGiven = false;
                document.getElementById('submit-btn').classList.add('disabled');
                page = page + 1;
                document.getElementById('question-wrapper').innerHTML = "";
                document.getElementById('question-wrapper').classList.remove('disabled');
                setCurrentPageText();
                setCurrentQuestionText();
                setAnswerText();
            }
        } else {
            document.getElementById("game").style.display = 'none';
            document.getElementById("end-screen").style.display = 'flex';
            let pageText = document.getElementById('page-text');
            pageText.innerHTML ='Du hast ' + correctAnswers + ' Fragen Richtig Beantwortet';
        }
      };
}

function shuffle(sourceArray) {
    for (var i = 0; i < sourceArray.length - 1; i++) {
        var j = i + Math.floor(Math.random() * (sourceArray.length - i));

        var temp = sourceArray[j];
        sourceArray[j] = sourceArray[i];
        sourceArray[i] = temp;
    }
    return sourceArray;
}