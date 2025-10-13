import React, { useState } from 'react';
import FormSelect from '../../components/FormSelect.jsx';
import DataGrid, {
    Column,
    ColumnChooser,
    GroupPanel,
    Grouping,
    Paging,
    Scrolling,
    Sorting
} from 'devextreme-react/data-grid';

const dummyData = [
    {
        id: "CNT-001",
        responsibility: {
            firstName: "John",
            lastName: "Doe",
        },
        type: "Full-Time",
        service: "Web Development",
        date: "2025-12-15"
    },
    {
        id: "CNT-002",
        responsibility: {
            firstName: "Jane",
            lastName: "Smith",
            avatar: null
        },
        type: "Part-Time",
        service: "Graphic Design",
        date: "2025-11-05"
    },
    {
        id: "CNT-003",
        responsibility: {
            firstName: "David",
            lastName: "Williams",
        },
        type: "Contract",
        service: "SEO Optimization",
        date: "2025-09-30"
    },
    {
        id: "CNT-004",
        responsibility: {
            firstName: "Emily",
            lastName: "Johnson",
        },
        type: "Internship",
        service: "Content Writing",
        date: "2025-10-18"
    },
    {
        id: "CNT-005",
        responsibility: null,
        type: "Freelance",
        service: "Social Media Marketing",
        date: "2025-08-25"
    }
];

const ExternalProvidesOverview = () => {
    const [formValues, setFormValues] = useState({
        option: 'types' // default selection
    });

    const optionsList = [
        { label: "Types", value: "types" },
        { label: "Applicability", value: "applicability" }
    ];

    return (
        <div>
            <div className="flex items-center justify-between mt-4">
                <FormSelect
                    name="option"
                    showLabel={false}
                    options={optionsList}
                    formValues={formValues}
                    onChange={({ target: { name, value } }) =>
                        setFormValues({ ...formValues, [name]: value })
                    }
                />

                <div>
                    
                </div>
            </div>

            <div className='mt-5'>
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
                        wordWrapEnabled={true}
                        width={120}
                    />
                    <Column
                        dataField="name"
                        caption="Name"
                        width={200}
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
                        dataField="type"
                        caption="Type"
                        width={150}
                    />
                    <Column
                        dataField="service"
                        caption="Service"
                    />
                    <Column
                        dataField="date"
                        caption="Contract End Date"
                        width={160}
                    />
                </DataGrid>

            </div>
        </div>
    );
};

export default ExternalProvidesOverview;
