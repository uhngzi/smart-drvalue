import styled from "styled-components"

interface Props {
  items: Array<{
    label: string;
    content: any;
    className?: string;
  }>
}

const FilterRound: React.FC<Props> = ({
  items,
}) => {
  return (
    <FilterRoundStyled>
      <div className="rows">
        {
          items.map((item, idx) => (
            <div key={idx} className={`items `+(item.className ?? '')}>
              <div className="min-w-40">{item.label}</div>
              {item.content}
            </div>
          ))
        }
      </div>
    </FilterRoundStyled>
  )
}

const FilterRoundStyled = styled.div<{
}>`
  display: flex;
  height: 60px;
  align-itmes: center;
  min-width: 997px;

  .rows {
    display: flex;
    align-items: center;
    height: 60px;
    border-radius: 14px;
    border: 1px solid #D5D5D5;
    background-color: #F9F9FB;

    & .items {
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 20px;
      height: 100%;
      border-right: 1px solid #D5D5D5;
      gap: 10px;
    }

    & > div:last-child {
      border-right: 0;
    }
  }
`

export default FilterRound;