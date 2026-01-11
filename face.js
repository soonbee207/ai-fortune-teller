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
        // 실제 Teachable Machine 모델이 있다면 여기서 predict()를 호출합니다.
        // 현재는 데모를 위해 랜덤 시뮬레이션을 수행합니다.
        
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

        // Pick random result based on simple hash of image src length (pseudo-random)
        const seed = facePreview.src.length; 
        const result = animals[seed % animals.length];

        displayFaceResult(result);
        
        loadingDiv.classList.add('hidden');
        resultDiv.classList.remove('hidden');
        resultDiv.scrollIntoView({ behavior: 'smooth' });
        // --- SIMULATION LOGIC END ---
    });
});

function displayFaceResult(data) {
    document.getElementById('animal-type').innerText = data.type;
    document.getElementById('face-desc').innerText = data.desc;
    document.getElementById('celebrity-lookalike').innerText = data.celeb;
    
    document.getElementById('luck-early').innerText = data.luck[0];
    document.getElementById('luck-mid').innerText = data.luck[1];
    document.getElementById('luck-late').innerText = data.luck[2];
    document.getElementById('luck-love').innerText = data.luck[3];

    const details = [
        "이마가 시원하여 초년운이 좋고 윗사람의 덕을 볼 수 있습니다.",
        "눈매가 살아있어 재물을 모으는 능력이 탁월합니다.",
        "코가 반듯하여 중년에 사업이나 일에서 큰 성과를 낼 관상입니다.",
        "입꼬리가 올라가 있어 말년에도 웃을 일이 많고 자식 복이 있습니다.",
        "전체적인 밸런스가 좋아 인복이 따르는 형국입니다."
    ];
    // Randomly pick 2 details
    const pick1 = details[Math.floor(Math.random() * details.length)];
    let pick2 = details[Math.floor(Math.random() * details.length)];
    while(pick1 === pick2) pick2 = details[Math.floor(Math.random() * details.length)];

    document.getElementById('detailed-analysis').innerHTML = `${pick1}<br>${pick2}`;
}

/* 
// --- Future Teachable Machine Integration Guide ---
// 1. Train your model at https://teachablemachine.withgoogle.com/train/image
// 2. Export the model (Upload) and get the URL (e.g., https://teachablemachine.withgoogle.com/models/...)
// 3. Uncomment and use this function:

async function predictWithTM() {
    const URL = "YOUR_MODEL_URL_HERE";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    const model = await tmImage.load(modelURL, metadataURL);
    const prediction = await model.predict(document.getElementById('face-preview'));
    
    // prediction array contains probabilities for each class
    // Find the highest probability class and map it to our 'animals' data
}
*/