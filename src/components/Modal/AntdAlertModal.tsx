import { Modal } from "antd";
import styled from "styled-components";
import { 
  CheckCircleFilled,    // success
  InfoCircleFilled,     // info
  CloseCircleFilled,    // error
  ExclamationCircleFilled  // warning
} from '@ant-design/icons';

export type AlertType = 'success' | 'info' | 'error' | 'warning';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  contents?: React.ReactNode;
  onOk?: () => void;
  onCancle?: () => void;
  hideCancel?: boolean;
  type?: AlertType;
  theme?: 'main' | 'base';
}

const iconMap = {
  success: { icon: CheckCircleFilled, color: '#52c41a' },
  info: { icon: InfoCircleFilled, color: '#1677ff' },
  error: { icon: CloseCircleFilled, color: '#ff4d4f' },
  warning: { icon: ExclamationCircleFilled, color: '#faad14' },
};

const CustomModal = styled(Modal)<{ theme?: 'main' | 'base' }>`
  & .ant-modal-content {
  }

  & .ant-btn-primary {
    background: ${({ theme }) => theme === 'main' ? '#4880FF' : '#03C75A'};
  }
`

const AntdAlertModal: React.FC<Props> = ({
  open,
  setOpen,
  title,
  contents,
  onOk,
  onCancle,
  hideCancel = false,
  type,
  theme = 'main'
}) => {
  const IconComponent = type ? iconMap[type].icon : null;

  return (
    <CustomModal
      theme={theme}
      open={open}
      closeIcon={null}
      centered
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {IconComponent && <IconComponent style={{ color: iconMap[type!].color }} />}
          {title}
        </div>
      }
      onOk={onOk || (() => setOpen(false))}
      onCancel={onCancle || (() => setOpen(false))}
      cancelButtonProps={{ style: { display: hideCancel ? 'none' : 'inline-block' } }}
    >
      {contents}
    </CustomModal>
  );
};

export default AntdAlertModal;

