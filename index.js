const express = require('express');
const axios = require('axios');
const app = express();

// Cambiamos a 8080 para que coincida con el Dockerfile y App Runner
const PORT = process.env.PORT || 8080;

const USER_SERVICE_URL = 'https://jsonplaceholder.typicode.com/users';
const POSTS_SERVICE_URL = 'https://jsonplaceholder.typicode.com/posts';

app.get('/customer-dashboard/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        console.log(`--- Iniciando agregación para el usuario ${userId} ---`);

        // Llamadas en paralelo (Eficiencia del patrón)
        const [userResponse, postsResponse] = await Promise.all([
            axios.get(`${USER_SERVICE_URL}/${userId}`),
            axios.get(`${POSTS_SERVICE_URL}?userId=${userId}`)
        ]);

        const dashboardData = {
            customer: {
                name: userResponse.data.name,
                email: userResponse.data.email,
                city: userResponse.data.address.city
            },
            recentActivity: postsResponse.data.slice(0, 3),
            generatedAt: new Date().toISOString(),
            source: "Cloud Gateway Aggregator en AWS"
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