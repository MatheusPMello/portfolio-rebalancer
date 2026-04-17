import { Modal } from "../ModalLayout";
import { DeleteAccountSection } from "./DeleteAccountSection";

export function AccountSettingsModal({ show, onClose }: { show: boolean, onClose: () => void }) {
    return (
        <Modal show={show} onClose={onClose} title="Account Settings">
            <div className="d-flex flex-column gap-4">
                <DeleteAccountSection />
            </div>
        </Modal>
    );
}