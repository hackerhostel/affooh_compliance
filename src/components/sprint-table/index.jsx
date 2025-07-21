import React from 'react';
import DataGrid, {
  Column,
  ColumnChooser,
  GroupPanel,
  Grouping,
  Paging,
  Scrolling,
  Sorting
} from 'devextreme-react/data-grid';
import './custom-style.css';
import FormTextArea from "../FormTextArea.jsx";
import FormSelect from '../FormSelect';

// Dummy data for both tables
const dummyData = [
  {
    id: 1,
    title: 'ISO control - close/Annex A',
    currentGaps: 'Gap 1: Missing documentation',
    complianceStatus: 'Non-Compliant',
    severity: 'High',
    recommendedAction: 'Review and update documentation accordingly.',
    responsibility: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    },
    dueDate: '2025-08-15',
    status: 'In Progress',
    task: 'Update ISO documentation'
  }
];

const complianceOptions = [
  { label: 'Non-Compliant', value: 'Non-Compliant' },
  { label: 'Partially Compliant', value: 'Partially Compliant' },
  { label: 'Compliant', value: 'Compliant' },
];

const severityOptions = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

const statusOptions = [
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Pending', value: 'Pending' },
];

const DummyTable = () => {
  return (
    <div className="px-4">
      <DataGrid
        dataSource={dummyData}
        width="100%"
        className="shadow-lg rounded-lg overflow-hidden dummy-grid-table mb-10"
        showRowLines={true}
        showColumnLines={false}
      >
        <ColumnChooser enabled={false} mode="select" />
        <GroupPanel visible={false} />
        <Grouping autoExpandAll={false} />
        <Paging enabled={false} />
        <Scrolling columnRenderingMode="virtual" />
        <Sorting mode="multiple" />

        <Column
          dataField="title"
          caption="ISO control - close/Annex A"
          width={350}
        />
        <Column
          dataField="currentGaps"
          caption="Current Gaps"
          cellRender={({ data }) => (
            <FormTextArea
              name="currentGaps"
              formValues={{ currentGaps: data.currentGaps }}
              onChange={() => { }}
              showLabel={false}
              className="w-full"
            />
          )}
        />
        <Column
          dataField="complianceStatus"
          caption="Compliance Status"
          cellRender={({ data }) => (
            <FormSelect
              name="complianceStatus"
              value={data.complianceStatus}
              options={complianceOptions}
              onChange={() => { }}
              showLabel={false}
              className="w-full"
            />
          )}
        />
        <Column
          dataField="severity"
          caption="Severity"
          cellRender={({ data }) => (
            <FormSelect
              name="severity"
              value={data.severity}
              options={severityOptions}
              onChange={() => { }}
              showLabel={false}
              className="w-full"
            />
          )}
        />
      </DataGrid>

      {/* Second Table */}
      <DataGrid
        dataSource={dummyData}
        width="100%"
        className="shadow-lg rounded-lg overflow-hidden dummy-grid-table"
        showRowLines={true}
        showColumnLines={false}
      >
        <ColumnChooser enabled={false} mode="select" />
        <GroupPanel visible={false} />
        <Grouping autoExpandAll={false} />
        <Paging enabled={false} />
        <Scrolling columnRenderingMode="virtual" />
        <Sorting mode="multiple" />

        <Column
          dataField="recommendedAction"
          caption="Recommended Action"
          wordWrapEnabled={true}
          width={420}
          cellRender={({ data }) => (
            <FormTextArea
              name="recommendedAction"
              formValues={{ recommendedAction: data.recommendedAction }}
              onChange={() => { }}
              showLabel={false}
              
            />
          )}
        />
        <Column
          dataField="responsibility"
          caption="Responsibility"
          width={150}
          cellRender={({ data }) => {
            const user = data?.responsibility;

            if (!user) return <span className="text-gray-400 italic">No user</span>;

            return (
              <div className="flex items-center space-x-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary-pink flex items-center justify-center text-white text-sm font-semibold">
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </div>
                )}
                <span>{user.firstName} {user.lastName}</span>
              </div>
            );
          }}
        />

        <Column
          dataField="dueDate"
          caption="Due Date"
          width={130}
        />
        <Column
          dataField="status"
          caption="Status"
          cellRender={({ data }) => (
            <FormSelect
              name="status"
              value={data.status}
              options={statusOptions}
              onChange={() => { }}
              showLabel={false}
              className="w-48"
            />
          )}
        />
        <Column
          dataField="task"
          caption="Task"
        />
      </DataGrid>
    </div>
  );
};

export default DummyTable;
