import { useEffect } from "react";
import { Modal } from "antd";

const RestoreNotification = ({
  title = "Restore",
  description = "This will override your current logbook data.",
  onConfirm,
  showOnMount = false,
}) => {
  useEffect(() => {
    if (showOnMount) {
      Modal.confirm({
        title: title,
        content: description,
        okText: "Restore",
        cancelText: "Cancel",
        centered: true,
        onOk: () => {
          if (onConfirm) {
            onConfirm();
          }
        },
      });
    }
  }, []);

  return null; // no JSX needed, modal handles UI
};

export default RestoreNotification;