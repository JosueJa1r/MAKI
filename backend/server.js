const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Credenciales y Token de sesión de Administración (Configurables en el archivo .env)
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'maki123';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'maki_secure_session_token_default_2026';

// Middleware de autenticación para proteger rutas de escritura/modificación
function requireAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso no autorizado. Falta el token de autenticación.' });
    }
    
    const token = authHeader.split(' ')[1]; // Formato: Bearer <token>
    if (token !== ADMIN_TOKEN) {
        return res.status(401).json({ error: 'Sesión expirada o no autorizada. Por favor vuelve a iniciar sesión.' });
    }
    
    next();
}

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Database connection parameters
const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false // Aiven requiere SSL y esta opción es necesaria en clientes Node.js
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

// Inicializar conexión
try {
    pool = mysql.createPool(dbConfig);
    console.log('⚡ Conexión a la base de datos configurada.');
} catch (error) {
    console.error('❌ Error al inicializar el pool de base de datos:', error.message);
}

// Inicialización de la Tabla
async function initializeDB() {
    // Verificar si las credenciales son de ejemplo
    if (!process.env.DB_HOST || process.env.DB_PASSWORD === 'tu_contrasena_de_aiven') {
        console.warn('\n⚠️ [MAKI WARNING] No has configurado tus credenciales reales de Aiven en el archivo .env.');
        console.warn('Por favor abre el archivo .env, ingresa tus credenciales de Aiven y reinicia el servidor.\n');
        return;
    }

    try {
        const connection = await pool.getConnection();
        console.log('✓ Conexión establecida con la base de datos de Aiven.');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(100) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                old_price DECIMAL(10, 2) DEFAULT NULL,
                image LONGTEXT NOT NULL,
                description TEXT,
                sizes VARCHAR(100) DEFAULT 'M',
                colors VARCHAR(255) DEFAULT NULL,
                badge VARCHAR(100) DEFAULT NULL,
                is_best_seller BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
        
        // Asegurar que la columna 'image' sea LONGTEXT por si la tabla ya existía con VARCHAR(500)
        try {
            await connection.query(`ALTER TABLE products MODIFY COLUMN image LONGTEXT NOT NULL;`);
            console.log('✓ Tipo de columna "image" verificado y actualizado a LONGTEXT.');
        } catch (alterErr) {
            console.warn('⚠️ No se pudo alterar la columna "image" (puede que ya fuera LONGTEXT):', alterErr.message);
        }
        console.log('✓ Tabla "products" verificada y lista para operar.');
        connection.release();
    } catch (err) {
        console.error('\n❌ [ERROR DE CONEXIÓN] No se pudo conectar a la base de datos de Aiven.');
        console.error('Mensaje:', err.message);
        console.error('Asegúrate de que tus credenciales de Aiven en .env son correctas y que tu IP tiene acceso permitido en la consola de Aiven.\n');
    }
}

// ==========================================================================
// API ENDPOINTS
// ==========================================================================

// POST: Login de Administración
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
    }
    
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
        res.json({ 
            success: true, 
            message: '¡Sesión iniciada con éxito!',
            token: ADMIN_TOKEN 
        });
    } else {
        res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }
});

// GET: Obtener todos los productos
app.get('/api/products', async (req, res) => {
    // Si no está conectada la BD, responder con un mensaje informativo
    if (!pool || !process.env.DB_HOST || process.env.DB_PASSWORD === 'tu_contrasena_de_aiven') {
        return res.status(200).json([
            {
                id: 1,
                name: "Vestido Floral Primavera (Sin Conexión)",
                category: "Vestidos",
                price: 89.99,
                image: "assets/images/pink_floral_dress.png",
                description: "Voz de alerta: Configura tus credenciales en el archivo .env de la base de datos de Aiven para cargar datos de la base de datos real.",
                sizes: ["S", "M"],
                colors: ["#ffd3e0"],
                badge: "Demo",
                is_best_seller: true
            }
        ]);
    }

    try {
        const [rows] = await pool.query('SELECT * FROM products ORDER BY id DESC');
        
        // Formatear campos para que coincidan con la estructura del frontend
        const formattedProducts = rows.map(row => ({
            id: row.id,
            name: row.name,
            category: row.category,
            price: parseFloat(row.price),
            oldPrice: row.old_price ? parseFloat(row.old_price) : null,
            image: row.image,
            description: row.description,
            sizes: row.sizes ? row.sizes.split(',').map(s => s.trim()) : ["M"],
            colors: row.colors ? row.colors.split(',').map(c => c.trim()) : [],
            badge: row.badge,
            isBestSeller: !!row.is_best_seller
        }));

        res.json(formattedProducts);
    } catch (err) {
        console.error('Error en GET /api/products:', err.message);
        res.status(500).json({ error: 'Error al recuperar los productos de la base de datos.' });
    }
});

// POST: Crear un nuevo producto (Protegida)
app.post('/api/products', requireAuth, async (req, res) => {
    const { name, category, price, oldPrice, image, description, sizes, colors, badge, isBestSeller } = req.body;

    if (!name || !category || !price || !image) {
        return res.status(400).json({ error: 'Faltan campos obligatorios: name, category, price o image.' });
    }

    try {
        const sql = `
            INSERT INTO products (name, category, price, old_price, image, description, sizes, colors, badge, is_best_seller)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        // Convertir arrays a strings separados por comas para guardar en la base de datos
        const sizesStr = Array.isArray(sizes) ? sizes.join(', ') : sizes || 'M';
        const colorsStr = Array.isArray(colors) ? colors.join(', ') : colors || '';

        const [result] = await pool.query(sql, [
            name,
            category,
            parseFloat(price),
            oldPrice ? parseFloat(oldPrice) : null,
            image,
            description || '',
            sizesStr,
            colorsStr,
            badge || null,
            isBestSeller ? 1 : 0
        ]);

        res.status(201).json({ 
            success: true, 
            message: '¡Prenda guardada con éxito!', 
            productId: result.insertId 
        });
    } catch (err) {
        console.error('Error en POST /api/products:', err.message);
        res.status(500).json({ error: 'Error al insertar el producto en la base de datos: ' + err.message });
    }
});

// DELETE: Eliminar una prenda por ID (Protegida)
app.delete('/api/products/:id', requireAuth, async (req, res) => {
    const { id } = req.params;
    
    if (!id) {
        return res.status(400).json({ error: 'Falta especificar el ID de la prenda.' });
    }
    
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Prenda no encontrada.' });
        }
        
        res.json({ success: true, message: '¡Prenda eliminada con éxito!' });
    } catch (err) {
        console.error('Error en DELETE /api/products:', err.message);
        res.status(500).json({ error: 'Error al eliminar la prenda de la base de datos.' });
    }
});

// Inicializar la base de datos al cargar el módulo
initializeDB();

// Iniciar servidor local (solo cuando se ejecute directamente en desarrollo)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
    });
}

// Exportar la aplicación para el runtime Serverless de Vercel
module.exports = app;
