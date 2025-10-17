import React from "react";
import styles from "./Modal.module.css";
import { Button } from "./buttons/Button/Button";
import Flex from "./Flex/Flex";
import { Text } from "./Text/Text";

interface ModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  title = "",
  open,
  onClose,
  children,
}) => {
  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <Flex style={{ backgroundColor: "black" }} margin={0} padding="2px 4px">
          {title && (
            <Text variant="title" style={{ margin: "0 auto" }}>
              {title}
            </Text>
          )}
          <Button onClick={onClose} variant="ghost" size="sm">
            ❌
          </Button>
        </Flex>
        {children}
      </div>
    </div>
  );
};
