document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle removed or hidden based on request (Night Sky default), but keeping code safe.
    
    // Saju Logic
    const sajuForm = document.getElementById('saju-form');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');
    const timeUnknownCheckbox = document.getElementById('time-unknown');
    const timeInput = document.getElementById('birthtime');

    // Handle Time Unknown Toggle
    if (timeUnknownCheckbox) {
        timeUnknownCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                timeInput.disabled = true;
                timeInput.value = '';
                timeInput.parentElement.style.opacity = '0.5';
            } else {
                timeInput.disabled = false;
                timeInput.parentElement.style.opacity = '1';
            }
        });
    }

    sajuForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Hide previous results, show loading
        sajuForm.parentElement.classList.add('hidden');
        resultDiv.classList.add('hidden');
        loadingDiv.classList.remove('hidden');

        const name = document.getElementById('name').value;
        const gender = document.querySelector('input[name="gender"]:checked').value;
        const birthdate = document.getElementById('birthdate').value;
        const isTimeUnknown = document.getElementById('time-unknown').checked;
        const birthtime = isTimeUnknown ? null : document.getElementById('birthtime').value;

        // Ritualistic Loading Sequence
        const loadingSteps = [
            "생년월일(生年月)의 기운을 하늘에 묻습니다...",
            "음양(陰陽)의 조화를 살피고 있습니다...",
            "오행(五行)의 흐름을 읽어내고 있습니다...",
            "당신의 운명(運命)을 기록합니다..."
        ];
        
        const loadingText = document.getElementById('loading-text');
        let step = 0;
        loadingText.innerText = loadingSteps[0];
        
        const interval = setInterval(() => {
            step++;
            if (step < loadingSteps.length) {
                loadingText.innerText = loadingSteps[step];
                loadingText.style.opacity = '0.5';
                setTimeout(() => loadingText.style.opacity = '1', 200);
            } else {
                clearInterval(interval);
                const pillars = calculatePillars(birthdate, birthtime);
                const stats = calculateStats(pillars);
                displayResults(name, pillars, stats, gender);
                
                loadingDiv.classList.add('hidden');
                resultDiv.classList.remove('hidden');
                resultDiv.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1200); // Slower, more ritualistic pace
    });
});

// --- Saju Calculation Engine ---

const CHEONGAN = ['갑(甲)', '을(乙)', '병(丙)', '정(丁)', '무(戊)', '기(己)', '경(庚)', '신(辛)', '임(壬)', '계(癸)'];
const JIJI = ['자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)', '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'];
const ANIMAL_NAMES = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

// Element Mappings
const STEM_ELEMENTS = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
const BRANCH_ELEMENTS = ['water', 'earth', 'wood', 'wood', 'earth', 'fire', 'fire', 'earth', 'metal', 'metal', 'earth', 'water'];
const ELEMENT_NAMES_KO = { wood: '목(木)', fire: '화(火)', earth: '토(土)', metal: '금(金)', water: '수(水)' };
const ELEMENT_COLORS = { wood: '#4caf50', fire: '#e53935', earth: '#a1887f', metal: '#bdbdbd', water: '#2196f3' };

function calculatePillars(dateStr, timeStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    // 1. Year Pillar
    let yearStemIndex = (year - 4) % 10;
    if (yearStemIndex < 0) yearStemIndex += 10;
    let yearBranchIndex = (year - 4) % 12;
    if (yearBranchIndex < 0) yearBranchIndex += 12;

    // 2. Month Pillar
    let monthBranchIndex = (month + 1) % 12; 
    let monthStemStart = (yearStemIndex % 5) * 2 + 2; 
    let monthStemIndex = (monthStemStart + (month - 1)) % 10;

    // 3. Day Pillar
    const refDate = new Date('2000-01-01');
    const diffTime = date.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let dayStemIndex = (4 + diffDays) % 10;
    if (dayStemIndex < 0) dayStemIndex += 10;
    let dayBranchIndex = (6 + diffDays) % 12;
    if (dayBranchIndex < 0) dayBranchIndex += 12;

    // 4. Time Pillar
    let timeStemIndex = -1;
    let timeBranchIndex = -1;
    let timeElement = null;

    if (timeStr) {
        const hour = parseInt(timeStr.split(':')[0]);
        timeBranchIndex = Math.floor(((hour + 1) % 24) / 2);
        let timeStemStart = (dayStemIndex % 5) * 2;
        timeStemIndex = (timeStemStart + timeBranchIndex) % 10;
        timeElement = STEM_ELEMENTS[timeStemIndex]; // For stats
    }

    return {
        year: { 
            stem: CHEONGAN[yearStemIndex], branch: JIJI[yearBranchIndex], 
            elementStem: STEM_ELEMENTS[yearStemIndex], elementBranch: BRANCH_ELEMENTS[yearBranchIndex],
            stemIndex: yearStemIndex, branchIndex: yearBranchIndex
        },
        month: { 
            stem: CHEONGAN[monthStemIndex], branch: JIJI[monthBranchIndex],
            elementStem: STEM_ELEMENTS[monthStemIndex], elementBranch: BRANCH_ELEMENTS[monthBranchIndex],
            stemIndex: monthStemIndex, branchIndex: monthBranchIndex
        },
        day: { 
            stem: CHEONGAN[dayStemIndex], branch: JIJI[dayBranchIndex], 
            elementStem: STEM_ELEMENTS[dayStemIndex], elementBranch: BRANCH_ELEMENTS[dayBranchIndex],
            stemIndex: dayStemIndex, branchIndex: dayBranchIndex
        },
        time: timeStr ? { 
            stem: CHEONGAN[timeStemIndex], branch: JIJI[timeBranchIndex],
            elementStem: STEM_ELEMENTS[timeStemIndex], elementBranch: BRANCH_ELEMENTS[timeBranchIndex],
            stemIndex: timeStemIndex, branchIndex: timeBranchIndex
        } : null
    };
}

