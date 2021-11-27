class TaskMaster {
    maxNumber = 20;
    firstOperand;
    secondOperand;
    action;
    textTask;
    rightAnswer;

    actionTypes = ['+', '-', '*', '/'];

    setAction = () => {
        this.action = this.actionTypes[Math.floor(Math.random() * (this.actionTypes.length))];
    }
    setFirstOperand = () => {
        if(this.action !== '/'){
            this.firstOperand = Math.floor(Math.random() * (this.maxNumber)) + 1;
        }else{
            this.firstOperand = this.secondOperand * (Math.floor(Math.random() * (this.maxNumber/2)) + 1);
        }
    }
    setSecondOperand = () => {
        this.secondOperand = Math.floor(Math.random() * (this.maxNumber)) + 1;
    }
    getFirstOperand = () => {
        return this.firstOperand;
    }
    getSecondOperand = () => {
        return this.secondOperand;
    }
    getAction = () => {
        return this.action;
    }
    setTextTask = () => {
        this.textTask = `${this.firstOperand} ${this.action} ${this.secondOperand}`;
    }
    getTextTask = () => {
        return this.textTask;
    }
    displayTextTask = () => {
        document.getElementById('task').innerText = this.textTask;
    }
    setRightAnswer = () => {
        switch(this.action){
            case '+':
                this.rightAnswer = this.firstOperand + this.secondOperand;
                break;
            case '-':
                this.rightAnswer = this.firstOperand - this.secondOperand;
                break;
            case '*':
                this.rightAnswer = this.firstOperand * this.secondOperand;
                break;
            case '/':
                this.rightAnswer = this.firstOperand / this.secondOperand;
                break;
            default:
                console.log('problems with this.action: ', this.action);
        }
    }
    getRightAnswer = () => {
        return this.rightAnswer;
    }
    giveTask = () => {
        this.setAction();
        this.setSecondOperand();
        this.setFirstOperand();
        this.setRightAnswer();
        this.setTextTask();
        this.displayTextTask();
    }
}

class Game {
    typeOfTheGame;
    startGameTime;
    rightAnswers = 0;
    wrongAnswers = 0;
    skippedAnswers = 0;
    taskObject;
    logs = [];
    
    setTypeOfTheGame =(typeOfTheGame) => {
        this.typeOfTheGame = typeOfTheGame;
    }

    play = () => {
        
        switch(this.typeOfTheGame){
            case "free":
                this.renderGUI();
                this.taskObject.giveTask();
                console.log('free');
                break;
            case "marathon":
                this.renderGUI();
                this.taskObject.giveTask();
                this.startGameTime = Date.now();
                console.log('marathon');
                break;
            case "faultless":
                this.renderGUI();
                this.taskObject.giveTask();
                setInterval(this.endGame,120000);
                console.log("faultless");
                break;
            default:
                console.log('typo in game type');
                break;
        }
    }
    exit = () => {
        location.reload();
    }

    displayStats = (data, id) => {
        document.getElementById(id).innerText = data;
    }

    skiphandler = () => {
        ++this.skippedAnswers;
        this.taskObject.giveTask();
        this.displayStats(this.skippedAnswers,'skipped');
    }

    compareAnswers = (answer) => {
        if(answer === this.taskObject.getRightAnswer()){
            return true;
        }else{
            return false;
        }
    }

    addLog = (task, userAnswer, rightOrWrong) => {
        this.logs.push({
            task,
            userAnswer,
            rightOrWrong
        })
    }

    getEndGameTime = () => {
        const currentTime = Date.now();
        console.log(`start ${this.startGameTime}  current ${currentTime} = ${currentTime - this.startGameTime}`)
        let minutes = 0;
        let seconds = 0;
        if(currentTime - this.startGameTime > 60000){
            minutes = Math.floor(currentTime-this.startGameTime / 60000);
            seconds = ((currentTime-this.startGameTime % 60000) / 1000).toFixed(0);
        }

        seconds = (((currentTime-this.startGameTime) % 60000) / 1000).toFixed(0);
        return `Your result is: ${minutes === 0? '00' : minutes} : ${(seconds < 10 ? ' 0' : '')}${seconds}`;
    }

