document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM chargé.");
  const form = document.querySelector("#loginform");
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Formulaire soumis.");

    const emailValue = document.querySelector("#email").value.trim();
    const passwordValue = document.querySelector("#password").value.trim();
    console.log("Email :", emailValue, "Password :", passwordValue);

    try {
      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue, password: passwordValue }),
      });
      console.log("Réponse de l'API :", response);

      const data = await response.json();
      console.log("Données reçues :", data);

      if (!response.ok) {
        throw new Error(data.message || "Identifiants incorrects");
      }

      if (!data.token) {
        throw new Error("Token manquant dans la réponse");
      }

      localStorage.setItem("authToken", data.token);
      console.log("Redirection vers index.html...");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Erreur :", error.message);
      alert(error.message || "Une erreur inconnue est survenue.");
    }
  });
});