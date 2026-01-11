document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    // Check saved theme or default to dark (Night Sky)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        body.setAttribute('data-theme', savedTheme);
        themeToggle.innerText = savedTheme === 'light' ? '☀️' : '🌙';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.innerText = newTheme === 'light' ? '☀️' : '🌙';
        });
    }

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
                try {
                    const pillars = calculatePillars(birthdate, birthtime);
                    const stats = calculateStats(pillars);
                    displayResults(name, pillars, stats, gender);
                    
                    loadingDiv.classList.add('hidden');
                    resultDiv.classList.remove('hidden');
                    resultDiv.scrollIntoView({ behavior: 'smooth' });
                } catch (err) {
                    console.error("Saju Calculation Error:", err);
                    loadingDiv.innerHTML = `<p style="color:red">분석 중 오류가 발생했습니다.<br>${err.message}</p>`;
                }
            } 
        }, 1200); 
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

    if (timeStr) {
        const hour = parseInt(timeStr.split(':')[0]);
        timeBranchIndex = Math.floor(((hour + 1) % 24) / 2);
        let timeStemStart = (dayStemIndex % 5) * 2;
        timeStemIndex = (timeStemStart + timeBranchIndex) % 10;
    }

    return {
        year: { 
            stem: CHEONGAN[yearStemIndex], branch: JIJI[yearBranchIndex], 
            elementStem: STEM_ELEMENTS[yearStemIndex], elementBranch: BRANCH_ELEMENTS[yearBranchIndex],
            stemIndex: yearStemIndex, branchIndex: yearBranchIndex, animal: ANIMAL_NAMES[yearBranchIndex]
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
            elementStem: STEM_ELEMENTS[timeStemIndex], elementBranch: BRANCH_ELEMENTS[timeStemIndex],
            stemIndex: timeStemIndex, branchIndex: timeBranchIndex
        } : null
    };
}

function calculateStats(pillars) {
    const counts = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const yinYang = { yin: 0, yang: 0 };

    const processPillar = (p) => {
        if (!p) return;
        if (p.elementStem) counts[p.elementStem]++;
        if (p.elementBranch) counts[p.elementBranch]++;
        
        yinYang[p.stemIndex % 2 === 0 ? 'yang' : 'yin']++;
        yinYang[p.branchIndex % 2 === 0 ? 'yang' : 'yin']++;
    };

    processPillar(pillars.year);
    processPillar(pillars.month);
    processPillar(pillars.day);
    processPillar(pillars.time);

    let max = 0;
    let dominant = 'wood';
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
        const el = document.getElementById(id);
        if(el) el.innerText = p ? `${p.stem}${p.branch}` : '미정(未定)';
    };
    setPillar('year-pillar', pillars.year);
    setPillar('month-pillar', pillars.month);
    setPillar('day-pillar', pillars.day);
    setPillar('time-pillar', pillars.time);
    
    document.getElementById('result-name').innerText = `${name}님의 명조(命造)`;

    // 2. NEW: Key Destiny Quote
    const quote = getDestinyQuote(pillars.day.elementStem, stats.dominant);
    const quoteEl = document.getElementById('key-destiny-quote');
    if (quoteEl) {
        quoteEl.innerText = `“${quote}”`;
    }

    // 3. Render Charts
    renderCharts(stats);

    // 4. Generate Detailed Interpretation
    const interpretations = getInterpretations(pillars.day.elementStem, stats.dominant, stats.counts);
    
    document.getElementById('summary-text').innerHTML = interpretations.summary;
    document.getElementById('personality-text').innerHTML = interpretations.personality;
    document.getElementById('love-text').innerHTML = interpretations.love;
    document.getElementById('wealth-text').innerHTML = interpretations.wealth;
    document.getElementById('caution-text').innerHTML = interpretations.caution;

    // 5. Compatibility
    const compat = getCompatibility(pillars.day.elementStem, stats.dominant);
    document.getElementById('good-element').innerText = compat.good.name;
    document.getElementById('good-reason').innerHTML = compat.good.reason;
    document.getElementById('bad-element').innerText = compat.bad.name;
    document.getElementById('bad-reason').innerHTML = compat.bad.reason;

    // 6. Time-based & Lucky Items
    document.getElementById('today-luck').innerText = getDailyLuck(pillars.day.stemIndex);
    
    const yearlyContainer = document.getElementById('yearly-luck-container');
    if (yearlyContainer) {
        yearlyContainer.innerHTML = '';
        [2024, 2025, 2026].forEach(year => {
            const div = document.createElement('div');
            div.className = 'year-card';
            div.innerHTML = `
                <span class="year-title">${year}년</span>
                <p>${getYearlyLuck(pillars.day.elementStem, year)}</p>
            `;
            yearlyContainer.appendChild(div);
        });
    }

    const luckyData = getLuckyData(pillars.day.stemIndex);
    document.getElementById('lucky-numbers').innerText = luckyData.numbers;
    document.getElementById('lucky-color').innerText = luckyData.color;

    // Add Date
    const today = new Date();
    document.getElementById('report-date').innerText = `작성일: ${today.getFullYear()}. ${today.getMonth()+1}. ${today.getDate()}`;
}

