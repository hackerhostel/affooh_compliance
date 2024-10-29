import AddIcon from '../../assets/add_icon.png'
import {formatDateIfDate} from "../../utils/commonUtils.js";
import React from "react";

export const onToolbarPreparing = (e) => {
    const toolbarItems = e.toolbarOptions.items;
    const columnChooserButton = toolbarItems.find((item) => item.name === 'columnChooserButton');

    if (columnChooserButton) {
        columnChooserButton.options.icon = AddIcon;
    }
};

export const customCellRender = (data) => {
    if (typeof data.value === 'object') {
        return <div className="text-sm text-wrap text-start">{formatDateIfDate(data.value)}</div>;
    }
    return <div className="text-sm text-wrap text-start">{data.value}</div>;
};

export const customHeaderRender = (data) => {
    return <div className="font-bold text-gray-600">{data.column.caption}</div>;
};

export const priorityCellRender = (data) => {
    const priority = data?.value || ""

    const bgColors = {
        "High": "bg-priority-high",
        "Medium": "bg-priority-medium",
        "Low": "bg-priority-low",
        "": "bg-secondary-bgc"
    };

    const txtColors = {
        "High": "text-white",
        "Medium": "text-secondary-grey",
        "Low": "text-secondary-grey",
        "": "text-black"
    };

    return (
        <div
            className={`${bgColors[priority] || "bg-secondary-bgc"} ${txtColors[priority] || "text-black"} py-1 px-0.5 text-center text-xs rounded-md cursor-pointer`}>
            {priority}
        </div>
    );
}

export const statusCellRender = (data) => {
    const status = data?.value || ""

    const bgColors = {
        "To Do": "bg-task-status-to-do",
        "In Progress": "bg-task-status-in-progress",
        "Done": "bg-task-status-done",
        "QA": "bg-task-status-qa",
        "UAT": "bg-task-status-uat",
        "": "bg-secondary-bgc"
    };

    const bgBoldColors = {
        "To Do": "bg-task-status-to-do-bold",
        "In Progress": "bg-task-status-in-progress-bold",
        "Done": "bg-task-status-done-bold",
        "QA": "bg-task-status-qa-bold",
        "UAT": "bg-task-status-uat-bold",
        "": "bg-secondary-bgc"
    };

    return (
        <div
            className={`${bgColors[status] || "bg-secondary-bgc"} text-secondary-grey py-1 px-2  text-center text-xs rounded-md cursor-pointer flex justify-start gap-2`}>
            <div className={`${bgBoldColors[status] || "bg-secondary-bgc"} min-w-1 rounded-md`}></div>
            {status === "Done" ? 'Completed' : status}
        </div>
    );

    // console.log(status)
};