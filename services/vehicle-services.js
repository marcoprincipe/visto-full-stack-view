import axios from 'axios'

// Retorna a lista de clientes ativos.

async function listActiviesVehicles() {

    try {
        const response = await axios.get("http://localhost:8080/visto-full-stack/vehicles/list-activies");
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }

}

export { listActiviesVehicles }