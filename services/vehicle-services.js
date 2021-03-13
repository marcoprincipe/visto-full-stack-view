import axios from 'axios'

// Retorna a lista de clientes ativos.

async function listActiviesVehicles() {

    try {
        const VISTO_API_PORT = process.env.VISTO_API_PORT;
        const response = await axios.get(`http://localhost:${VISTO_API_PORT}/visto-full-stack/vehicles/list-activies`);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }

}

export { listActiviesVehicles }