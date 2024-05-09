import fs from 'fs'

// create a basic appspec file
const appspec = {
  version: 0.0,
  resources: [
    {
      type: 'lambda',
      name: 'myLambda',
      properties: {
        alias: 'production',
        currentVersion: '1',
        targetVersion: '2',
      },
    },
  ],
}

// write the appspec file to disk
fs.writeFileSync('appspec.json', JSON.stringify(appspec, null, 2))
