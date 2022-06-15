import { LoadingOutlined } from '@ant-design/icons';

interface LoadingProps {
  size: 'large' | 'middle' | 'small';
}

export const Loading = ({ size }: LoadingProps) => {
  const returnFontSize = () => {
    switch (size) {
      case 'large':
        return 40;
      case 'middle':
        return 30;
      case 'small':
        return 20;
      default:
        return 30;
    }
  };

  return (
    <div className="max-size-container">
      <LoadingOutlined style={{ fontSize: returnFontSize() }} />
    </div>
  );
};
