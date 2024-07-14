/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSprint = /* GraphQL */ `
  mutation MyQuery($sprint: SprintCreateInput!) {
    createSprint(sprint: $sprint)
  }
`;

export const getSprint = /* GraphQL */ `
  query MyQuery($sprintID: Int!) {
    getSprint(sprintID: $sprintID) {
      id
      isBacklog
      name
      startDate
      updatedAt
      endDate
      createdAt
      status {
        id
        value
        colourCode
      }
      displayConfig {
        dataField
        index
      }
    }
  }
`;

export const fetchSprintDetails = /* GraphQL */ `
    query MyQuery($sprintID: Int!, $projectID: Int!) {
        listTasksBySprint(sprintID: $sprintID) {
            tasks {
                id
                code
                type
                epicID
                epicName
                attributes {
                    endDate {
                        attributeKey
                        taskFieldID
                        value
                    }
                    priority {
                        attributeKey
                        id
                        taskFieldID
                        value
                    }
                    severity {
                        attributeKey
                        id
                        taskFieldID
                        value
                    }
                    startDate {
                        attributeKey
                        taskFieldID
                        value
                    }
                    status {
                        attributeKey
                        id
                        taskFieldID
                        value
                    }
                    estimation {
                        value
                    }
                    release {
                        value
                    }
                    taskOwner {
                        value
                    }
                }
                assignee {
                    id
                    lastName
                    firstName
                }
                createdAt
                description
                hasParentTasks
                name
                parentTaskID
                timeLog {
                    time
                }
            }
            priorities {
                colourCode
                id
                value
            }
            severities {
                colourCode
                id
                value
            }
            statuses {
                colourCode
                id
                value
            }
        }
        getSprint(sprintID: $sprintID) {
            id
            isBacklog
            name
            startDate
            updatedAt
            endDate
            createdAt
            status {
                id
                value
                colourCode
            }
            displayConfig {
                dataField
                index
            }
        }
        listUsersByProject(projectID: $projectID) {
            id
            firstName
            lastName
            email
        }
        listTaskTypesByProject(projectID: $projectID) {
            description
            id
            name
            projects {
                id
                name
            }
            screen {
                id
                name
            }
        }
        getSprintFormData {
            id
            value
            colourCode
        }
        getProject(projectID: $projectID) {
            id
            name
            deletedAt
            deleted
            createdBy {
                id
                lastName
                firstName
            }
            colorTheme
            createdAt
            avatar
        }
    }
`;

export const updateSprint = /* GraphQL */ `
  mutation MyQuery($updatedSprintDetails: SprintUpdateInput!) {
    updateSprint(updatedSprintDetails: $updatedSprintDetails)
  }
`;

export const deleteSprint = /* GraphQL */ `
  mutation MyQuery($sprintID: Int!) {
    deleteSprint(sprintID: $sprintID)
  }
`;

export const listSprintsByProject = /* GraphQL */ `
  query MyQuery($projectID: Int!) {
    listSprintsByProject(projectID: $projectID) {
      id
      name
    }
  }
`;

export const getSprintFormData = /* GraphQL */ `
  query MyQuery {
    getSprintFormData {
      id
      value
      colourCode
    }
  }
`;

export const updateSprintDisplayConfig = /* GraphQL */ `
    mutation MyQuery($displayConfig: [DisplayConfigCreateInput!]!, $sprintID: Int!) {
      updateSprintDisplayConfig(displayConfig: $displayConfig, sprintID: $sprintID)
    }
`;

export const onDeleteSprint = /* GraphQL */ `
    subscription MyQuery {
        onDeleteSprint
    }
`;

export const getAllActiveSprints = /* GraphQL */ `
  query getAllActiveSprints($projectID: Int!) {
    getAllActiveSprints(projectID: $projectID) {
      id
      name
      projectId
     
    }
  }
`;
