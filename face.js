document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const uploadContent = document.getElementById('upload-content');
    const previewContainer = document.getElementById('preview-container');
    const facePreview = document.getElementById('face-preview');
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingDiv = document.getElementById('loading');
    const resultDiv = document.getElementById('result');

    // Handle Click on Upload Area
    uploadArea.addEventListener('click', () => {
        imageUpload.click();
    });

    // Handle File Selection
    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                facePreview.src = e.target.result;
                uploadContent.classList.add('hidden');
                previewContainer.classList.remove('hidden');
                analyzeBtn.classList.remove('hidden');
                
                // Start Scanning Animation
                const scanLine = document.getElementById('scan-line');
                scanLine.style.animation = 'scan 2s infinite linear';
            }
            reader.readAsDataURL(file);
        }
    });

    // Handle Analyze Button
    analyzeBtn.addEventListener('click', async () => {
        analyzeBtn.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        uploadArea.style.pointerEvents = 'none'; // Disable click

        // --- SIMULATION LOGIC START ---
        // Simulating face analysis delay
        await new Promise(r => setTimeout(r, 2000)); 

        // Pseudo-random seed from image data
        const seed = facePreview.src.length;
        
        displayFaceResult(seed);
        
        loadingDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth' });
        // --- SIMULATION LOGIC END ---
    });
});

function displayFaceResult(seed) {
    // 1. Sam-jeong (Three Zones) Analysis
    const samJeong = getSamJeongAnalysis(seed);
    document.getElementById('face-balance-title').innerText = samJeong.title;
    document.getElementById('face-balance-desc').innerHTML = samJeong.desc;

    // 2. Luck Flow (Early, Mid, Late)
    // Map Sam-jeong to luck timing
    const luckLevels = ["대길(大吉)", "길(吉)", "평(平)", "보통"];
    
    // Simple mapping: Upper -> Early, Middle -> Mid, Lower -> Late
    // Logic: If zone is strong -> Good luck.
    document.getElementById('luck-early').innerText = luckLevels[samJeong.scores[0] % 3]; // Upper
    document.getElementById('luck-mid').innerText = luckLevels[samJeong.scores[1] % 3];   // Middle
    document.getElementById('luck-late').innerText = luckLevels[samJeong.scores[2] % 3];  // Lower
    document.getElementById('luck-love').innerText = luckLevels[seed % 4];

    // 3. Detailed Parts (12 Palaces Style)
    const foreheads = [
        "관록궁(官祿宮)이 밝아 명예운이 따르며, 윗사람의 인정을 받아 초년에 두각을 나타냅니다.",
        "역마궁(驛馬宮)이 발달하여 활동 반경이 넓고, 타지나 해외에서 성공할 기운이 강합니다.",
        "부모궁(父母宮)이 넉넉하여 조상의 음덕을 입고, 학업과 지혜가 뛰어난 귀격입니다."
    ];
    const eyes = [
        "전택궁(田宅宮)이 맑아 부동산 운이 좋으며, 눈빛이 그윽하여 사람을 끄는 매력이 있습니다.",
        "처첩궁(妻妾宮)이 깨끗하여 배우자 복이 있고, 감수성이 풍부하여 예술적 재능이 있습니다.",
        "눈동자의 흑백이 분명하여(자웅안) 시비를 가리는 판단력이 뛰어나고 리더십이 있습니다."
    ];
    const noses = [
        "재백궁(財帛宮)인 코가 우뚝 솟아 평생 재물 걱정이 없으며, 주관이 뚜렷하여 사업가 기질이 보입니다.",
        "산근(山根)이 살아있어 중년운이 탄탄하고, 실행력과 추진력이 타의 추종을 불허합니다.",
        "콧망울이 두툼하여 저축하는 힘이 강하고, 한번 들어온 재물은 쉽게 나가지 않는 실속파입니다."
    ];
    const mouths = [
        "출납관(出納官)인 입이 단정하여 말에 무게가 있고, 신의를 중시하여 대인관계가 원만합니다.",
        "입꼬리가 위로 향해(앙월구) 긍정적인 에너지가 넘치며, 말년으로 갈수록 복이 들어옵니다.",
        "입술이 도톰하여 정이 많고 포용력이 있어 주변에 따르는 사람이 많은 덕장(德將)입니다."
    ];
    const chins = [
        "노복궁(奴僕宮)이 넓고 둥글어 아랫사람의 덕을 보며, 말년에 안락한 삶을 누립니다.",
        "지각(地閣)이 단단하여 의지가 굳건하고, 어떤 어려움도 버텨내는 지구력이 뛰어납니다.",
        "하관이 발달하여 주거가 안정되고 자식 농사에 성공하여 가문이 번창할 상입니다."
    ];

    document.getElementById('part-forehead').innerText = foreheads[seed % foreheads.length];
    document.getElementById('part-eyes').innerText = eyes[(seed + 1) % eyes.length];
    document.getElementById('part-nose').innerText = noses[(seed + 2) % noses.length];
    document.getElementById('part-mouth').innerText = mouths[(seed + 3) % mouths.length];
    document.getElementById('part-chin').innerText = chins[(seed + 4) % chins.length];
}

function getSamJeongAnalysis(seed) {
    // Determine balance of Upper(0), Middle(1), Lower(2)
    // 0: Balanced, 1: Upper Strong, 2: Middle Strong, 3: Lower Strong
    const type = seed % 4; 
    
    // Simulate scores for luck calculation (0=Best, 1=Good, 2=Avg)
    let scores = [1, 1, 1]; 

    if (type === 0) {
        scores = [0, 0, 0];
        return {
            title: "삼정 균등형 (三停均等)",
            desc: "얼굴의 상/중/하 비율이 황금 조화를 이루고 있습니다.<br>초년, 중년, 말년의 운세가 고르게 발달하여 평생 큰 기복 없이 안정적인 복을 누리는 <strong>귀격(貴格)</strong>입니다.",
            scores: scores
        };
    } else if (type === 1) {
        scores = [0, 1, 2];
        return {
            title: "상정 발달형 (上停發達)",
            desc: "이마에서 눈썹까지의 상정이 특히 발달했습니다.<br>총명하고 지혜로워 <strong>초년운과 학업운</strong>이 매우 좋습니다. 정신적인 활동이나 기획 분야에서 두각을 나타냅니다.",
            scores: scores
        };
    } else if (type === 2) {
        scores = [1, 0, 1];
        return {
            title: "중정 발달형 (中停發達)",
            desc: "눈썹에서 코끝까지의 중정이 가장 튼튼합니다.<br>의지가 강하고 실행력이 뛰어나 <strong>중년운과 사회적 성취</strong>가 가장 왕성합니다. 자수성가하여 큰 부를 이룰 상입니다.",
            scores: scores
        };
    } else {
        scores = [2, 1, 0];
        return {
            title: "하정 발달형 (下停發達)",
            desc: "인중에서 턱까지의 하정이 후덕하고 넓습니다.<br>지구력이 좋고 포용력이 있어 <strong>말년운과 자식복, 부동산 운</strong>이 탁월합니다. 대기만성형으로 갈수록 좋아집니다.",
            scores: scores
        };
    }
}