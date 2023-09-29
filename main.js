const calculator = {
    deleteBtn: document.querySelector('.delete'),
    clearBtn: document.querySelector('.clear'),
    resultDiv: document.querySelector('.result'),
    resultTextNode: document.createElement('div'),
    infoArray: [],
    isLineActive: false,
    lineAnimInterval: null,
    lineAnimTimeout: null,
    isCommaPresent: false,
    isSymbolPresent: false,
    sum: 0,
    allButtons: document.querySelectorAll('button'),
    line: (function() {
        const tempDiv = document.createElement('div');
        tempDiv.classList.add("line");
        return tempDiv;
    })(),
    
    isEquationGood() {
        if (this.infoArray[0] === '×' || this.infoArray[0] === '÷') {
            return false;
        }
    
        let symbolFound = false;
        for (let i = 0; i < this.infoArray.length; i++) {
            if (symbolFound && (this.infoArray[i] === '+' || this.infoArray[i] === '−' || this.infoArray[i] === '×' || this.infoArray[i] === '÷')) {
                return false;
            }
            if (this.infoArray[i] === '÷' && (parseFloat(this.infoArray[i + 1]) === 0 || /^0+$/.test(this.infoArray[i + 1]))) {
                // Check for division by zero or by any sequence interpreted as zero
                return false;
            }
            if (this.infoArray[i] === '+' || this.infoArray[i] === '−' || this.infoArray[i] === '×' || this.infoArray[i] === '÷') {
                symbolFound = true;
            } else if (!isNaN(this.infoArray[i]) && this.infoArray[i] !== ' ') { // Check if it's a number and not a space.
                symbolFound = false;
            }
        }
    
        return true;
    },

    clear() {
        this.sum = 0;
        this.resultTextNode.textContent = '0';
        this.infoArray = [];
    },

    glueArrayNumbers(array) {
        let newArray = [];
        let number = '';
        for (let i = 0; i < array.length; i++) {
            if (array[i] === '.' || !isNaN(array[i])) {
                number += array[i];
            } else {
                if (number !== '') {
                    newArray.push(number);
                    number = '';
                }
                newArray.push(array[i]);
            }
        }
        if (number !== '') {
            newArray.push(number);
        }

        return newArray;
    },

    unglueArray(array) {
        console.log("Input to unglueArray:", array);
        if (array.length > 1) {
            return array; 
        }
        let newArray = [];
        const itemAsString = String(array[0]);
        for (let i = 0; i < itemAsString.length; i++) {
            newArray.push(itemAsString[i]);
        }
        return newArray
    },

    executeMath() {
        console.log("Starting array:", this.infoArray);

        if (this.infoArray.indexOf('×') === -1  
        && this.infoArray.indexOf('÷') === -1
        && this.infoArray.indexOf('+') === -1
        && this.infoArray.indexOf('−') === -1) {
            return this.infoArray;
        }

        const arrLen = this.infoArray.length;
        
        for (let i = 0; i < arrLen; i++) {
            if (this.infoArray[i] === '×') {
                const tempResult = this.infoArray[i - 1] * this.infoArray[i + 1];
                console.log("Multiplying:", this.infoArray[i - 1], "*", this.infoArray[i + 1], "=", tempResult);
                this.infoArray.splice(i - 1, 3, tempResult);
                return this.executeMath();
            } 
            else if (this.infoArray[i] === '÷') {
                const tempResult = this.infoArray[i - 1] / this.infoArray[i + 1];
                console.log("Dividing:", this.infoArray[i - 1], "/", this.infoArray[i + 1], "=", tempResult);
                let resultToInsert = (function() {
                    const newResult = tempResult.toFixed(5);
                    if (newResult.endsWith('00000') || 
                    // || newResult.endsWith('0000') 
                    // || newResult.endsWith('000') 
                    // || newResult.endsWith('00') || 
                     newResult.endsWith('0')) {
                        return parseFloat(tempResult).toString();
                    } else {
                        return tempResult.toFixed(5);
                    }
                })();
                this.infoArray.splice(i - 1, 3, resultToInsert);
                return this.executeMath();
            } 
            else if (this.infoArray[i] === '+' && this.infoArray.indexOf('×') === -1 && this.infoArray.indexOf('÷') === -1) {
                const tempResult = parseFloat(this.infoArray[i - 1]) + parseFloat(this.infoArray[i + 1]);
                console.log("Adding:", this.infoArray[i - 1], "+", this.infoArray[i + 1], "=", tempResult);
                this.infoArray.splice(i - 1, 3, tempResult);
                return this.executeMath();
            } 
            else if (this.infoArray[i] === '−' && this.infoArray.indexOf('×') === -1 && this.infoArray.indexOf('÷') === -1) {
                const tempResult = parseFloat(this.infoArray[i - 1]) - parseFloat(this.infoArray[i + 1]);
                console.log("Subtracting:", this.infoArray[i - 1], "-", this.infoArray[i + 1], "=", tempResult);
                this.infoArray.splice(i - 1, 3, tempResult);
                return this.executeMath();
            }
        }
    },

    evaluate() {
        //eval logic
        this.infoArray = this.glueArrayNumbers(this.infoArray);
        if (!this.isEquationGood()) {
            console.log("ITS FALSE");
            this.clear();
            return;
        }
        this.executeMath();

        console.log("Is it array?: ", this.infoArray);

        console.log("INFO ARRAY: ",  this.infoArray);

        this.resultTextNode.textContent = this.infoArray;
    },
    
    append(symbol) {
        if (symbol == '.' && this.isCommaPresent) {
            return;
        }
        else if (symbol == '.') {
            this.isCommaPresent = true;
        }

        else if (this.infoArray[this.infoArray.length - 1] == symbol && (symbol == '+' || symbol == '−' || symbol == '×' || symbol == '÷' )) {
            return;
        }

        this.infoArray.push(symbol.toString());
        this.resultTextNode.textContent = this.infoArray.join('');
        this.resultDiv.appendChild(this.resultTextNode);
    },
    
    initEventListeners() {
        this.startLineAnimation();
        
        this.allButtons.forEach((button) => {
            button.addEventListener("click", () => {
                
                this.stopLineAnimation();
                
                if (button.classList.contains("equals")) {
                    this.evaluate();
                    return;
                }
                
                if (button.innerText != "Delete" && button.innerText != "Clear") {
                    this.append(button.innerText);
                }
                
                this.resultTextNode.textContent = this.infoArray.join('');
                this.resultTextNode.classList.add("result-start");
                this.resultDiv.appendChild(this.resultTextNode);

            });
        });
        
        this.deleteBtn.addEventListener('click', () => {
            console.log('Delete button clicked');

            if (!this.infoArray.length) {
                console.log('Array already empty');
                this.resultTextNode.textContent = '0';
                return; // Exit early
            }

            console.log("before unglue: ",  this.infoArray);
            this.infoArray = this.unglueArray(this.infoArray);
            console.log("after unglue: ",  this.infoArray);

            if (this.infoArray.length > 1) {
                if (this.infoArray[this.infoArray.length - 1] == '.') {
                    console.log("COMMMAAA is set to false");
                    this.isCommaPresent = false;
                }
                this.infoArray.pop();
                this.resultTextNode.textContent = this.infoArray.join('');
                console.log('new array: ',  this.infoArray);
            }
            else {
                console.log('This is null is true');
                this.sum = 0;
                this.resultTextNode.textContent = '0';
                this.infoArray = [];
            }
        });
        
        this.clearBtn.addEventListener('click', () => {
            console.log('Clear button clicked');
            this.sum = 0;
            this.resultTextNode.textContent = '0';
            this.infoArray = [];
        });
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
};

calculator.initEventListeners();