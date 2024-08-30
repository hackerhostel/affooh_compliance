import * as yup from "yup";

export const TestPlanCreateSchema = yup.object({
    name: yup.string().required('Name is required'),
    sprintId: yup.number().required().min(1, 'Select an Sprint'),
    releaseId: yup.number().required().moreThan(0, 'Select an Release'),
});

export const TestSuiteCreateSchema = yup.object().shape({
    summary: yup.string().required('Summary is required'),
    status: yup.number().required('Status is required'),
    assignee: yup.number().required('Assignee is required'),
    releases: yup.array().min(1, 'At least one release is required'),
    platforms: yup.array().min(1, 'At least one platform is required'),
    testCases: yup.array().min(1, 'At least one platform is required'),
});