import axios from 'axios'

// Define a porta para utilização.

const VISTO_API_PORT = "8083";

// Retorna a lista de alocações ativas.

async function listActiviesAllocations() {

    try {
        const response = await axios.get(`http://localhost:${VISTO_API_PORT}/visto-full-stack/allocations/list-activies`);
        return response.data;
    }
    catch(error) {
        return error.response.data
    }

}

// Efetua uma nova alocação.

async function doAllocation(request) {

    try {
        const response = await axios.post(`http://localhost:${VISTO_API_PORT}/visto-full-stack/allocations/do-allocation`, request);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }

}

// Cancela uma alocação.

async function cancelAllocation(idAllocation) {

    const request = {
        "idAllocation": idAllocation
    };

    try {
        const VISTO_API_PORT = process.env.VISTO_API_PORT;
        const response = await axios.post(`http://localhost:${VISTO_API_PORT}/visto-full-stack/allocations/cancel-allocation`, request);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }

}

// Encerra uma alocação.

async function terminateAllocation(idAllocation) {

    const request = {
        "idAllocation": idAllocation
    };

    try {
        const response = await axios.post(`http://localhost:${VISTO_API_PORT}/visto-full-stack/allocations/terminate-allocation`, request);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }

}

export { listActiviesAllocations, doAllocation, cancelAllocation, terminateAllocation }