import React, { useState } from 'react'
import DataGrid, { Column, ColumnChooser, GroupPanel, Grouping, Paging, Scrolling, Sorting } from 'devextreme-react/data-grid'
import { PlusCircleIcon } from '@heroicons/react/24/outline'
import CreateDocument from './CreateDocumentComponent.jsx'


const FolderContentPage = ({ folder }) => {
    if (!folder) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-sm text-gray-500">Select a folder to view details</div>
            </div>
        )
    }

    const [isOpen, setIsOpen] = useState(false);

    const onAddNew = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <div className="p-6 bg-dashboard-bgc h-full">
            <div className="flex items-center space-x-5">
                <span className='text-text-color text-2xl font-medium'>Documents</span>
                <button type="button" onClick={onAddNew} className='flex items-center'>
                    <PlusCircleIcon className='w-5 text-primary-pink'/>
                    <span className='text-sm text-text-color ml-1 cursor-pointer'>Add New</span>
                </button>
            </div>

            <div className='bg-white mt-5 h-full'>
            <div className="p-10  bg-white rounded-lg shadow-lg overflow-hidden">
                <DataGrid
                    dataSource={folder.documents || []}
                    width="100%"
                    className="dummy-grid-table"
                    showRowLines={true}
                    showColumnLines={false}
                >
                    <ColumnChooser enabled={false} mode="select" />
                    <GroupPanel visible={false} />
                    <Grouping autoExpandAll={false} />
                    <Paging enabled={false} />
                    <Scrolling columnRenderingMode="virtual" />
                    <Sorting mode="multiple" />

                    <Column dataField="name" caption="Name" />
                    <Column dataField="modified" caption="Modified" width={160} />
                    <Column dataField="modifiedBy" caption="Modified By" width={200} />
                </DataGrid>
            </div>
            </div>
            <CreateDocument isOpen={isOpen} onClose={handleClose} />
        </div>
    )
}

export default FolderContentPage