    updateGameStatistics = (rightOrWrong) => {
        if(rightOrWrong){
            ++this.rightAnswers;
            this.displayStats(this.rightAnswers,'right');
        }else{
            ++this.wrongAnswers;
            this.displayStats(this.wrongAnswers,'wrong');
        }
        this.addLog(this.taskObject.getTextTask(), Number(document.getElementById('answerInput').value), rightOrWrong);

    }

    endGameChecker = () => {
        let endOrNot = false;
        switch(this.typeOfTheGame){
            case 'marathon':
                if(this.rightAnswers === 20){
                    endOrNot = true;
                }
                break;
            case 'faultless':
                if(this.wrongAnswers !== 0){
                    endOrNot = true;
                }
                break;
            case 'free':
                break;
            default:
                console.log('problems with this.typeOfTheGame',this.typeOfTheGame)
        }
        return endOrNot;
    }

    submitHandler = () => {
        const userAnswer = Number(document.getElementById('answerInput').value)
        if(userAnswer || userAnswer === 0){
            const rightOrWrong = this.compareAnswers(userAnswer);
            this.updateGameStatistics(rightOrWrong);
            if(this.endGameChecker()){
                this.endGame();
                return;
            }
            this.taskObject.giveTask();
            document.getElementById('answerInput').value = '';
        }else{
            document.getElementById('answerInput').value = '';
        }
    }

    endGame = () => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        if(this.typeOfTheGame === 'marathon'){
            const span = document.createElement('span');
            span.innerText = this.getEndGameTime();
            document.body.appendChild(span);
        }

        const ul = document.createElement('ul');

        this.logs.forEach((item) => {
            const li = document.createElement('li');
            li.innerText = `${item.task} = ${item.userAnswer}`
            li.style.color = item.rightOrWrong===true?'green':'red';
            ul.appendChild(li);
        })

        let buttonReload = document.createElement('button');
        buttonReload.innerText = 'exit';
        buttonReload.addEventListener('click',this.exit);
        
        document.body.append(ul,buttonReload);
    }

    renderGUI = () => {
        let spanRightAnswers = document.createElement('span');
        spanRightAnswers.innerText = 'Right answers: ';
        let spanRightAnswersAns = document.createElement('span');
        spanRightAnswersAns.innerText = '0';
        spanRightAnswersAns.setAttribute('id','right');
        document.body.append(spanRightAnswers,spanRightAnswersAns);

        let spanWrongAnswers = document.createElement('span');
        spanWrongAnswers.innerText = 'Wrong answers: ';
        let spanWrongAnswersAns = document.createElement('span');
        spanWrongAnswersAns.innerText = '0';
        spanWrongAnswersAns.setAttribute('id','wrong');
        document.body.append(spanWrongAnswers,spanWrongAnswersAns);

        if(this.typeOfTheGame !== 'faultless'){
            let spanSkippedAnswers = document.createElement('span');
            spanSkippedAnswers.innerText = 'Skipped answers:';
            let spanSkippedAnswersAns = document.createElement('span');
            spanSkippedAnswersAns.innerText = '0';
            spanSkippedAnswersAns.setAttribute('id','skipped');

            let buttonSkip = document.createElement('button');
            buttonSkip.setAttribute('id','buttonSkip');
            buttonSkip.innerText = 'skip';

            buttonSkip.addEventListener('click', this.skiphandler);
            document.body.append(spanSkippedAnswers,spanSkippedAnswersAns,buttonSkip);
        }

        let buttonClose = document.createElement('button');
        buttonClose.innerText = 'exit';
        buttonClose.addEventListener('click',this.endGame)

        let task = document.createElement('div');
        this.taskObject = new TaskMaster();
        task.setAttribute('id','task');

        let answerInput = document.createElement('input');
        answerInput.setAttribute('id','answerInput');
        answerInput.setAttribute('type','text');

        let submitAnswer = document.createElement('button');
        submitAnswer.innerText = 'submit';
        submitAnswer.setAttribute('id','submitAnswer');
        submitAnswer.addEventListener('click', this.submitHandler);
        document.body.append(buttonClose, task, answerInput, submitAnswer);
    }
}

const gameStarter = (event) =>{
    game.setTypeOfTheGame(event.target.value);
    document.body.removeChild(document.getElementById('menu'));
    game.play();
}

const game= new Game();