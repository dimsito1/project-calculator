const calculator = {
    deleteBtn: document.querySelector('.delete'),
    clearBtn: document.querySelector('.clear'),
    resultDiv: document.querySelector('.result'),
    resultTextNode: document.createElement('div'),
    isLineActive: false,
    lineAnimInterval: null,
    lineAnimTimeout: null,
    tempSymbol: null,
    isSymbolPresent: false,
    isInEquation: false,
    number: 0,
    sum: 0,
    allButtons: document.querySelectorAll('button'),
    line: (function() {
        const tempDiv = document.createElement('div');
        tempDiv.classList.add("line");
        return tempDiv;
    })(),
    
    equation() {
        this.resultTextNode.textContent = this.sum;
        console.log(this.sum);
        this.isSymbolPresent = false;
        this.isInEquation = false;
    },
    
    addition() {
        if (!this.isSymbolPresent) {
            this.tempElement = '+';
            this.resultTextNode.textContent += this.tempElement;
            this.isSymbolPresent = true;
        }

        this.allButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('num')) {
                    this.sum = this.sum + parseInt(this.number);
                    console.log("first sum: " + this.sum);
                    this.number = button.innerText;
                    console.log("sum: " + this.sum);
                    this.sum = this.sum + parseInt(this.number);
                    console.log("sum: " + this.sum);
                    console.log("button number: " + this.number);
                }
                else {
                    this.executeOp(button);
                }
            });
        });
    },

    subtraction(first, second) {
        return first - second;
    },
    
    multiplication(first, second) {
        return first * second;
    },
    
    division(first, second) {
        return first / second;
    },

    startLineAnimation() {
        if (this.isLineActive) {
            return;
        }

        let showLine = true;
        this.isLineActive = true;
        
        this.lineAnimInterval = setInterval(() => {
            if (showLine) {
                const currLine = this.line.cloneNode();
                this.resultDiv.appendChild(currLine);
    
                this.lineAnimTimeout = setTimeout(() => {
                    currLine.remove();
                }, 500);
            }

            showLine = !showLine;
        }, 500);
    },

    stopLineAnimation() {
        clearInterval(this.lineAnimInterval);

        const lines = this.resultDiv.querySelectorAll('.line');
        lines.forEach(line => line.remove());

        this.isLineActive = false;
    },

    initEventListeners() {
        this.startLineAnimation();

        if (!this.isInEquation) {
            this.allButtons.forEach(button  => {
                button.addEventListener('click', () => {
                    this.stopLineAnimation();
                    
                    if (button.classList.contains('op')) {
                        this.executeOp(button);
                        return;
                    }
                    
                    console.log("SURELY NOT HERE");
                    this.number = button.innerText;
                    this.resultTextNode.textContent = this.number;
                    this.resultTextNode.classList.add('result-start');
                    this.resultDiv.appendChild(this.resultTextNode);
                    console.log("result num: " + this.number);

                    this.allButtons.forEach(button => {
                        button.removeEventListener('click', this.handleButtonClick.bind(this));
                    });

                    this.isInEquation = true;
                });
            });
        }

        this.deleteBtn.addEventListener('click', () => {
            console.log('Delete button clicked');
        });

        this.clearBtn.addEventListener('click', () => {
            console.log('Clear button clicked');
        });
    },

    executeOp(currButton) {
        console.log("operation");
        switch(true) {
            case currButton.classList.contains('add'):
                console.log("addition");
                this.addition();
                break;
            case currButton.classList.contains('subtract'):
                this.subtraction();
                break;
            case currButton.classList.contains('multiply'):
                this.multiplication();
                break;
            case currButton.classList.contains('divide'):
                this.division();
                break;
            case currButton.classList.contains('equals'):
                this.equation();
        }
    }
};

calculator.initEventListeners();