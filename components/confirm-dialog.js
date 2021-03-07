import Modal  from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

// Diálogo de confirmação de operações.

export default function ConfirmDialog({ title, message, handleYes, handleNo, visible }) {

    // Retorna o componente gerado.

    return (

        <>
            <Modal show={visible} 
                    backdrop="static"
                    keyboard={false}
                    onHide={ () => handleNo() }>
                
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>
                
                <Modal.Body>{message}</Modal.Body>
                
                <Modal.Footer>
                    <Button variant="primary" onClick={ () => handleYes() }>
                    Sim
                    </Button>
                    <Button variant="danger" onClick={ () => handleNo() } autofocus>
                    Não
                    </Button>
                </Modal.Footer>
            
            </Modal>

        </>
        
    )

}