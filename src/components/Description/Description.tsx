import Separator from '../Divider/Separator';

interface Props {
  children: React.ReactNode | React.ReactNode[];

  isTopBorder?: boolean;
  isBottomBorder?: boolean;

  separatorColor?: string;
}

const Description: React.FC<Props> = ({
  children,

  isTopBorder = false,
  isBottomBorder = false,

  separatorColor = '#D5D5D5',
}) => {
  const childArray = Array.isArray(children) ? children : [children];

  return (
    <div className="flex flex-col">
      {/* 위쪽 선 */}
      {isTopBorder ? (
        <Separator color={'#D5D5D5'} />
      ) : (
        <Separator color={separatorColor} />
      )}

      {/* 자식 컴포넌트 */}
      {childArray.map((child, index) => (
        <div key={index}>
          {child}
          {index < childArray.length - 1 && (
            <Separator color={separatorColor} />
          )}
        </div>
      ))}

      {/* 아래쪽 선 */}
      {isBottomBorder ? (
        <Separator color={'#D5D5D5'} />
      ) : (
        <Separator color={separatorColor} />
      )}
    </div>
  );
};

export default Description;
