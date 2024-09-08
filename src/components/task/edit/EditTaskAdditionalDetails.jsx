import {Tab, TabGroup, TabList, TabPanel, TabPanels} from '@headlessui/react'
import Table from "../../table/Table.jsx";
import ColumnHeader from "../../table/ColumnHeader.jsx";

const categories = [
  {
    name: 'Sub Tasks',
    posts: [
      {
        id: 1,
        title: 'Does drinking coffee make you smarter?',
        date: '5h ago',
        commentCount: 5,
        shareCount: 2,
      },
      {
        id: 2,
        title: "So you've bought coffee... now what?",
        date: '2h ago',
        commentCount: 3,
        shareCount: 2,
      },
    ],
  },
  {
    name: 'Relationship',
    posts: [
      {
        id: 1,
        title: 'Is tech making coffee better or worse?',
        date: 'Jan 7',
        commentCount: 29,
        shareCount: 16,
      },
      {
        id: 2,
        title: 'The most innovative things happening in coffee',
        date: 'Mar 19',
        commentCount: 24,
        shareCount: 12,
      },
    ],
  },
  {
    name: 'Criteria',
    posts: [
      {
        id: 1,
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        date: '2d ago',
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  },
  {
    name: 'Test Cases',
    posts: [
      {
        id: 1,
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        date: '2d ago',
        commentCount: 9,
        shareCount: 5,
      },
      {
        id: 2,
        title: "The worst advice we've ever heard about coffee",
        date: '4d ago',
        commentCount: 1,
        shareCount: 2,
      },
    ],
  },
]

const rows = [
  {name: 'John Doe', email: 'john@example.com', role: 'Admin'},
  {name: 'Jane Smith', email: 'jane@example.com', role: 'Editor'},
  {name: 'Alice Johnson', email: 'alice@example.com', role: 'Subscriber'},
];

const EditTaskAdditionalDetails = () => {
  return (
    <div className="w-full mt-5">
      <TabGroup>
        <TabList className="flex gap-4">
          {categories.map(({name}) => (
            <Tab
              key={name}
              className="rounded-full py-1 px-3 text-sm/6 font-semibold bg-gray-900 text-white focus:outline-none data-[selected]:bg-primary-pink data-[hover]:bg-secondary-grey data-[selected]:data-[hover]:bg-primary-pink data-[focus]:outline-1 data-[focus]:outline-white"
            >
              {name}
            </Tab>
          ))}
        </TabList>
        <TabPanels className="mt-5 bg-gray-50 rounded-md w-full">
          {categories.map(({name, posts}) => (
            <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
              <Table rows={rows}>
                <ColumnHeader label="Name"/>
                <ColumnHeader label="Email"/>
                <ColumnHeader label="Role"/>
              </Table>
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  )
}

export default EditTaskAdditionalDetails;