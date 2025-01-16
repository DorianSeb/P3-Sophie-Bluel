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

function displayGallery(items) {
  const galleryContainer = document.querySelector(".gallery");
  galleryContainer.innerHTML = "";

//creation boucle, voir diff avec le tuto
  items.forEach(item => {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    img.src = item.imageUrl; //il recupere comment l'image?
    img.alt = item.title;
    const figcaption = document.createElement("figcaption"); //légende image
    figcaption.textContent = item.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    galleryContainer.appendChild(figure);
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  items = await getWorks();
  displayGallery(items);
});

