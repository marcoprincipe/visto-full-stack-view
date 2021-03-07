import axios from 'axios'

// Retorna a lista de alocações ativas.

async function listActiviesAllocations() {

    try {
        const response = await axios.get("http://localhost:8080/visto-full-stack/allocations/list-activies");
        return response.data;
    }
    catch(error) {
        return error.response.data
    }

}

// Efetua uma nova alocação.

async function doAllocation(request) {

    try {
        const response = await axios.post("http://localhost:8080/visto-full-stack/allocations/do-allocation", request);
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
        const response = await axios.post("http://localhost:8080/visto-full-stack/allocations/cancel-allocation", request);
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
        const response = await axios.post("http://localhost:8080/visto-full-stack/allocations/terminate-allocation", request);
        return response.data;
    }
    catch (error) {
        return error.response.data;
    }

}

export { listActiviesAllocations, doAllocation, cancelAllocation, terminateAllocation }