import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from 'aws-cdk-lib';
import * as GarbageDay from '../lib/garbage-day-stack';

test('Creates Lambda Function with proper Timeout value and Alexa Skill', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new GarbageDay.GarbageDayStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(haveResourceLike('AWS::Lambda::Function', {
      Timeout: 7
    }));
    expectCDK(stack).to(haveResource('Alexa::ASK::Skill'));
});
