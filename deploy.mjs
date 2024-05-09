import fs from 'fs'
import { Lambda } from '@aws-sdk/client-lambda'
import { zip, COMPRESSION_LEVEL } from 'zip-a-folder'

const lambda = new Lambda({ region: process.env.AWS_REGION })

const functionName = process.env.LAMBDA_FUNCTION_NAME || 'code_deploy_lambda'
const aliasName = process.env.LAMBDA_ALIAS_NAME || 'deploy'

const run = async () => {
  // zip the scr directory into a bundle.zip file with files listed at the root of the zip
  await zip('src/*.*', 'bundle.zip', { compression: COMPRESSION_LEVEL.high })

  // publish this bundle to the lambda function
  const publish = await lambda.updateFunctionCode({
    FunctionName: functionName,
    ZipFile: fs.readFileSync('bundle.zip'),
    Publish: true,
  })

  console.log('Publish: ', JSON.stringify(publish, null, 2))

  // get the current alias state
  const alias = await lambda.getAlias({
    FunctionName: functionName,
    Name: aliasName
  })

  console.log('Alias: ', JSON.stringify(alias, null, 2))

  // find the latest function published version (or $LATEST if not available)
  const versions = []
  const params = {
    FunctionName: functionName
  }

  // create a basic appspec file
  const appspec = {
    version: 0.0,
    resources: [
      {
        "myLambdaFunction": {
          Type: 'AWS::Lambda::Function',
          Properties: {
            Name: functionName,
            Alias: aliasName,
            CurrentVersion: alias.FunctionVersion,
            TargetVersion: publish.Version,
          }
        }
      }
    ]
  }

  console.log('Appspec: ', JSON.stringify(appspec, null, 2))

  // write the appspec file to disk
  fs.writeFileSync('appspec.json', JSON.stringify(appspec, null, 2))
}

run()