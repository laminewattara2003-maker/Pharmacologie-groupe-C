const API_URL = "https://script.google.com/macros/s/AKfycbw7uCQXpNrmyx6EbAHzxYcaMJwPAlyu7dXMDMWesF4RQThvXId94eXdFpHrUGpnLWaA/exec";
let totalSeconds = 1200; // 20 min globales
let questionSeconds = 30; // 30s par question
let selectedAnswers = []; 
let serverDatabase = [];
let userIP = "Non détectée";
let currentStudentName = "";
let score = 0;
let i = 0;
let lock = false;
let globalInterval;
let questionInterval;
let questions = [
    {q:`1- Le principe actif des suspensions buvables est :`,o:[`A- Stable dans le sel`,`B- Instable dans l'eau`,`C- Stable dans le l'huile`,`D- Instable dans l'huile`],a:["B"]},
    {q:`2- Le médicament sert à :`,o:[`A- Guérir les maladies`,`B- Autres`,`C- Prévenir les maladies`,`D- Autre`],a:["A", "C"]},
    {q:`3- Dispenser le médicament consiste à :`,o:[`A- Donner la posologie au patient`,`B- Ne pas préciser les effets secondaires`,`C- Entreposer le médicament`,`D- Autres`],a:["A"]},
    {q:`4- Le principe actif (PA) d'un médicament est aussi :`,o:[`A- Son nom commercial`,`B- Son nom international`,`C- Son excipient`,`D- Autre`],a:["B"]},
    {q:`5- Dans EFFERALGAN 500 mg comprimé effervescent peut se prendre :`,o:[`A- Par voie percutanée`,`B- Par voie transmuqueuse`,`C- Par voie parentérale`,`D- Autre`],a:["D"]},
    {q:`6- La pharmacie galénique c'est :`,o:[`A- L'étude du mode d'action du médicament`,`B- L'étude des plantes médicinales`,`C- L'étude de la forme du médicament`,`D- Autre`],a:["C"]},
    {q:`7- Les sirops sont des préparations médicamenteuses :`,o:[`A- Saturées en eau`,`B- Saturées en sel`,`C- Saturées en lipide`,`D- Saturées en sucre`],a:["D"]},
    {q:`8- Les suspensions buvables doivent être préparées :`,o:[`A- Après la prise du médicament`,`B- Avant la prise du médicament`,`C- Pendant la prise du médicament`,`D- Autre`],a:["B"]},
    {q:`9- La voie parentérale c'est l'administration des médicaments par :`,o:[`E- Per os`,`F- Intra musculaire (IM)`,`G- Voie anale`,`H- Voie cutanée`],a:["F"]},
    {q:`10- Les inconvénients de la voie PER OS sont :`,o:[`A- Inobservance du traitement à cause du goût`,`B- Antiallergique`,`C- Antiparasitaire`,`D- Impossibilité d'administration si trouble de la déglutition`],a:["A", "D"]},
    {q:`11- Il faut la présence obligatoire d'un infirmier pour pratiquer :`,o:[`A- La voie percutanée`,`B- La voie transmuqueuse`,`C- La voie per os`,`D- Autre`],a:["D"]},
    {q:`12- La D.C.I du médicament c'est :`,o:[`E- sa dénomination commerciale`,`F- sa dénomination commune internationale`,`G- son principe actif`,`H- Autres`],a:["F", "G"]},
    {q:`13- L'allergie aux excipients d'un médicament est un :`,o:[`E- Effet bénéfique`,`F- Effet non voulu`,`G- Effet secondaire`,`H- Autre`],a:["F", "G"]},
    {q:`14- En cas d'effets secondaire d'un médicament il faut :`,o:[`E- Diminution de la dose`,`F- Augmenter la dose`,`G- Changer de prescription`,`H- Autres`],a:["E", "G"]},
    {q:`15- Dans une ordonnance médicale, il faut :`,o:[`E- La D.C.I`,`F- Le dosage`,`G- Un excipient`,`H- Le conditionnement primaire`],a:["E", "F"]},
    {q:`16- En pharmacologie, il y a :`,o:[`E- 2 voies de prise des médicaments`,`F- 5 voies de prise des médicaments`,`G- 1 seule voie de prise des médicaments`,`H- 6 voies de prise des médicaments`],a:["F"]},
    {q:`17- La voie parentérale concerne :`,o:[`E- La voie sous-cutanée`,`F- La voie orale`,`G- La voie intra-veineuse`,`H- La voie percutanée`],a:["E", "G"]},
    {q:`18- La voie transmuqueuse associe :`,o:[`A- La voie oculaire`,`B- La voie rectale`,`C- La voie cutanée`,`D- La voie sublinguale`],a:["A", "B", "D"]},
    {q:`19- La pharmacognosie est l'étude :`,o:[`I- Des plantes médicinales`,`J- Du médicament depuis son administration jusqu'à son élimination`,`K- Des bactéries`,`L- Autres`],a:["I"]},
    {q:`20- Le principe actif (PA) d'un médicament est aussi :`,o:[`I- Son nom commercial`,`J- Son nom international`,`K- Son excipient`,`L- Autre`],a:["J"]},
    {q:`21- L'effet indésirable d'un médicament peut être :`,o:[`E- Une pharmaco dépendance`,`F- L'indication thérapeutique`,`G- Une allergie au principe actif`,`H- Un Décès du patient`],a:["E", "G", "H"]},
    {q:`22- La rapidité des effets du médicament est obtenue par :`,o:[`I- La voie sous-cutanée`,`J- La voie orale`,`K- La voie intra-veineuse`,`L- La voie percutanée`],a:["I", "K"]},
    {q:`23- Le médicament sert :`,o:[`M- Seulement aux maladies humaines`,`N- Seulement aux maladies animales`,`M- A la fois aux maladies humaines et animales`,`O- Aux maladies des plantes`],a:["M"]},
    {q:`24- Dans EFFERALGAN 500 mg :`,o:[`N- Le principe actif est paracétamol 500 milligrammes`,`I- L'acide acétylsalicylique 500 milligrammes`,`J- La carbocysteine 500 milligrammes`,`K- Autres`],a:["N"]},
    {q:`25- Dans EFFERALGAN 500 milligrammes, le benzoate de sodium est :`,o:[`I- Le conditionnement secondaire`,`J- Le principe actif`,`K- Autre`,`L- Le conditionnement primaire`],a:["K"]},
    {q:`26- Les formes injectables sont des préparations galéniques :`,o:[`O- Non stériles`,`P- Autres`,`Q- A inhaler`,`R- Stériles`],a:["R"]},
    {q:`27- Dans un médicament l'eau est :`,o:[`S- Un principe actif`,`T- Un excipient`,`U- Un conditionnement`,`V- Autre`],a:["T"]},
    {q:`28- En pharmacologie, l'IVD est aussi appelée :`,o:[`W- La voie intra veineuse`,`X- Autres`,`Y- La voie sous-`,`Z- La voie intra veineuse directe`],a:["Z"]},
    {q:`29- Les crèmes sont des préparations :`,o:[`A- Lavables à l'eau`,`B- Non lavables à l'eau`,`C- A inhaler`,`D- Stériles`],a:["A"]},
    {q:`30- Les médicaments magistraux sont :`,o:[`A- Des spécialités pharmaceutiques`,`B- Autres`,`C- Des médicaments officinaux`,`D- Préparés par le pharmacien ou le PGP`],a:["D"]},
    {q:`31- Les médicaments génériques constituent :`,o:[`A- L'original d'un médicament`,`B- La DCI d'un médicament`,`C- Autre`,`D- Une copie de l'originale d'un médicament`],a:["D"]},
    {q:`32- L'intérêt de la prescription en D.C.I c'est :`,o:[`A- D'améliorer disponibilité des médicaments`,`B- Autres`,`C- De choisir une spécialité pharmaceutique`,`D- De réduire le risque de prendre plusieurs médicaments portant des noms différents mais contenant un même principe actif`],a:["A", "D"]},
    {q:`33- Le numéro de téléphone est :`,o:[`A- Nécessaire à inscrire sur l'ordonnance`,`B- Autres`,`E- N'est pas nécessaire à inscrire sur l'ordonnance`,`F- Permet de réduire le risque de prendre plusieurs médicaments`],a:["A"]},
    {q:`34- La PHARMACIE est un lieu :`,o:[`A- De vente seulement des médicaments`,`B- De vente et de conseil sur les médicaments`,`G- De choix d'une spécialité pharmaceutique`,`H- De stockage des médicaments`],a:["B", "H"]},
    {q:`35- L'arrêt définitif du traitement doit se faire :`,o:[`A- Autre`,`C- En cas d'effet curatif`,`I- En cas de prévention`,`J- En cas d'effets indésirables`],a:["J"]},
    {q:`36- COARTEM 80 mg est :`,o:[`A- Le nom commercial d'un médicament`,`B- Autres`,`K- Une D.C.I d un médicament`,`L- Un principe actif d'un médicament`],a:["A"]},
    {q:`37- L'alcool à 70 degrés est :`,o:[`A- Un générique`,`B- Un médicament officinal`,`M- Une spécialité pharmaceutique`,`N- Un médicament magistral`],a:["B"]},
    {q:`38- La VENTOLINE SPRAY est à prendre par voie :`,o:[`A- Transmuqueuse`,`B- Autre`,`O- Per os`,`P- Parentérale`],a:["A", "B", "O"]},
    {q:`39- Le paracétamol en suppositoire est destiné à être administré par voie :`,o:[`A- Vaginale`,`B- Per os`,`Q- Pulmonaire`,`R- Rectale`],a:["R"]},
    {q:`40- La voie percutanée concerne :`,o:[`A- Les oreilles`,`B- La peau`,`S- La bouche`,`T- Les poumons`],a:["B"]}
];
// Mélange aléatoire des questions à chaque rechargement
questions = questions.sort(() => Math.random() - 0.5);
window.onload = function() {
    fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(ipData => { userIP = ipData.ip; checkUserStatus(); })
    .catch(() => { checkUserStatus(); });
};

