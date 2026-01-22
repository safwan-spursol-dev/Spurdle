document.addEventListener("DOMContentLoaded", () => {
    
    // =========================================
    // 1. CONFIGURATION & SOUNDS
    // =========================================
    const WORDS = ["TRUST", "TRUTH" , "HONOR" , "CLEAR" , "SPEAK" , "HEARD" , "OWNED" , "CRAFT" , "RAISE" , "SHARP" , "EXACT" , "PRIDE" , "IDEAL" , "START" , "DOING" , "DRIVE" , "ADAPT" , "LEARN" , "BRAVE" , "SOLVE" , "FOCUS" , "AWARE" , "CHECK" , "NOTES" , "VALUE" , "WORTH" , "PROVE" , "TRACK"]; 
    const GAME_DURATION = 120; // 120 Seconds

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
    let sessionID = null;

    // NEW VARIABLE: Tracks points earned specifically for the CURRENT word only
    let currentWordPoints = 0; 

    // Helper functions
    function stopTicking() {
        soundTicking.pause();
        soundTicking.currentTime = 0;
    }

    function playSound(audioObj) {
        audioObj.currentTime = 0;
        var playPromise = audioObj.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => console.log("Audio play error:", error));
        }
    }

    // =========================================
    // 2. NAVIGATION
    // =========================================
    function switchScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        
        const flower = document.getElementById('game-flower');
        const scribble = document.getElementById('game-scribble');
        
        if(screenId === 'screen-game') {
            if(flower) { flower.classList.remove('hidden'); flower.classList.add('visible'); }
            if(scribble) { scribble.classList.remove('hidden'); scribble.classList.add('visible'); }
        } else {
            if(flower) { flower.classList.remove('visible'); flower.classList.add('hidden'); }
            if(scribble) { scribble.classList.remove('visible'); scribble.classList.add('hidden'); }
        }

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
            if (count > 0) {
                numEl.innerText = "0" + count;
            } else {
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
            
            if (timeLeft === 8) {
                playSound(soundTicking);
            }

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
        if(timerVal) {
            timerVal.innerText = timeLeft;
        }
    }

    function loadNewWord() {
        currentWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        console.log("Word:", currentWord);
        currentRow = 0;
        currentGuess = "";
        
        // RESET Word points for the new word
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
    // 4. CHECK WIN / LOSS (UPDATED SCORING LOGIC)
    // =========================================
    function submitGuess() {
        if (!canType || currentGuess.length !== 5) return;
        
        let startIdx = currentRow * 5;
        let correctCount = 0;
        let tempWord = currentWord.split("");

        // 1. Check Greens
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
        
        // 2. Check Yellows
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

        // --- NEW SCORING LOGIC ---
        
        if (correctCount === 5) {
            // CASE: User WON the word
            // Step 1: Remove points previously earned for this word (letters)
            score -= currentWordPoints;
            
            // Step 2: Add direct 10 points for the Win
            score += 10;
            
            // Log for debugging
            console.log(`Word Won! Removed partials (${currentWordPoints}), added 10. Total: ${score}`);
            
            canType = false;
            stopTicking();
            showSuccessPopup(); 
            
        } else {
            // CASE: User missed, but maybe got some letters right
            // Give 2 points for every green letter
            if(correctCount > 0) {
                let partialEarned = correctCount * 2;
                
                score += partialEarned;             // Add to Total Score
                currentWordPoints += partialEarned; // Track for this word (so we can remove if they win later)
                
                console.log(`Partial: +${partialEarned} for ${correctCount} letters.`);
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
    // 5. POPUPS & END GAME
    // =========================================
    function showSuccessPopup() {
        playSound(soundSuccess);
        const popup = document.getElementById('popup-success');
        if(popup) {
            popup.classList.remove('hidden');
            popup.style.display = 'flex';
            popup.style.zIndex = '9999';
            setTimeout(() => {
                popup.classList.add('hidden');
                popup.style.display = ''; 
                popup.style.zIndex = '';
                loadNewWord();
            }, 2000);
        } else { setTimeout(loadNewWord, 1000); }
    }

    function showTimeoutPopup() {
        playSound(soundTimeout);
        const popup = document.getElementById('popup-timeout');
        if(popup) {
            popup.classList.remove('hidden');
            popup.style.display = 'flex';
            popup.style.zIndex = '9999';
            setTimeout(() => {
                popup.classList.add('hidden');
                endGame();
            }, 3000);
        } else { endGame(); }
    }

    function showGameOverPopup() {
        playSound(soundGameOver);
        const popup = document.getElementById('popup-gameover');
        if(popup) {
            popup.classList.remove('hidden');
            popup.style.display = 'flex';
            popup.style.zIndex = '9999';
            setTimeout(() => {
                popup.classList.add('hidden');
                endGame();
            }, 3000);
        } else { endGame(); }
    }

    function endGame() {
        stopTicking();
        // Save score to DB
        fetch('api/save_score.php', {
            method: 'POST',
            body: JSON.stringify({ score: score })
        })
        .then(res => res.json())
        .then(data => {
            sessionID = data.id;
            switchScreen('screen-qr');
        })
        .catch(err => {
            console.error(err);
            switchScreen('screen-qr');
        });
    }

    // =========================================
    // 6. FORM & LEADERBOARD
    // =========================================
    const userForm = document.getElementById('user-form');
    if(userForm) {
        userForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fname').value;
            const email = document.getElementById('uemail').value;

            fetch('api/update_user.php', {
                method: 'POST',
                body: JSON.stringify({ id: sessionID, name: name, email: email })
            })
            .then(res => res.json())
            .then(data => {
                loadLeaderboard();
                switchScreen('screen-leaderboard');
            });
        });
    }

    // UPDATED LEADERBOARD (With Trophies)
    function loadLeaderboard() {
        const tbody = document.getElementById('lb-body');
        if(!tbody) return;
        tbody.innerHTML = "";

        fetch('api/get_leaderboard.php')
        .then(res => res.json())
        .then(data => {
            if(data.length === 0) { 
                tbody.innerHTML = "<tr><td colspan='3'>No scores yet!</td></tr>"; 
                return; 
            }
            
            data.forEach((row, index) => {
                let rank = index + 1;
                
                // Default settings (4th, 5th, etc.)
                let avatarClass = "lb-avatar";
                let content = rank; 

                // Top 3 Logic (Trophies & Colors)
                if (rank === 1) {
                    avatarClass += " gold";  // Add Gold Class
                    content = "🏆";          // Gold Trophy Icon
                } else if (rank === 2) {
                    avatarClass += " silver"; // Add Silver Class
                    content = "🥈";          // Silver Medal Icon
                } else if (rank === 3) {
                    avatarClass += " bronze"; // Add Bronze Class
                    content = "🥉";          // Bronze Medal Icon
                }
                
                let tr = document.createElement('tr');
                tr.className = "lb-row-container";
                
                tr.innerHTML = `
                    <td style="width: 80px;">
                        <div class="${avatarClass}">${content}</div>
                    </td>
                    <td class="lb-name">${row.full_name || 'Anonymous'}</td>
                    <td class="lb-score">${row.score}</td>
                `;
                tbody.appendChild(tr);
            });
        });
    }
});