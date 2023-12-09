import React from "react";
import DisplayEffort from "./DisplayEffort";

function Effort({
  effortVisible,
  handleEffortVisible,
  effort,
  isHaveSubTask,
  openSubtaskModal
}) {
  return (
    <>
      <DisplayEffort
        effortVisible={effortVisible}
        handleEffortVisible={handleEffortVisible}
        effort={effort}
        isHaveSubTask={isHaveSubTask}
        openSubtaskModal={openSubtaskModal}
      />
    </>
  );
}

export default Effort;
