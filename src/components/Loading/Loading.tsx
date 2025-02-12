import { Spin } from "antd";

interface Props {
  loading: boolean;
}

const Loading: React.FC<Props> = ({ loading }) => {
  return (
    <div className="w-full h-full v-h-center">
      <Spin tip="Loading..." />
    </div>
  )
}

export default Loading;