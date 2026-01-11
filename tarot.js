document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('tarot-board');
    const resultDiv = document.getElementById('tarot-result');
    const cardNameEl = document.getElementById('card-name');
    const cardMeaningEl = document.getElementById('card-meaning');
    const cardAdviceEl = document.getElementById('card-advice');
    const selectedCardView = document.getElementById('selected-card-view');

    // Wikipedia/Wikimedia Public Domain Rider-Waite Images
    const MAJOR_ARCANA = [
        { 
            name: "0. The Fool (광대)", 
            meaning: "새로운 시작, 모험, 순수함, 무한한 잠재력. 두려움 없이 첫 발을 내디딜 때입니다.", 
            advice: "망설이지 말고 도전하세요. 당신의 직관을 믿으세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg"
        },
        { 
            name: "I. The Magician (마법사)", 
            meaning: "창조력, 자신감, 의지력, 기술. 당신은 이미 필요한 모든 능력을 가지고 있습니다.", 
            advice: "당신의 재능을 마음껏 펼치세요. 주도권을 잡으세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg"
        },
        { 
            name: "II. The High Priestess (여사제)", 
            meaning: "직관, 신비, 지혜, 내면의 목소리. 눈에 보이지 않는 진실을 탐구할 때입니다.", 
            advice: "서두르지 말고 내면의 소리에 귀 기울이세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg"
        },
        { 
            name: "III. The Empress (여황제)", 
            meaning: "풍요, 모성, 자연, 편안함. 결실을 맺고 사랑받는 시기입니다.", 
            advice: "주변을 돌보고 사랑을 베푸세요. 창의적인 활동이 좋습니다.",
            image: "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg"
        },
        { 
            name: "IV. The Emperor (황제)", 
            meaning: "권위, 구조, 안정, 리더십. 질서와 규칙을 통해 목표를 달성합니다.", 
            advice: "체계적인 계획을 세우고 책임감 있게 행동하세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg"
        },
        { 
            name: "V. The Hierophant (교황)", 
            meaning: "전통, 가르침, 신념, 영적 인도. 조언을 구하거나 배움을 얻기 좋은 때입니다.", 
            advice: "검증된 방식을 따르고 멘토의 조언을 구하세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg"
        },
        { 
            name: "VI. The Lovers (연인)", 
            meaning: "사랑, 조화, 선택, 가치관의 일치. 깊은 유대감을 형성하거나 중요한 선택을 합니다.", 
            advice: "마음이 가는 쪽을 선택하세요. 진심을 표현하세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg"
        },
        { 
            name: "VII. The Chariot (전차)", 
            meaning: "승리, 의지, 극복, 전진. 장애물을 뚫고 목표를 향해 돌진하는 형국입니다.", 
            advice: "강한 의지로 밀어붙이세요. 포기하지 않으면 승리합니다.",
            image: "https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg"
        },
        { 
            name: "VIII. Strength (힘)", 
            meaning: "용기, 인내, 포용, 내면의 힘. 부드러움이 강함을 이깁니다.", 
            advice: "감정을 다스리고 인내심을 가지세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg"
        },
        { 
            name: "IX. The Hermit (은둔자)", 
            meaning: "성찰, 고독, 탐구, 깨달음. 잠시 멈춰 자신을 돌아보는 시간이 필요합니다.", 
            advice: "혼자만의 시간을 갖고 깊이 생각해보세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg"
        },
        { 
            name: "X. Wheel of Fortune (운명의 수레바퀴)", 
            meaning: "변화, 기회, 운명, 순환. 상황이 호전되거나 새로운 국면을 맞이합니다.", 
            advice: "변화를 자연스럽게 받아들이세요. 흐름에 몸을 맡기세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg"
        },
        { 
            name: "XI. Justice (정의)", 
            meaning: "공정함, 진실, 균형, 법. 뿌린 대로 거두는 시기입니다.", 
            advice: "객관적으로 판단하고 정직하게 행동하세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg"
        },
        { 
            name: "XII. The Hanged Man (매달린 사람)", 
            meaning: "희생, 새로운 관점, 정지, 기다림. 다른 각도에서 상황을 바라봐야 합니다.", 
            advice: "조급해하지 말고 때를 기다리며 지혜를 얻으세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg"
        },
        { 
            name: "XIII. Death (죽음)", 
            meaning: "종결, 새로운 시작, 변화, 이별. 낡은 것을 버려야 새것이 옵니다.", 
            advice: "과거에 연연하지 말고 과감하게 정리하세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg"
        },
        { 
            name: "XIV. Temperance (절제)", 
            meaning: "균형, 조화, 인내, 중용. 극단을 피하고 조화를 이루어야 합니다.", 
            advice: "무리하지 말고 순리에 따르며 타협점을 찾으세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg"
        },
        { 
            name: "XV. The Devil (악마)", 
            meaning: "속박, 유혹, 물질주의, 집착. 벗어나기 힘든 유혹이나 구속을 주의하세요.", 
            advice: "자신의 욕망을 직시하고 부정적인 사슬을 끊으세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg"
        },
        { 
            name: "XVI. The Tower (탑)", 
            meaning: "갑작스러운 변화, 붕괴, 재난, 계시. 기존의 틀이 무너지고 진실이 드러납니다.", 
            advice: "변화를 두려워 말고 무너진 자리에 새로움을 세우세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg"
        },
        { 
            name: "XVII. The Star (별)", 
            meaning: "희망, 영감, 치유, 긍정. 어둠 속에서 빛을 발견합니다.", 
            advice: "긍정적인 마음을 잃지 마세요. 소원은 이루어집니다.",
            image: "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg"
        },
        { 
            name: "XVIII. The Moon (달)", 
            meaning: "불안, 환상, 잠재의식, 혼란. 불확실한 상황 속에서 길을 잃지 않도록 주의하세요.", 
            advice: "보이는 것이 전부가 아닙니다. 진실을 꿰뚫어 보세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg"
        },
        { 
            name: "XIX. The Sun (태양)", 
            meaning: "성공, 활력, 행복, 명확함. 모든 것이 밝게 빛나는 최고의 운세입니다.", 
            advice: "자신감을 갖고 즐기세요. 당신은 축복받았습니다.",
            image: "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg"
        },
        { 
            name: "XX. Judgement (심판)", 
            meaning: "부활, 보상, 결단, 소명. 과거의 노력에 대한 보상을 받고 새로운 단계로 나아갑니다.", 
            advice: "중요한 결정을 내려야 할 때입니다. 과거를 용서하고 나아가세요.",
            image: "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg"
        },
        { 
            name: "XXI. The World (세계)", 
            meaning: "완성, 성취, 통합, 해피엔딩. 긴 여정의 끝에 달콤한 보상이 있습니다.", 
            advice: "지금까지의 노력을 스스로 칭찬하세요. 완벽한 마무리입니다.",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg"
        }
    ];

    // Generate Cards
    for (let i = 0; i < 22; i++) { // Generate 22 card backs
        const card = document.createElement('div');
        card.className = 'tarot-card';
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-back"></div>
                <div class="card-front"></div>
            </div>
        `;
        
        // Random slight rotation for realism
        const rotation = (Math.random() - 0.5) * 10;
        card.style.transform = `rotate(${rotation}deg)`;
        
        card.addEventListener('click', () => revealCard(card));
        board.appendChild(card);
    }

    function revealCard(card) {
        if (card.classList.contains('flipped')) return;

        // Pick random card logic
        const randomIdx = Math.floor(Math.random() * MAJOR_ARCANA.length);
        const result = MAJOR_ARCANA[randomIdx];

        // Set image to this specific card's front before flipping
        const frontFace = card.querySelector('.card-front');
        frontFace.style.backgroundImage = `url('${result.image}')`;
        frontFace.style.backgroundSize = 'cover';
        frontFace.style.backgroundPosition = 'center';
        frontFace.innerText = ''; // Clear text if any

        // Animate
        card.classList.add('flipped');
        
        // Hide other cards fade out
        const allCards = document.querySelectorAll('.tarot-card');
        allCards.forEach(c => {
            if (c !== card) c.style.opacity = '0';
        });

        // Show Result after delay
        setTimeout(() => {
            board.classList.add('hidden');
            resultDiv.classList.remove('hidden');
            
            // Populate Result
            cardNameEl.innerText = result.name;
            cardMeaningEl.innerText = result.meaning;
            cardAdviceEl.innerText = result.advice;
            
            // Show selected card visual in result
            selectedCardView.className = 'selected-card-view card-show-anim';
            selectedCardView.style.backgroundImage = `url('${result.image}')`;
            selectedCardView.style.backgroundSize = 'cover';
            selectedCardView.style.backgroundPosition = 'center';
            selectedCardView.innerText = ''; // Clear text
        }, 1000);
    }
});