import { Modal } from "rsuite"
import ModalHeader from "rsuite/esm/Modal/ModalHeader"


export const ImageFill = ({ imgUrl, isOpen, setIsOpen }) => {

    return <Modal open={isOpen} onClose={() => setIsOpen(false)} size={'calc(100% - 120px)'} overflow={false} >
        <Modal.Body>
            <div style={{ width: "100%", height: "100%" }}>
                <img src={imgUrl} alt="" style={{ width: "100%", height: "100%" }} />
            </div>
        </Modal.Body>
    </Modal>

}