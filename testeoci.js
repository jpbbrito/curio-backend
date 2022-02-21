const { common, database } = require('oci-sdk');

const provider = new common.ConfigFileAuthenticationDetailsProvider();

const tenancyId = 'ocid1.tenancy.oc1..aaaaaaaakv3ibsqxq2hymut6azcsyprkb3qryfk22hkahnsjm4pmnyuwwl2a';
const compartmentId = 'ocid1.compartment.oc1..aaaaaaaanewdynmctrau4oh62k6kwjaaw57u6xkefxyyrfclrsir36jl5zga';
const adminPassword = '#S3nh4..4dm1n';