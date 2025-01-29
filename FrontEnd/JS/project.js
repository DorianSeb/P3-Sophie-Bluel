async function getWorks() {
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
    return []
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

    const imgContainer = document.createElement("div"); // Conteneur image + icône
    imgContainer.classList.add("image-container");

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = item.title;

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
      figure.appendChild(img);
    }

    figure.appendChild(figcaption);
    galleryContainer.appendChild(figure);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
items = await getWorks();
displayGallery(items,  ".gallery");
displayGallery(items,  ".gallery-modal");
});