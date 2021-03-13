import Head from 'next/head'
import Button from 'react-bootstrap/Button'
import Table from 'react-bootstrap/Table'
import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { listActiviesAllocations, cancelAllocation, terminateAllocation } from '../../services/allocation-services'
import ConfirmDialog from '../../components/confirm-dialog'
import EditDialog from '../../components/edit-dialog'

// Declaração das variáveis globais do módulo.

let message = null;
let title = null;
let selectedItem = {}

// Função principal da módulo.

export default function Home() {
  
  // Declaração das variáveis locais.

  let isCancelation = false;

  // Declaração dos estados da aplicação.

  const [items, setItems] = useState([]);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  // Efetua a carga das alocações ativas.

  useEffect(() => {
    doListActiviesAllocations()
  }, []);

  // Lista todas as alocações ativas

  async function doListActiviesAllocations() {
    
    const response = await listActiviesAllocations();

    setItems(response.data);

  }

  // Efetua o tratamento do resultado da edição de alocações.

  function handleEditDialog(option) {

    setShowEditDialog(false)

    if (option === "N") {
        return;
    }

    doListActiviesAllocations()

  }

  // Efetua o cancelamento de uma alocação.

  function doCancelAllocation(item) {

    title = "Cancelar";
    message = `Confirma o cancelamento da alocação do veículo com placa '${item.vehicle.plate}' ?`

    setShowCancelDialog(true);

    selectedItem = item

    isCancelation = true;

  }

  // Efetua o cancelamento de uma alocação.

  function doTerminateAllocation(item) {

    title = "Encerrar";
    message = `Confirma o encerramento da alocação do veículo com placa '${item.vehicle.plate}' ?`

    setShowCancelDialog(true);

    selectedItem = item

    isCancelation = false;

  }

  // Efetua o tratamento da resposta do diálogo.

  async function handleCancelDialog(option) {

    setShowCancelDialog(false);

    if (option === "N") {
        return;
    }

    if (isCancelation) {
      await cancelAllocation(selectedItem.id);
    }
    else {
      await terminateAllocation(selectedItem.id);
    }

    doListActiviesAllocations();

  }

  // Efetua a formatação das datas recebidas.

  function formatDate(value) {

    const date = 
      value.substring(8, 10) + "/" + 
      value.substring(5, 7) + "/" + 
      value.substring(0, 4);

    return date;

  }

  // Retorna a página gerada.

  return (

    <div className="container-fluid" style={{marginTop:"2vh"}}>
    
      <Head>
        <title>Alocações Ativas</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <EditDialog
        visible={showEditDialog}
        handleYes={ () => handleEditDialog("Y") }
        handleNo={ () => handleEditDialog("N") } />

      <ConfirmDialog
        visible={showCancelDialog}
        title={title}
        message={message} 
        handleYes={ () => handleCancelDialog("Y") }
        handleNo={ () => handleCancelDialog("N") } />

      <Table striped bordered responsive>

        <thead>
          
          <tr>
            <th colSpan="5" className="text-center text-bold">Alocações Ativas</th>
          </tr>

          <tr>
            <th>Cliente</th>
            <th className="text-center">Placa</th>
            <th className="text-center">Data inicial da alocação</th>
            <th className="text-center">Data final da alocação</th>
            <th>Ações</th>
          </tr>  
          
        </thead>  

        <tbody>

          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.customer.name}</td>
              <td className="text-center">{item.vehicle.plate}</td>
              <td className="text-center">{formatDate(item.startDate)}</td>
              <td className="text-center">{formatDate(item.endDate)}</td>
              <td>
                <div className="float-left text-success" style={{width:"1.75rem"}}>
                  <FontAwesomeIcon title="Encerrar alocação" style={{cursor: "pointer"}} onClick={ () => doTerminateAllocation(item) } icon={faCheckCircle}/>
                </div>
                <div className="float-left ml-2 text-danger" style={{width:"1.75rem"}}>
                  <FontAwesomeIcon title="Cancelar alocação" style={{cursor: "pointer"}} onClick={ () => doCancelAllocation(item) } icon={faTimesCircle}/>
                </div>
              </td>
            </tr>
          ))}
        
        </tbody>
        
      </Table> 

      <div className="text-center">
        <Button className="font-weight-bold" variant="primary" onClick={ () => setShowEditDialog(true) }>Nova alocação...</Button>
      </div>

    </div>

  )

}