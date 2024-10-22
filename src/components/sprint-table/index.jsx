import React, {useEffect, useState} from 'react';
import DataGrid, {
  Column,
  ColumnChooser,
  Grouping,
  GroupPanel,
  Paging,
  Scrolling,
  Sorting
} from 'devextreme-react/data-grid';
import {formatDateIfDate} from "../../utils/commonUtils.js";
import './custom-style.css';
import {useHistory} from "react-router-dom";
import {onToolbarPreparing} from "./utils.jsx";
import MenuTabs from '../../assets/menu_tabs.png'
import FormSelect from "../FormSelect.jsx";
import SearchBar from "../SearchBar.jsx";

const SprintTable = ({taskList, typeList, filters, onSelectFilterChange}) => {
  const history = useHistory();

  const [filteredTaskList, setFilteredTaskList] = useState(taskList);

  useEffect(() => {
    setFilteredTaskList(taskList)
  }, [taskList]);

  const taskTitleComponent = (data) => {
    return <button
        className="px-2 py-1 text-sm hover:bg-gray-50 rounded-lg text-wrap text-start"
        onClick={() => {
          history.push(`/task/${data?.key?.taskCode}`);
        }}
    >
      {data.value}
    </button>
  };

  const customCellRender = (data) => {
    if (typeof data.value === 'object') {
      return <div className="text-sm text-wrap text-start">{formatDateIfDate(data.value)}</div>;
    }
    return <div className="text-sm text-wrap text-start">{data.value}</div>;
  };

  const customHeaderRender = (data) => {
    return <div className="font-bold text-gray-600">{data.column.caption}</div>;
  };

  const handleSearch = (term) => {
    let filtered = taskList;

    if (term.trim() !== '') {
      filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(term.toLowerCase())
      );
    } else {
      setFilteredTaskList(taskList);
    }

    setFilteredTaskList(filtered);
  };

  return (
      <div className="px-4">
        <div className="mb-2 flex items-center justify-between w-full">
          <div className="flex gap-5 w-1/2 items-center">
            <p className='text-secondary-grey text-lg font-medium'>{`Tasks (${filteredTaskList && filteredTaskList.length})`}</p>
            <div className={"min-w-28"}>
              <FormSelect
                  name="type"
                  formValues={{type: filters?.type}}
                  options={typeList}
                  onChange={({target: {name, value}}) => onSelectFilterChange(value, name)}
              />
            </div>
            <SearchBar onSearch={handleSearch}/>
          </div>
          <div className="flex items-center w-1/2 ">
            <img src={MenuTabs} alt="Menu tabs"/>
          </div>
        </div>
        <DataGrid
            dataSource={filteredTaskList}
            allowColumnReordering={true}
            showBorders={true}
            width="100%"
            className="shadow-lg rounded-lg overflow-hidden sprint-grid-table h-task-list-screen"
            showRowLines={true}
            showColumnLines={true}
            onToolbarPreparing={onToolbarPreparing}
        >
          <ColumnChooser enabled={true} mode="select"/>
          <GroupPanel visible/>
          <Grouping autoExpandAll/>
          <Paging enabled={false}/>
          <Scrolling columnRenderingMode="virtual"/>
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
              width={400}
              headerCellRender={customHeaderRender}
              cellRender={taskTitleComponent}
          />
          <Column
              dataField="assignee"
              caption="Assignee"
              groupIndex={0}
              headerCellRender={customHeaderRender}
              cellRender={customCellRender}
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