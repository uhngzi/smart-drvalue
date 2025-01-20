import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  padding?: string;
}

const Contents: React.FC<Props> = ({ children, padding }) => {
  return <ContentsStyled $padding={padding||'0 15px 30px 15px'}>{children}</ContentsStyled>
}

const ContentsStyled = styled.div<{
  $padding: string;
}>`
  padding: ${({ $padding }) => $padding};
`

export default Contents;