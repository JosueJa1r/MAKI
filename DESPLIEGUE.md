# 🚀 Guía de Despliegue - MAKI Boutique (Servicios Separados)

Este proyecto está dividido en **tres componentes independientes** para un despliegue seguro y escalable:
1.  **Tienda Pública (Clientes):** Ubicada en `frontend/shop/`.
2.  **Panel de Administración (Privado):** Ubicado en `frontend/admin/`.
3.  **Servidor API (Backend):** Ubicado en `backend/` (conectado a Aiven MySQL).

---

## 📂 Nueva Estructura del Proyecto

```text
MAKI/
├── frontend/
│   ├── shop/             # 🛒 Proyecto 1 en Vercel (Tienda)
│   │   ├── index.html    # Portada y catálogo
│   │   ├── script.js     # Lógica del cliente
│   │   ├── style.css     # Estilos visuales
│   │   └── assets/       # Imágenes de prendas y logo
│   │
│   └── admin/            # 🔐 Proyecto 2 en Vercel (Panel Admin)
│       ├── index.html    # Panel de carga (renombrado de admin.html)
│       ├── style.css     # Copia de estilos
│       └── assets/       # Copia de logo
│
└── backend/              # ⚙️ Proyecto en Render (API Node.js)
    ├── server.js         # API Express
    ├── package.json
    └── .env              # Configuración local de Aiven MySQL
```

---

## 1. 🖥️ Despliegue de la Tienda en Vercel (frontend/shop)

Este servicio mostrará la tienda pública para los compradores.

1.  Inicia sesión en [vercel.com](https://vercel.com) con tu cuenta de GitHub.
2.  Crea un nuevo proyecto (**Add New** -> **Project**).
3.  Importa el repositorio del proyecto.
4.  En la configuración del proyecto:
    *   **Project Name:** `maki-boutique` (o el nombre que prefieras).
    *   **Root Directory (Directorio Raíz):** Haz clic en *Edit* y selecciona **`frontend/shop`**.
    *   **Framework Preset:** `Other`.
    *   **Build Command:** Déjalo vacío.
    *   **Output Directory:** Déjalo por defecto (vacío).
5.  Haz clic en **Deploy**. 
    *   *URL Resultante ejemplo:* `https://maki-boutique.vercel.app`

---

## 2. 🔐 Despliegue del Panel de Administración en Vercel (frontend/admin)

Este servicio estará en un enlace completamente separado para que los compradores no puedan adivinar la ruta ni ver el formulario de carga.

1.  En Vercel, crea otro proyecto independiente (**Add New** -> **Project**).
2.  Importa el **mismo repositorio** de GitHub.
3.  En la configuración:
    *   **Project Name:** `maki-admin` (o un nombre secreto).
    *   **Root Directory (Directorio Raíz):** Haz clic en *Edit* y selecciona **`frontend/admin`**.
    *   **Framework Preset:** `Other`.
    *   **Build & Development Settings:** Déjalos vacíos.
4.  Haz clic en **Deploy**.
    *   *URL Resultante ejemplo:* `https://maki-admin.vercel.app`

> [!NOTE]
> Cuando el administrador haga clic en **"Volver a la Tienda"** en la página de administración, el sitio detectará automáticamente que está en producción y lo redirigirá a la URL oficial de la tienda (`https://maki-boutique.vercel.app`). Puedes cambiar este enlace en la línea 431 de [frontend/admin/index.html](file:///c:/Users/josue/OneDrive/Escritorio/JOSUE-PROYECTOS/MAKI/frontend/admin/index.html).

---

## 3. ⚙️ Despliegue del Backend en Render (backend)

1.  Inicia sesión en [render.com](https://render.com) e importa tu repositorio.
2.  Crea un nuevo **Web Service**.
3.  En la configuración de Render:
    *   **Root Directory:** `backend`
    *   **Runtime:** `Node`
    *   **Build Command:** `npm install`
    *   **Start Command:** `node server.js`
4.  Ve a la pestaña **Environment** y agrega tus variables de entorno para Aiven MySQL:
    *   `DB_HOST` = *(Tu host de Aiven)*
    *   `DB_PORT` = `10000` *(Puerto)*
    *   `DB_USER` = `avnadmin`
    *   `DB_PASSWORD` = *(Tu contraseña de Aiven)*
    *   `DB_NAME` = `defaultdb`

---

## 🧪 Pruebas Locales del Entorno Dividido

Puedes correr y probar ambos proyectos locales simulando el comportamiento de Vercel:

1.  **Arrancar Backend (Puerto 3000):**
    ```bash
    cd backend
    node server.js
    ```
2.  **Arrancar Tienda (Puerto 8000):**
    ```bash
    cd frontend/shop
    python -m http.server 8000
    ```
3.  **Arrancar Admin (Puerto 8080):**
    ```bash
    cd frontend/admin
    python -m http.server 8080
    ```

*   Abre la tienda en `http://localhost:8000`.
*   Abre el administrador en `http://localhost:8080`.
*   Carga un producto desde `http://localhost:8080` y comprueba que se actualiza instantáneamente en el catálogo de `http://localhost:8000`.
