// Imports
// TODO: Import the aws-sdk
const AWS = require('aws-sdk')
const helpers = require('./helpers')

// TODO: Configure region
AWS.config.update({
  region='us-east-1'
})

// Declare local variables
// TODO: Create an ec2 object
const ec2 = new AWS.ec2()
const sgName = 'hamster_sg'
const keyName = 'hamster_key'

// Do all the things together
createSecurityGroup(sgName)
.then(() => {
  return createKeyPair(keyName)
})
.then(helpers.persistKeyPair)
.then(() => {
  return createInstance(sgName, keyName)
})
.then((data) => {
  console.log('Created instance with:', data)
})
.catch((err) => {
  console.error('Failed to create instance with:', err)
})

// Create functions

function createSecurityGroup (sgName) {
  let sg_name_params = {
    Description: sgName,
    GroupName: sgName
  }

  return new Promise((resolve, reject) => {
    // creates security_group
    ec2.createSecurityGroup(sg_name_params, (err, data) => {
      if(err) reject(err)
      else{
        // SG rules: ssh and port 3000
        // get id from previous call response
        let sg_port_rules = {
          GroupId: data.GroupId,
          IpPermissions: [
            {
              IpProtocol: 'tcp',
              FromPort: 22,
              ToPort: 22,
              IpRanges: [
                {
                  CidrIp: '0.0.0.0/0'
                }
              ]
            },
            {
              IpProtocol: 'tcp',
              FromPort: 3000,
              ToPort: 3000,
              IpRanges: [
                {
                  CidrIp: '0.0.0.0/0'
                }
              ]
            }
          ]
        }
        // applu rules to SG
        ec2.authorizeSecurityGroup(sg_port_rules, (err) => {
          if (err) reject(err)
          else resolve()
        })
      }
    })
  })
}

function createKeyPair (keyName) {
  // TODO: Create keypair
}

function createInstance (sgName, keyName) {
  // TODO: create ec2 instance
}
