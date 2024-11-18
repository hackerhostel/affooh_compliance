import React from 'react';
import {Tab, TabGroup, TabList, TabPanel, TabPanels} from "@headlessui/react";
import TimeLogging from "./TimeLogging.jsx";
import CommentSection from "./CommentSection.jsx";

const CommentAndTimeTabs = ({timeLogs, taskId, refetchTimeLogs}) => {
    return (
        <div className="w-full mt-8">
            <TabGroup>
                <TabList className="flex gap-4">
                    <Tab
                        key={'comments'}
                        className="w-28 rounded-full py-2 px-3 text-sm bg-white text-secondary-grey data-[selected]:bg-black data-[selected]:text-white"
                    >
                        Comments
                    </Tab>
                    <Tab
                        key={'timelogs'}
                        className="w-28 rounded-full py-2 px-3 text-sm bg-white text-secondary-grey data-[selected]:bg-black data-[selected]:text-white"
                    >
                        Time log
                    </Tab>
                </TabList>
                <TabPanels>
                    <TabPanel key={'comments'}>
                        <CommentSection/>
                    </TabPanel>
                    <TabPanel key={'timelogs'}>
                        <TimeLogging timeLogs={timeLogs} taskId={taskId} refetchTimeLogs={refetchTimeLogs}/>
                    </TabPanel>
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default CommentAndTimeTabs;
