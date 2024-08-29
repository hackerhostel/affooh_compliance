import * as yup from "yup";

export const TestPlanCreateSchema = yup.object({
    name: yup.string().required('Name is required'),
    sprintId: yup.number().required().min(1, 'Select an Sprint'),
    releaseId: yup.number().required().moreThan(0, 'Select an Release'),
});