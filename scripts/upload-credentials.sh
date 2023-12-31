#!/bin/bash

# Purpose: Sample script for creating SSM Parameter Store Parameters and Secrets Manager Secrets
# that can be used to store credentials needed to create an Alexa Skill via the cdk-alexa-skill library.
# 
# REPLACE_ME should be replaced with actual credential values.


SET VENDOR_ID="REPLACE_ME"
SET CLIENT_ID="REPLACE_ME"
SET CLIENT_SECRET="REPLACE_ME"
SET REFRESH_TOKEN="REPLACE_ME"

aws ssm put-parameter --overwrite --name "/garbage-day/alexa-developer-vendor-id" --type "String" --value %VENDOR_ID%
aws ssm put-parameter --overwrite --name "/garbage-day/lwa-client-id" --type "String" --value %CLIENT_ID%
aws secretsmanager create-secret  --name "/garbage-day/lwa-client-secret" --secret-string %CLIENT_SECRET%
aws secretsmanager create-secret  --name "/garbage-day/lwa-refresh-token" --secret-string %REFRESH_TOKEN%
