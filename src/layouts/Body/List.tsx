interface Props {
  children: React.ReactNode;
  className?: string;
}

export const List: React.FC<Props> = ({ children, className }) => {
  return (
    <div
      className={`flex flex-col gap-20 ${className}`}
      style={{ borderTop: " 1px solid rgba(0,0,0,6%)" }}
    >
      {children}
    </div>
  );
};
