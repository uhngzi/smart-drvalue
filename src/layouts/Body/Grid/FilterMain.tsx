import FilterTab from "@/components/Filter/FilterTab";
import { filterType } from "@/data/type/filter";
import { SetStateAction } from "react";

interface Props {
  filter: filterType;
  setFilter: React.Dispatch<SetStateAction<filterType>>;
  filterTitle: string;
  titleEtc?: any;
  filterBtn?: React.ReactNode;
  filterContents?: React.ReactNode;
  main: React.ReactNode;
  btn?: React.ReactNode;
}

const FilterMain: React.FC<Props> = ({
  filter, 
  setFilter, 
  filterTitle,
  titleEtc,
  filterBtn, 
  filterContents,
  main, 
  btn,
}) => {
  return (
    <div className="flex flex-col gap-40">
      <div className="w-full ">
          <FilterTab
            title={filterTitle}
            filter={filter}
            setFilter={setFilter}
            filterButton={filterBtn}
            
            titleEtc={titleEtc}
            contents={filterContents}
          />

      </div>
      <div className="w-full bg-white p-30 rounded-14 gap-64 min-w-[1600px] w-full">
        {main}
      </div>
      {btn}
    </div>

  )
}

export default FilterMain;