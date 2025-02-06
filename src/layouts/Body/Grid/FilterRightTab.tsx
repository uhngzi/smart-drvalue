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
  tab: React.ReactNode;
}

const FilterRightTab: React.FC<Props> = ({ 
  filter, 
  setFilter, 
  filterTitle,
  titleEtc,
  filterBtn, 
  filterContents,
  main, 
  tab
}) => {
  return (
    <div className="w-full flex gap-20">
      <div className="min-w-[1530px] w-[97%] flex flex-col gap-20">
        <FilterTab
          title={filterTitle}
          filter={filter}
          setFilter={setFilter}
          filterButton={filterBtn}

          titleEtc={titleEtc}
          contents={filterContents}
        />

        <div className="w-full h-[990px] bg-white p-20 text-center rounded-14 overflow-auto">
            {main}
        </div>
      </div>
      
      <div className="min-w-[80px] w-[3%] px-10 py-20 h-center flex-col bg-white rounded-14 gap-20">
        {tab}
      </div>
    </div>
  )
}

export default FilterRightTab;