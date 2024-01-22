// AWS CDK
import {
  App,
  CfnOutput,
  Stack,
  StackProps,
  aws_iam as iam,
  aws_s3 as s3,
} from 'aws-cdk-lib';

// Constructs
import { Construct } from 'constructs';

/**
 * Code River Stack Properties
 */
interface CodeRiverStackProps extends StackProps {
  /**
   * GitHub Repository Name
   */
  readonly githubRepo: string;
}

/**
 * Code River Stack Construct
 */
class CodeRiverStack extends Stack {
  /**
   * Creates a new stack.
   *
   * @param scope Parent of this stack, usually an `App` or a `Stage`, but could be any construct.
   * @param id The construct ID of this stack. If `stackName` is not explicitly
   * defined, this id (and any parent IDs) will be used to determine the
   * physical ID of the stack.
   * @param props Stack properties.
   */
  constructor(scope: Construct, id: string, { githubRepo, ...props }: CodeRiverStackProps) {
    super(scope, id, props);

    // Data Source Bucket
    const dataSourceBucket = new s3.Bucket(this, 'DataSourceBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Data Source Bucket Name
    new CfnOutput(this, 'DataSourceBucketName', {
      value: dataSourceBucket.bucketName,
    });

    // GitHub OIDC Provider
    const githubOidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(this, 'GitHubOidcProvider', `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`);

    // GitHub Role
    const githubRole = new iam.Role(this, 'GitHubRole', {
      assumedBy: new iam.WebIdentityPrincipal(githubOidcProvider.openIdConnectProviderArn, {
        StringEquals: {
          [`${githubOidcProvider.openIdConnectProviderIssuer}:aud`]: 'sts.amazonaws.com',
        },
        StringLike: {
          [`${githubOidcProvider.openIdConnectProviderIssuer}:sub`]: `repo:${githubRepo}:*`,
        },
      }),
    });

    // Add permissions to access Data Source Bucket.
    dataSourceBucket.grantReadWrite(githubRole);

    // GitHub Role ARN
    new CfnOutput(this, 'GitHubRoleArn', {
      value: githubRole.roleArn,
    });
  }
}

// CDK App
const app = new App();

// GitHub Repository Name
const githubRepo = app.node.getContext('githubRepo');

// Code River Stack
new CodeRiverStack(app, `CodeRiver-${githubRepo}`, {
  env: { region: 'us-east-1' },
  githubRepo,
});
