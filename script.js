// ===== ELEMENT REFERENCES =====
const inputElement = document.getElementById("input-element");
const inputButton = document.getElementById("input-button");
const tabButton = document.getElementById("tab-button")
const deleteAllButton = document.getElementById("delete-all-button");
const ulElement = document.getElementById("ul-element");

// ===== INITIALIZE ITEMS FROM LOCAL STORAGE =====
let items = [];
try {
    const storedItems = localStorage.getItem("items");
    items = storedItems ? JSON.parse(storedItems) : [];
} catch (error) {
    console.error("Error reading from localStorage:", error);
    items = [];
}

// ===== HELPER FUNCTIONS =====
// Validate URL format
function isValidUrl(urlString) {
    try {
        new URL(urlString);
        return true;
    } catch {
        inputElement.value = "";
        return false;
    }
}

// Render a single list item
function renderInput(value) {
    try {
        const liElement = document.createElement("li");
        const aElement = document.createElement("a");

        aElement.textContent = value;
        aElement.href = value;
        aElement.target = "_blank";

        liElement.appendChild(aElement);
        ulElement.appendChild(liElement);
    } catch (error) {
        console.error("Error rendering item:", error);
    }
}

// ===== EVENT LISTENERS =====

// Add new link
inputButton.addEventListener("click", function() {
    try {
        const value = inputElement.value.trim();
        if (!value) return;

        if (!isValidUrl(value)) return;

        items.push(value);
        renderInput(value);
        localStorage.setItem("items", JSON.stringify(items));
        inputElement.value = "";
    } catch (error) {
        console.error("Error adding link:", error);
    }
});

// Save tab link
tabButton.addEventListener("click", function() {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            const activeTab = tabs[0].url
            if (!activeTab) return;

            if (!isValidUrl(activeTab)) return;

            items.push(activeTab);
            renderInput(activeTab);
            localStorage.setItem("items", JSON.stringify(items));
            inputElement.value = "";
        });
    } catch(error) {
        console.error("Error adding tab:", error);
    }
})

// Delete all saved links
deleteAllButton.addEventListener("dblclick", function() {
    try {
        localStorage.removeItem("items");
        ulElement.textContent = "";
        items = [];
    } catch (error) {
        console.error("Error deleting items:", error);
    }
});

// ===== INITIAL RENDER =====
try {
    for (const item of items) {
        renderInput(item);
    }
} catch (error) {
    console.error("Error rendering saved items:", error);
}