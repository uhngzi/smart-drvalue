import { memo } from 'react';

import styled from 'styled-components';

interface Props {
  color?: string;
}

const Separator: React.FC<Props> = memo(({ color = '#d2d2d2' }) => {
  return (
    <SeparatorStyled $color={color}>
      <hr />
    </SeparatorStyled>
  );
});
Separator.displayName = 'Separator';

const SeparatorStyled = styled.div<{
  $color?: string;
}>`
  hr {
    height: 1px;
    border-color: ${({ $color }) => $color};
  }
`;

export default Separator;
