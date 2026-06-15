# 🚀 Guía de Despliegue - MAKI Boutique (Infraestructura 100% Vercel)

Este proyecto está dividido en **tres componentes independientes** para un despliegue seguro, escalable y 100% gratuito en **Vercel**:
1.  **Tienda Pública (Clientes):** Ubicada en `frontend/shop/`.
2.  **Panel de Administración (Privado):** Ubicado en `frontend/admin/`.
3.  **Servidor API (Backend/Serverless):** Ubicado en `backend/` (conectado a Aiven MySQL).

---

## 📂 Estructura del Proyecto

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
└── backend/              # ⚙️ Proyecto 3 en Vercel (API Serverless)
    ├── server.js         # Código del servidor (Express adaptable a Serverless)
    ├── vercel.json       # Configuración para que Vercel ejecute Express
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

## 3. ⚙️ Despliegue del Backend en Vercel (backend)

Vercel ejecutará tu servidor API Express como una **Serverless Function** automáticamente gracias al archivo `vercel.json` configurado en el proyecto.

1.  En Vercel, crea un **tercer proyecto** independiente (**Add New** -> **Project**).
2.  Importa el **mismo repositorio** de GitHub.
3.  En la configuración:
    *   **Project Name:** `maki-api` (este nombre definirá la URL de tu API).
    *   **Root Directory (Directorio Raíz):** Haz clic en *Edit* y selecciona **`backend`**.
    *   **Framework Preset:** `Other`.
    *   **Build & Development Settings:** Déjalos vacíos.
4.  **Configurar Variables de Entorno (Environment Variables):**
    Antes de desplegar, ve a la pestaña **Settings -> Environment Variables** de este tercer proyecto en Vercel y agrega tus credenciales de Aiven MySQL:
    *   `DB_HOST` = *(Tu host de Aiven)*
    *   `DB_PORT` = `10000` *(Puerto)*
    *   `DB_USER` = `avnadmin`
    *   `DB_PASSWORD` = *(Tu contraseña de Aiven)*
    *   `DB_NAME` = `defaultdb`
5.  Haz clic en **Deploy**.
    *   *URL Resultante ejemplo:* `https://maki-api.vercel.app`

> [!IMPORTANT]
> Una vez desplegado tu backend, copia la URL que te dio Vercel (ej: `https://maki-api.vercel.app`) y reemplázala en la línea 87 de [frontend/shop/script.js](file:///c:/Users/josue/OneDrive/Escritorio/JOSUE-PROYECTOS/MAKI/frontend/shop/script.js) y la línea 408 de [frontend/admin/index.html](file:///c:/Users/josue/OneDrive/Escritorio/JOSUE-PROYECTOS/MAKI/frontend/admin/index.html) para que se comuniquen con la API en la nube.

---

## 🧪 Pruebas Locales del Entorno Dividido

Puedes correr y probar ambos proyectos locales simulando el comportamiento de Vercel:

1.  **Arrancar Backend (Puerto 5000):**
    ```bash
    cd backend
    node server.js
    ```
2.  **Arrancar Tienda (Puerto 8001):**
    ```bash
    cd frontend/shop
    python -m http.server 8001
    ```
3.  **Arrancar Admin (Puerto 8002):**
    ```bash
    cd frontend/admin
    python -m http.server 8002
    ```

*   Abre la tienda en `http://localhost:8001`.
*   Abre el administrador en `http://localhost:8002`.
*   Carga un producto desde `http://localhost:8002` y comprueba que se actualiza instantáneamente en el catálogo de `http://localhost:8001`.
