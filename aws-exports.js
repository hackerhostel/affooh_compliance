import { fetchAuthSession } from 'aws-amplify/auth';

const authToken = (await fetchAuthSession()).tokens?.idToken?.toString();

const awsmobile = {
  aws_project_region: 'us-east-1',
  aws_cognito_region: 'us-east-1',
  aws_user_pools_id: 'us-east-1_PF7Lb11Kj',
  aws_cognito_identity_pool_id:
    'us-east-1:da59795d-f493-4ca0-adf4-708255914dd6',
  aws_user_pools_web_client_id: '2n6p0kkkqjnc4nf7a106ei414n',
  aws_appsync_graphqlEndpoint: 'https://api.affooh.com/graphql',
  aws_appsync_region: 'us-east-1',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  aws_user_files_s3_bucket: 'afooh-prod-uploads',
  aws_user_files_s3_bucket_region: 'us-east-1',
  graphql_headers: authToken
};

export default awsmobile;
