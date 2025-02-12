import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  padding?: string;
}

const SettingContents: React.FC<Props> = ({ children, padding }) => {
  return <ContentsStyled $padding={padding ||'80px 150px 50px 150px'} className="bg-white relative">{children}</ContentsStyled>
}

const ContentsStyled = styled.div<{
  $padding: string;
}>`
  padding: ${({ $padding }) => $padding};
  box-shadow: 0px 2px 20px 0px #00000026;
`

export default SettingContents;