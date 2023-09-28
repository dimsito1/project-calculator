const calculator = {
    deleteBtn: document.querySelector('.delete'),
    clearBtn: document.querySelector('.clear'),
    resultDiv: document.querySelector('.result'),
    resultTextNode: document.createElement('div'),
    infoArray: [],
    isLineActive: false,
    lineAnimInterval: null,
    lineAnimTimeout: null,
    sum: 0,
    allButtons: document.querySelectorAll('button'),
    line: (function() {
        const tempDiv = document.createElement('div');
        tempDiv.classList.add("line");
        return tempDiv;
    })(),
    
    glueArrayNumbers(array) {
        console.log("INFO ARRAY BEFORE: " + array);
        let newArray = [];
        let number = '';
        for (let i = 0; i < array.length; i++) {
            if (!Number(array[i])) {
                newArray.push(number);
                newArray.push(array[i]);
                number = ''
            }
            else if (Number(array[i])) {
                number += array[i];
            }
        }
        newArray.push(number);

        return newArray;
    },

    multiplication() {
        let prevNum = '';
        let nextNum = '';
        for (let i = 0; i < this.infoArray.length; i++) {
            if (this.infoArray[i] == '*') {
                i != 0 ? prevNum = this.infoArray[i - 1] : prevNum = this.infoArray[0];
                i != arrLen - 1 ? nextNum = this.infoArray[i + 1] : nextNum = this.infoArray[arrLen - 1];
                
            }
        }
    },

    evaluate() {
        //eval logic
      
        this.infoArray = this.glueArrayNumbers(this.infoArray);

        console.log("INFO ARRAY: " + this.infoArray);
        
        let prevNum = '';
        let nextNum = '';
        let arrLen = this.infoArray.length;
        for (let i = 0; i < arrLen; i++) {
            //execute multiplication
            if (this.infoArray[i] == '*')
            if (isNaN(this.infoArray[i])) {

                i != 0 ? prevNum = this.infoArray[i - 1] : prevNum = this.infoArray[0];
                i != arrLen - 1 ? nextNum = this.infoArray[i + 1] : nextNum = this.infoArray[arrLen - 1];

                console.log("sum: " + this.sum);
                console.log("prev: " + prevNum + ", next: " + nextNum);

                switch (this.infoArray[i]) {
                    case ('×'):
                        this.sum += parseInt(prevNum) * parseInt(nextNum);
                        break;
                    case ('÷'):
                        this.sum += parseInt(prevNum) / parseInt(nextNum);
                        break;
                    case ('+'):
                        this.sum += parseInt(prevNum) + parseInt(nextNum);
                        break;
                    case ('-'):
                        this.sum += parseInt(prevNum) - parseInt(nextNum);
                        break;
                }
            console.log("final sum: " + this.sum);
            this.resultTextNode.textContent = this.sum;
            }
        }
    },

    append(symbol) {
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
                
                this.append(button.innerText);

                this.resultTextNode.textContent = this.infoArray.join('');
                this.resultTextNode.classList.add("result-start");
                this.resultDiv.appendChild(this.resultTextNode);

            });
        });
        
        this.deleteBtn.addEventListener('click', () => {
            console.log('Delete button clicked');
        });

        this.clearBtn.addEventListener('click', () => {
            console.log('Clear button clicked');
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