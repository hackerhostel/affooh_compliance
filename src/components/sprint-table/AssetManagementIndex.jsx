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
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

// Dummy data for both tables
const dummyData = [
  {
    id: 1,
    assetName: 'Dell Latitude 7420',
    serialKey: 'DL7420-ABC123',
    type: 'Laptop',
    classification: 'Confidential',
    department: 'IT',
    responsibility: {
      firstName: 'John',
      lastName: 'Doe',
      avatar: ''
    }
  }
  
];


const AssetManagementTable = () => {
    const [formValues, setFormValues] = useState({
        type: '',
        owner: '',
        classification: '',
        development: '',
        assigned: '',
    });
    return (
        <div className=''>
            <div>
                <div className='flex items-center justify-between'>
                    <div className='flex space-x-4 p-4'>
                        <div className='w-28'>
                            <FormSelect
                                name="type"
                                options={[]}
                                placeholder="Type"
                                showLabel={false}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>
                        <div className='w-28'>
                            <FormSelect
                                name="owner"
                                placeholder="Owner"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-36'>
                            <FormSelect
                                name="classification"
                                placeholder="Classification"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-28'>
                            <FormSelect
                                name="development"
                                placeholder="Development"
                                showLabel={false}
                                options={[]}
                                formValues={formValues}
                                onChange={(e) => setFormValues({ ...formValues, version: e.target.value })}
                            />
                        </div>

                        <div className='w-28'>
                            <FormSelect
                                name="assigned"
                                placeholder="Assigned"
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
            <div className="px-4 mt-5">
            
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
                        dataField="id"
                        caption="ID"
                        width={50}
                    />

                    <Column
                        dataField="assetName"
                        caption="Asset Name"
                        wordWrapEnabled={true}
                
                    />
                   
                    <Column
                        dataField="serialKey"
                        caption="Serial Key"
                    
                    />
                    <Column
                        dataField="type"
                        caption="Type"
                    />
                    <Column
                        dataField="classification"
                        caption="Classification"
                    />

                     <Column
                        dataField="department"
                        caption="Department"
                    />

                     <Column
                        dataField="owner"
                        caption="Owner"
                 
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
                        dataField="assigned"
                        caption="Assigned"
                  
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

                </DataGrid>
            </div>
        </div>
    );
};

export default AssetManagementTable;
