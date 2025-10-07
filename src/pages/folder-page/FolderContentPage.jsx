import React from 'react'
import DataGrid, { Column, ColumnChooser, GroupPanel, Grouping, Paging, Scrolling, Sorting } from 'devextreme-react/data-grid'

const FolderContentPage = ({ folder }) => {
    if (!folder) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-sm text-gray-500">Select a folder to view details</div>
            </div>
        )
    }

    return (
        <div className="p-6 bg-dashboard-bgc h-full">
            <div className="flex items-center justify-between">
                <span className='text-text-color text-2xl font-medium'>Documents</span>
            </div>

            <div className="px-0 mt-5 bg-white rounded-lg shadow-lg overflow-hidden">
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
    )
}

export default FolderContentPage