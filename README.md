# 🌸 MAKI Boutique

MAKI Boutique es una tienda en línea interactiva y premium de moda, diseñada con una estética minimalista en tonos crema y rosa. La plataforma está optimizada para dispositivos móviles y cuenta con una base de datos MySQL en la nube (Aiven), un panel de administración integrado y checkout automático vía WhatsApp.

## ✨ Características Principales

*   **Diseño Premium y Responsivo:** Diseñado meticulosamente con tipografía elegante (*Outfit* y *Playfair Display*), animaciones fluidas y un diseño adaptado para smartphones, tablets y computadoras.
*   **Gestión Dinámica de Productos:** Los productos se cargan dinámicamente desde una base de datos MySQL en la nube (Aiven).
*   **Panel de Administración Aislado:** Panel en un servicio/carpeta separado para cargar y eliminar productos del catálogo en tiempo real con una vista previa de la tarjeta interactiva antes de guardarla.
*   **Carrito de Compras y Favoritos:** Sistema interactivo de carrito lateral (Drawer) y lista de deseos persistente en `localStorage`.
*   **Checkout por WhatsApp:** Al finalizar la compra, el cliente es redirigido a WhatsApp con un mensaje pre-formateado y detallado de su pedido (tallas, colores, precios, envío y total) directo al número de contacto de la boutique.
*   **Botón Flotante de WhatsApp:** Acceso rápido para atención al cliente personalizada con animación de pulso.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** HTML5, CSS3 clásico (diseño responsivo y variables CSS), JavaScript Moderno (Vanilla ES6) e iconos vectoriales de Lucide.
*   **Backend:** Node.js, Express framework, CORS, y `dotenv` para credenciales seguras.
*   **Base de Datos:** MySQL alojada en la nube con **Aiven** (conexión segura mediante SSL).

---

## 🚀 Cómo Empezar

El proyecto está dividido en tres componentes principales para facilitar su mantenimiento y despliegue independiente:

1.  **Tienda Pública (`/frontend/shop`):** Proyecto de Vercel para el catálogo principal que verán los compradores.
2.  **Panel de Administración (`/frontend/admin`):** Proyecto de Vercel independiente y seguro para la gestión del catálogo.
3.  **Backend (`/backend`):** Proyecto de Render que aloja la API REST de Node.js.

### 📝 Guía de Despliegue
Para ver los pasos detallados para subir el servidor API a la nube (ej. Render) y las páginas de Vercel para la tienda y administración de forma independiente, consulta nuestra **[Guía de Despliegue (DESPLIEGUE.md)](file:///c:/Users/josue/OneDrive/Escritorio/JOSUE-PROYECTOS/MAKI/DESPLIEGUE.md)**.
