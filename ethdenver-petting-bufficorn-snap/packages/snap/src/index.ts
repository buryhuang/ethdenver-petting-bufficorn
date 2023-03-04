import { OnTransactionHandler } from '@metamask/snaps-types';
import { heading, panel, text } from '@metamask/snaps-ui';

// Handle outgoing transactions
export const onTransaction: OnTransactionHandler = async ({ transaction, chainId }) => {
  console.log('Transaction insights transaction', transaction);

  // Get tx data
  const fromAddress = transaction.from;
  const toAddress = transaction.to;
  const txChainId = chainId.split(":")[1];

  // Call api for risk assessment
  // 0xecd2106311e08F55d10707F09E75BB107F2B1C92
  const url = `https://api.gopluslabs.io/api/v1/address_security/${toAddress}?chain_id=${txChainId}`;
  const response = await fetch(url);
  const respData = await response.json();
  console.log(respData);

  const petUrl = `http://127.0.0.1:8700/pet_happy`
  await fetch(petUrl); // notify pet

  // // Cases for returning insights
  // if (data.status == "ok"){
  //   const individual_scores = stringify_json('individual_scores', data)
  //   const individual_details = stringify_json('contract_info', data)
  //   return {
  //     insights: {"Risk Assessment": data.risk_level, "Security Score": data.security_score, "Recommendation": data.recommendation, "Details": individual_details, "Individual Scores": individual_scores, "Assessment Timestamp": data.risk_assessment_timestamp, "IPFS Storage Hash": data.ipfs_hash},
  //   };
  // } else if(data.status =='error, not a contract address'){
  //   return {
  //     insights: {"No Score Available": "No interaction with a smart contract detected.", "Assessment Timestamp": data.risk_assessment_timestamp},
  //   };
  // } else if(data.status =='error, unsupported chain'){
  //   return {
  //     insights: {"Chain Not Supported": "We are currently supporting Ethereum and Goerli only. We are working on adding more networks."},
  //   };
  // } else {
  //   return {
  //     insights: {"Unknown Error": "An unknown error occured. Please contact the team and try again later."},
  //   };
  // }

  return {
    content: panel([
      heading('Percent Snap'),
      text(
        `You are sending to to Address ${JSON.stringify(respData)}`,
      ),
    ]),
  };
};
