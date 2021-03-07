import Modal  from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useEffect, useRef, useState } from 'react'
import { Alert, Col, Container, Form, Row } from 'react-bootstrap'
import { listActiviesCustomers } from '../services/customer-services'
import { listActiviesVehicles} from '../services/vehicle-services'
import { doAllocation } from '../services/allocation-services'

// Diálogo de edição de alocações.

export default function EditDialog({ visible, handleYes, handleNo }) {
  
    // Declarações dos estados da aplicação.

    const [formData, setFormData] = useState({
        idCustomer: "",
        idVehicle: "",
        startDate: "",
        endDate: ""
    });

    const [customers, setCustomers] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [disableSaveButton, setDisableSaveButton] = useState(true);
    const [message, setMessage] = useState(null);

    // Efetua a preparação do modal.

    useEffect(() => {
        doPrepareModal();
    }, []);

    useEffect(() => {
        checkDisableSaveButton()
    }, [formData]);

    // Efetua a carga da lista de clientes e veículos.

    async function doPrepareModal() {

        let response = {};

        response = await listActiviesCustomers();
        setCustomers(response.data);

        response = await listActiviesVehicles();
        setVehicles(response.data);
    
    }

    // Salva o identificador do cliente selecionado.

    function onChangeCustomer(event) {
        setFormData({...formData, idCustomer: event.target.value});
    }

    // Salva o identificador do veículo selecionado.

    function onChangeVehicle(event) {
        setFormData({...formData, idVehicle: event.target.value});
    }

    // Formata a data como dd/mm/yyyy

    function formatDate(value) {

        let formatted = "";
        let temp = value.replaceAll("/", "");

        if (temp.length > 4) {
            formatted = temp.substring(0, 2) + "/" + temp.substring(2, 4) + "/" + temp.substring(4);
        }
        else if (temp.length > 2) {
            formatted = temp.substring(0, 2) + "/" + temp.substring(2);
        }
        else {
            formatted = temp;
        }

        return formatted;

    }

    // Salva a data inicial informada.

    function onChangeStartDate(event) {
        event.target.value = formatDate(event.target.value);
        setFormData({...formData, startDate: event.target.value});
    }

    // Salva a data final informada.

    function onChangeEndDate(event) {
        event.target.value = formatDate(event.target.value);
        setFormData({...formData, endDate: event.target.value});
    }

    // Verifica se deve desabilitar o botão salvar.

    function checkDisableSaveButton() {

        if ((formData.idCustomer === null || formData.idCustomer.trim() === "") || 
            (formData.idVehicle === null || formData.idVehicle.trim() === "")  || 
            (formData.startDate === null || formData.startDate.trim() === "") ||
            (formData.endDate === null || formData.endDate.trim() === "")) {
            setDisableSaveButton(true);
            return;
        }
        
        if ((formData.startDate !== null && formData.startDate.length < 10) ||
            (formData.endDate !== null && formData.endDate.length < 10)) {
            setDisableSaveButton(true);
            return;
        }
        
        setDisableSaveButton(false)

    }

    // Verifica a data informada.

    function checkDate(value) {

        if (value === null ||
            value.trim() === "") {
            return false;
        }

        if (value.trim().length !== 10) {
            return false;
        }

        const day = parseInt(value.substring(0, 2));
        const month = parseInt(value.substring(3, 5)) - 1;
        const year = parseInt(value.substring(6, 10));

        const date = new Date(year, month, day);

        if (date.getDate() === day && 
            date.getMonth() === month &&
            date.getFullYear() === year) {
            return true;
        }

        return false;

    }

    // Efetua o tratamento do botão yes.

    async function onButtonYesClicked() {

        if (!checkDate(formData.startDate)) {
            setMessage("Data inicial informada inválida");
            setTimeout(() => {
                document.getElementById("startDate").focus();
            }, 250);
            return;
        }

        if (!checkDate(formData.endDate)) {
            setMessage("Data final informada inválida");
            setTimeout(() => {
                document.getElementById("endDate").focus();
            }, 250);
            return;
        }

        const startDate = 
            formData.startDate.substring(6, 10) + "-" +
            formData.startDate.substring(3, 5) + "-" +
            formData.startDate.substring(0, 2) + "T23:59:59Z";

        const endDate = 
            formData.endDate.substring(6, 10) + "-" +
            formData.endDate.substring(3, 5) + "-" +
            formData.endDate.substring(0, 2) + "T23:59:59Z";

        const request = {
            idCustomer: formData.idCustomer,
            idVehicle: formData.idVehicle,
            startDate: startDate,
            endDate: endDate
        }

        const response = await doAllocation(request);

        if (response.code !== 0) {
            setMessage(response.message);
            if (response.code === -16 ||
                response.code === -19) {
                document.getElementById("startDate").focus();
            }
            else if (response.code === -2003) {
                document.getElementById("selectVehicles").focus();
            }
            else {
                document.getElementById("selectCustomers").focus();
            }
            return
        }

        setMessage(null);

        setFormData({
            idCustomer: "",
            idVehicle: "",
            startDate: "",
            endDate: ""
        });

        handleYes();

    }

    // Efetua o tratamento do botão No.

    function onButtonNoClicked() {

        setMessage(null);

        setFormData({
            idCustomer: "",
            idVehicle: "",
            startDate: "",
            endDate: ""
        });

        handleNo();

    }

    // Retorna o componente gerado.

    return (

        <Modal show={visible} 
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    onEntered={() => document.getElementById("selectCustomers").focus()}
                    onHide={() => onButtonNoClicked()}>
                
            <Modal.Header>
                <Modal.Title>Nova alocação</Modal.Title>
            </Modal.Header>
                
            <Modal.Body>

                <Form autoComplete="off">

                    <Container fluid>

                        <Row>

                            <Col xs={12}>

                                <Form.Group controlId="selectCustomers" autoFocus>
                                    <Form.Label>Cliente :</Form.Label>
                                    <Form.Control as="select" onChange={onChangeCustomer}>
                                        <option key={0} value={""}>{"Selecione o cliente..."}</option>
                                        {customers.map((item, index) => (
                                            <option key={index + 1} value={item.id}>{item.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>

                            </Col>

                        </Row>

                        <Row>

                            <Col xs={12}>

                                <Form.Group controlId="selectVehicles">
                                    <Form.Label>Veículo :</Form.Label>
                                    <Form.Control as="select" onChange={onChangeVehicle}>
                                    <option key={0} value={""}>{"Selecione o veículo..."}</option>
                                    {vehicles.map((item, index) => (
                                        <option key={index + 1} value={item.id}>{item.plate} - {item.brand} - {item.model}</option>
                                    ))}
                                    </Form.Control>
                                </Form.Group>

                            </Col>

                        </Row>

                        <Row>
                            
                            <Col xs={6}>
                                <Form.Group controlId="startDate">
                                    <Form.Label>Data inicial :</Form.Label>
                                    <Form.Control onChange={onChangeStartDate} type="text" maxLength="10" placeholder="dd/MM/yyyy" />
                                </Form.Group>
                            </Col>
                            
                            <Col xs={6}>
                                <Form.Group controlId="endDate">
                                    <Form.Label>Data final :</Form.Label>
                                    <Form.Control onChange={onChangeEndDate} type="text" maxLength="10" placeholder="dd/MM/yyyy" />
                                </Form.Group>
                            </Col>

                        </Row>

                        { message !== null &&

                        <Row>

                            <hr/>

                            <Col xs={12}>
                                <Alert variant="danger">{message}</Alert>
                            </Col>

                        </Row>

                        }

                    </Container>

                </Form>

            </Modal.Body>
                
            <Modal.Footer>
                <Button variant="primary" disabled={disableSaveButton} onClick={ () => onButtonYesClicked() }>
                Salvar
                </Button>
                <Button variant="danger" onClick={ () => onButtonNoClicked() }>
                Cancelar
                </Button>
            </Modal.Footer>
            
        </Modal>
        
    )

}