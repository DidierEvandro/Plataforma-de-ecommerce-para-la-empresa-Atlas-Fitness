package com.apiweb.aresfitnes.Controller;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

@WebServlet("/LoginServlet")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
        throws ServletException, IOException {

        String email = request.getParameter("email");
        String password = request.getParameter("password");

        // Simulación de login válido
        if ("admin@ares.com".equals(email) && "123456".equals(password)) {
            // Guardar sesión
            HttpSession session = request.getSession();
            session.setAttribute("userEmail", email);

            // Redirigir al home o dashboard
            response.sendRedirect("dashboard.html");
        } else {
            // Redirigir al login con error
            response.sendRedirect("login.html?error=true");
        }
    }
}
