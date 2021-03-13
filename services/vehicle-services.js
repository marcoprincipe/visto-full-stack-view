import axios from 'axios'

// Define a porta para utilização.

const VISTO_API_PORT = "8083";

// Retorna a lista de clientes ativos.

async function listActiviesVehicles() {

    try {
        const response = await axios.get(`http://localhost:${VISTO_API_PORT}/visto-full-stack/vehicles/list-activies`);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }

}

export { listActiviesVehicles }