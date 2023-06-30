import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Skill } from 'cdk-alexa-skill';


const ALEXA_DEVELOPER_SSM_PARAM_PREFIX = '/garbage-day/'


export class GarbageDayStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
 // Get Alexa Developer credentials from SSM Parameter Store/Secrets Manager.
    // NOTE: Parameters and secrets must have been created in the appropriate account before running `cdk deploy` on this stack.
    //       See sample script at scripts/upload-credentials.sh for how to create appropriate resources via AWS CLI.
    const alexaVendorId = ssm.StringParameter.valueForStringParameter(this, `${ALEXA_DEVELOPER_SSM_PARAM_PREFIX}alexa-developer-vendor-id`);
    const lwaClientId = ssm.StringParameter.valueForStringParameter(this, `${ALEXA_DEVELOPER_SSM_PARAM_PREFIX}lwa-client-id`);
    const lwaClientSecret = cdk.SecretValue.secretsManager(`${ALEXA_DEVELOPER_SSM_PARAM_PREFIX}lwa-client-secret`);
    const lwaRefreshToken = cdk.SecretValue.secretsManager(`${ALEXA_DEVELOPER_SSM_PARAM_PREFIX}lwa-refresh-token`);
  
    // Create the Lambda Function for the Skill Backend
    const skillBackend = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'SkillBackend', {
      entry: 'src/lambda/skill-backend/index.js',
      timeout: cdk.Duration.seconds(7),
    });

    
 

    // Create the Alexa Skill
    const skill = new Skill(this, 'Skill', {
      endpointLambdaFunction: skillBackend,
      skillPackagePath: 'src/skill-package',
      alexaVendorId: alexaVendorId,
      lwaClientId: lwaClientId,
      lwaClientSecret:lwaClientSecret,
      lwaRefreshToken: lwaRefreshToken 
    });
  }
}