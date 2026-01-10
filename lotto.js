const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.querySelector('.numbers-container');
const themeToggleBtn = document.getElementById('theme-toggle');

// Helper function to update toggle button text
function updateToggleButton(isDark) {
    themeToggleBtn.textContent = isDark ? '🌞' : '🌙';
}

// Check local storage for theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    updateToggleButton(true);
} else {
    updateToggleButton(false);
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateToggleButton(isDark);
});

generateBtn.addEventListener('click', () => {
    numbersContainer.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const row = document.createElement('div');
        row.classList.add('lotto-row');

        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }

        const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

        for (const number of sortedNumbers) {
            const numberEl = document.createElement('div');
            numberEl.classList.add('number');
            
            // Assign color class based on number range
            if (number <= 10) numberEl.classList.add('ball-10');
            else if (number <= 20) numberEl.classList.add('ball-20');
            else if (number <= 30) numberEl.classList.add('ball-30');
            else if (number <= 40) numberEl.classList.add('ball-40');
            else numberEl.classList.add('ball-45');

            numberEl.textContent = number;
            row.appendChild(numberEl);
        }
        
        numbersContainer.appendChild(row);
    }
});
