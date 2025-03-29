#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { DynamicSite } from './dynamic-site';


/**
 * This stack relies on getting the domain name from CDK context.
 * Use 'cdk synth -c domain=mydynamicsite.com -c subdomain=www'
 * Or add the following to cdk.json:
 * {
 *   "context": {
 *     "domain": "mydynamicsite.com",
 *     "subdomain": "www",
 *     "accountId": "1234567890",
 *     "webPath": "../web/dist",
 *     "apiPath": "../api/dist",
 *     "apiHandler": "dist/index.handler",
 *     "folderRedirects": false
 *   }
 * }
 *
 * folderRedirects=true is needed for non SPA sites like MkDocs, where /somepath/ should redirect to /somepath/index.html
**/
class DynamicSiteStack extends cdk.Stack {
    constructor(parent: cdk.App, name: string, props: cdk.StackProps) {
        super(parent, name, props);

        new DynamicSite(this, 'DynamicSite', {
            domainName: this.node.tryGetContext('domain'),
            siteSubDomain: this.node.tryGetContext('subdomain'),
            webPath: this.node.tryGetContext('webPath'),
            apiPath: this.node.tryGetContext('apiPath'),
            apiHandler: this.node.tryGetContext('apiHandler') || 'dist/index.handler',
            folderRedirects: this.node.tryGetContext('folderRedirects')
        });
    }
}

const app = new cdk.App();

new DynamicSiteStack(app, `DynamicSite-${app.node.tryGetContext('subdomain')}`, {
    /**
     * This is required for our use of hosted-zone lookup.
     *
     * Lookups do not work at all without an explicit environment
     * specified; to use them, you must specify env.
     * @see https://docs.aws.amazon.com/cdk/latest/guide/environments.html
     */
    env: {
        account: app.node.tryGetContext('accountId'),
        /**
         * Stack must be in us-east-1, because the ACM certificate for a
         * global CloudFront distribution must be requested in us-east-1.
         */
        region: app.node.tryGetContext('region') || 'us-east-1',
    }
});

app.synth();
