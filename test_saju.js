const CHEONGAN = ['갑(甲)', '을(乙)', '병(丙)', '정(丁)', '무(戊)', '기(己)', '경(庚)', '신(辛)', '임(壬)', '계(癸)'];
const JIJI = ['자(子)', '축(丑)', '인(寅)', '묘(卯)', '진(辰)', '사(巳)', '오(午)', '미(未)', '신(申)', '유(酉)', '술(戌)', '해(亥)'];
const STEM_ELEMENTS = ['wood', 'wood', 'fire', 'fire', 'earth', 'earth', 'metal', 'metal', 'water', 'water'];
const ANIMAL_NAMES = ['쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양', '원숭이', '닭', '개', '돼지'];

function calculatePillars(dateStr, timeStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    // 1. Year Pillar
    let yearStemIndex = (year - 4) % 10;
    if (yearStemIndex < 0) yearStemIndex += 10;
    
    let yearBranchIndex = (year - 4) % 12;
    if (yearBranchIndex < 0) yearBranchIndex += 12;

    // 2. Month Pillar (Simplified)
    let monthBranchIndex = (month + 1) % 12; 
    let monthStemStart = (yearStemIndex % 5) * 2 + 2; 
    let monthStemIndex = (monthStemStart + (month - 1)) % 10;

    // 3. Day Pillar (Approximation)
    const refDate = new Date('2000-01-01');
    const diffTime = date.getTime() - refDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let dayStemIndex = (4 + diffDays) % 10;
    if (dayStemIndex < 0) dayStemIndex += 10;
    
    let dayBranchIndex = (6 + diffDays) % 12;
    if (dayBranchIndex < 0) dayBranchIndex += 12;

    // 4. Time Pillar
    let timeBranchIndex = 0; 
    if (timeStr) {
        const hour = parseInt(timeStr.split(':')[0]);
        timeBranchIndex = Math.floor(((hour + 1) % 24) / 2);
    }
    
    let timeStemStart = (dayStemIndex % 5) * 2;
    let timeStemIndex = (timeStemStart + timeBranchIndex) % 10;

    return {
        year: { stem: CHEONGAN[yearStemIndex], branch: JIJI[yearBranchIndex], animal: ANIMAL_NAMES[yearBranchIndex] },
        month: { stem: CHEONGAN[monthStemIndex], branch: JIJI[monthBranchIndex] },
        day: { stem: CHEONGAN[dayStemIndex], branch: JIJI[dayBranchIndex], element: STEM_ELEMENTS[dayStemIndex], stemIndex: dayStemIndex },
        time: { stem: CHEONGAN[timeStemIndex], branch: JIJI[timeBranchIndex] }
    };
}

console.log("Testing with date: 2026-01-11, time: 14:30");
const result = calculatePillars('2026-01-11', '14:30');
console.log(JSON.stringify(result, null, 2));