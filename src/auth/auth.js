import {getBuildConstant} from "../constants/build-constants.jsx";
import awsExports from "../../aws-exports.js";

export const AwsConfigAuth = {
    ...awsExports,
    aws_project_region: getBuildConstant('REACT_APP_AUTH_REGION'),
    aws_cognito_region: getBuildConstant('REACT_APP_AUTH_REGION'),
    aws_user_pools_id: getBuildConstant('REACT_APP_AUTH_USER_POOL_ID'),
    aws_cognito_identity_pool_id: getBuildConstant('REACT_APP_COGNITO_IDENTITY_POOL_ID'),
    aws_user_pools_web_client_id: getBuildConstant('REACT_APP_AUTH_USER_POOL_WEB_CLIENT_ID'),
    aws_appsync_graphqlEndpoint: getBuildConstant('REACT_APP_APPSYNC_GRAPHQL_ENDPOINT'),
    aws_appsync_region: getBuildConstant('REACT_APP_APPSYNC_REGION'),
    aws_appsync_authenticationType: getBuildConstant('REACT_APP_APPSYNC_AUTHENTICATION_TYPE'),
    aws_user_files_s3_bucket: getBuildConstant('REACT_APP_S3_BUCKET'),
    aws_user_files_s3_bucket_region: getBuildConstant('REACT_APP_S3_BUCKET_REGION'),
    Storage: {
        bucket: getBuildConstant('REACT_APP_S3_BUCKET'),
        region: getBuildConstant('REACT_APP_S3_BUCKET_REGION'),
    },
    API: {
        endpoints: [
            {
                name: 'afooh-prod-public-api',
                endpoint: 'https://identity.affooh.com/'
            }
        ]
    },
    // REST: {
    //     'afooh-prod-public-api': {
    //         endpoint:
    //             'https://identity.affooh.com/',
    //         region: 'us-east-1' // Optional
    //     }
    // }
};