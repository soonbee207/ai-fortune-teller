document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeToggle.innerText = savedTheme === 'light' ? '☀️' : '🌙';
    }

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeToggle.innerText = newTheme === 'light' ? '☀️' : '🌙';
    });

    // Saju Logic
    const sajuForm = document.getElementById('saju-form');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    sajuForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide previous results, show loading
        sajuForm.parentElement.classList.add('hidden');
        resultDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');

        const name = document.getElementById('name').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const birthdate = document.getElementById('birthdate').value;
        const birthtime = document.getElementById('birthtime').value;

        // Simulate processing time
        setTimeout(() => {
            const pillars = calculatePillars(birthdate, birthtime);
            displayResults(name, pillars, gender, birthdate);
            
            loadingDiv.classList.add('hidden');
            resultDiv.classList.remove('hidden');
        }, 1500);
    });
});

// --- Saju Calculation Engine (Simplified for Prototype) ---

const CHEONGAN = ['갑(甲)', '을(乙)', '병(丙)', '정(丁)', '무(戊)', '기(己)', '경(庚)', '신(辛)', '임(壬)', '계(癸)'];
const JIJI = ['자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)', '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'];

// Elements mapping: Wood, Fire, Earth, Metal, Water
const STEM_ELEMENTS = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
// 0:Wood, 1:Fire, 2:Earth, 3:Metal, 4:Water

function calculatePillars(dateStr, timeStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // 1. Year Pillar (Standard calculation)
    // 1984 was year of Rat (Start of cycle for simplicity). 1984 % 10 = 4. 
    // Sky: (Year - 4) % 10. if neg, +10.
    let yearStemIndex = (year - 4) % 10;
    if (yearStemIndex < 0) yearStemIndex += 10;
    
    // Earth: (Year - 4) % 12.
    let yearBranchIndex = (year - 4) % 12;
    if (yearBranchIndex < 0) yearBranchIndex += 12;

    // 2. Month Pillar (Simplified)
    // Usually starts around 4-8th of solar month. 
    // Branch roughly maps to month (Feb=Tiger, etc.). Simplified: Month 2 ~ Index 2 (Tiger)
    let monthBranchIndex = (month + 1) % 12; // Dec(12) -> Ox(1), Jan(1) -> Tiger(2)... rough approx
    
    // Month Stem depends on Year Stem (Janggan method simplified)
    // 甲/己 year -> 丙 month start
    // 乙/庚 year -> 戊 month start
    // ... simplified lookup
    let monthStemStart = (yearStemIndex % 5) * 2 + 2; 
    let monthStemIndex = (monthStemStart + (month - 1)) % 10;

    // 3. Day Pillar (Approximation using Julian Date reference)
    // Reference: Jan 1, 1900 was Gab-Ja (0,0) ? No, actually calculating exact day pillar 
    // requires a reference date. 
    // Let's use a known anchor: Jan 1, 2000 was Saturday, Mwu-O (4, 6)
    const refDate = new Date('2000-01-01');
    const diffTime = date.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Mwu (4) index start, O (6) index start
    let dayStemIndex = (4 + diffDays) % 10;
    if (dayStemIndex < 0) dayStemIndex += 10;
    
    let dayBranchIndex = (6 + diffDays) % 12;
    if (dayBranchIndex < 0) dayBranchIndex += 12;

    // 4. Time Pillar
    let timeBranchIndex = 0; // Default Rat time
    if (timeStr) {
        const hour = parseInt(timeStr.split(':')[0]);
        // Time branches change every 2 hours, starting 23:30. Simplified:
        // 23-01: Rat(0), 01-03: Ox(1)...
        timeBranchIndex = Math.floor(((hour + 1) % 24) / 2);
    }
    
    // Time Stem depends on Day Stem
    // 甲/己 day -> 甲 time start
    // 乙/庚 day -> 丙 time start
    let timeStemStart = (dayStemIndex % 5) * 2;
    let timeStemIndex = (timeStemStart + timeBranchIndex) % 10;

    return {
        year: { stem: CHEONGAN[yearStemIndex], branch: JIJI[yearBranchIndex] },
        month: { stem: CHEONGAN[monthStemIndex], branch: JIJI[monthBranchIndex] },
        day: { stem: CHEONGAN[dayStemIndex], branch: JIJI[dayBranchIndex], element: STEM_ELEMENTS[dayStemIndex] },
        time: { stem: CHEONGAN[timeStemIndex], branch: JIJI[timeBranchIndex] }
    };
}

