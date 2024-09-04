import * as yup from "yup";

export const TestPlanCreateSchema = yup.object({
    name: yup.string().required('Name is required'),
    sprintId: yup.number().required().min(1, 'Select an Sprint'),
    releaseId: yup.number().required().moreThan(0, 'Select an Release'),
});

export const TestSuiteCreateSchema = yup.object().shape({
    summary: yup.string().required('Summary is required'),
    status: yup.number().typeError('Status is required').required('Status is required').min(1, 'Status is required'),
    assignee: yup.number().typeError('Assignee is required').required('Assignee is required').min(1, 'Assignee is required'),
    build: yup.string().required('Build name is required'),
    releases: yup.array().min(1, 'Please select at-least one release option'),
    platforms: yup.array().min(1, 'Please select at-least one platform option'),
    testCases: yup.array().min(1, 'Please select at-least one test case option'),
});