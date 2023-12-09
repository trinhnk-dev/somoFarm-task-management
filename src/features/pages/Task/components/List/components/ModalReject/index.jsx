import { Button, Modal } from "antd";
import React from "react";

const ModalReject = ({
  selectedTaskId,
  rejectModalVisible,
  closeRejectModal,
  handleRefuseTask,
}) => {
  return (
    <>
      {rejectModalVisible ? (
        <Modal
          title="Không chấp nhận"
          open={rejectModalVisible}
          onCancel={closeRejectModal}
          footer={[
            <Button onClick={closeRejectModal}>Hủy</Button>,
            <Button
              type="primary"
              danger
              onClick={() => handleRefuseTask(selectedTaskId)}
            >
              Đồng ý
            </Button>,
          ]}
        >
          <p>Nếu bạn từ chối thì công việc này sẽ quay lại trạng thái chuẩn bị </p>
          <p>Bạn sẽ không chấp nhận?</p>
        </Modal>
      ) : null}
    </>
  );
};

export default ModalReject;
