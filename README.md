# Deploy Alexa Skills with the AWS CDK v2 from Amazon CodeCatalyst

## Sample Code Repository

The  blog post [[Build a CI/CD Pipeline using Amazon CodeCatalyst to deploy an Alexa Skill with CDK v2](https://vivek-aws.medium.com/build-a-ci-cd-pipeline-using-amazon-codecatalyst-to-deploy-an-alexa-skill-with-cdk-v2-d72fc2d6de9c)]() demonstrates how to leverage the AWS CDK v2 to achieve Infrastructure-as-Code for your Alexa Skills and orchestrate it using CodeCatalyst CI/CD pipeline. 
The solution uses [an open-source construct library](https://www.npmjs.com/package/cdk-alexa-skill) to deploy a Garbage Collection Day Alexa skill via the AWS CDK v2.

### Usage

[See blog post]() for detailed solution walkthrough. This code is fully functional and can be deployed as is. 
The only requirement is the following SSM parameters must be present in the AWS account being deployed to:

| Parameter Name                            | Service                | Type                      | Description                        |
| ----------------------------------------- | ---------------------- | ------------------------- | ---------------------------------- |
| /garbage-day/alexa-developer-vendor-id | SSM Parameter          | String                    | Alexa Developer Vendor ID          |
| /garbage-day/lwa-client-id             | SSM Parameter          | String                    | LWA Security Profile Client ID     |
| /garbage-day/lwa-client-secret         | Secrets Manager Secret | Plaintext / secret-string | LWA Security Profile Client Secret |
| /garbage-day/lwa-refresh-token         | Secrets Manager Secret | Plaintext / secret-string | LWA Security Profile Refresh Token | 

A sample CLI script for uploading these parameters can be found [here](scripts/upload-credentials.sh). Full descriptions and how-tos for retrieving each value can be found in the blog post solution walkthrough.
