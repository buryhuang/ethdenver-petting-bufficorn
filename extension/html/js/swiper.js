import { Swiper } from "./swiper-bundle.esm.browser.min.js";
window.onload = () => {
  const swiper = new Swiper("#swiper", {
    autoplay: false,
    loop: true,
    initialSlide: 0,
    grabCursor: true,
    setWrapperSize: true,
    // 如果需要前进后退按钮
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  document.getElementById("connect").addEventListener("click", async () => {
    if (window.ethereum) {
      const address = await ethereum.request({
        method: "eth_accounts",
      });
      if (!address[0]) {
        await window.ethereum
          .request({
            method: "eth_requestAccounts",
          })
          .then((res) => {
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
          });
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
          address[0].slice(0, 6) + "..." + address[0].slice(37, 42);
        document.getElementById("address").title = address[0];
      }
    } else {
      alert("Wallet extension was not detected!");
    }
  });

  document.getElementById("try1").addEventListener("click", function () {
    console.log("try111")
  });
};
