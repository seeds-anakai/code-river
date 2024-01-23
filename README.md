# Code River

Code River is a platform for providing code-based development support using Amazon Bedrock.

## Setup

1. Install all dependencies.

```sh
yarn
```

2. Deploy the Code River stack, replacing `OWNER` and `REPOSITORY` with your details.

```sh
yarn cdk deploy -c githubRepo=OWNER/REPOSITORY --require-approval never
```

3. Create a new knowledge base for Amazon Bedrock in the US East (N. Virginia) Region.  
   Use the data source bucket created by cdk deploy.  
   https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base-create.html

4. Create the following secrets on your repository.

   | Name                    | Secret                                                            |
   | ----------------------- | ----------------------------------------------------------------- |
   | AWS_ROLE_ARN            | The ARN of the IAM role for GitHub created by cdk deploy.         |
   | KNOWLEDGE_BASE_ID       | ID of the knowledge base you created.                             |
   | DATA_SOURCE_ID          | ID of the data source for the knowledge base you created.         |
   | DATA_SOURCE_BUCKET_NAME | The name of the data source bucket created by cdk deploy.         |
   | MODEL_ARN               | arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-v2:1 |

5. Copy YAML files in `.github/workflows` to your repository.

6. Let's add an issue.
