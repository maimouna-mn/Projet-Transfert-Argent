var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b;
function transfert() {
    const montant = document.getElementById('montant').value;
    const expediteur = document.getElementById('expediteur').value;
    const destinataire = document.getElementById('destinataire').value;
    const data = {
        montant: montant,
        numero_emetteur: expediteur,
        numero_beneficiaire: destinataire,
    };
    fetch('http://127.0.0.1:8000/api/transferts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then((result) => {
        var _a, _b;
        if (result.emetteur) {
            document.getElementById('expediteur_nom').value = result.emetteur.nom;
        }
        if (result.beneficiaire) {
            document.getElementById('destinataire_nom').value = result.beneficiaire.nom;
        }
        if (result.message.includes('Transfert1 effectué avec succès.')) {
            const message = `Le transfert effectué par ${(_a = result.emetteur) === null || _a === void 0 ? void 0 : _a.nom} vers ${(_b = result.beneficiaire) === null || _b === void 0 ? void 0 : _b.nom} est un succès.`;
            notification(message);
        }
        else {
            showModal(result.codeRetrait);
        }
    })
        .catch(error => console.error('Erreur lors du transfert:', error));
}
function showModal(code) {
    const modalBody = document.querySelector(".modal-body");
    modalBody.textContent = code;
    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show();
}
const boutonValider = document.querySelector('.btn-primary');
boutonValider === null || boutonValider === void 0 ? void 0 : boutonValider.addEventListener('click', transfert);
(_a = document.getElementById('expediteur')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => {
    const expediteur = document.getElementById('expediteur').value;
    fetch('http://127.0.0.1:8000/api/getclient/' + expediteur)
        .then(response => response.json())
        .then((result) => {
        if (result.nom) {
            document.getElementById('expediteur_nom').value = result.nom;
        }
        else {
            document.getElementById('expediteur_nom').value = '';
        }
    })
        .catch(error => console.error('Erreur lors de la récupération du nom de l\'expéditeur:', error));
});
(_b = document.getElementById('destinataire')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', () => {
    const destinataire = document.getElementById('destinataire').value;
    fetch('http://127.0.0.1:8000/api/getclient/' + destinataire)
        .then(response => response.json())
        .then((result) => {
        if (result.nom) {
            document.getElementById('destinataire_nom').value = result.nom;
        }
        else {
            document.getElementById('destinataire_nom').value = '';
        }
    })
        .catch(error => console.error('Erreur lors de la récupération du nom du destinataire:', error));
});
let container = document.querySelector('.container');
function notification(text) {
    let notifi = document.createElement("div");
    notifi.textContent = text;
    notifi.classList.add("notification");
    container.appendChild(notifi);
    setTimeout(() => {
        container.removeChild(notifi);
    }, 3000);
}
const selFournisseur = document.getElementById('fournisseur');
selFournisseur.addEventListener('change', () => {
    const selectElement = document.getElementById('fournisseur');
    const transactionTitles = document.querySelectorAll('.transaction-title');
    const selectedFournisseur = selectElement.value;
    transactionTitles.forEach(transactionTitle => {
        transactionTitle.classList.remove('om', 'wave', 'wari', 'cb');
        if (selectedFournisseur === 'om') {
            transactionTitle.classList.add('om');
        }
        else if (selectedFournisseur === 'wave') {
            transactionTitle.classList.add('wave');
        }
        else if (selectedFournisseur === 'wari') {
            transactionTitle.classList.add('wari');
        }
        else if (selectedFournisseur === 'cb') {
            transactionTitle.classList.add('cb');
        }
    });
});
const hiden = document.getElementById('hiden');
const typeTransaction = document.getElementById("type_transaction");
typeTransaction.addEventListener('change', () => {
    const selecttype = document.getElementById('type_transaction');
    if (selecttype.value === "retrait") {
        hiden.style.display = "none";
    }
    else {
        hiden.style.display = "block";
    }
});
function fetchData(compteEmetteurId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://127.0.0.1:8000/api/comptes/${compteEmetteurId}/listetransferts`);
            const data = yield response.json();
            const infoString = `Montant: ${data[0].montant}<br>Type d'Opération: ${data[0].typeOperation}<br>Bénéficiaire:Jules Senghor`;
            console.log(infoString);
            showModal1(infoString);
        }
        catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    });
}
function showModal1(info) {
    const modalBody = document.querySelector(".modal-body1");
    modalBody.innerHTML = info;
    const modal = new bootstrap.Modal(document.getElementById("exampleModalLong"));
    modal.show();
}
const iconElement = document.querySelector('.bi-info-circle');
iconElement === null || iconElement === void 0 ? void 0 : iconElement.addEventListener('click', () => {
    const compteEmetteurId = 2;
    fetchData(compteEmetteurId);
});
