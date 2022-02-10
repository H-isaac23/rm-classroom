// get button
let hideClass = document.getElementById("hideFirstClass");

// When the button is clicked, hide first class
hideClass.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: hideFirstClass,
  });
});

const hideFirstClass = () => {
  document.querySelectorAll("ol > li")[0].style.display = "none";
};

// const getListOfClasses = () => {

// }
