window.onload = async () => {
  document.getElementById("try1").addEventListener("click", function () {
    console.log("try111");
  });
  if (window.ethereum) {
    const address = await ethereum.request({
      method: "eth_accounts",
    });
    if (address.length != 0) {
      document
        .getElementById("connectImg")
        .setAttribute("style", "display:none");
      document
        .getElementById("connectText")
        .setAttribute("style", "display:none");
      document.getElementById("address").setAttribute("style", "display:block");
      document.getElementById("address").innerHTML =
        address[0].slice(0, 6) + "..." + address[0].slice(37, 42);
      document.getElementById("address").title = address[0];
    } else {
      document
        .getElementById("connectImg")
        .setAttribute("style", "display:block");
      document
        .getElementById("connectText")
        .setAttribute("style", "display:block");
      document.getElementById("address").setAttribute("style", "display:none");
      document.getElementById("address").innerHTML = "";
      document.getElementById("address").title = "";
    }
    window.ethereum.on("accountsChanged", (res) => {
      if (res.length == 0) {
        document
          .getElementById("connectImg")
          .setAttribute("style", "display:block");
        document
          .getElementById("connectText")
          .setAttribute("style", "display:block");
        document
          .getElementById("address")
          .setAttribute("style", "display:none");
        document.getElementById("address").innerHTML = "";
        document.getElementById("address").title = "";
      } else {
        document
          .getElementById("connectImg")
          .setAttribute("style", "display:none");
        document
          .getElementById("connectText")
          .setAttribute("style", "display:none");
        document
          .getElementById("address")
          .setAttribute("style", "display:block");
        document.getElementById("address").innerHTML =
          res[0].slice(0, 6) + "..." + res[0].slice(37, 42);
        document.getElementById("address").title = res[0];
      }
    });
  }
};
