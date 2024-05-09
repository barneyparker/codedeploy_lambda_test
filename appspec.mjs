import fs from 'fs'
import { Lambda } from '@aws-sdk/client-lambda'

const lambda = new Lambda({ region: process.env.AWS_REGION })

const functionName = process.env.LAMBDA_FUNCTION_NAME || 'code_deploy_lambda'
const aliasName = process.env.LAMBDA_ALIAS_NAME || 'deploy'

const run = async () => {
  // get the current alias state
  const alias = await lambda.getAlias({
    FunctionName: functionName,
    Name: aliasName
  })

  console.log(JSON.stringify(alias, null, 2))

  // find the latest function published version (or $LATEST if not available)
  const versions = []
  const params = {
    FunctionName: functionName
  }

  do {
    const result = await lambda.listVersionsByFunction(params)
    versions.push(...result.Versions)
    params.Marker = result.NextMarker
  } while (params.Marker)

  console.log(JSON.stringify(versions, null, 2))

  if(versions.length === 0) {
    versions.push('$LATEST')
    console.log('no published versions found')
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
            TargetVersion: versions[versions.length - 1].Version,
          }
        }
      }
    ]
  }

  // write the appspec file to disk
  fs.writeFileSync('appspec.json', JSON.stringify(appspec, null, 2))
}

run()