import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF, GridCallbackDetails, GridColDef, GridColumnVisibilityModel, GridPaginationModel, GridToolbar } from "@mui/x-data-grid";
import { koKR } from "@mui/x-data-grid/locales";

interface Props {
  columns: GridColDef<any>[];
  rows: any[];
  rowCount: number;
  loading?: boolean;
  visibilityModal?: GridColumnVisibilityModel;
  visibilityChange?: (model: GridColumnVisibilityModel, details: GridCallbackDetails) => void;
  paging?: true;
  paginationModel?: {
    pageSize: number;
    page: number;
  };
  onPaginationModelChange?: (model: GridPaginationModel, details: GridCallbackDetails<"pagination">) => void;
}

const MuiTable: React.FC<Props> = ({
  columns,
  rows,
  rowCount,
  loading = false,
  visibilityModal,
  visibilityChange,
  paging,
  paginationModel,
  onPaginationModelChange,
}) => {
  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        rowCount={rowCount}
        loading={loading}

        //스타일
        rowHeight={55}
        columnHeaderHeight={56}
        localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
        
        //수정 및 추가
        editMode="row"
        
        //필터
        slots={{ toolbar: GridToolbar }}
        slotProps={{toolbar: {showQuickFilter: true}}}

        //페이징
        paginationMode="server"
        pagination={paging}
        pageSizeOptions={[15, 25, 50, 100]}
        initialState={{
          pagination: { paginationModel: paginationModel },
        }}
        onPaginationModelChange={onPaginationModelChange}

        //열숨김
        columnVisibilityModel={visibilityModal}
        onColumnVisibilityModelChange={visibilityChange}
        
        sx={{
          "& .header": {
            backgroundColor: "#FAFAFA !important",
          },
          "& .pinned-column": {
            position: "sticky",
            left: 0,
            backgroundColor: "#fff",
            zIndex: 2,
          },
          "& .MuiDataGrid-columnHeaders .pinned-column": {
            zIndex: 3, // 헤더는 더 높은 zIndex 적용
          },
        }}
      />
    </>
  )
}

export default MuiTable;