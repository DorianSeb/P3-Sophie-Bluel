document.addEventListener("DOMContentLoaded", () => {
    console.log("Chargement de la page index.");

    // Récupération du token
    const authToken = localStorage.getItem("authToken");
    console.log("Token trouvé :", authToken);

    // Gestion de la barre de mode édition
    const editModeBar = document.querySelector(".editmodebar");
    if (editModeBar) {
        if (authToken) {
            console.log("Mode édition activé.");
            editModeBar.classList.remove("hiddenbar");
        } else {
            console.log("Pas de token, mode édition désactivé.");
            editModeBar.classList.add("hiddenbar");
        }
    } else {
        console.error("Élément .editmodebar introuvable !");
    }

    // Gestion du lien login/logout
    const loginLink = document.querySelector('a[href="login.html"]');
    if (loginLink) {
        if (authToken) {
            console.log("Utilisateur connecté, transformation du lien en logout.");
            loginLink.textContent = "logout";
            loginLink.href = "#";

            //se déconnecter
            loginLink.addEventListener("click", () => {
                console.log("Déconnexion...");
                localStorage.removeItem("authToken"); // Suppression du token
                window.location.reload(); // Recharge la page
            });
        } else {
            console.log("Utilisateur non connecté, affichage du lien login.");
            loginLink.textContent = "login";
            loginLink.href = "login.html";
        }
    } else {
        console.error("Lien login introuvable dans la navigation !");
    }
});