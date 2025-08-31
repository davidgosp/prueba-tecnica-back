// Importamos las librerías necesarias
const express = require('express');
const { MongoClient } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');
const cors = require('cors');

// Creamos la aplicación Express
const app = express();
const PORT = 3000;

// Middlewares - Son funciones que procesan las peticiones
app.use(cors()); // Permite peticiones desde Angular
app.use(express.json()); // Permite recibir JSON en el body

// Variables globales para la base de datos
let mongoServer;
let db;
let usersCollection;

// Función para iniciar la base de datos en memoria
async function initDatabase() {
    console.log('🚀 Iniciando base de datos en memoria...');
    
    // Crear servidor MongoDB en memoria
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    
    // Conectar a la base de datos
    const client = new MongoClient(uri);
    await client.connect();
    
    // Seleccionar base de datos y colección
    db = client.db('prueba-tecnica');
    usersCollection = db.collection('users');
    
    console.log('✅ Base de datos lista!');
}

// ======================
// RUTAS DE LA API
// ======================

// GET /api/user - Obtener todos los usuarios
app.get('/api/user', async (req, res) => {
    try {
        console.log('📋 Obteniendo todos los usuarios...');
        const users = await usersCollection.find({}).toArray();
        res.json(users);
    } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// POST /api/user - Crear un nuevo usuario
app.post('/api/user', async (req, res) => {
    try {
        console.log('➕ Creando nuevo usuario:', req.body);
        
        const newUser = {
            userId: req.body.userId,
            name: req.body.name,
            createDate: Date.now(),
            updateDate: Date.now()
        };
        
        // Verificar si el userId ya existe
        const existingUser = await usersCollection.findOne({ userId: newUser.userId });
        if (existingUser) {
            return res.status(400).json({ error: 'El userId ya existe' });
        }
        
        const result = await usersCollection.insertOne(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear usuario' });
    }
});

// PUT /api/user/:userId - Actualizar un usuario
app.put('/api/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('✏️ Actualizando usuario:', userId);
        
        const updateData = {
            name: req.body.name,
            updateDate: Date.now()
        };
        
        const result = await usersCollection.updateOne(
            { userId: userId },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        const updatedUser = await usersCollection.findOne({ userId: userId });
        res.json(updatedUser);
    } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// DELETE /api/user/:userId - Eliminar un usuario
app.delete('/api/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('🗑️ Eliminando usuario:', userId);
        
        const result = await usersCollection.deleteOne({ userId: userId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

// Iniciar el servidor
async function startServer() {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
        console.log('📝 Rutas disponibles:');
        console.log('   GET    /api/user');
        console.log('   POST   /api/user');
        console.log('   PUT    /api/user/:userId');
        console.log('   DELETE /api/user/:userId');
    });
}

startServer().catch(console.error);