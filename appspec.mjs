import fs from 'fs'

// create a basic appspec file
const appspec = {
  version: 0.0,
  resources: [
    {
      "myLambdaFunction": {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Name: process.env.LAMBDA_FUNCTION_NAME || 'unknown-function-name',
          Alias: process.env.LAMBDA_ALIAS_NAME || 'unknown-alias-name',
          CurrentVersion: '1',
          TargetVersion: '2',
        }
      }
    }
  ]
}

// write the appspec file to disk
fs.writeFileSync('appspec.json', JSON.stringify(appspec, null, 2))
