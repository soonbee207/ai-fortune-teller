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
        
        await new Promise(r => setTimeout(r, 2000)); // 2초 대기 (분석 척)

        // Mock Data
        const animals = [
            { type: "용상 (Dragon)", desc: "카리스마와 리더십이 넘치는 제왕의 상입니다.", celeb: "공유, 김수현", luck: ["대길", "길", "대길", "평"] },
            { type: "여우상 (Fox)", desc: "지혜롭고 눈치가 빠르며 매력이 넘치는 상입니다.", celeb: "지드래곤, 황민현", luck: ["길", "대길", "평", "대길"] },
            { type: "곰상 (Bear)", desc: "우직하고 신뢰감을 주며 재물복이 타고난 상입니다.", celeb: "마동석, 조진웅", luck: ["평", "길", "대길", "길"] },
            { type: "토끼상 (Rabbit)", desc: "사랑스럽고 인기가 많으며 감수성이 풍부한 상입니다.", celeb: "정국, 수지", luck: ["대길", "평", "길", "대길"] },
            { type: "늑대상 (Wolf)", desc: "냉철하고 강인하며 목표를 반드시 이루는 상입니다.", celeb: "이준기, 서인국", luck: ["길", "대길", "길", "평"] },
            { type: "강아지상 (Puppy)", desc: "순둥하고 친근하여 어디서나 사랑받는 상입니다.", celeb: "박보영, 송중기", luck: ["대길", "길", "평", "대길"] },
            { type: "고양이상 (Cat)", desc: "도도하고 세련된 매력으로 사람을 홀리는 상입니다.", celeb: "강동원, 한예슬", luck: ["길", "평", "대길", "길"] },
            { type: "공룡상 (Dino)", desc: "개성 있고 강렬한 인상으로 시선을 사로잡는 상입니다.", celeb: "공유, 김우빈", luck: ["길", "대길", "대길", "평"] }
        ];

        // Pick random result based on simple hash of image src length
        const seed = facePreview.src.length; 
        const result = animals[seed % animals.length];

        displayFaceResult(result, seed);
        
        loadingDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth' });
        // --- SIMULATION LOGIC END ---
    });
});

function displayFaceResult(data, seed) {
    document.getElementById('animal-type').innerText = data.type;
    document.getElementById('face-desc').innerText = data.desc;
    document.getElementById('celebrity-lookalike').innerText = data.celeb;
    
    document.getElementById('luck-early').innerText = data.luck[0];
    document.getElementById('luck-mid').innerText = data.luck[1];
    document.getElementById('luck-late').innerText = data.luck[2];
    document.getElementById('luck-love').innerText = data.luck[3];

    // Detailed Parts Analysis
    const foreheads = [
        "넓고 시원하여 윗사람의 덕을 보고 초년운이 좋습니다.",
        "M자형 이마로 창의적이고 예술적인 감각이 뛰어납니다.",
        "반듯하고 도톰하여 지혜롭고 학업 성취가 높습니다."
    ];
    const eyes = [
        "눈동자가 흑백이 분명하여 총명하고 결단력이 있습니다.",
        "눈꼬리가 살짝 올라가 도화살이 있으며 이성에게 인기가 많습니다.",
        "선하고 맑은 눈빛으로 주변 사람들에게 신뢰를 줍니다."
    ];
    const noses = [
        "콧대가 곧게 뻗어 의지가 강하고 실행력이 좋습니다.",
        "코끝이 둥글고 도톰하여 재물복이 가득 차 있습니다.",
        "매부리코 형상으로 한번 잡은 기회는 놓치지 않습니다."
    ];
    const mouths = [
        "입꼬리가 올라가 있어 평생 식복이 따르고 긍정적입니다.",
        "입술이 도톰하여 정이 많고 언변이 뛰어납니다.",
        "단정한 입매로 신중하고 책임감이 강한 성격입니다."
    ];
    const chins = [
        "턱이 둥글고 후덕하여 말년에 자식 복과 부귀를 누립니다.",
        "브이라인으로 세련되었으며 자수성가할 관상입니다.",
        "강인한 하관으로 리더십이 있고 추진력이 좋습니다."
    ];

    document.getElementById('part-forehead').innerText = foreheads[seed % foreheads.length];
    document.getElementById('part-eyes').innerText = eyes[(seed + 1) % eyes.length];
    document.getElementById('part-nose').innerText = noses[(seed + 2) % noses.length];
    document.getElementById('part-mouth').innerText = mouths[(seed + 3) % mouths.length];
    document.getElementById('part-chin').innerText = chins[(seed + 4) % chins.length];
}
