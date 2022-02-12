chrome.tabs.onUpdated.addListener(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url) {
    console.log("URL not updated");
  } else if (tab.url.includes("https://classroom.google.com/")) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: configPage,
    });
  }
});

const configPage = () => {
  const getClasses = () => {
    const classList = document.querySelectorAll("ol > li");
    classList.forEach((item) => {
      const checkbox = document.createElement("INPUT");
      checkbox.setAttribute("type", "checkbox");
      checkbox.setAttribute("class", "class-checkbox");
      checkbox.classList.add("class", "hide-checkbox");
      checkbox.style.position = "absolute";
      checkbox.style.margin = "10px 0 0 10px";
      checkbox.style.height = "1.5em";
      checkbox.style.width = "1.5em";
      item.appendChild(checkbox);
    });
  };

  const addStyle = () => {
    const isStylePresent = document.querySelector("style.checkbox-style");
    //if style is present, return
    if (isStylePresent) return;

    const checkboxStyle = document.createElement("style");
    checkboxStyle.setAttribute("class", "checkbox-style");
    checkboxStyle.textContent = `
      .hide-checkbox {
        display: none;
      }
    `;
    document.body.appendChild(checkboxStyle);
  };

  // add checkbox styles
  addStyle();

  const isCheckboxPresent = document.getElementById("rm-classroom-checkbox");
  if (isCheckboxPresent) {
    // Select the node that will be observed for mutations
    const targetNode = document.querySelector("ol");
    if (targetNode.classList.contains("mutation-exists")) {
      return;
    }

    // Options for the observer (which mutations to observe)
    const config = { childList: true };

    // Callback function to execute when mutations are observed
    const callback = (_, observer) => {
      // Use traditional 'for loops' for IE 11
      getClasses();
      observer.disconnect();
      targetNode.classList.remove("mutation-exists");
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
    targetNode.classList.add("mutation-exists");
    return;
  }

  // create main checkbox
  const checkbox = document.createElement("INPUT");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", "rm-classroom-checkbox");
  checkbox.style.margin = "2em 0 0 2em";
  checkbox.style.height = "1.5em";
  checkbox.style.width = "1.5em";
  checkbox.addEventListener("change", (e) => {
    const classCheckboxes = document.querySelectorAll(".class-checkbox");
    classCheckboxes.forEach((element) => {
      element.classList.toggle("hide-checkbox");
    });
  });
  document.querySelector("ol").parentElement.prepend(checkbox);
};
