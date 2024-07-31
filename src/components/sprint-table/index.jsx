import React from 'react';
import DataGrid, {
  Column,
  SearchPanel,
  Paging, GroupPanel, Grouping, ColumnChooser, Scrolling, Sorting,
} from 'devextreme-react/data-grid';
import {formatDateIfDate} from "../../utils/commonUtils.js";

import './custom-style.css';

const hardcodedData = [
  {
    id: 1,
    status: 'In Progress',
    title: 'Implement user authentication',
    assignee: 'John Doe',
    epic: 'User Management',
    startDate: '2024-08-01',
    endDate: '2024-08-15',
    type: 'Feature',
    priority: 'High'
  },
  {
    id: 2,
    status: 'To Do',
    title: 'Design new dashboard layout',
    assignee: 'Jane Smith',
    epic: 'UI Redesign',
    startDate: '2024-08-05',
    endDate: '2024-08-20',
    type: 'Task',
    priority: 'Medium'
  },
  {
    id: 3,
    status: 'Done',
    title: 'Fix login page bug',
    assignee: 'Bob Johnson',
    epic: 'Bug Fixes',
    startDate: '2024-07-28',
    endDate: '2024-07-30',
    type: 'Bug',
    priority: 'High'
  },
  {
    id: 4,
    status: 'In Review',
    title: 'Implement data export feature',
    assignee: 'Alice Brown',
    epic: 'Data Management',
    startDate: '2024-08-10',
    endDate: '2024-08-25',
    type: 'Feature',
    priority: 'Medium'
  },
  {
    id: 5,
    status: 'To Do',
    title: 'Optimize database queries',
    assignee: 'Charlie Wilson',
    epic: 'Performance Improvements',
    startDate: '2024-08-15',
    endDate: '2024-08-30',
    type: 'Task',
    priority: 'Low'
  }
];

const SprintTable = () => {
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
        dataSource={hardcodedData}
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