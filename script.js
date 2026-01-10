const URL = "https://teachablemachine.withgoogle.com/models/Xm7HLSBDP/";

let model, labelContainer, maxPredictions;

// Load the image model
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function predict() {
    var image = document.getElementById("face-image");
    const prediction = await model.predict(image, false);
    prediction.sort((a, b) => b.probability - a.probability);

    const resultMessage = document.querySelector(".result-message");
    const bestPrediction = prediction[0];
    
    let resultText = "";
    switch (bestPrediction.className) {
        case "Dog":
            resultText = "🐶 귀여운 강아지상이네요!";
            break;
        case "Cat":
            resultText = "🐱 매력적인 고양이상이네요!";
            break;
        default:
            resultText = "알 수 없는 동물상입니다.";
    }
    resultMessage.innerHTML = resultText;

    labelContainer.innerHTML = "";
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + (prediction[i].probability * 100).toFixed(1) + "%";
        
        const barContainer = document.createElement("div");
        barContainer.classList.add("bar-container");
        
        const labelText = document.createElement("span");
        labelText.textContent = prediction[i].className === "Dog" ? "강아지" : "고양이";
        labelText.classList.add("label-text");
        
        const barWrap = document.createElement("div");
        barWrap.classList.add("bar-wrap");
        
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.classList.add(prediction[i].className === "Dog" ? "dog-bar" : "cat-bar");
        bar.style.width = (prediction[i].probability * 100) + "%";
        
        const percentText = document.createElement("span");
        percentText.textContent = (prediction[i].probability * 100).toFixed(0) + "%";
        percentText.classList.add("percent-text");

        barWrap.appendChild(bar);
        barContainer.appendChild(labelText);
        barContainer.appendChild(barWrap);
        barContainer.appendChild(percentText);
        
        labelContainer.appendChild(barContainer);
    }
    
    document.getElementById("loading").style.display = "none";
    document.querySelector(".result-message").style.display = "block";
    document.getElementById("label-container").style.display = "block";
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            document.querySelector('.image-upload-wrap').style.display = 'none';
            document.getElementById('loading').style.display = 'block';
            document.querySelector('.file-upload-content').style.display = 'block';
            
            var img = document.querySelector('.file-upload-image');
            img.src = e.target.result;
            img.onload = function() {
                init().then(() => {
                    predict();
                });
            };
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        removeUpload();
    }
}

function removeUpload() {
    document.querySelector('.file-upload-input').value = "";
    document.querySelector('.file-upload-content').style.display = "none";
    document.querySelector('.image-upload-wrap').style.display = "block";
    document.querySelector('.image-upload-wrap').classList.remove('image-dropping');
    document.querySelector(".result-message").style.display = "none";
    document.getElementById("label-container").style.display = "none";
}

document.querySelector('.image-upload-wrap').addEventListener('dragover', function () {
    document.querySelector('.image-upload-wrap').classList.add('image-dropping');
});

document.querySelector('.image-upload-wrap').addEventListener('dragleave', function () {
    document.querySelector('.image-upload-wrap').classList.remove('image-dropping');
});


// Theme Toggle Logic (Copied from main.js)
const themeToggleBtn = document.getElementById('theme-toggle');

function updateToggleButton(isDark) {
    themeToggleBtn.textContent = isDark ? '🌞' : '🌙';
}

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
