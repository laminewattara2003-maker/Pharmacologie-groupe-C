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
    {q:`Question 1 : Quelle est l'origine étymologique exacte du terme « pharmacie » ?`,o:[`A) Du latin « pharmacum » qui signifie remède ou solution miracle.`,`B) Du grec « pharmakon » qui signifie drogue, venin ou poison.`,`C) Du grec « pharmakeia » qui signifie cueillette des plantes.`,`D) Du latin « medicamentum » qui signifie art de guérir.`],a:["B"]},
    {q:`Question 2 : Le terme « pharmacie » possède une double définition dans la pratique médicale. Laquelle ?`,o:[`A) La science de la fabrication industrielle et l'art de prescrire.`,`B) La science qui s'intéresse à la conception/dispensation des médicaments, et l'officine (lieu de stockage et dispensation).`,`C) Le laboratoire de recherche universitaire et la pharmacopée légale.`,`D) Le commerce des plantes médicinales et la distribution aux armées.`],a:["B"]},
    {q:`Question 3 : Le cours répertorie exactement 6 types de pratiques de la pharmacie. Quel regroupement est parfaitement exact ?`,o:[`A) Officinale, Industrielle, Hospitalière, Humanitaire, Militaire, Vétérinaire.`,`B) Officinale, Clinique, Recherche, Biologique, Commerciale, Maritime.`,`C) Grossiste, Détaillant, Biologiste, Urgentiste, Nucléaire, Rurale.`,`D) Industrielle, Administrative, Pédagogique, Cosmétique, Libérale, Urbaine.`],a:["A"]},
    {q:`Question 4 : Si un chercheur isole et extrait une nouvelle molécule thérapeutique à partir d'une plante médicinale ou d'une souche microbienne, de quelle discipline s'agit-il ?`,o:[`A) Chimie pharmaceutique analytique.`,`B) Pharmacognosie.`,`C) Cosmétologie.`,`D) Pharmacie galénique.`],a:["B"]},
    {q:`Question 5 : Au sein de la pharmacologie, quelle est la différence fondamentale entre la pharmacodynamie et la pharmacocinétique ?`,o:[`A) La pharmacodynamie étudie l'action du corps sur le médicament, la pharmacocinétique étudie l'action du médicament sur le corps.`,`B) La pharmacodynamie étudie les plantes, la pharmacocinétique étudie les molécules de synthèse.`,`C) La pharmacodynamie analyse comment le médicament agit sur le corps, la pharmacocinétique analyse comment le corps absorbe, distribue, métabolise et élimine le médicament.`,`D) La pharmacodynamie s'occupe de la conservation, la pharmacocinétique s'occupe de la toxicité.`],a:["C"]},
    {q:`Question 6 : Quelle discipline s'occupe de la conception, de la synthèse chimique, du développement et de l'analyse des molécules à visée thérapeutique ?`,o:[`A) La pharmacie galénique.`,`B) Les sciences biologiques.`,`C) La pharmacologie générale.`,`D) La chimie pharmaceutique.`],a:["D"]},
    {q:`Question 7 : Dans le domaine pharmaceutique, les sciences biologiques regroupent plusieurs spécialités pour comprendre les maladies sauf une. Laquelle ?`,o:[`A) La biologie médicale et la biochimie.`,`B) La microbiologie, l'immunologie et la virologie.`,`C) L'analyse des fluides biologiques.`,`D) La botanique systématique des sols.`],a:["D"]},
    {q:`Question 8 : Quelle est la définition exacte de la cosmétologie selon le cours ?`,o:[`A) La science qui traite uniquement du maquillage superficiel du visage.`,`B) La science qui étudie les produits cosmétiques, leur formulation, fabrication, efficacité et sécurité d'emploi pour l'hygiène et l'esthétique de la peau, des cheveux et des phanères.`,`C) La branche de la dermatologie réservée exclusivement aux chirurgiens esthétiques.`,`D) La science de la conservation des crèmes hydratantes en milieu stérile.`],a:["B"]},
    {q:`Question 9 : Un produit présenté comme capable d'établir un diagnostic médical sans guérir ni prévenir une maladie est-il légalement un médicament ?`,o:[`A) Non, car il n'a pas de propriétés curatives ou préventives directes.`,`B) Non, c'est un dispositif médical de diagnostic non assimilé.`,`C) Oui, car la définition légale inclut tout produit administré en vue d'établir un diagnostic médical ou de restaurer, corriger, modifier les fonctions organiques.`,`D) Oui, mais uniquement s'il est injecté par voie intraveineuse stricte.`],a:["C"]},
    {q:`Question 10 : Quels types de produits sont juridiquement considérés comme des « produits assimilés aux médicaments » ?`,o:[`A) Les dispositifs chirurgicaux, les pansements et les prothèses de hanche.`,`B) Les produits d'hygiène, les produits cosmétiques, les produits diététiques ou destinés à l'alimentation.`,`C) Uniquement les tisanes artisanales et les compléments à base d'ail.`,`D) Les eaux minérales naturelles et les jus de fruits enrichis en vitamines de marque.`],a:["B"]},
    {q:`Question 11 : Concernant la composition d'un médicament, quelle est la proportion habituelle du Principe Actif (PA) par rapport aux excipients ?`,o:[`A) Le PA est toujours présent en quantité strictement égale à celle de l'excipient.`,`B) Le PA est le plus souvent en très faible proportion par rapport aux excipients.`,`C) Le PA représente au moins 90% du poids total du comprimé final.`,`D) Les excipients sont toujours en proportion minoritaire pour éviter les allergies de contact.`],a:["B"]},
    {q:`Question 12 : Dans la formulation de l'EFFERALGAN, quels rôles respectifs jouent le paracétamol et le benzoate de sodium ?`,o:[`A) Le paracétamol est l'excipient, le benzoate de sodium est le principe actif.`,`B) Ce sont deux principes actifs qui agissent en synergie contre la fièvre et la douleur.`,`C) Le paracétamol est le principe actif (effet thérapeutique) et le benzoate de sodium est l'excipient.`,`D) Ce sont deux excipients destinés à stabiliser la solution effervescente.`],a:["C"]},
    {q:`Question 13 : Quelle est la contrainte chimique absolue que doit respecter un excipient vis-à-vis du Principe Actif (PA) ?`,o:[`A) Il doit se lier de manière irréversible au PA par des liaisons covalentes dures.`,`B) Il doit éviter toute interaction (particulièrement chimique) avec le PA.`,`C) Il doit modifier la structure moléculaire du PA pour le rendre plus acide dans l'estomac.`,`D) Il doit détruire le PA dès que le médicament entre en contact avec la salive.`],a:["B"]},
    {q:`Question 14 : Pour quelles raisons précises ajoute-t-on un excipient à un principe actif ?`,o:[`A) Uniquement pour augmenter artificiellement le prix de vente en officine.`,`B) Pour masquer totalement l'effet thérapeutique afin d'éviter la pharmacodépendance.`,`C) Pour conférer une consistance donnée, ou d'autres caractéristiques physiques ou gustatives particulières au produit final.`,`D) Pour remplacer le principe actif lorsque celui-ci est en rupture de stock industriel.`],a:["C"]},
    {q:`Question 15 : Quel est le trajet et le devenir exact d'un médicament administré par la voie orale (per os) ?`,o:[`A) Il passe directement dans la circulation générale depuis les parois de l'œsophage.`,`B) Il est absorbé par l'appareil digestif, transformé par le foie, puis passe dans la circulation sanguine pour agir.`,`C) Il est acheminé directement vers les poumons pour y être métabolisé en gaz.`,`D) Il est stocké dans la vésicule biliaire avant d'agir sur le système nerveux central.`],a:["B"]},
    {q:`Question 16 : Quel inconvénient majeur de la voie orale est lié directement à l'action biochimique de l'estomac ?`,o:[`A) Le risque d'inobservance du traitement dû au goût amer du produit.`,`B) Le risque d'altération ou de destruction du médicament par les sucs digestifs.`,`C) L'apparition immédiate de vertiges et de troubles de la déglutition.`,`D) L'obligation d'utiliser une technique d'injection stérile par le médecin.`],a:["B"]},
    {q:`Question 17 : Pourquoi la voie orale présente-t-elle un risque hépatique spécifique ?`,o:[`A) Parce qu'elle détruit instantanément les reins, ce qui surcharge le foie en retour.`,`B) Parce que le passage obligatoire par le foie peut entraîner un risque de dégradation de cet organe (hépatotoxicité).`,`C) Parce que le foie digère le médicament comme s'il s'agissait d'une protéine grasse.`,`D) Le cours n'indique aucun risque lié au foie pour la voie orale (per os).`],a:["B"]},
    {q:`Question 18 : Quelle est la caractéristique principale de la voie parentérale (Injections) ?`,o:[`A) C'est une voie directe qui passe obligatoirement par le gros intestin.`,`B) C'est l'administration la plus directe car elle évite le passage par le tube digestif.`,`C) Elle nécessite obligatoirement que la solution finale soit sucrée et visqueuse.`,`D) Elle est exclusivement réservée à la voie cutanée superficielle de la peau.`],a:["B"]},
    {q:`Question 19 : Selon le cours, quelle est la seule exception où le patient est autonome pour pratiquer lui-même une injection parentérale sans médecin ni infirmier ?`,o:[`A) Le patient asthmatique pour son spray inhalateur.`,`B) Le patient cardiaque pour son traitement d'urgence anti-angoreux.`,`C) Le patient diabétique pour l'injection d'insuline (voie sous-cutanée).`,`D) L'enfant souffrant de convulsions fébriles à la maison.`],a:["C"]},
    {q:`Question 20 : Pourquoi le risque de surdosage is-il plus important pour la voie parentérale que pour la voie orale ?`,o:[`A) Parce que les seringues contiennent par défaut des doses doublées.`,`B) En raison de l'arrivée directe dans le sang sans passer initialement par le foie et sans destruction par les sucs digestifs.`,`C) Parce que le patient choisit lui-même librement la quantité de liquide à injecter.`,`D) Parce que la voie parentérale ne provoque jamais d'élimination par les voies rénales.`],a:["B"]},
    {q:`Question 21 : Quel est l'avantage capital de la voie sublinguale (médicament à laisser fondre sous la langue) ?`,o:[`A) Elle permet une action lente, retardée et progressive sur plus de 24 heures.`,`B) Elle transforme instantanément le principe actif en un excipient fluide.`,`C) Elle permet une pénétration directe dans la circulation sans passer par le foie (action rapide).`,`D) Elle évite d'irriter l'émail des dents du patient.`],a:["C"]},
    {q:`Question 22 : Les formes rectales (suppositoires, lavements, pommades) ont-elles uniquement une action locale ?`,o:[`A) Oui, elles agissent exclusivement sur la muqueuse locale du rectum.`,`B) Non, elles peuvent avoir soit un effet local, soit un passage dans la circulation et un effet général.`,`C) Oui, car le sang ne circule pas dans la région anatomique rectale.`,`D) Non, elles agissent uniquement sur le cerveau par voie nerveuse directe.`],a:["B"]},
    {q:`Question 23 : Quel inconvénient physiologique majeur partagent les voies transmuqueuses (rectale, nasale, vaginale, etc.) ?`,o:[`A) Une hépatotoxicité fulgurante et systématique dès la première prise.`,`B) Une irritation ou même une ulcération de la muqueuse, et un caractère parfois jugé désagréable.`,`C) Une destruction complète des globules blancs circulants.`,`D) Une dépendance physique immédiate à l'excipient utilisé.`],a:["B"]},
    {q:`Question 24 : Comment appelle-t-on le dispositif d'administration par voie percutanée qui permet au PA de traverser lentement la peau pour un effet général prolongé ?`,o:[`A) Un collyre ophtalmique.`,`B) Une potion magistrale d'officine.`,`C) Le patch (ou dispositif transdermique).`,`D) Un aérosol ou spray pulmonaire.`],a:["C"]},
    {q:`Question 25 : Quelle est la définition exacte de la « Galénique » ou pharmacie galénique selon votre cours ?`,o:[`A) L'étude des effets toxiques des poisons sur l'organisme des animaux de laboratoire.`,`B) L'art de diagnostiquer les maladies aiguës de l'appareil digestif supérieur.`,`C) Science et art de conserver et de présenter les médicaments de la manière la plus adaptée à leur mode d'administration.`,`D) La technique d'extraction chirurgicale des tumeurs hépatiques et rénales.`],a:["C"]},
    {q:`Question 26 : La galénique doit apporter trois garanties fondamentales pour permettre l'observance d'un traitement. Quelles sont-elles ?`,o:[`A) Un coût nul, une couleur attrayante et un goût très sucré.`,`B) Un dosage précis, une stabilité satisfaisante et une utilisation simple.`,`C) Une élimination rapide, une absence totale d'excipient et une vente libre.`,`D) Une fabrication manuelle, une conservation illimitée et une enveloppe stérile.`],a:["B"]},
    {q:`Question 27 : Pourquoi est-il mentionné qu'une gélule doit TOUJOURS être avalée avec de l'eau ?`,o:[`A) Pour diluer le principe actif qui est trop concentré et trop acide.`,`B) Parce que sinon il y a un risque qu'elle se colle à l'œsophage.`,`C) Pour activer les propriétés effervescentes de sa gélatine de couverture.`,`D) Pour éviter qu'elle ne soit détruite prématurément par la salive buccale.`],a:["B"]},
    {q:`Question 28 : Quelle est la différence de conservation et de fabrication majeure entre un sirop et une potion ?`,o:[`A) Le sirop est acide alors que la potion est basique.`,`B) Le sirop est une forme solide comprimée et la potion est une forme pâteuse grasse.`,`C) Les sirops sont des préparations aqueuses sucrées visqueuses, tandis que les potions sont des préparations magistrales aqueuses sucrées à ne pas utiliser au-delà d'une semaine.`,`D) Le sirop contient des colorants artificiels alors que la potion est obtenue uniquement par décoction.`],a:["C"]},
    {q:`Question 29 : Quelle manipulation le patient ou le soignant doit-il impérativement effectuer avant l'emploi d'une suspension buvable (ex: CLAMOXYL 250 POUDRE) ?`,o:[`A) La chauffer au bain-marie pour dissoudre les graisses de surface.`,`B) La filtrer à l'aide d'une compresse stérile pour éliminer les grains de poudre.`,`C) La suspension doit toujours être agitée avant l'emploi (substance active non stable dans l'eau).`,`D) Ajouter du benzoate de sodium pur pour stabiliser le goût sucré.`],a:["C"]},
    {q:`Question 30 : Classez ces formes dermiques de la plus grasse à la moins grasse (ou non grasse) : Pommades, Gels, Crèmes.`,o:[`A) Gels (très gras) > Crèmes (moyennement grasses) > Pommades (non grasses).`,`B) Pommades (préparations grasses) > Crèmes (moins grasses) > Gels (non gras, limpides).`,`C) Crèmes > Pommades > Gels.`,`D) Toutes ces formes possèdent exactement le même taux de matières grasses en pharmacie.`],a:["B"]},
    {q:`Question 31 : Associez correctement la spécialité transmuqueuse « OTIPAX » à sa forme exacte :`,o:[`A) Solutions nasales.`,`B) Solutions auriculaires.`,`C) Collyres.`,`D) Formes pour inhaler.`],a:["B"]},
    {q:`Question 32 : Quelle est la distinction fondamentale de principe entre un médicament homéopathique et un médicament allopathique ?`,o:[`A) L'homéopathie utilise des molécules de synthèse pure, l'allopathie utilise uniquement de l'eau.`,`B) Les médicaments homéopathiques provoquent des symptômes qui peuvent donner la guérison, tandis que les allopathiques constituent le traitement habituel des maladies.`,`C) L'homéopathie est réservée aux militaires, l'allopathie est réservée aux civils en officine.`,`D) Il n'existe aucune différence légale, ce sont deux termes synonymes en industrie.`],a:["B"]},
    {q:`Question 33 : Qu'est-ce qu'une « Spécialité pharmaceutique » selon la législation de l'allopathie humaine ?`,o:[`A) Un médicament préparé pour un besoin précis du patient à l'instant T (magistral).`,`B) Tout médicament préparé à l'avance, présenté sous un conditionnement particulier et caractérisé par une dénomination spéciale.`,`C) Une solution d'alcool à 90° ou 70° préparée selon la formule officielle du codex.`,`D) Un produit cosmétique destiné exclusivement aux soins esthétiques des phanères.`],a:["B"]},
    {q:`Question 34 : Comment définit-on la D.C.I. (Dénomination Commune Internationale) par rapport à la Dénomination Commerciale ?`,o:[`A) La DCI est le nom de marque choisi par le laboratoire, la dénomination commerciale est le prix fixé.`,`B) La DCI est le nom scientifique du principe actif, alors que la Dénomination Commerciale est le nom de marque.`,`C) La DCI est un code secret réglementaire, la dénomination commerciale est le nom de l'excipient.`,`D) La DCI s'applique uniquement aux tisanes, la dénomination commerciale aux comprimés.`],a:["B"]},
    {q:`Question 35 : Qu'est-ce qu'un « Médicament princeps » et quelle est la durée exacte de la protection de son brevet ?`,o:[`A) C'est une copie économique dont le brevet dure 50 ans en industrie.`,`B) Un médicament synthétisé pour la première fois par un laboratoire, protégé par un brevet de 10 ans (exclusivité commerciale).`,`C) Un médicament officinal à base d'alcool dont le brevet est éternel et non modifiable.`,`D) Un produit homéopathique dont le brevet dure 2 ans après sa mise sur le marché.`],a:["B"]},
    {q:`Question 36 : Les autorités de santé imposent la prescription en DCI. Quels sont les deux objectifs majeurs de cette mesure ?`,o:[`A) Augmenter les taxes d'importation et ficher les patients d'officine.`,`B) Améliorer la disponibilité des médicaments et réduire le risque de prendre plusieurs médicaments portant des noms différents mais contenant un même PA.`,`C) Permettre aux médecins de cacher le nom du traitement au patient et accélérer le diagnostic.`,`D) Remplacer les pharmaciens par du personnel paramédical et supprimer les excipients.`],a:["B"]},
    {q:`Question 37 : Selon la définition du cours, à quelles posologies un effet secondaire ou indésirable se produit-il ?`,o:[`A) Uniquement lors d'une tentative de suicide par surdosage volontaire ou massif.`,`B) Exclusivement lors d'une erreur grave de délivrance par le personnel de l'officine.`,`C) Aux posologies normales (réaction nocive et non voulue).`,`D) Uniquement lorsque le traitement est administré par voie pulmonaire ou patch.`],a:["C"]},
    {q:`Question 38 : La définition élargie des effets indésirables inclut plusieurs situations sauf une. Laquelle n'en fait PAS partie ?`,o:[`A) Le mésusage, l'usage abusif, le syndrome de sevrage ou la pharmacodépendance.`,`B) L'erreur médicamenteuse, l'inefficacité thérapeutique, l'allergie aux excipients.`,`C) Un produit défectueux ou de mauvaise qualité exposé aux éléments.`,`D) Le coût élevé du médicament non remboursé par les structures d'assurances.`],a:["D"]},
    {q:`Question 39 : Un effet indésirable est classé comme « Grave » (EIG) s'il engendre au moins l'un de ces critères cliniques sauf un. Éliminez l'intrus :`,o:[`A) Le décès ou une menace pour la vie du patient au moment de l'événement.`,`B) La nécessité d'une hospitalisation ou d'une prolongation d'hospitalisation.`,`C) L'impossibilité à réaliser des gestes de la vie courante ou une anomalie congénitale.`,`D) Un simple changement bénin et temporaire de la coloration des urines du patient.`],a:["D"]},
    {q:`Question 40 : Quelles sont les trois conduites à tenir mentionnées face à l'apparition d'effets indésirables chez un patient ?`,o:[`A) Augmentation des doses, doublement du traitement, hospitalisation immédiate.`,`B) Diminution de la dose, ajustement posologique, arrêt définitif du médicament.`,`C) Remplacement par une tisane, injection d'insuline, massage cardiaque d'urgence.`,`D) Ignorer l'effet, poursuivre le traitement à l'identique, changer de marque commerciale.`],a:["B"]}
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
