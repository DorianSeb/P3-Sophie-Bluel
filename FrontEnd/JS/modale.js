let modal = null
const focusableSelector = 'button, a, input, textarea'
let focusables = []

const openModal = function(e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    focusables[0].focus();
    modal.style.display = null //Pour retirer le display none
    modal.removeAttribute('aria-hidden'); //Pour retirer l'attribut aria-hidden
    modal.setAttribute('aria-modal', 'true'); //Pour ajouter l'attribut aria-modal
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    
}

const closeModal = function(e) {
    if (modal === null) return
        e.preventDefault();
        modal.style.display = "none";
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');
        modal.removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
        modal = null;
    }

const stopPropagation = function(e) {
    e.stopPropagation(); //Pour éviter que le click ne se propage
}
const focusInModal = function(e) {
    e.preventDefault();
     let index = focusables.findIndex(modal.querySelector(':focus'));
     if (e.shiftKey === true) {
         index--
     } else {
     index++
     }
     if (index >= focusables.length) {
         index = 0;
     }
     if (index < 0) {
         index = focusables.length - 1;
     }
     focusables[index].focus();
};

document.querySelectorAll('.js-modal').forEach((a) => {
    a.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du lien
        openModal(e); // Appelle la fonction openModal pour ouvrir la modale
    });
});
    window.addEventListener('keydown', function(e) {
        if (e.key === "Escape" || e.key === "Esc") {
            closeModal(e);
        }
            if (e.key === "Tab" && modal !== null) {
                focusInModal(e);
            }
        });

   