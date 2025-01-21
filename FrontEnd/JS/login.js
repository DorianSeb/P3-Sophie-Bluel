document.addEventListener("DOMContentLoaded", () => {
    // 1) Sélection du formulaire
    const form = document.querySelector("#loginform");
  
    // 2) Écoute l’événement submit
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Empêche le rechargement auto du formulaire
  
      // 3) Récupère les valeurs
      const emailValue = document.querySelector("#email").value.trim();
      const passwordValue = document.querySelector("#password").value.trim();
  
      // Facile de vérifier en console
      console.log("Email:", emailValue);
      console.log("Password:", passwordValue);
  
      // 4) Faire un try/catch pour fetch
      try {
        // 5) Requête POST vers l’API
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            email: emailValue, 
            password: passwordValue 
          })
        });
  
        // 6) Convertir la réponse en JSON
        const data = await response.json();
  
        // 6 bis) Vérifier le statut HTTP
        if (!response.ok) {
          // Mauvais identifiants ou autre erreur
          throw new Error(data.message || "Identifiants incorrects");
        }
  
        // 7) Stocker le token et rediriger
        if (!data.token) {
          throw new Error("Token manquant dans la réponse");
        }
        localStorage.setItem("authToken", data.token);
  
        window.location.href = "index.html";
        
      } catch (error) {
        console.error(error);
        alert(error.message || "Une erreur inconnue est survenue."); // Affiche une popup en cas d'erreur
      }
    });
  });

