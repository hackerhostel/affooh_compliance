/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listTestPlansByProject = /* GraphQL */ `
    query MyQuery($projectID: Int!) {
        listTestPlansByProject (projectID: $projectID) {
            id
            name
            projectID
            releaseID
            sprintID
        }
    }
`;
