class TaskMaster {
    constructor(maxNumber){
        this.maxNumber = maxNumber
    }
    maxNumber;
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

class Clocks{
    seconds;
    minutes;
    clockText;

    constructor(typeOfTheGame){
        switch(typeOfTheGame){
            case 'faultless':
                this.seconds = 0;
                this.minutes = 2;
                break;
            case 'marathon':
                this.seconds = 0;
                this.minutes = 0;
                break;
            case 'free':
                this.seconds = 0;
                this.minutes = 0;
                break;
            case 'children':
                this.seconds = 0;
                this.minutes = 0;
                break;
            case 'hard':
                this.seconds = 0;
                this.minutes = 0;
                break;
            default:
                console.log('typo in game type');
                break;
        }
    }

    setMinute = () => {
        ++this.minutes;
    }

    setSeconds = () => {
        ++this.seconds;
        if(this.seconds === 60){
            this.seconds = 0;
            this.setMinute();
        }
    }

    setClockText = () => {
        this.clockText = `${this.minutes < 10?'0'+this.minutes:this.minutes}:${this.seconds < 10?'0'+this.seconds:this.seconds}`;
        console.log(this.clockText);
    }

    renderClocks = () => {
        const div = document.createElement('div');
        div.setAttribute('id', 'clocks');
        this.setClockText();
        div.innerText = this.clockText;
        document.body.appendChild(div);
    }

    updateClocks = () => {
        this.setSeconds();
        this.setClockText();
        document.getElementById('clocks').innerText = this.clockText;
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
    clocks;
    intervalClocks;
    intervalHardMode;
    timeoutGame;
    
    setTypeOfTheGame =(typeOfTheGame) => {
        this.typeOfTheGame = typeOfTheGame;
    }

    terminateIntervals = () => {
        if(this.intervalClocks !== null){
            clearInterval(this.intervalClocks);
        }
        if(this.intervalHardMode !== null){
            clearInterval(this.intervalHardMode);
        }
    }

    terminateTimeout = () => {
        if(this.timeoutGame !== null){
            clearTimeout(this.timeoutGame);
        }
    }



    play = () => {
        
        switch(this.typeOfTheGame){
            case "free":
                this.taskObject = new TaskMaster(20);
                this.clocks = new Clocks(this.typeOfTheGame);
                this.renderGUI();
                this.taskObject.giveTask();
                this.intervalClocks = setInterval(this.clocks.updateClocks,1000);
                console.log('free');
                break;
            case "marathon":
                this.taskObject = new TaskMaster(20);
                this.clocks = new Clocks(this.typeOfTheGame);
                this.renderGUI();
                this.taskObject.giveTask();
                this.startGameTime = Date.now();
                this.intervalClocks = setInterval(this.clocks.updateClocks,1000);
                console.log('marathon');
                break;
            case "faultless":
                this.taskObject = new TaskMaster(20);
                this.clocks = new Clocks(this.typeOfTheGame);
                this.renderGUI();
                this.taskObject.giveTask();
                this.timeoutGame = setTimeout(this.endGame,120000);
                this.intervalClocks = setInterval(this.clocks.updateClocks,1000);
                console.log("faultless");
                break;
            case 'children':
                this.taskObject = new TaskMaster(10);
                this.clocks = new Clocks(this.typeOfTheGame);
                this.renderGUI();
                this.taskObject.giveTask();
                this.timeoutGame = setTimeout(this.endGame,30000);
                this.intervalClocks = setInterval(this.clocks.updateClocks,1000);
                console.log("children");
                break;
            case 'hard':
                this.taskObject = new TaskMaster(20);
                this.clocks = new Clocks(this.typeOfTheGame);
                this.renderGUI();
                this.taskObject.giveTask();
                this.timeoutGame = setTimeout(this.endGame,120000);
                this.intervalClocks = setInterval(this.clocks.updateClocks,1000);
                this.intervalHardMode = setInterval(this.submitHandler,3000);
                console.log("children");
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

    getStartOfGameTime = () => {
        return this.startGameTime;
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
            case 'children':
                break;
            case 'hard':
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
        this.terminateIntervals();
        this.terminateTimeout();
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

    createDataVisualisationBlock = (tagName, TextField,id) => {
        let textElement = document.createElement(tagName);
        textElement.innerText = TextField;
        let dataElement = document.createElement(tagName);
        dataElement.innerText = '0';
        dataElement.setAttribute('id',id);
        document.body.append(textElement,dataElement);
    }

    renderGUI = () => {
        this.clocks.renderClocks();
        this.createDataVisualisationBlock('span', 'Right answers: ', 'right');

        this.createDataVisualisationBlock('span', 'Wrong answers: ', 'wrong');

        if(this.typeOfTheGame !== 'faultless'){
            this.createDataVisualisationBlock('span', 'Skipped answers: ', 'skipped');

            let buttonSkip = document.createElement('button');
            buttonSkip.setAttribute('id','buttonSkip');
            buttonSkip.innerText = 'skip';

            buttonSkip.addEventListener('click', this.skiphandler);
            document.body.append(buttonSkip);
        }

        let buttonClose = document.createElement('button');
        buttonClose.innerText = 'exit';
        buttonClose.addEventListener('click',this.endGame)

        let task = document.createElement('div');
        // this.taskObject = new TaskMaster();
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