interface Props {
  title: string;
}

const TitleModalSub: React.FC<Props> = ({
  title
}) => {
  return (
    <div className="w-full h-40 font-medium text-16">
      {title}
    </div>
  )
}

export default TitleModalSub;