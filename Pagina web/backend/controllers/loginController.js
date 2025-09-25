// login.controller.js

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Evita que se recargue la página

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!email || !password) {
                showLoginError("Completa todos los campos");
                return;
            }

            // Preparar los datos para enviar al LoginServlet
            const formData = new URLSearchParams();
            formData.append("email", email);
            formData.append("password", password);

            // Enviar petición POST al LoginServlet
            fetch("LoginServlet", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData.toString()
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Guardar información en sessionStorage (puedes cambiar a localStorage si deseas mantener sesión)
                    sessionStorage.setItem("user", JSON.stringify(data.user));

                    // Redirigir al dashboard o página principal
                    window.location.href = "index.html";
                } else {
                    showLoginError(data.message || "Credenciales incorrectas");
                }
            })
            .catch(error => {
                console.error("Error al iniciar sesión:", error);
                showLoginError("Error en el servidor. Intenta más tarde.");
            });
        });
    }
});

function showLoginError(message) {
    let errorBox = document.getElementById("login-error.html");

    if (!errorBox) {
        errorBox = document.createElement("div");
        errorBox.id = "login-error.html";
        errorBox.style.cssText = `
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            padding: 10px;
            margin-top: 15px;
            border-radius: 6px;
            text-align: center;
        `;
        const formContent = document.querySelector(".form-content");
        formContent.appendChild(errorBox);
    }

    errorBox.textContent = message;
}
