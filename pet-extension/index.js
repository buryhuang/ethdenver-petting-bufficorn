const createProvider = require('../')
const Eth = require('ethjs')

const provider = createProvider()

renderText('Loading...')

if (provider) {
  console.log('provider detected', provider)
  const eth = new Eth(provider)
  renderText('MetaMask provider detected.')
  eth.accounts().then((accounts) => {
    console.log(accounts)
    let myAccount = accounts[0]
    myAccount = "0xE120a1C90a813796425a2e9eF36F692F92d17073"
    localStorage.setItem("myPetAccount", myAccount)
    renderText(`Detected MetaMask account, addr ${myAccount}`)
  })

  provider.on('error', (error) => {
    if (error && error.includes('lost connection')) {
      renderText('MetaMask extension not detected.')
    }
  })

} else {
  renderText('MetaMask provider not detected.')
}

function renderText (text) {
  content.innerText = text
}

