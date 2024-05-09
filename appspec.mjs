import fs from 'fs'

// create a basic appspec file
const appspec = {
  version: 0.0,
  resources: [
    {
      "myLambdaFunction": {
        Type: 'AWS::Lambda::Function',
        Properties: {
          Name: 'myLambda',
          Alias: 'production',
          CurrentVersion: '1',
          TargetVersion: '2',
        }
      }
    }
  ]
}

// write the appspec file to disk
fs.writeFileSync('appspec.json', JSON.stringify(appspec, null, 2))
