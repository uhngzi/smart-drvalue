interface Props {
  title: string;
  height?: string;
}

const TitleSmall: React.FC<Props> = ({
  title,
  height = 30,
}) => {
  return (
    <p className={`font-medium text-[#000000] text-14 h-${height}`}>{title}</p>
  )
}

export default TitleSmall;