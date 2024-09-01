import React, {useEffect, useState} from 'react';
import DataGrid, {
  Column,
  SearchPanel,
  Paging, GroupPanel, Grouping, ColumnChooser, Scrolling, Sorting,
} from 'devextreme-react/data-grid';
import {formatDateIfDate} from "../../utils/commonUtils.js";

import './custom-style.css';
import {useHistory} from "react-router-dom";

const SprintTable = ({taskList}) => {
  const history = useHistory();

  const taskTitleComponent = (data) => {
    return <button
      className="px-2 py-1 text-sm hover:bg-gray-50 rounded-lg"
      onClick={() => {
        history.push(`/task/${data?.key?.taskCode}`);
      }}
    >
      {data.value}
    </button>
  };

  const customCellRender = (data) => {
    if (typeof data.value === 'object') {
      return <div className="px-2 py-1 text-sm">{formatDateIfDate(data.value)}</div>;
    }
    return <div className="px-2 py-1 text-sm">{data.value}</div>;
  };

  const customHeaderRender = (data) => {
    return <div className="font-bold text-gray-600">{data.column.caption}</div>;
  };

  const [windowHeight, setWindowHeight] = useState(window.innerHeight  - 200);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight  - 200);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-4">
      <DataGrid
        dataSource={taskList}
        allowColumnReordering={true}
        rowAlternationEnabled={true}
        showBorders={true}
        width="100%"
        className="shadow-lg rounded-lg overflow-hidden sprint-grid-table"
        height={windowHeight}
      >
        <GroupPanel visible/>
        <SearchPanel visible/>
        <Grouping autoExpandAll/>
        <Paging enabled={false}/>
        <ColumnChooser enabled={true} mode="select"/>
        <Scrolling columnRenderingMode="virtual" />
        <Sorting mode="multiple"/>

        <Column
          dataField="status"
          caption="Status"
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
        />
        <Column
          dataField="title"
          caption="Title"
          width={500}
          headerCellRender={customHeaderRender}
          cellRender={taskTitleComponent}
        />
        <Column
          dataField="assignee"
          caption="Assignee"
          groupIndex={0}
          headerCellRender={customHeaderRender}
          cellRender={customCellRender}
          // groupCellRender={(cellInfo) => (
          //   <div className="custom-group-cell">
          //     group cell test
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