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
    
        document.addEventListener("DOMContentLoaded", () => {
            const galleryView = document.getElementById("gallery-view");
            const addPhotoView = document.getElementById("add-photo-view");
            const openAddPhoto = document.getElementById("open-add-photo");
            const backButton = document.getElementById("back-to-gallery");
        
            // ✅ Passer à "Ajout photo"
            openAddPhoto.addEventListener("click", () => {
                galleryView.style.display = "none";
                addPhotoView.style.display = "block";
                backButton.style.display = "block"; // Affiche la flèche
            });
        
            // ✅ Revenir à "Galerie photo"
            backButton.addEventListener("click", () => {
                addPhotoView.style.display = "none";
                galleryView.style.display = "block";
                backButton.style.display = "none"; // Cache la flèche
            });
        });

        async function populateCategorySelect() {
            const selectElement = document.getElementById("photo-category");
            if (!selectElement) return;
        
            try {
                const categories = await getCategories(); // Utilise la fonction existante pour récupérer les catégories
                selectElement.innerHTML = ""; // Vide le select avant d'ajouter les options
        
                // ✅ Ajoute une option par défaut
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Sélectionnez une catégorie";
                defaultOption.disabled = true; // Empêche la sélection
                defaultOption.selected = true; // Sélectionnée par défaut
                selectElement.appendChild(defaultOption);
        
                // ✅ Ajoute les vraies catégories
                categories.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = category.name;
                    selectElement.appendChild(option);
                });
        
            } catch (error) {
                console.error("Erreur lors du chargement des catégories :", error);
            }
        }
        document.addEventListener("DOMContentLoaded", () => {
            const fileInput = document.getElementById("photo-input");
            const titleInput = document.getElementById("photo-title");
            const categoryInput = document.getElementById("photo-category");
            const submitButton = document.querySelector("#add-photo-form .add-item-button");
            const uploadPreview = document.querySelector(".upload-preview");
            
            // Désactiver le bouton au début
            submitButton.disabled = true;
            submitButton.style.backgroundColor = "grey"; 

            // Fonction pour afficher l'aperçu de l'image
        function displayImagePreview() {
            const file = fileInput.files[0];

         if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                //  Remplace l'upload-preview par l'image sélectionnée
                uploadPreview.innerHTML = `<img src="${e.target.result}" alt="Aperçu de l'image" style="max-width: 100%; max-height: 200px; border-radius: 5px;">`;
            };
            reader.readAsDataURL(file);
         } else {
            alert("Veuillez sélectionner une image au format JPG ou PNG.");
        }
    }
            // Fonction pour vérifier si tous les champs sont remplis
            function checkFormValidity() {
                if (fileInput.files.length > 0 && titleInput.value.trim() !== "" && categoryInput.value !== "") {
                    submitButton.disabled = false;
                    submitButton.style.backgroundColor = "#1D6154"; // ✅ Passe au vert
                } else {
                    submitButton.disabled = true;
                    submitButton.style.backgroundColor = "grey"; // ❌ Reste gris
                }
            }
        
         // Ajouter les écouteurs d'événements
    fileInput.addEventListener("change", () => {
        displayImagePreview();
        checkFormValidity();
    });

    titleInput.addEventListener("input", checkFormValidity);
    categoryInput.addEventListener("change", checkFormValidity);
});
        // Exécuter la fonction une fois le DOM chargé
        document.addEventListener("DOMContentLoaded", populateCategorySelect);

        document.addEventListener("DOMContentLoaded", () => {
            const addPhotoForm = document.getElementById("add-photo-form");
            const fileInput = document.getElementById("photo-input");
            const titleInput = document.getElementById("photo-title");
            const categoryInput = document.getElementById("photo-category");
        
            addPhotoForm.addEventListener("submit", async (event) => {
                event.preventDefault(); // Empêche le rechargement de la page
        
                // Récupérer les valeurs du formulaire
                const file = fileInput.files[0];
                const title = titleInput.value.trim();
                const category = categoryInput.value;
        
                // Vérifier que tous les champs sont remplis
                if (!file || !title || !category) {
                    alert("Veuillez remplir tous les champs et sélectionner une image.");
                    return;
                }
        
                // Vérifier le format et la taille du fichier
                const validFormats = ["image/jpeg", "image/png"];
                if (!validFormats.includes(file.type)) {
                    alert("Format d'image non valide. Choisissez un fichier JPG ou PNG.");
                    return;
                }
                if (file.size > 4 * 1024 * 1024) {
                    alert("L'image ne doit pas dépasser 4 Mo.");
                    return;
                }
        
                // Envoyer les données à l'API
                await sendNewProject(file, title, category);
            });
        });

        function addProjectToModal(project) {
            const figure = document.createElement("figure");
            figure.innerHTML = `<div class="image-container">
                <img src="${project.imageUrl}" alt="${project.title}">
                <figcaption>${project.title}</figcaption>
                <i class="fa-solid fa-trash-can delete-icon" data-id="${project.id}"></i>
            </div>`;
        
            document.querySelector(".gallery-modal").appendChild(figure);
        
            // Ajoute un gestionnaire d'événement pour la suppression
            const trashIcon = figure.querySelector(".delete-icon");
            trashIcon.addEventListener("click", async (event) => {
                event.stopPropagation();
                const idToDelete = event.target.dataset.id;
                await deleteWork(idToDelete);
            });
        }

        async function sendNewProject(file, title, category) {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("title", title);
            formData.append("category", category);
        
            const token = localStorage.getItem("authToken"); // Récupération du token
        
            try {
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: formData,
                });
        
                if (!response.ok) {
                    throw new Error(`Erreur serveur: ${response.status}`);
                }
        
                const newWork = await response.json();
                console.log("Projet ajouté:", newWork);
        
                // Ajouter dynamiquement le projet dans la galerie
                addProjectToGallery(newWork);
                addProjectToModal(newWork);
        
                // Fermer la modale et réinitialiser le formulaire
                closeModal(new Event("close"));
                document.getElementById("add-photo-form").reset();
                
                    // Réinitialise l'aperçu de l'image
                const uploadPreview = document.querySelector(".upload-preview");
                uploadPreview.innerHTML = `<i class="fa-regular fa-image picture-loaded"></i>
                           <span>+ Ajouter photo</span>
                           <p>jpg, png : 4mo max</p>`;

                // Réinitialise la catégorie à l'option par défaut
                document.getElementById("photo-category").selectedIndex = 0;

                // Désactiver le bouton valider après réinitialisation
                const submitButton = document.querySelector("#add-photo-form .add-item-button");
                submitButton.disabled = true;
                submitButton.style.backgroundColor = "grey";
        
            } catch (error) {
                console.error("Erreur:", error);
                alert("Une erreur est survenue lors de l'ajout du projet.");
            }
        }