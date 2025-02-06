interface Props {
  title: string;
  icon: any;
}

const TitleIcon: React.FC<Props> = ({
  title,
  icon,
}) => {
  return (
    <div className="h-center gap-5">
      <p className="w-24 h-24">{icon}</p>
      <p className="text-16 font-medium">{title}</p>
    </div>
  )
}

export default TitleIcon;