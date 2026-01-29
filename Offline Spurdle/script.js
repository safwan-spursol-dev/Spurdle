document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================
    // 1. CONFIGURATION & SOUNDS
    // =========================================
    const WORDS = ["THINK" , "TRUST" , "CHASE" , "ACTOR" , "SOLVE" , "VALUE" , "BUILD" , "DRIVE" , "FORCE"]; 
    const GAME_DURATION = 120; 

    // Sound Objects
    const soundSuccess = new Audio('assets/sounds/success.mp3');
    const soundGameOver = new Audio('assets/sounds/gameover.mp3');
    const soundTimeout =  new Audio('assets/sounds/timeout.mp3');
    const soundTicking =  new Audio('assets/sounds/ticking.mp3');

    let score = 0;
    let timeLeft = GAME_DURATION;
    let timerInterval;
    let currentWord = "";
    let currentGuess = "";
    let currentRow = 0;
    let canType = false;
    let sessionID = null; // We will use Timestamp as ID
    let currentWordPoints = 0; 

    // --- NEW: OFFLINE DATABASE LOGIC ---
    function getLocalData() {
        return JSON.parse(localStorage.getItem('spurdle_data')) || [];
    }

    function saveLocalData(data) {
        localStorage.setItem('spurdle_data', JSON.stringify(data));
    }

    // Helper functions
    function stopTicking() {
        soundTicking.pause();
        soundTicking.currentTime = 0;
    }

    function playSound(audioObj) {
        try { audioObj.currentTime = 0; audioObj.play(); } 
        catch (e) { console.log("Sound error", e); }
    }

    // =========================================
    // 2. NAVIGATION
    // =========================================
    function switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        const target = document.getElementById(screenId);
        if(target) {
            target.classList.remove('hidden');
            setTimeout(() => target.classList.add('active'), 10);
        }
    }
    window.switchScreen = switchScreen;
    window.goToHowToPlay = function() { switchScreen('screen-instructions'); };
    
    window.startCountdownSequence = function() {
        switchScreen('screen-countdown');
        let count = 3;
        const numEl = document.getElementById('countdown-number');
        numEl.innerText = "0" + count;
        let interval = setInterval(() => {
            count--;
            if (count > 0) numEl.innerText = "0" + count;
            else {
                clearInterval(interval);
                numEl.innerText = "GO!";
                setTimeout(() => { startGame(); }, 500);
            }
        }, 1000);
    };

    window.startGame = function() {
        switchScreen('screen-game');
        initGameLogic();
    };

    window.resetGame = function() { location.reload(); };

    // --- NEW: EXPORT TO EXCEL FUNCTION ---
    window.downloadExcel = function() {
        const data = getLocalData();
        if(data.length === 0) { alert("No data to export!"); return; }
        
        // Convert JSON to Worksheet
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leaderboard");
        
        // Save File
        XLSX.writeFile(wb, "Spurdle_Data.xlsx");
    };

    // =========================================
    // 3. GAME LOGIC
    // =========================================
    function initGameLogic() {
        score = 0;
        timeLeft = GAME_DURATION;
        canType = true;
        createKeyboard();
        loadNewWord();
        startTimer();
    }

    function startTimer() {
        updateTimerUI(); 
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerUI();
            if (timeLeft === 8) playSound(soundTicking);
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                canType = false;
                stopTicking();
                showTimeoutPopup();
            }
        }, 1000);
    }

    function updateTimerUI() {
        const timerBadge = document.getElementById('timer-badge');
        const timerVal = document.getElementById('timer-val');
        if(timerBadge) {
            let angle = (timeLeft / GAME_DURATION) * 360;
            timerBadge.style.background = `conic-gradient(#0065D1 ${angle}deg, #FDF1D6 0deg)`;
        }
        if(timerVal) timerVal.innerText = timeLeft;
    }

    function loadNewWord() {
        currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        console.log("Word:", currentWord);
        currentRow = 0;
        currentGuess = "";
        currentWordPoints = 0;
        canType = true;
        createGrid();
        resetKeyboardColors();
    }

    function createGrid() {
        const board = document.getElementById("grid-container");
        board.innerHTML = "";
        for (let i = 0; i < 15; i++) {
            let tile = document.createElement("div");
            tile.className = "tile";
            tile.id = "tile-" + i;
            board.appendChild(tile);
        }
    }

    function createKeyboard() {
        const keys = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
        const cont = document.getElementById("keyboard-area");
        cont.innerHTML = "";
        keys.forEach(rowStr => {
            let rowDiv = document.createElement("div");
            rowDiv.className = "row";
            if(rowStr.startsWith("Z")) {
                 let ent = document.createElement("div");
                 ent.className = "key key-wide"; ent.innerText = "Enter";
                 ent.onclick = submitGuess;
                 rowDiv.appendChild(ent);
            }
            rowStr.split("").forEach(char => {
                let key = document.createElement("div");
                key.className = "key"; key.innerText = char;
                key.dataset.key = char;
                key.onclick = () => handleInput(char);
                rowDiv.appendChild(key);
            });
            if(rowStr.startsWith("Z")) {
                 let del = document.createElement("div");
                 del.className = "key"; 
                 del.innerHTML = "&#8592;"; 
                 del.style.fontWeight = "900";
                 del.onclick = deleteChar;
                 rowDiv.appendChild(del);
            }
            cont.appendChild(rowDiv);
        });
    }

    function handleInput(char) {
        if(!canType || currentGuess.length >= 5) return;
        currentGuess += char;
        updateGrid();
    }
    
    function deleteChar() {
        if(!canType || currentGuess.length === 0) return;
        currentGuess = currentGuess.slice(0, -1);
        updateGrid();
    }

    function updateGrid() {
        let startIdx = currentRow * 5;
        for(let i=0; i<5; i++) {
            let tile = document.getElementById("tile-" + (startIdx + i));
            if(tile) tile.innerText = currentGuess[i] || "";
        }
    }

    // =========================================
    // 4. CHECK WIN / LOSS
    // =========================================
    function submitGuess() {
        if (!canType || currentGuess.length !== 5) return;
        let startIdx = currentRow * 5;
        let correctCount = 0;
        let tempWord = currentWord.split("");

        // Check Greens
        for (let i = 0; i < 5; i++) {
            let tile = document.getElementById("tile-" + (startIdx + i));
            let letter = currentGuess[i];
            let key = document.querySelector(`.key[data-key="${letter}"]`);
            if (letter === currentWord[i]) {
                tile.classList.add("correct");
                if(key) { key.classList.remove("present", "absent"); key.classList.add("correct"); }
                correctCount++;
                tempWord[i] = null;
            }
        }
        
        // Check Yellows
        for (let i = 0; i < 5; i++) {
            let tile = document.getElementById("tile-" + (startIdx + i));
            let letter = currentGuess[i];
            let key = document.querySelector(`.key[data-key="${letter}"]`);
            if (!tile.classList.contains("correct")) {
                if (tempWord.includes(letter)) {
                    tile.classList.add("present");
                    if(key && !key.classList.contains("correct")) key.classList.add("present");
                    tempWord[tempWord.indexOf(letter)] = null;
                } else {
                    tile.classList.add("absent");
                    if(key && !key.classList.contains("correct") && !key.classList.contains("present")) key.classList.add("absent");
                }
            }
        }

        if (correctCount === 5) {
            score -= currentWordPoints; 
            score += 10;
            canType = false;
            stopTicking();
            showSuccessPopup(); 
        } else {
            if(correctCount > 0) {
                let partialEarned = correctCount * 2;
                score += partialEarned;
                currentWordPoints += partialEarned;
            }
            currentRow++;
            currentGuess = "";
            if (currentRow >= 3) { 
                canType = false;
                clearInterval(timerInterval);
                stopTicking();
                showGameOverPopup();
            }
        }
    }

    function resetKeyboardColors() {
        document.querySelectorAll('.key').forEach(k => {
            k.className = "key";
            if(k.innerText === "Enter") k.className = "key key-wide";
        });
    }

    // =========================================
    // 5. POPUPS & END GAME (OFFLINE LOGIC)
    // =========================================
    function showSuccessPopup() {
        playSound(soundSuccess);
        const popup = document.getElementById('popup-success');
        if(popup) {
            popup.classList.remove('hidden');
            popup.style.display = 'flex';
            setTimeout(() => {
                popup.classList.add('hidden');
                popup.style.display = ''; 
                loadNewWord();
            }, 2000);
        } else { setTimeout(loadNewWord, 1000); }
    }

   function showTimeoutPopup() {
        playSound(soundTimeout);
        const popup = document.getElementById('popup-timeout');
         const wordDisplay = document.getElementById('go-correct-word1');
        if(wordDisplay) {
            wordDisplay.innerHTML = `The correct word was:<br><span style="color: #0065D1; font-size: 35px; font-weight: 800;">${currentWord}</span>`;
        }
        if(popup) {
            popup.classList.remove('hidden');
            popup.style.display = 'flex';
            setTimeout(() => {
                popup.classList.add('hidden');
                endGame();
            }, 3000);
        } else { endGame(); }
    }

     function showGameOverPopup() {
        playSound(soundGameOver);
        const popup = document.getElementById('popup-gameover');
        const wordDisplay = document.getElementById('go-correct-word');
        if(wordDisplay) {
            wordDisplay.innerHTML = `The correct word was:<br><span style="color: #0065D1; font-size: 35px; font-weight: 800;">${currentWord}</span>`;
        }
      if(popup) {
            popup.classList.remove('hidden');
            popup.style.display = 'flex';
            
            // 3 Second baad screen change hogi
            setTimeout(() => {
                popup.classList.add('hidden');
                popup.style.display = ''; 
                endGame();
            }, 3000);
        } else { endGame(); }
    }

    function endGame() {
        stopTicking();
        // --- OFFLINE SAVE (Partial) ---
        // Hum abhi sirf ID generate kar ke temporary save kar rahe hain
        // Asal data Form submit hone par update hoga
        sessionID = Date.now().toString(); // Use unique timestamp as ID
        
        let existingData = getLocalData();
        // Create new entry placeholder
        let newEntry = {
            id: sessionID,
            full_name: "Anonymous",
            email: "",
            score: score,
            timestamp: new Date().toLocaleString()
        };
        existingData.push(newEntry);
        saveLocalData(existingData);

        switchScreen('screen-qr');
    }

    // =========================================
    // 6. FORM & LEADERBOARD (OFFLINE LOGIC)
    // =========================================
    const userForm = document.getElementById('user-form');
    if(userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fname').value;
            const email = document.getElementById('uemail').value;

            // --- UPDATE LOCAL DATA ---
            let data = getLocalData();
            // Find the entry we just made in endGame() using sessionID
            let entryIndex = data.findIndex(x => x.id === sessionID);
            
            if(entryIndex !== -1) {
                data[entryIndex].full_name = name;
                data[entryIndex].email = email;
                saveLocalData(data); // Save back to LocalStorage
            }

            loadLeaderboard();
            switchScreen('screen-leaderboard');
        });
    }

    function loadLeaderboard() {
        const tbody = document.getElementById('lb-body');
        if(!tbody) return;
        tbody.innerHTML = "";

        // --- LOAD FROM LOCAL STORAGE ---
        let data = getLocalData();
        
        // Sort by Score DESC
        data.sort((a, b) => b.score - a.score);

        if(data.length === 0) { 
            tbody.innerHTML = "<tr><td colspan='3'>No scores yet!</td></tr>"; 
            return; 
        }
        
        data.forEach((row, index) => {
            let rank = index + 1;
            let avatarClass = "lb-avatar";
            let content = rank; 

            if (rank === 1) { avatarClass += " gold"; content = "🏆"; } 
            else if (rank === 2) { avatarClass += " silver"; content = "🥈"; } 
            else if (rank === 3) { avatarClass += " bronze"; content = "🥉"; }
            
            let tr = document.createElement('tr');
            tr.className = "lb-row-container";
            tr.innerHTML = `
                <td style="width: 80px;"><div class="${avatarClass}">${content}</div></td>
                <td class="lb-name">${row.full_name}</td>
                <td class="lb-score">${row.score}</td>
            `;
            tbody.appendChild(tr);
        });
    }
});