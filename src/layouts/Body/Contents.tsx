import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  padding?: string;
}

const Contents: React.FC<Props> = ({ children, padding }) => {
  return <ContentsStyled $padding={padding||'0 40px 0 40px'} className="bg-white rounded-14">{children}</ContentsStyled>
}

const ContentsStyled = styled.div<{
  $padding: string;
}>`
  padding: ${({ $padding }) => $padding};
`

export default Contents;