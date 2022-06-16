import { Button, Modal } from 'antd';
import React, { useState } from 'react';

interface ModalProps {
  children: React.ReactNode;
  loading: boolean;
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  title: string;
}

export const ModalWrapper: React.FC<ModalProps> = ({
  children,
  loading,
  visible,
  onOk,
  onCancel,
  title,
}: ModalProps) => {
  return (
    <Modal
      visible={visible}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onOk}>
          Enviar
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};
