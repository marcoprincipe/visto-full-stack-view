import axios from 'axios'

// Retorna a lista de clientes ativos.

async function listActiviesCustomers() {

    try {
        const response = await axios.get("http://localhost:8081/visto-full-stack/customers/list-activies");
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }    

}

export { listActiviesCustomers }

