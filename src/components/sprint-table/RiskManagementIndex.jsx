import React, { useEffect, useState } from 'react'
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
import FormSelect from '../FormSelect.jsx';
import FormInput from '../FormInput.jsx';
import RiskLevelCell from '../../components/RiskCell.jsx';
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

// Dummy data for both tables
const dummyData = [

   {
    id: 1,
    title: 'ISO control - close/Annex A',
    currentGaps: 'Gap 1: Missing documentation',
    complianceStatus: 'Non-Compliant ',
    severity: 'High',
    recommendedAction: 'Review dd and update documentation accordingly.',
    responsibility: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    },
    dueDate: '2025-08-15',
    status: 'In Progress',
    task: 'Update ISO documentation',

    // 👇 Additional fields for 3rd table
    interestedParties: 'External Auditors, Internal Compliance Team',
    threat: 'non-compliance',
    references: 'ISMS manual',
    reAssessmentDate: '2025-12-01',
    reAssessmentComment: 'Re-assessed controls found partially effective. Further review scheduled.'
  },
];



const responseOptions = [
    { label: 'Mitigate', value: 'Mitigate' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
];

const statusOptions = [
    { label: 'In Progress', value: 'In Progress' },
    { label: 'Completed', value: 'Completed' },
    { label: 'Pending', value: 'Pending' },
];

const RiskManagementTable = () => {
    const [formValues, setFormValues] = useState({
        control: '',
        assignee: '',
        compliance: '',
        severity: '',
        status: '',
    });
    return (
        <div className=''>
            <div>
                <div className='flex items-center justify-between'>
                    <div className='flex space-x-4 p-4'>
                        <div className='w-28'>
                            <FormSelect
                                name="control"
                                options={[]}
                                placeholder="Control"
                                showLabel={false}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>
                        <div className='w-28'>
                            <FormSelect
                                name="assignee"
                                placeholder="Assignee"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-36'>
                            <FormSelect
                                name="compliance"
                                placeholder="Compliance"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-28'>
                            <FormSelect
                                name="severity"
                                placeholder="Severity"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-28'>
                            <FormSelect
                                name="status"
                                placeholder="Status"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className='flex w-32'>
                        <button
                            className='btn-primary h-10 rounded-md'
                            type='button'>
                            Update
                        </button>
                        <EllipsisVerticalIcon className="w-8" />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4">
                {/* Table 1 */}
                <DataGrid
                    dataSource={dummyData}
                    width="100%"
                    className="rounded-lg  dummy-grid-table"
                    showRowLines={true}
                    showColumnLines={false}
                >
                    <ColumnChooser enabled={false} />
                    <GroupPanel visible={false} />
                    <Grouping autoExpandAll={false} />
                    <Paging enabled={false} />
                    <Scrolling columnRenderingMode="virtual" />
                    <Sorting mode="multiple" />
                    <Column
                        dataField="id"
                        caption="ID"
                        width={60}
                    />
                    <Column dataField="title" caption="ISO control - close/Annex A" />
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
                        dataField="riskLevel"
                        caption="Risk Level"
                        cellRender={({ data }) => <RiskLevelCell data={data} />}
                    />

                    <Column
                        dataField="owner"
                        caption="Owner"
                        width={150}
                        cellRender={({ data }) => {
                            const user = data?.responsibility;
                            return user ? (
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
                            ) : (
                                <span className="text-gray-400 italic">No user</span>
                            );
                        }}
                    />

                    <Column
                        dataField="riskLevel"
                        caption="Risk Level"
                        cellRender={({ data }) => <RiskLevelCell data={data} />}
                    />



                </DataGrid>

                {/* Table 2 */}
                <DataGrid
                    dataSource={dummyData}
                    width="100%"
                    className="shadow-lg rounded-lg overflow-hidden dummy-grid-table"
                    showRowLines={true}
                    showColumnLines={false}
                >
                    <ColumnChooser enabled={false} />
                    <GroupPanel visible={false} />
                    <Grouping autoExpandAll={false} />
                    <Paging enabled={false} />
                    <Scrolling columnRenderingMode="virtual" />
                    <Sorting mode="multiple" />

                    <Column
                        dataField="response"
                        caption="Response"
                        width={140}
                        cellRender={({ data }) => (
                            <FormSelect
                                name="status"
                                value={data.status}
                                options={responseOptions}
                                onChange={() => { }}
                                showLabel={false}
                            />
                        )}
                    />

                    <Column
                        dataField="recommendedAction"
                        caption="Recommended Action"
                        wordWrapEnabled={true}
                        width={300}
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
                        dataField="owner"
                        caption="Owner"
                        width={150}
                        cellRender={({ data }) => {
                            const user = data?.responsibility;
                            return user ? (
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
                            ) : (
                                <span className="text-gray-400 italic">No user</span>
                            );
                        }}
                    />
                    <Column
                        dataField="dueDate"
                        caption="Due Date"
                        width={130}
                        cellRender={({ data }) => (
                            <FormInput
                                name="dueDate"
                                type="date"
                                value={data.dueDate}
                                onChange={(e) => {
                                    data.dueDate = e.target.value; // Optionally, call a state update if needed
                                }}
                                showLabel={false}
                                className="w-full"
                            />
                        )}
                    />

                    <Column
                        dataField="status"
                        caption="Status"
                        width={160}
                        cellRender={({ data }) => (
                            <FormSelect
                                name="status"
                                value={data.status}
                                options={statusOptions}
                                onChange={() => { }}
                                showLabel={false}
                            />
                        )}
                    />
                    <Column dataField="task" caption="Task" />
                </DataGrid>

                <DataGrid
                    dataSource={dummyData}
                    width="100%"
                    className="shadow-lg rounded-lg overflow-hidden dummy-grid-table"
                    showRowLines={true}
                    showColumnLines={false}
                >
                    <ColumnChooser enabled={false} />
                    <GroupPanel visible={false} />
                    <Grouping autoExpandAll={false} />
                    <Paging enabled={false} />
                    <Scrolling columnRenderingMode="virtual" />
                    <Sorting mode="multiple" />

                    <Column
                        dataField="interestedParties"
                        caption="Interested Parties"
                        width={300}
                    />

                     <Column
                        dataField="threat"
                        caption="Threat"
                        width={140}
                    />

                     <Column
                        dataField="references"
                        caption="References"
                        width={140}
                    />

                    <Column
                        dataField="reAssessmentDate"
                        caption="Re-Assessment Date"
                        width={130}
                        cellRender={({ data }) => (
                            <FormInput
                                name="dueDate"
                                type="date"
                                value={data.dueDate}
                                onChange={(e) => {
                                    data.dueDate = e.target.value; // Optionally, call a state update if needed
                                }}
                                showLabel={false}
                                className="w-full"
                            />
                        )}
                    />

                    <Column
                        dataField="reAssessmentComment"
                        caption="Re-Assessment Comment(s)"
                        wordWrapEnabled={true}
                        width={300}
                        cellRender={({ data }) => (
                            <FormTextArea
                                name="recommendedAction"
                                formValues={{ recommendedAction: data.recommendedAction }}
                                onChange={() => { }}
                                showLabel={false}
                            />
                        )}
                    />

                </DataGrid>
            </div>
        </div>
    );
};

export default RiskManagementTable;