function calculateStats(pillars) {
    const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const yinYang = { yin: 0, yang: 0 };

    // Helper to count
    const processPillar = (p) => {
        if (!p) return;
        counts[p.elementStem]++;
        counts[p.elementBranch]++;
        
        // Simple Yin/Yang: Even Index = Yang, Odd = Yin (roughly)
        // Stems: 0(Gap)=Yang, 1(Eul)=Yin...
        yinYang[p.stemIndex % 2 === 0 ? 'yang' : 'yin']++;
        // Branches: 0(Ja)=Yang, 1(Chug)=Yin...
        yinYang[p.branchIndex % 2 === 0 ? 'yang' : 'yin']++;
    };

    processPillar(pillars.year);
    processPillar(pillars.month);
    processPillar(pillars.day);
    processPillar(pillars.time);

    // Find dominant element
    let max = 0;
    let dominant = 'wood'; // default
    for (const [elm, count] of Object.entries(counts)) {
        if (count > max) {
            max = count;
            dominant = elm;
        }
    }

    return { counts, yinYang, dominant };
}

function displayResults(name, pillars, stats, gender) {
    // 1. Fill Pillars
    const setPillar = (id, p) => {
        document.getElementById(id).innerText = p ? `${p.stem}${p.branch}` : '미정(未定)';
    };
    setPillar('year-pillar', pillars.year);
    setPillar('month-pillar', pillars.month);
    setPillar('day-pillar', pillars.day);
    setPillar('time-pillar', pillars.time);
    
    document.getElementById('result-name').innerText = `${name}님의 명조(命造)`;

    // 2. Render Charts
    renderCharts(stats);

    // 3. Generate Interpretative Text
    const interpretations = getInterpretations(pillars.day.elementStem, stats.dominant, stats.counts);
    
    document.getElementById('summary-text').innerHTML = interpretations.summary;
    document.getElementById('personality-text').innerHTML = interpretations.personality;
    document.getElementById('love-text').innerHTML = interpretations.love;
    document.getElementById('wealth-text').innerHTML = interpretations.wealth;
    document.getElementById('caution-text').innerHTML = interpretations.caution;

    // Add Date
    const today = new Date();
    document.getElementById('report-date').innerText = `작성일: ${today.getFullYear()}. ${today.getMonth()+1}. ${today.getDate()}`;
}

