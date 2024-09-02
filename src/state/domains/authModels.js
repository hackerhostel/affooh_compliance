import * as yup from 'yup';

export const LoginSchema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

export const TaskCreateSchema = yup.object({
  taskTypeID: yup.string().required("task type is required"),
  name: yup.string().required("task title is required"),
  description: yup.string(),
  taskOwner: yup.number(),
  epic: yup.number(),
  assignee: yup.number()
});