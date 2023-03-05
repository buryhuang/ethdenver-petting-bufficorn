import { OnTransactionHandler, OnRpcRequestHandler } from '@metamask/snaps-types';
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

  const goodAddress = '0x6F7a6328D21347FbD3CE4652b2c21e80DE2e3F6C';
  const badAddress = '0xf6De0609dbb1F3E3e4ef32cF4E932221672A0dd5';

  const url = `https://api.gopluslabs.io/api/v1/address_security/${toAddress}?chain_id=${txChainId}`;
  const response = await fetch(url);
  const respData = await response.json();
  console.log(respData);

  let varResults = '';

  // {
  // 	"code": 1,
  // 	"message": "ok",
  // 	"result": {
  // 		"cybercrime": "0",
  // 		"money_laundering": "0",
  // 		"number_of_malicious_contracts_created": "0",
  // 		"financial_crime": "0",
  // 		"darkweb_transactions": "0",
  // 		"phishing_activities": "0",
  // 		"contract_address": "0",
  // 		"fake_kyc": "0",
  // 		"blacklist_doubt": "0",
  // 		"data_source": "",
  // 		"stealing_attack": "0",
  // 		"blackmail_activities": "0",
  // 		"sanctioned": "0",
  // 		"malicious_mining_activities": "0",
  // 		"mixer": "0",
  // 		"honeypot_related_address": "0"
  // 	}
  // }
  const goPlusChecks = respData;
  let fullPassResults = '';
  let allPass = true;
  for (const key in goPlusChecks.result) {
    const checkResult = goPlusChecks.result[key];
    fullPassResults += `${key}: ${checkResult} \n`;
    if (checkResult === '1') {
      varResults += `${key} FAILED \n`;
      allPass = false;
    }
  }
  if (allPass) {
    varResults = 'All checks passed';
  } else {
    varResults = `Some checks failed: [${fullPassResults}]`;
  }

  if (toAddress === goodAddress.toLowerCase()) {
    const petUrl = `http://127.0.0.1:8700/pet_happy`
    await fetch(petUrl); // notify pet
  } else if (toAddress === badAddress.toLowerCase()) {
    const petUrl = `http://127.0.0.1:8700/pet_warning`
    await fetch(petUrl); // notify pet
  }

  return {
    content: panel([
      heading('Security Check'),
      text(
        `You are sending to to Address ${toAddress} \n ${varResults}`,
      ),
    ]),
  };
};
