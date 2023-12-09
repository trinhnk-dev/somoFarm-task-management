import { Button, Modal } from "antd";
import React from "react";

const CloneTask = ({
  selectedTaskId,
  cloneTaskModalVisible,
  closeCloneTaskModal,
  handleCloneTask,
}) => {
  return (
    <>
      {cloneTaskModalVisible ? (
        <Modal
          title="Tạo bản sao"
          open={cloneTaskModalVisible}
          onCancel={closeCloneTaskModal}
          footer={[
            <Button onClick={closeCloneTaskModal}>Hủy</Button>,
            <Button
              type="primary"
              onClick={() => handleCloneTask(selectedTaskId)}
            >
              Tạo bản sao
            </Button>,
          ]}
          className="subTask-modal"
        >
          <p>Bản sao của công việc này sẽ được tạo ở trạng thái "Bản nháp"</p>
        </Modal>
      ) : null}
    </>
  );
};

export default CloneTask;
