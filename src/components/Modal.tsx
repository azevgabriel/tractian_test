import { Button, Modal } from 'antd';
import React, { useState } from 'react';

interface ModalProps {
  children: React.ReactNode;
  loading: boolean;
  visible: boolean;
  onCancel: () => void;
  onOk: () => void;
  title: string;
  width: string;
}

export const ModalWrapper: React.FC<ModalProps> = ({
  children,
  loading,
  visible,
  onOk,
  onCancel,
  title,
  width = '500px',
}: ModalProps) => {
  return (
    <Modal
      width={width}
      visible={visible}
      title={title}
      onOk={onOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button
          key="submit"
          type="primary"
          htmlType="submit"
          loading={loading}
          onClick={onOk}
        >
          Enviar
        </Button>,
      ]}
    >
      {children}
    </Modal>
  );
};
