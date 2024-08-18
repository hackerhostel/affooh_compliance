import React from 'react';
import DataGrid, {
  Column,
  SearchPanel,
  Paging, GroupPanel, Grouping, ColumnChooser, Scrolling, Sorting,
} from 'devextreme-react/data-grid';
import {formatDateIfDate} from "../../utils/commonUtils.js";

import './custom-style.css';

const SprintTable = ({taskList}) => {
  const customCellRender = (data) => {
    if(typeof data.value === 'object') {
      return <div className="px-2 py-1 text-sm">{formatDateIfDate(data.value)}</div>;
    }
    return <div className="px-2 py-1 text-sm">{data.value}</div>;
  };

  const customHeaderRender = (data) => {
    return <div className="font-bold text-blue-600">{data.column.caption}</div>;
  };

  return (
    <div className="p-4">
      <DataGrid
        dataSource={taskList}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        width="100%"
        className="shadow-lg rounded-lg overflow-hidden sprint-grid-table"
      >
        <GroupPanel visible />
        <SearchPanel visible />
        <Grouping autoExpandAll />
        <Paging enabled={false} />
        <ColumnChooser enabled={true} mode="select" />
        <Scrolling mode="standard" useNative={true} />
        <Sorting mode="multiple" />

        <Column
          dataField="status"
          caption="Status"
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
        />
        <Column
          dataField="title"
          caption="Title"
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
        />
        <Column
          dataField="assignee"
          caption="Assignee"
          groupIndex={0}
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
          // groupCellRender={(cellInfo) => (
          //   <div className="custom-group-cell">
          //     awdawdawdawd
          //   </div>
          // )}
        />
        <Column
          dataField="epic"
          caption="Epic"
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
        />
        <Column
          dataField="startDate"
          caption="Start Date"
          dataType="date"
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
        />
        <Column
          dataField="endDate"
          caption="End Date"
          dataType="date"
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
        />
        <Column
          dataField="type"
          caption="Type"
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
        />
        <Column
          dataField="priority"
          caption="Priority"
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
        />
      </DataGrid>
    </div>
  );
};

export default SprintTable;