function renderCharts(stats) {
    const chartDiv = document.getElementById('five-elements-chart');
    if (!chartDiv) return;
    
    chartDiv.innerHTML = '';
    const total = Object.values(stats.counts).reduce((a, b) => a + b, 0);
    
    ['wood', 'fire', 'earth', 'metal', 'water'].forEach(elm => {
        const count = stats.counts[elm];
        const percent = total > 0 ? (count / total) * 100 : 0;
        
        const group = document.createElement('div');
        group.className = 'bar-group';
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${Math.max(percent, 5)}%`; 
        bar.style.backgroundColor = ELEMENT_COLORS[elm];
        
        const label = document.createElement('div');
        label.className = 'bar-label';
        label.innerText = `${ELEMENT_NAMES_KO[elm]}\n(${count})`;
        
        group.appendChild(bar);
        group.appendChild(label);
        chartDiv.appendChild(group);
    });

    const totalYY = stats.yinYang.yin + stats.yinYang.yang;
    const yinPct = totalYY > 0 ? (stats.yinYang.yin / totalYY) * 100 : 50;
    const yangPct = totalYY > 0 ? (stats.yinYang.yang / totalYY) * 100 : 50;
    
    const yinBar = document.getElementById('yin-bar');
    const yangBar = document.getElementById('yang-bar');
    
    if (yinBar) {
        yinBar.style.width = `${yinPct}%`;
        yinBar.innerText = `음(陰) ${Math.round(yinPct)}%`;
    }
    if (yangBar) {
        yangBar.style.width = `${yangPct}%`;
        yangBar.innerText = `양(陽) ${Math.round(yangPct)}%`;
    }

    let explanationDiv = document.getElementById('yin-yang-explanation');
    if (!explanationDiv && document.querySelector('.yin-yang-bar')) {
        explanationDiv = document.createElement('p');
        explanationDiv.id = 'yin-yang-explanation';
        explanationDiv.className = 'evidence-desc';
        explanationDiv.style.marginTop = '10px';
        explanationDiv.style.fontSize = '0.8rem';
        document.querySelector('.yin-yang-bar').after(explanationDiv);
    }
    if (explanationDiv) {
        explanationDiv.innerHTML = "<strong>* 음(陰):</strong> 차분함, 내실, 수용성, 안정 | <strong>* 양(陽):</strong> 활동성, 발산, 적극성, 변화<br>어느 한쪽이 좋고 나쁜 것이 아니며, 조화가 중요합니다.";
    }
}

function getInterpretations(dayElement, dominant, counts) {
    const selfName = ELEMENT_NAMES_KO[dayElement];
    const domName = ELEMENT_NAMES_KO[dominant];
    
    let summary = `귀하는 타고난 본원(本元)인 <strong>${selfName}</strong>의 기운을 중심으로, 사주 전체를 감싸는 <strong>${domName}</strong>의 환경 속에 놓여 있습니다.<br><br>
    사주 원국을 살펴보면, 본인의 내면적인 힘과 외부 환경이 서로 밀접하게 상호작용하고 있습니다. `;
    
    if (dayElement === dominant) {
        summary += `특히 본인의 기운이 매우 강한 '신강(身强)' 사주로 판단됩니다. 이는 주관이 매우 뚜렷하고, 어떠한 난관이 닥쳐도 본인의 의지로 돌파해 나가는 추진력이 탁월함을 의미합니다. 남의 말에 휘둘리기보다는 본인이 옳다고 믿는 길을 묵묵히 걸어갈 때 큰 성취를 이룰 수 있습니다. 리더십이 뛰어나나 독선에 빠질 위험도 있으니 주변을 살피는 지혜가 필요합니다.`;
    } else {
        summary += `주변 환경의 기운(${domName})이 본인을 이끌어주거나, 때로는 본인의 힘을 설기(기운을 뺌)시키는 구조를 가지고 있습니다. 이는 사회적인 적응력이 뛰어나고 주변 상황에 맞춰 유연하게 대처하는 능력이 발달했음을 의미합니다. 혼자 모든 것을 짊어지기보다는, 타인과의 협력이나 조직의 힘을 빌릴 때 더 큰 시너지를 낼 수 있는 '지략가' 타입입니다.`;
    }

    const personalityText = {
        wood: "성장과 의욕이 넘치며, 늘 새로운 것을 추구하는 창조적인 에너지가 가득합니다. 인자하고 부드러운 성품 속에 강한 자존심을 감추고 있어, 겉으로는 유해 보여도 속은 단단한 외유내강형입니다. 시작하는 힘은 천하제일이나 끝맺음이 약할 수 있으니 끈기를 기르는 것이 중요합니다.",
        fire: "활활 타오르는 불처럼 열정이 넘치고 매사 분명한 것을 좋아합니다. 예의와 격식을 중시하며, 자신을 드러내고 표현하는 데에 주저함이 없습니다. 명랑하고 쾌활한 성격으로 주변에 사람이 끊이지 않으나, 감정의 기복이 심해 욱하는 성질로 일을 그르칠 수 있으니 마음의 평정을 유지하는 수양(修養)이 필요합니다.",
        earth: "넓은 대지처럼 만물을 포용하는 넉넉한 마음씨와 믿음직스러운 신용을 지녔습니다. 쉽게 흔들리지 않는 뚝심이 있으며, 한 번 맺은 인연은 끝까지 지켜내는 의리가 있습니다. 다만 변화를 두려워하고 보수적인 성향이 강해 때로는 융통성이 없다는 소리를 들을 수 있으니, 새로운 흐름을 받아들이는 유연함이 더해진다면 금상첨화입니다.",
        metal: "단단한 바위나 날카로운 칼처럼 결단력이 있고 맺고 끊음이 확실합니다. 의(義)를 목숨보다 소중히 여기며, 옳지 않은 일에는 절대 타협하지 않는 강직함이 있습니다. 냉철한 이성과 판단력은 타의 추종을 불허하나, 때로는 너무 차가운 말과 행동으로 타인에게 상처를 줄 수 있으니 따뜻한 말 한마디의 힘을 배운다면 존경받는 리더가 될 것입니다.",
        water: "흐르는 물처럼 어디에나 스며드는 유연함과 깊은 지혜를 지녔습니다. 총명하고 임기응변에 능하여 어떠한 환경에서도 살아남는 생존력이 탁월합니다. 겉으로는 조용해 보이나 속에는 거대한 바다와 같은 야망을 품고 있습니다. 속내를 잘 드러내지 않아 음흉하다는 오해를 살 수 있으니, 가끔은 솔직하게 자신의 감정을 표현하는 것이 인간관계에 도움이 됩니다."
    };

    const wealthLogic = `<strong>${selfName}</strong> 일간에게 재물은 <strong>${getWealthElement(dayElement)}</strong>의 기운입니다.<br><br>
    ${counts[getWealthElementKey(dayElement)] > 0 
        ? "귀하의 사주 원국에는 재물의 기운이 뚜렷하게 자리 잡고 있습니다. 이는 타고난 재복(財福)이 있음을 의미하며, 경제적인 감각이 남들보다 뛰어납니다. 작은 돈을 굴려 큰 돈을 만드는 능력이 탁월하며, 시기에 맞는 투자와 경제 활동을 통해 평생 의식주 걱정 없이 풍요로운 삶을 영위할 수 있는 그릇입니다. 다만, 돈을 쫓기보다 명예와 신용을 지킬 때 더 큰 재물이 따라옵니다." 
        : "사주 원국에 재물의 기운이 약하게 드러나 있습니다. 이는 일확천금을 노리기보다는 본인의 전문 기술이나 재능(식상)을 발휘하여 차곡차곡 재산을 모아야 함을 암시합니다. '무재사주(無財四柱)'라 하여 돈이 없는 것이 아니며, 오히려 돈에 대한 집착을 버리고 본인의 일에 몰두할 때 거부(巨富)가 되는 경우가 많습니다. 자수성가하여 늦게 발복하는 대기만성형 재물운입니다."}`;

    return {
        summary: summary,
        personality: `귀하의 사주에서 가장 강력한 기운은 <strong>${domName}</strong>입니다.<br><br>${personalityText[dominant]}<br><br>이러한 기운이 본원인 <strong>${selfName}</strong>와 결합하여, 귀하는 남들과 다른 독창적인 시각과 문제 해결 능력을 갖추게 되었습니다. 때로는 내면의 갈등이 있을 수 있으나, 이는 더 큰 그릇으로 성장하기 위한 진통이니 긍정적으로 받아들이시길 바랍니다.`,
        love: `음양의 조화를 살펴보면, 음(陰)과 양(陽)의 기운이 ${Math.abs(counts.wood - counts.metal) < 2 ? '황금비율을 이루고 있습니다' : '한쪽으로 다소 치우쳐져 있습니다'}.<br><br>
        ${Math.abs(counts.wood - counts.metal) < 2 
            ? "이는 감정의 기복이 적고 안정적인 연애를 선호함을 의미합니다. 상대방을 배려하고 이해하는 폭이 넓어 다툼이 적고, 오랜 기간 신뢰를 바탕으로 한 만남을 지속할 수 있습니다. 결혼 운 또한 순탄하며, 배우자와 친구 같은 동반자 관계를 형성할 가능성이 높습니다." 
            : "이는 사랑에 있어 매우 열정적이고 드라마틱한 성향을 보임을 의미합니다. 한 번 불타오르면 물불 가리지 않고 헌신하지만, 식을 때도 차갑게 돌아설 수 있습니다. 자신과 반대되는 성향의 이성에게 강한 끌림을 느끼며, 서로 부족한 부분을 채워주는 보완적인 관계가 이상적입니다."}`,
        wealth: wealthLogic,
        caution: `인생의 흐름에서 가장 주의해야 할 것은 <strong>${domName}</strong> 기운의 과잉입니다.<br><br>
        ${dominant === 'fire' ? '불의 기운이 지나치면 성급함으로 인해 공든 탑을 무너뜨릴 수 있습니다. 중요한 결정 앞에서는 반드시 세 번 생각하고(삼사일언), 주변의 조언을 구하는 것이 액운을 막는 길입니다.' : 
          dominant === 'water' ? '물의 기운이 범람하면 깊은 우울감이나 잡생각에 빠져 현실 도피적인 성향이 나타날 수 있습니다. 햇볕을 자주 쬐고 활동적인 취미를 통해 양기(陽氣)를 보충해야 합니다.' : 
          dominant === 'wood' ? '나무의 기운이 빽빽하면 고집불통이 되어 주변 사람들과 고립될 수 있습니다. 숲을 보지 못하고 나무만 보는 우를 범하지 않도록, 넓은 시야를 갖는 훈련이 필요합니다.' : 
          dominant === 'metal' ? '금의 기운이 강하면 날카로운 언행으로 인덕(人德)을 잃을 수 있습니다. 칼은 칼집에 있을 때 더 위엄이 있는 법이니, 자신의 능력을 과시하기보다 겸손함을 미덕으로 삼으세요.' : 
          '토의 기운이 태과하면 게으름이나 무사안일주의에 빠질 수 있습니다. 현실에 안주하기보다 끊임없이 새로운 목표를 세우고 도전하는 자세가 귀하의 운을 트이게 합니다.'}`
    };
}

function getDestinyQuote(dayElement, dominant) {
    const quotes = {
        wood: "당신은 척박한 땅에서도 꽃을 피워내는 강인한 생명력을 타고났습니다.",
        fire: "당신은 세상을 밝히는 등불처럼, 주변 사람들에게 영감을 주는 존재입니다.",
        earth: "당신은 모든 것을 품어주는 대지처럼, 흔들리지 않는 중심을 가지고 있습니다.",
        metal: "당신은 원석을 다듬어 보석이 되듯, 시련을 통해 더욱 빛나는 운명입니다.",
        water: "당신은 거침없이 흐르는 강물처럼, 어떠한 장애물도 유연하게 넘어서는 지혜가 있습니다."
    };
    
    let base = quotes[dayElement];
    if (dayElement !== dominant) {
        base += " (흐름을 타는 지혜)";
    } else {
        base += " (세상을 이끄는 힘)";
    }
    return base;
}

function getCompatibility(dayElem, dominant) {
    const generating = { wood: 'water', fire: 'wood', earth: 'fire', metal: 'earth', water: 'metal' };
    const controlling = { wood: 'metal', fire: 'water', earth: 'wood', metal: 'fire', water: 'earth' };
    
    let good, bad;
    
    if (dayElem === dominant) {
        const controlElem = controlling[dayElem];
        good = {
            name: ELEMENT_NAMES_KO[controlElem],
            reason: `귀하는 <strong>${ELEMENT_NAMES_KO[dayElem]}</strong> 기운이 강하기 때문에, 이를 적절히 제어하고 다듬어주는 <strong>${ELEMENT_NAMES_KO[controlElem]}</strong> 기운이 필요합니다. 이는 도끼로 나무를 다듬어 재목을 만드는 이치와 같습니다.`
        };
        const genElem = generating[dayElem];
        bad = {
            name: ELEMENT_NAMES_KO[genElem],
            reason: `이미 본인의 기운이 강한데 <strong>${ELEMENT_NAMES_KO[genElem]}</strong> 기운이 더해지면 고집이 세지고 독단적으로 변할 수 있습니다. 넘치는 것은 모자란 것만 못하니(과유불급), 힘을 빼는 것이 중요합니다.`
        };
    } else {
        const genElem = generating[dayElem];
        good = {
            name: ELEMENT_NAMES_KO[genElem],
            reason: `귀하는 <strong>${ELEMENT_NAMES_KO[dayElem]}</strong> 기운이 약한 편이므로, 어머니처럼 나를 생(生)해주고 도와주는 <strong>${ELEMENT_NAMES_KO[genElem]}</strong> 기운이 절실합니다. 이를 통해 자신감과 추진력을 얻을 수 있습니다.`
        };
        const controlElem = controlling[dayElem];
        bad = {
            name: ELEMENT_NAMES_KO[controlElem],
            reason: `본인의 기운이 약한 상태에서 <strong>${ELEMENT_NAMES_KO[controlElem]}</strong> 기운이 들어오면, 심리적으로 위축되거나 건강을 해칠 수 있습니다. 강한 압박이나 스트레스를 피하고 내실을 다져야 합니다.`
        };
    }
    
    return { good, bad };
}

function getYearlyLuck(element, year) {
    const lucks = [
        "올해는 귀하의 인생에서 새로운 챕터가 시작되는 '변곡점'과 같은 시기입니다. 그동안 막혀있던 운의 물꼬가 트이며, 생각지도 못했던 곳에서 귀인(貴人)이 나타나 도움을 줄 것입니다. 다만, 너무 서두르면 체할 수 있으니 돌다리도 두드려보고 건너는 신중함이 필요합니다. 이사나 이직 등 환경의 변화가 긍정적으로 작용할 것입니다.",
        "노력한 만큼의 정직한 결실을 맺는 '수확'의 해입니다. 요행을 바라기보다는 땀 흘려 일군 성과가 빛을 발할 것입니다. 직장에서는 승진이나 영전의 기회가, 사업에서는 매출 증대의 기쁨이 있습니다. 다만 건강 관리에는 각별히 신경 써야 하며, 특히 과로로 인한 질병을 조심해야 합니다.",
        "잠시 숨을 고르며 내실을 다져야 하는 '인내'의 시기입니다. 무리하게 일을 확장하거나 투자를 감행하기보다는, 현재 가진 것을 지키고 갈고닦는 데 집중해야 합니다. 겉으로는 화려해 보이나 실속이 없을 수 있으니 겉치레보다는 실리를 추구하세요. 공부나 자격증 취득 등 자기 계발에는 최고의 해입니다.",
        "문서운이 강하게 들어오는 해입니다. 부동산 계약, 매매, 혹은 학업과 관련된 성취가 따를 것입니다. 오랫동안 골머리를 앓던 법적인 문제나 서류 문제가 시원하게 해결될 조짐이 보입니다. 윗사람의 인정을 받게 되며, 명예가 드높아지는 길운(吉運)이 함께합니다.",
        "재물운이 폭발적으로 상승하는 '황금기'입니다. 뜻밖의 횡재수가 있으며, 투자했던 곳에서 큰 이익을 거둘 수 있습니다. 다만 들어오는 돈만큼 나가는 돈도 많을 수 있으니 지출 관리에 유의해야 합니다. 인간관계에서는 베푸는 만큼 돌아오니 인색하게 굴지 않는 것이 복을 더 키우는 비결입니다."
    ];
    const idx = (element.charCodeAt(0) + year) % lucks.length;
    return lucks[idx];
}

function getDailyLuck(stemIndex) {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() + stemIndex;
    const msgs = [
        "오늘은 하늘의 기운이 귀하를 돕는 날입니다. 평소 망설이던 일이 있다면 과감하게 추진해보세요. 뜻밖의 성과가 기다리고 있습니다.",
        "주변 사람들과의 화합이 중요한 날입니다. 독단적인 결정보다는 경청하는 자세가 행운을 불러옵니다. 저녁 약속에서 좋은 정보를 얻을 수 있습니다.",
        "작은 실수가 큰 오해를 부를 수 있으니 언행을 각별히 조심해야 합니다. 돌다리도 두드려보고 건너는 신중함이 액운을 막아줍니다.",
        "재물운이 좋은 날입니다. 생각지도 못한 용돈이 생기거나, 잊고 있던 돈을 찾을 수 있습니다. 복권을 한 장 사보는 것도 나쁘지 않습니다.",
        "건강 관리에 유의해야 하는 날입니다. 무리한 운동이나 과식은 피하고, 일찍 귀가하여 휴식을 취하는 것이 내일을 위한 보약입니다.",
        "학업이나 업무 효율이 매우 높은 날입니다. 집중력이 최고조에 달하니, 어려운 과제나 공부에 매진하면 기대 이상의 결과를 얻을 것입니다.",
        "애정운이 상승하는 날입니다. 연인과는 더욱 깊은 사랑을 확인하게 되고, 솔로라면 마음에 드는 이성에게 연락이 올 수도 있습니다.",
        "마음이 다소 심란하고 집중이 되지 않을 수 있습니다. 잠시 명상을 하거나 산책을 통해 머리를 식히는 것이 도움이 됩니다.",
        "귀인(貴人)을 만날 운세입니다. 곤란한 상황에서 도움의 손길이 뻗쳐오니, 평소 덕을 쌓았다면 그 보답을 받는 날입니다.",
        "이동수가 있는 날입니다. 여행이나 출장을 가게 될 수 있으며, 그곳에서 새로운 기회를 발견하게 됩니다. 변화를 두려워하지 마세요."
    ];
    return msgs[seed % msgs.length];
}

function getLuckyData(seed) {
    const colors = ["황금색 (Gold)", "붉은색 (Red)", "푸른색 (Blue)", "검은색 (Black)", "흰색 (White)", "초록색 (Green)", "보라색 (Purple)"];
    
    const numbers = [];
    let currentSeed = seed * 12345 + new Date().getDate(); 
    
    while(numbers.length < 6) {
        currentSeed = (currentSeed * 1103515245 + 12345) % 2147483647;
        const num = (currentSeed % 45) + 1;
        if (!numbers.includes(num)) {
            numbers.push(num);
        }
    }
    numbers.sort((a, b) => a - b);

    return {
        color: colors[seed % colors.length],
        numbers: numbers.join(', ')
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