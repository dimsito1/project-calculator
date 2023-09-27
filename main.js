const calculator = {
    deleteBtn: document.querySelector('.delete'),
    clearBtn: document.querySelector('.clear'),
    resultDiv: document.querySelector('.result'),
    activeLineAnim: true,
    line: (function() {
        const tempDiv = document.createElement('div');
        tempDiv.classList.add("line");
        return tempDiv;
    })(),

    lineAnimation() {
        if (!this.activeLineAnim) {
            return;
        }
    
        let showLine = true;
    
        setInterval(() => {
            if (showLine) {
                console.log("Line added");
                let currentLine = this.line.cloneNode();
                this.resultDiv.appendChild(currentLine);
    
                setTimeout(() => {
                    currentLine.remove();
                }, 500);  // remove the line after 5 seconds
            } else {
                console.log("Line hidden");
            }
    
            showLine = !showLine;  // toggle the showLine value
        }, 500);  // repeat every 5 seconds
    },

    initEventListeners() {
        this.deleteBtn.addEventListener('click', () => {
            console.log('Delete button clicked');
            this.lineAnimation();
        });

        this.clearBtn.addEventListener('click', () => {
            console.log('Clear button clicked');
            this.activeLineAnim = false;
        });
    }
};

calculator.initEventListeners();