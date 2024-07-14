/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const listUserInvitesByOrganization = /* GraphQL */ `
  query MyQuery {
    listUserInvitesByOrganization {
      id
      accepted
      deleted
      email
      invitedAt
      invitedBy {
        id
        firstName
        email
      }
      organization {
        id
        name
      }
      userRole {
        id
        name
      }
    }
  }
`;

export const getProjectBreakdown = /* GraphQL */ `
    query MyQuery($defaultProject: String) {
        getProjectBreakdownV2(defaultProject: $defaultProject) {
            id
            organizationName
            defaultProject {
                id
                name
                releases {
                    id
                    name
                    releaseDate
                    status
                    type {
                        id
                        name
                    }
                    version
                }
                sprints {
                    endDate
                    id
                    isBacklog
                    name
                    startDate
                    status {
                        colourCode
                        id
                        value
                    }
                }
                testSuites {
                    id
                    status {
                        id
                        type
                        value
                    }
                    summary
                }
            }
            projects {
                id
                name
                prefix
                projectType
            }
        }
    }
`;
