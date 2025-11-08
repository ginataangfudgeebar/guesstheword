// --- JAVASCRIPT (The Brains) ---

// 1. Get all the HTML elements
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-btn');
const message = document.getElementById('message');
const guessCountDisplay = document.getElementById('guess-count');
const playAgainButton = document.getElementById('play-again-btn');
const giveUpButton = document.getElementById('give-up-btn'); // New button
const gameInputArea = document.getElementById('game-input-area');
const hintText = document.getElementById('hint-text');

// 2. Game variables
const wordList = [
    'apple', 'banana', 'grape', 'lemon', 'mango',
    'peach', 'world', 'hello', 'house', 'water',
    'chair', 'table', 'happy', 'music', 'cloud'
];
let secretWord;
let guessCount;
let lastGuessDistance;
let isGameActive = true; // Track if the game is currently running

// 3. Levenshtein Distance Function (The "Brain" of the game)
function getLevenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

// 4. Initialize the game (start a new round)
function initializeGame() {
    secretWord = wordList[Math.floor(Math.random() * wordList.length)];
    guessCount = 0;
    lastGuessDistance = 1000;
    isGameActive = true;

    // Reset UI
    guessCountDisplay.textContent = guessCount;
    message.textContent = "Good luck!";
    message.className = 'text-neutral';
    guessInput.value = '';
    hintText.textContent = `I'm thinking of a word with ${secretWord.length} letters.`;

    // Show input, show Give Up, hide Play Again
    gameInputArea.style.display = 'block';
    giveUpButton.style.display = 'inline-block'; // Show Give Up button
    playAgainButton.style.display = 'none';      // Hide Play Again button
    guessInput.disabled = false;                 // Re-enable input if it was disabled
    submitButton.disabled = false;               // Re-enable submit button
    guessInput.focus();
}

// 5. Function to end the game (Win or Give Up)
function endGame(win) {
    isGameActive = false;
    gameInputArea.style.display = 'none';       // Hide input area
    giveUpButton.style.display = 'none';        // Hide Give Up button
    playAgainButton.style.display = 'inline-block'; // Show Play Again button
}

// 6. Function to check the user's guess
function checkGuess() {
    if (!isGameActive) return;

    const userGuess = guessInput.value.toLowerCase().trim();

    if (!userGuess) {
        message.textContent = "Please enter a guess first.";
        message.className = 'text-error';
        return;
    }

    guessCount++;
    guessCountDisplay.textContent = guessCount;

    if (userGuess === secretWord) {
        message.textContent = `CORRECT! You got it in ${guessCount} guesses!`;
        message.className = 'text-correct';
        endGame(true); // End game as a win
        return;
    }

    const currentDistance = getLevenshteinDistance(secretWord, userGuess);

    if (currentDistance < lastGuessDistance) {
        message.textContent = "You're getting closer! (Hotter 🔥)";
        message.className = 'text-hotter';
    } else if (currentDistance > lastGuessDistance) {
        message.textContent = "You're getting farther! (Colder ❄️)";
        message.className = 'text-colder';
    } else {
        message.textContent = "No change in distance. (Warm 😐)";
        message.className = 'text-neutral';
    }

    lastGuessDistance = currentDistance;
    guessInput.value = '';
    guessInput.focus();
}

// 7. Function to handle "Give Up"
function giveUp() {
    if (!isGameActive) return;

    message.textContent = `The word was: "${secretWord.toUpperCase()}". Better luck next time!`;
    message.className = 'text-error'; // Use error color (orange) for reveal
    endGame(false); // End game as a loss/give up
}

// 8. Add Event Listeners
submitButton.addEventListener('click', checkGuess);
playAgainButton.addEventListener('click', initializeGame);
giveUpButton.addEventListener('click', giveUp); // Add listener for new button

guessInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

// 9. Start the game
initializeGame();