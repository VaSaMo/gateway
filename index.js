const express = require('express');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de las URLs de los microservicios (Simulados)
const USER_SERVICE_URL = 'https://jsonplaceholder.typicode.com/users'; // Simula servicio de usuarios
const POSTS_SERVICE_URL = 'https://jsonplaceholder.typicode.com/posts'; // Simula servicio de pedidos/posts

app.get('/customer-dashboard/:id', async (req, res) => {
    const userId = req.params.id;

    try {
        console.log(`--- Iniciando agregación para el usuario ${userId} ---`);

        // EJECUCIÓN EN PARALELO: El núcleo del patrón
        const [userResponse, postsResponse] = await Promise.all([
            axios.get(`${USER_SERVICE_URL}/${userId}`),
            axios.get(`${POSTS_SERVICE_URL}?userId=${userId}`)
        ]);

        // AGREGACIÓN: Combinamos las piezas en un solo JSON
        const dashboardData = {
            customer: {
                name: userResponse.data.name,
                email: userResponse.data.email,
                city: userResponse.data.address.city
            },
            recentActivity: postsResponse.data.slice(0, 3), // Solo los últimos 3
            generatedAt: new Date().toISOString(),
            source: "Cloud Gateway Aggregator"
        };

        res.json(dashboardData);

    } catch (error) {
        console.error('Error agregando datos:', error.message);
        res.status(500).json({ error: 'Fallo al recolectar datos del backend' });
    }
});

app.listen(PORT, () => {
    console.log(`Gateway Aggregator corriendo en puerto ${PORT}`);
});