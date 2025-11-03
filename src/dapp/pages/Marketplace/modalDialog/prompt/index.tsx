

import React, { useState, useEffect } from 'react';
import styles from './styles.module.scss';

interface PromptModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ isOpen, onClose }) => {
    const [visible, setVisible] = useState(isOpen);

    useEffect(() => {
        setVisible(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setVisible(false);
        onClose();
    };

    if (!visible) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h3>System prompt</h3>
                    <button className={styles.closeButton} onClick={handleClose}>
                        ×
                    </button>
                </div>
                <div className={styles.modalContent}>
                    <p>The current beta version is old, and the new beta version will be launched soon. Testing can officially begin at that time!</p>
                </div>
                <div className={styles.modalFooter}>
                    <button className={styles.confirmButton} onClick={handleClose}>
                        I road
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PromptModal;