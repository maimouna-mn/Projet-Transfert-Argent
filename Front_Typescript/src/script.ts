function transfert(){
    const montant = (<HTMLInputElement>document.getElementById('montant')).value;
    const expediteur = (<HTMLInputElement>document.getElementById('expediteur')).value;
    const destinataire = (<HTMLInputElement>document.getElementById('destinataire')).value;

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
        .then((result: any) => {
     
            if (result.emetteur) {
                (<HTMLInputElement>document.getElementById('expediteur_nom')).value = result.emetteur.nom;
            }

            if (result.beneficiaire) {
                (<HTMLInputElement>document.getElementById('destinataire_nom')).value = result.beneficiaire.nom;
            }
         
            if (result.message.includes('Transfert1 effectué avec succès.')) {
                const message = `Le transfert effectué par ${result.emetteur?.nom} vers ${result.beneficiaire?.nom} est un succès.`;
                notification(message);
            } else {
               
                showModal(result.codeRetrait);
            }
            
        })
        .catch(error => console.error('Erreur lors du transfert:', error));
}


function showModal(code:string) {
    const modalBody = document.querySelector(".modal-body");
    modalBody.textContent = code;

    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    modal.show();
}

const boutonValider = document.querySelector('.btn-primary');
boutonValider?.addEventListener('click', transfert);

document.getElementById('expediteur')?.addEventListener('change', () => {
    const expediteur = (<HTMLInputElement>document.getElementById('expediteur')).value;
    fetch('http://127.0.0.1:8000/api/getclient/' + expediteur)
        .then(response => response.json())
        .then((result: any) => {
            if (result.nom) {
                (<HTMLInputElement>document.getElementById('expediteur_nom')).value = result.nom;
            } else {
                (<HTMLInputElement>document.getElementById('expediteur_nom')).value = '';
            }
        })
        .catch(error => console.error('Erreur lors de la récupération du nom de l\'expéditeur:', error));
});

document.getElementById('destinataire')?.addEventListener('change', () => {
    const destinataire = (<HTMLInputElement>document.getElementById('destinataire')).value;
    fetch('http://127.0.0.1:8000/api/getclient/' + destinataire)
        .then(response => response.json())
        .then((result: any) => {
            if (result.nom) {
                (<HTMLInputElement>document.getElementById('destinataire_nom')).value = result.nom;
            } else {
                (<HTMLInputElement>document.getElementById('destinataire_nom')).value = '';
            }
        })
        .catch(error => console.error('Erreur lors de la récupération du nom du destinataire:', error));
});

let container = document.querySelector('.container')
function notification(text: string) {
    let notifi = document.createElement("div");
    notifi.textContent = text;
    notifi.classList.add("notification");
    container.appendChild(notifi);

    setTimeout(() => {
        container.removeChild(notifi);
    }, 3000);
}

const selFournisseur = document.getElementById('fournisseur')

selFournisseur.addEventListener('change', () => {
    const selectElement = document.getElementById('fournisseur') as HTMLSelectElement;
    const transactionTitles = document.querySelectorAll('.transaction-title');

    const selectedFournisseur = selectElement.value;

    transactionTitles.forEach(transactionTitle => {
        transactionTitle.classList.remove('om', 'wave', 'wari', 'cb');

        if (selectedFournisseur === 'om') {
            transactionTitle.classList.add('om');
        } else if (selectedFournisseur === 'wave') {
            transactionTitle.classList.add('wave');
        } else if (selectedFournisseur === 'wari') {
            transactionTitle.classList.add('wari');
        } else if (selectedFournisseur === 'cb') {
            transactionTitle.classList.add('cb');
        }
    });
});


const hiden = document.getElementById('hiden') as HTMLElement;
const typeTransaction = document.getElementById("type_transaction");

typeTransaction.addEventListener('change', () => {
    const selecttype = document.getElementById('type_transaction') as HTMLSelectElement
    if (selecttype.value === "retrait") {
        hiden.style.display = "none";
    } else {
        hiden.style.display = "block";

    }

})


async function fetchData(compteEmetteurId: number) {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/comptes/${compteEmetteurId}/listetransferts`);
      const data = await response.json();
  
      const infoString = `Montant: ${data[0].montant}<br>Type d'Opération: ${data[0].typeOperation}<br>Bénéficiaire:Jules Senghor`;
  
      console.log(infoString);
  
      showModal1(infoString);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  }
  
  function showModal1(info: string) {
    const modalBody = document.querySelector(".modal-body1");
    modalBody.innerHTML = info; 
  
    const modal = new bootstrap.Modal(document.getElementById("exampleModalLong"));
    modal.show();
  }
  
  const iconElement = document.querySelector('.bi-info-circle');
  iconElement?.addEventListener('click', () => {
    const compteEmetteurId = 2;
    fetchData(compteEmetteurId);
  });
  