function checkUserStatus() {
    fetch(API_URL)
    .then(res => res.json())
    .then(data => {
        serverDatabase = data;
        document.getElementById("count-students-login").innerText = `👥 ${data.length} étudiant(s) ont déjà composé`;
        let aujourdhui = new Date().toDateString();
        let dejaSoumis = data.find(row => row.ip === userIP || (row.date && new Date(row.date).toDateString() === aujourdhui && row.ip === userIP));
        if (dejaSoumis) { showSavedResults(dejaSoumis); } 
        else {
            document.getElementById("loading-screen").style.display = "none";
            document.getElementById("login").style.display = "flex";
        }
    })
    .catch(() => {
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("login").style.display = "flex";
    });
}

function start() {
    currentStudentName = document.getElementById("name").value.trim();
    if (!currentStudentName) { alert("Nom complet requis"); return; }
    let nomExiste = serverDatabase.find(row => row.nom && row.nom.trim().toLowerCase() === currentStudentName.toLowerCase());
    if (nomExiste) { showSavedResults(nomExiste); return; }
    document.getElementById("login").style.display = "none";
    document.getElementById("quiz").style.display = "flex";
    document.getElementById("student").innerText = currentStudentName;
    startGlobalTimer();
    load();
}

function startGlobalTimer() {
    globalInterval = setInterval(() => {
        totalSeconds--;
        let min = Math.floor(totalSeconds / 60);
        let sec = totalSeconds % 60;
        document.getElementById("global-timer").innerText = `⏱ Global : ${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (totalSeconds <= 0) {
            clearInterval(globalInterval); clearInterval(questionInterval);
            alert("⏰ Temps global écoulé ! Copie envoyée."); finish();
        }
    }, 1000);
}

function load() {
    lock = false; selectedAnswers = []; questionSeconds = 30;
    document.getElementById("question-timer").innerText = `⏳ Question : ${questionSeconds}s`;
    let q = questions[i];
    let typeBadge = document.getElementById("quiz-type");
    let validateBtn = document.getElementById("btn-validate");
    if (q.a.length === 1) {
        typeBadge.innerText = "QCD : Choix unique direct"; typeBadge.style.background = "#2980b9"; validateBtn.style.display = "none";
    } else {
        typeBadge.innerText = "QCM : Choix multiple (" + q.a.length + " réponses)"; typeBadge.style.background = "#e67e22"; validateBtn.style.display = "block";
    }
    document.getElementById("question").innerText = q.q;
    let box = document.getElementById("options"); box.innerHTML = "";
    q.o.forEach(opt => {
        let b = document.createElement("button"); b.className = "option"; b.innerText = opt;
        b.onclick = () => selectOption(b, opt.charAt(0)); box.appendChild(b);
    });
    document.getElementById("bar").style.width = ((i / questions.length) * 100) + "%";

    clearInterval(questionInterval);
    questionInterval = setInterval(() => {
        questionSeconds--;
        document.getElementById("question-timer").innerText = `⏳ Question : ${questionSeconds}s`;
        if (questionSeconds <= 0) {
            clearInterval(questionInterval); lock = true;
            questions[i].userSelection = selectedAnswers;
            displayColors(questions[i].a, selectedAnswers); nextQuestion();
        }
    }, 1000);
}

function selectOption(buttonElement, letter) {
    if (lock) return;
    let q = questions[i];
    if (q.a.length === 1) { clearInterval(questionInterval); validateQCD(letter); } 
    else {
        if (selectedAnswers.includes(letter)) {
            selectedAnswers = selectedAnswers.filter(item => item !== letter);
            buttonElement.classList.remove("selected-opt");
        } else { selectedAnswers.push(letter); buttonElement.classList.add("selected-opt"); }
    }
}

function validateQCD(val) {
    lock = true; let correctList = questions[i].a; let isCorrect = correctList.includes(val);
    questions[i].userSelection = [val]; displayColors(correctList, [val]);
    if (isCorrect) score++; nextQuestion();
}

function validateQCM() {
    if (lock) return;
    if (selectedAnswers.length === 0) { alert("Sélectionnez au moins une option !"); return; }
    clearInterval(questionInterval); lock = true; let correctList = questions[i].a;
    let isFullyCorrect = ([...correctList].sort().join(",") === [...selectedAnswers].sort().join(","));
    questions[i].userSelection = selectedAnswers; displayColors(correctList, selectedAnswers);
    if (isFullyCorrect) score++; nextQuestion();
}

function displayColors(correctList, selectedList) {
    document.querySelectorAll(".option").forEach(btn => {
        btn.disabled = true; let letter = btn.innerText.charAt(0);
        if (correctList.includes(letter)) { btn.className = "option correct"; }
        else if (selectedList.includes(letter)) { btn.className = "option wrong"; }
    });
}

function nextQuestion() {
    setTimeout(() => {
        i++; if (i >= questions.length) { clearInterval(globalInterval); clearInterval(questionInterval); finish(); } else { load(); }
    }, 1000);
}

function finish() {
    let noteSur20 = ((score / questions.length) * 20).toFixed(2);
    document.getElementById("quiz").style.display = "none";
    document.getElementById("loading-screen").style.display = "flex";
    document.getElementById("loading-screen").innerHTML = `<h3>Transmission de votre copie sécurisée...</h3>`;
    fetch(`${API_URL}?ip=${userIP}`, {
        method: "POST", mode: "no-cors", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "nom": currentStudentName, "score": `${score}/${questions.length}`, "note": `${noteSur20}/20` })
    })
    .then(() => { reloadDataAndShowResults(currentStudentName, noteSur20, score); })
    .catch(() => { reloadDataAndShowResults(currentStudentName, noteSur20, score); });
}

function reloadDataAndShowResults(studentName, finalNote, finalScore) {
    fetch(API_URL).then(res => res.json()).then(data => {
        serverDatabase = data; buildRankingTable(data); buildCorrectionGrid();
        document.getElementById("loading-screen").style.display = "none";
        document.getElementById("result-welcome-msg").innerHTML = `Étudiant : <strong>${studentName}</strong>.<br>Note finale enregistrée : <strong style="font-size:22px; color:#27ae60;">${finalNote}/20</strong> (${finalScore}/${questions.length}).`;
        document.getElementById("result-screen").style.display = "flex";
    });
}

function showSavedResults(studentRow) {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("login").style.display = "none";
    document.getElementById("quiz").style.display = "none";
    document.getElementById("already-done-msg").style.display = "block";
    document.getElementById("result-welcome-msg").innerHTML = `Étudiant : <strong>${studentRow.nom}</strong>.<br>Note finale : <strong style="font-size:22px; color:#27ae60;">${studentRow.note}</strong> (${studentRow.score}).`;
    buildRankingTable(serverDatabase);
    document.getElementById("correction-box").innerHTML = "<p style='color:#7f8c8d; text-align:center;'>La grille de correction détaillée est affichée uniquement lors de la soumission initiale de la copie pour des raisons de sécurité.</p>";
    document.getElementById("result-screen").style.display = "flex";
}

function buildRankingTable(data) {
    if (!data || data.length === 0) { document.getElementById("ranking-table-container").innerHTML = "<p>Aucune note.</p>"; return; }
    data.sort((a, b) => parseFloat(b.note) - parseFloat(a.note));
    let tableHtml = `<table class="rank-table"><tr><th>Rang</th><th>Nom Étudiant</th><th>Note /20</th></tr>`;
    data.forEach((student, index) => {
        let medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : (index + 1);
        tableHtml += `<tr><td>${medal}</td><td>${student.nom || "Anonyme"}</td><td><strong>${student.note || "N/A"}</strong></td></tr>`;
    });
    tableHtml += `</table>`; document.getElementById("ranking-table-container").innerHTML = tableHtml;
}

function buildCorrectionGrid() {
    let html = "";
    questions.forEach((q, index) => {
        let userSel = q.userSelection || [];
        let isCorrect = ([...q.a].sort().join(",") === [...userSel].sort().join(","));
        let color = isCorrect ? "#d4edda" : "#f8d7da";
        let correctTexts = q.o.filter(opt => q.a.includes(opt.charAt(0))).join(' | ');
        let userTexts = userSel.length > 0 ? q.o.filter(opt => userSel.includes(opt.charAt(0))).join(' | ') : "Aucune réponse / Temps écoulé";
        html += `
        <div style="background:${color}; padding:10px; margin-bottom:10px; border-radius:6px; font-size:13px; border-left:5px solid ${isCorrect ? '#2ecc71':'#e74c3c'}">
            <b>Q${index + 1} : ${q.q}</b><br>
            <span style="color:#27ae60;">✔ Réponse correcte : ${correctTexts}</span><br>
            <span style="color:${isCorrect ? '#27ae60':'#c0392b'};">❌ Votre choix : ${userTexts}</span>
        </div>`;
    });
    document.getElementById("correction-box").innerHTML = html;
}
