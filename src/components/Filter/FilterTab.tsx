import { filterType } from "@/data/type/filter";
import DefaultFilter from "./DeafultFilter";
import { SetStateAction } from "react";

interface Props {
  title: string;
  filter: filterType;
  setFilter: React.Dispatch<SetStateAction<filterType>>;
  titleEtc?: any;
  filterButton?: any;
  contents?: any;
}

const FilterTab: React.FC<Props> = ({
  title,
  filter,
  setFilter,
  titleEtc,
  filterButton,
  contents,
}) => {
  return (
    <div className="flex flex-col bg-white p-30 rounded-14 gap-20 w-full">
      <div className="h-32 h-center text-22 text-[#222222] flex gap-10">
        {title}
        {titleEtc}
      </div>

      <div className="h-60 w-full h-center justify-between">
        <DefaultFilter filter={filter} setFilter={setFilter}/>
        {filterButton}
      </div>

      {contents}
    </div>
  )
};

export default FilterTab;