async function getCategories() {
  const url = "http://localhost:5678/api/categories";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const categories = await response.json();
    console.log(categories);
    return categories;
  } catch (error) {
    console.error(error.message);
    return []
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const categoriesFilters = document.querySelector("#portfolio");
  const categoriesButtons = document.createElement("div");
  categoriesButtons.classList.add("filters");

  // Placer la div.filters juste au-dessus de la galerie
  const galleryContainer = categoriesFilters.querySelector(".gallery");
  categoriesFilters.insertBefore(categoriesButtons, galleryContainer);

  // Ajouter le bouton "Tous"
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  categoriesButtons.appendChild(allButton);
  allButton.addEventListener("click", () => {
      displayGallery(items, ".gallery"); // Affiche tous les éléments
  });

  // Récupérer les catégories et supprimer les doublons avec Set
  const categories = await getCategories();
  const uniqueCategories = Array.from(
      new Set(categories.map(category => JSON.stringify(category)))
  ).map(category => JSON.parse(category));

  // Ajouter un bouton pour chaque catégorie unique
  uniqueCategories.forEach(category => {
      const button = document.createElement("button");
      button.textContent = category.name; // Texte du bouton
      categoriesButtons.appendChild(button); // Ajoute chaque bouton à la div.filters

      button.addEventListener("click", () => {
          const filteredGallery = items.filter(item => item.categoryId === category.id);
          displayGallery(filteredGallery, ".gallery"); // Affiche les éléments filtrés
      });
  });
});