function renderCharts(stats) {
    // Five Elements Bar Chart
    const chartDiv = document.getElementById('five-elements-chart');
    chartDiv.innerHTML = '';
    const total = Object.values(stats.counts).reduce((a, b) => a + b, 0);
    
    ['wood', 'fire', 'earth', 'metal', 'water'].forEach(elm => {
        const count = stats.counts[elm];
        const percent = total > 0 ? (count / total) * 100 : 0;
        
        const group = document.createElement('div');
        group.className = 'bar-group';
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${Math.max(percent, 5)}%`; // Min height for visibility
        bar.style.backgroundColor = ELEMENT_COLORS[elm];
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.innerText = `${ELEMENT_NAMES_KO[elm]}\n(${count})`;
        
        group.appendChild(bar);
        group.appendChild(label);
        chartDiv.appendChild(group);
    });

    // Yin/Yang Bar
    const totalYY = stats.yinYang.yin + stats.yinYang.yang;
    const yinPct = totalYY > 0 ? (stats.yinYang.yin / totalYY) * 100 : 50;
    const yangPct = totalYY > 0 ? (stats.yinYang.yang / totalYY) * 100 : 50;
    
    const yinBar = document.getElementById('yin-bar');
    const yangBar = document.getElementById('yang-bar');
    
    yinBar.style.width = `${yinPct}%`;
    yinBar.innerText = `음(陰) ${Math.round(yinPct)}%`;
    yangBar.style.width = `${yangPct}%`;
    yangBar.innerText = `양(陽) ${Math.round(yangPct)}%`;
}

function getInterpretations(dayElement, dominant, counts) {
    // Logic: Interpret based on Day Master (Self) AND Dominant Element (Environment/Strength)
    const selfName = ELEMENT_NAMES_KO[dayElement];
    const domName = ELEMENT_NAMES_KO[dominant];
    
    // Dynamic text generation
    let summary = `귀하는 <strong>${selfName}</strong>의 기운을 타고났으나, 사주 전체를 감싸는 기운은 <strong>${domName}</strong>입니다. `;
    if (dayElement === dominant) {
        summary += `본인의 기운이 매우 강하여(신강), 주관이 뚜렷하고 밀어붙이는 힘이 강력한 형국입니다.`;
    } else {
        summary += `주변 환경(${domName})이 본인(${selfName})과 어우러지며, 조화를 이루거나 혹은 다듬어지는 과정에 있습니다.`;
    }

    const personality = {
        wood: "성장과 의욕이 넘치는 성향입니다. 뻗어나가려는 기질이 강해 시작은 잘하지만 마무리가 약할 수 있습니다.",
        fire: "열정과 예의가 돋보입니다. 확산하는 기운이 강해 솔직하고 화려하나, 감정 기복이 있을 수 있습니다.",
        earth: "믿음직하고 포용력이 있습니다. 변화보다는 안정을 추구하며, 한번 정한 것은 잘 바꾸지 않습니다.",
        metal: "결단력과 맺고 끊음이 확실합니다. 냉철한 이성을 가졌으나 다소 날카로워 보일 수 있습니다.",
        water: "지혜롭고 유연합니다. 상황 대처 능력이 뛰어나나, 속내를 알 수 없어 비밀스러워 보입니다."
    };

    const wealthLogic = `<strong>${selfName}</strong> 일간에게 재물은 <strong>${getWealthElement(dayElement)}</strong>의 기운입니다. 
    ${counts[getWealthElementKey(dayElement)] > 0 
        ? "사주 내에 재물의 기운이 자리잡고 있어, 흐름을 잘 타면 큰 부를 이룰 잠재력이 충분합니다." 
        : "사주 원국에 재물의 기운이 약하게 드러나 있으나, 대운의 흐름이나 본인의 식상(활동)을 통해 재물을 만들어내는 자수성가형 구조입니다."}`;

    return {
        summary: summary,
        personality: `귀하의 오행 분포를 보면 <strong>${domName}</strong>이 가장 강합니다. 이는 ${personality[dominant]}<br>하지만 본원인 ${selfName}의 특성도 함께 나타나, 때로는 이중적인 면모를 보일 수 있습니다.`,
        love: `음양의 비율이 ${Math.abs(counts.wood - counts.metal) < 2 ? '균형 잡혀 있어' : '한쪽으로 쏠려 있어'} 감정의 흐름이 ${Math.abs(counts.wood - counts.metal) < 2 ? '안정적입니다' : '강렬합니다'}. 상대방에게 깊이 빠져드는 스타일이나, 본인의 강한 주관(${domName})으로 인해 주도권을 쥐려 할 수 있습니다.`,
        wealth: wealthLogic,
        caution: `가장 강한 기운인 <strong>${domName}</strong>이 과해질 때를 조심해야 합니다. 
        ${dominant === 'fire' ? '성급한 판단이나 화를 내는 것을 경계하세요.' : 
          dominant === 'water' ? '우울감이나 지나친 생각에 빠지는 것을 주의하세요.' : 
          dominant === 'wood' ? '독단적인 결정으로 인한 고립을 피해야 합니다.' : 
          dominant === 'metal' ? '차가운 말로 사람을 잃는 것을 조심하세요.' : 
          '지나친 고집으로 기회를 놓치는 것을 경계하세요.'}`
    };
}

function getWealthElement(dayElem) {
    const map = { wood: '토(土)', fire: '금(金)', earth: '수(水)', metal: '목(木)', water: '화(火)' };
    return map[dayElem];
}

function getWealthElementKey(dayElem) {
    const map = { wood: 'earth', fire: 'metal', earth: 'water', metal: 'wood', water: 'fire' };
    return map[dayElem];
}