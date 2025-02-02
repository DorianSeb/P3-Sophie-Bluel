console.log("Chargement du fichier project.js");

async function getWorks() {
  console.log("Récupération des projets...");
  const url = "http://localhost:5678/api/works";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
    return json;
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

function displayGallery(items, containerSelector) {
  const galleryContainer = document.querySelector(containerSelector);
  if (!galleryContainer) {
    console.error(`Erreur : Impossible de trouver ${containerSelector}`);
    return;
  }

  galleryContainer.innerHTML = "";

  items.forEach(item => {
    const figure = document.createElement("figure");
    figure.classList.add("gallery-item");
    figure.dataset.id = item.id; // ✅ Ajoute l'ID pour la suppression dynamique

    const imgContainer = document.createElement("div"); // Conteneur image + icône
    imgContainer.classList.add("image-container");

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;

    // ✅ Ajoute l'icône poubelle seulement dans la galerie modale
    if (containerSelector === ".gallery-modal") {
      const trashIcon = document.createElement("i");
      trashIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");
      trashIcon.dataset.id = item.id;

      // Événement pour supprimer l'image
      trashIcon.addEventListener("click", async (event) => {
        event.stopPropagation();
        const idToDelete = event.target.dataset.id;
        await deleteWork(idToDelete);
      });

      imgContainer.appendChild(img); // Ajoute l'image dans le conteneur
      imgContainer.appendChild(trashIcon); // Ajoute la poubelle SUR l'image
      figure.appendChild(imgContainer); // Ajoute tout à la figure
    } else {
      // Si ce n'est PAS la galerie modale, on ajoute la légende en bas
      const contentContainer = document.createElement("div"); // Nouveau conteneur pour organiser
      contentContainer.classList.add("content-container");

      contentContainer.appendChild(img); // Ajoute l'image en haut
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = item.title;
      contentContainer.appendChild(figcaption); // Ajoute la légende en bas

      figure.appendChild(contentContainer); // Ajoute le conteneur dans la figure
    }

    galleryContainer.appendChild(figure);
  });
}

async function deleteWork(id) {
  const token = localStorage.getItem("authToken"); // Vérifie si l'utilisateur est connecté
  if (!token) {
      console.error("Utilisateur non authentifié");
      return;
  }

  const confirmDelete = confirm("Voulez-vous vraiment supprimer ce projet ?");
  if (!confirmDelete) return;

  try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });

      if (response.ok) {
          console.log(`Travail avec l'ID ${id} supprimé avec succès.`);
          removeWorkFromDOM(id); // ✅ Supprime immédiatement après suppression
      } else {
          console.error("Erreur lors de la suppression :", response.status);
      }
  } catch (error) {
      console.error("Erreur :", error);
  }
}

function removeWorkFromDOM(id) {
  // ✅ Supprime l'élément de la galerie modale
  const workElementModal = document.querySelector(`.gallery-modal figure[data-id="${id}"]`);
  if (workElementModal) {
      workElementModal.remove();
  }

  // ✅ Supprime l'élément de la galerie principale
  const workElementGallery = document.querySelector(`.gallery figure[data-id="${id}"]`);
  if (workElementGallery) {
      workElementGallery.remove();
  }

  console.log(`Élément avec l'ID ${id} retiré du DOM.`);
}

document.addEventListener("DOMContentLoaded", async () => {
  const items = await getWorks();
  displayGallery(items, ".gallery");
  displayGallery(items, ".gallery-modal");
  console.log("Galerie affichée.", items);
});

function addProjectToGallery(project) {
  const gallery = document.querySelector(".gallery");

  const figure = document.createElement("figure");
  figure.classList.add("gallery-item");
  figure.dataset.id = project.id; // ✅ Ajoute l'ID pour la suppression dynamique

  const img = document.createElement("img");
  img.src = project.imageUrl;
  img.alt = project.title;
  img.dataset.id = project.id; // ✅ Ajoute aussi l'ID à l'image

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = project.title;

  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}