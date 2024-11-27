import React, {useState} from 'react';
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import {PlusCircleIcon} from "@heroicons/react/24/outline/index.js";
import SubTaskSection from "./SubTaskSection.jsx";
import {useSelector} from "react-redux";
import {selectUser} from "../../../state/slice/authSlice.js";
import {selectProjectUserList} from "../../../state/slice/projectUsersSlice.js";

const TaskRelationTabs = ({taskId, subTasks}) => {
    const userDetails = useSelector(selectUser);
    const users = useSelector(selectProjectUserList);

    const tabs = [
        {key: 'sub_task', label: 'Sub Task', content: 'Sub Task(s)'},
        {key: 'relationship', label: 'Relationship', content: 'Relationship(s)'},
        {key: 'criteria', label: 'Criteria', content: 'Criteria(s)'},
        {key: 'test_cases', label: 'Test Cases', content: 'Test Cases(s)'},
    ];

    const [selectedTab, setSelectedTab] = useState('sub_task');
    const [addingNew, setAddingNew] = useState(false)

    return (
        <div className="w-full mt-10">
            <TabGroup onChange={(index) => setSelectedTab(tabs[index].key)}>
                <div className={"flex justify-between"}>
                    <div className={"flex"}>
                        <span className="font-semibold text-secondary-grey text-lg mt-1">
                            {tabs.find((tab) => tab.key === selectedTab)?.content}
                        </span>
                        <div className={"flex gap-1 items-center ml-5 cursor-pointer"}
                             onClick={() => setAddingNew(true)}>
                            <PlusCircleIcon className={"w-6 h-6 text-pink-500"}/>
                            <span className="font-thin text-xs text-gray-600">Add New</span>
                        </div>
                    </div>
                    <TabList className="flex gap-4">
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.key}
                                className={({selected}) =>
                                    `w-28 rounded-full py-2 px-3 text-sm 
                                ${selected ? 'bg-black text-white' : 'bg-white text-secondary-grey'}`
                                }
                            >
                                {tab.label}
                            </Tab>
                        ))}
                    </TabList>
                </div>
                <TabPanels>
                    <TabPanel key={'sub_task'}>
                        <SubTaskSection
                            subtasks={subTasks}
                            addingNew={addingNew}
                            selectedTab={selectedTab}
                            setAddingNew={setAddingNew}
                            users={users}
                        ></SubTaskSection>
                    </TabPanel>
                    <TabPanel key={'relationship'}>
                        <div className={'mt-8'}>Relationship</div>
                    </TabPanel>
                    <TabPanel key={'criteria'}>
                        <div className={'mt-8'}>Criteria</div>
                    </TabPanel>
                    <TabPanel key={'test_cases'}>
                        <div className={'mt-8'}>Test Cases</div>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default TaskRelationTabs;
