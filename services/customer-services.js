import axios from 'axios'

// Define a porta para utilização.

const VISTO_API_PORT = "8083";

// Retorna a lista de clientes ativos.

async function listActiviesCustomers() {

    try {
        const response = await axios.get(`http://localhost:${VISTO_API_PORT}/visto-full-stack/customers/list-activies`);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }    

}

export { listActiviesCustomers }

