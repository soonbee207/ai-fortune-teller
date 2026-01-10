const generateBtn = document.getElementById('generate-btn');
const numbersContainer = document.querySelector('.numbers-container');
const themeToggleBtn = document.getElementById('theme-toggle');

// Check local storage for theme preference
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggleBtn.textContent = 'Light Mode';
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    let theme = 'light';
    if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
        themeToggleBtn.textContent = 'Light Mode';
    } else {
        themeToggleBtn.textContent = 'Dark Mode';
    }
    
    localStorage.setItem('theme', theme);
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
            numberEl.textContent = number;
            row.appendChild(numberEl);
        }
        
        numbersContainer.appendChild(row);
    }
});