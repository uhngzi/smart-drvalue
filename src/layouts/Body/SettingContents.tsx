import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  padding?: string;
}

const SettingContents: React.FC<Props> = ({ children, padding }) => {
  return (
    <ContentsStyled $padding={padding || "30px"} className="bg-white relative">
      {children}
    </ContentsStyled>
  );
};

const ContentsStyled = styled.div<{
  $padding: string;
}>`
  padding: ${({ $padding }) => $padding};
  /* box-shadow: 0px 2px 0px 20px #00000026; */
`;

export default SettingContents;