function displayResults(name, pillars, gender, dateStr) {
    // Set Pillars Text
    document.getElementById('year-pillar').innerText = `${pillars.year.stem}\n${pillars.year.branch}`;
    document.getElementById('month-pillar').innerText = `${pillars.month.stem}\n${pillars.month.branch}`;
    document.getElementById('day-pillar').innerText = `${pillars.day.stem}\n${pillars.day.branch}`;
    document.getElementById('time-pillar').innerText = `${pillars.time.stem}\n${pillars.time.branch}`;
    
    document.getElementById('result-name').innerText = `${name}님의 사주 분석 결과`;

    // Generate Interpretations based on Day Master (Day Stem Element)
    const element = pillars.day.element;
    const interpretations = getInterpretations(element);
    
    document.getElementById('personality-text').innerText = interpretations.personality;
    document.getElementById('wealth-text').innerText = interpretations.wealth;
    
    // Yearly Luck (Next 3 years)
    const currentYear = new Date().getFullYear();
    const ul = document.getElementById('yearly-luck-list');
    ul.innerHTML = '';
    
    for (let i = 0; i < 3; i++) {
        const y = currentYear + i;
        const li = document.createElement('li');
        li.innerHTML = `<strong>${y}년:</strong> ${getYearlyLuck(element, y)}`;
        ul.appendChild(li);
    }
}

function getInterpretations(element) {
    const data = {
        wood: {
            personality: "당신은 큰 숲이나 화초처럼 성장하려는 욕구가 강합니다. 인자하고 부드러운 성품을 지녔으며, 창의적이고 기획력이 뛰어납니다. 굽히기보다는 뻗어나가려는 기질이 있어 자존심이 세지만, 리더십을 발휘하기도 좋습니다.",
            wealth: "꾸준한 노력으로 재물을 모으는 타입입니다. 한탕주의보다는 자신의 전문성을 살려 차곡차곡 쌓아가는 것이 유리합니다. 교육, 기획, 창작 분야에서 재물을 얻을 기회가 많습니다."
        },
        fire: {
            personality: "태양이나 촛불처럼 밝고 열정적입니다. 예의를 중시하며 명랑하고 쾌활한 성격으로 주변에 사람이 많습니다. 화끈하고 뒤끝이 없지만, 때로는 급한 성격으로 인해 실수를 할 수 있으니 차분함이 필요합니다.",
            wealth: "활동적인 에너지가 강해 돈을 버는 능력도 탁월하지만, 쓰는 씀씀이도 큰 편입니다. 화려한 것을 좋아하며, 자신의 명예가 높아지면 자연스럽게 재물도 따라오는 형국입니다."
        },
        earth: {
            personality: "넓은 대지나 높은 산처럼 믿음직스럽고 포용력이 있습니다. 신용을 최우선으로 여기며, 묵묵히 자신의 일을 해나가는 뚝심이 있습니다. 변화를 싫어하고 보수적인 면이 있으나, 한 번 마음먹은 일은 끝까지 해냅니다.",
            wealth: "부동산이나 저축 등 안정적인 자산 증식에 유리합니다. 투기적인 것보다는 안전한 투자를 선호하며, 중개나 컨설팅 등 사람과 사람을 이어주는 일에서 이익을 얻기 쉽습니다."
        },
        metal: {
            personality: "단단한 바위나 보석처럼 결단력이 있고 냉철합니다. 의리를 중요시하며 옳고 그름이 분명합니다. 카리스마가 있고 추진력이 좋지만, 때로는 너무 날카로운 말로 타인에게 상처를 줄 수 있으니 유연함이 필요합니다.",
            wealth: "정확하고 치밀한 계산 능력을 바탕으로 재물을 운용합니다. 금융, 의료, 법조계 등 전문 직종에서 성공할 가능성이 높으며, 자신의 기술이나 권위를 통해 부를 축적합니다."
        },
        water: {
            personality: "흐르는 물처럼 지혜롭고 유연합니다. 적응력이 뛰어나고 머리 회전이 빠릅니다. 속을 알 수 없는 신비로운 매력이 있으며, 사교적이지만 내면은 고독할 수 있습니다. 기획이나 아이디어로 승부하면 좋습니다.",
            wealth: "물 흐르듯이 돈이 들어오고 나갑니다. 유통, 무역, 외식업 등 유동성이 큰 분야에서 두각을 나타낼 수 있습니다. 지적 자산을 활용한 재테크가 유리합니다."
        }
    };
    return data[element];
}

function getYearlyLuck(element, year) {
    // Simple mock logic for yearly luck based on year number and element
    const lucks = [
        "새로운 기회가 찾아오는 해입니다. 이동수가 있으니 변화를 두려워하지 마세요.",
        "노력한 만큼의 결실을 맺는 시기입니다. 주변의 도움으로 일이 술술 풀립니다.",
        "잠시 숨을 고르며 내실을 다져야 할 때입니다. 무리한 확장은 피하는 것이 좋습니다.",
        "문서운이 들어와 계약이나 학업에 좋은 성과가 있습니다.",
        "재물운이 상승하는 해입니다. 뜻밖의 수입이 생길 수 있으니 관리를 잘하세요."
    ];
    // Hash year + element to pick a random but consistent luck
    const index = (year + element.charCodeAt(0)) % lucks.length;
    return lucks[index];
}