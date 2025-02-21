import styled from "styled-components";

interface Props {
  children: React.ReactNode;
  bg?: string;
  padding?: string;
}

const Contents: React.FC<Props> = ({ children, padding, bg }) => {
  if(bg) {
    return <ContentsStyled $padding={padding||'0 40px 0 40px'} className="rounded-14 relative" style={{backgroundColor:bg}}>{children}</ContentsStyled>
  }

  return <ContentsStyled $padding={padding||'0 40px 0 40px'} className="bg-white rounded-14 relative">{children}</ContentsStyled>
}

const ContentsStyled = styled.div<{
  $padding: string;
}>`
  padding: ${({ $padding }) => $padding};
`

export default Contents;