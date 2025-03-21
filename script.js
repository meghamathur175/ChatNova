let prompt = document.querySelector("#prompt");
let container = document.querySelector(".container");
let chatContainer = document.querySelector(".chat_container");
let btn = document.querySelector("#btn");
let user_message = null;


function createChatBox(html, className) {
    let div = document.createElement("div");
    div.classList.add(className);
    div.innerHTML = html;
    return div;
}

async function getApiResponse(aiChatBox) {
    // fetch api
    let textElement = aiChatBox.querySelector(".text");

    try {
        let response = await fetch(api_url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "contents": [{
                    "parts": [{ "text": user_message }]
                }]
            })
        });

        let data = await response.json();
        let apiResponse = data?.candidates[0].content.parts[0].text;
        textElement.innerText = apiResponse;
    }
    catch (error) {
        textElement.innerText = "Oops! Something went wrong. Please try again.";
        console.log(error);
    }
    finally {
        aiChatBox.querySelector("#loading").style.display = "none";
        btn.disabled = false;
    }
}

function showLoading() {
    let html = `<div class="ai_chatbox">
                <div class="img">
                    <img src="ai.webp" alt="ai" width="50">
                </div>
                <p class="text"></p>

                <img src="loading.gif" alt="loading" id="loading" height="50">
            </div>`

    let aiChatBox = createChatBox(html, "ai_chatbox");
    chatContainer.appendChild(aiChatBox);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    getApiResponse(aiChatBox);
}

function sendMessage() {
    if(btn.disabled) {
        return;
    }

    user_message = prompt.value.trim();

    if(user_message == "") {
        container.style.display = "flex";
    }
    else {
        container.style.display = "none";
    }

    if (!user_message) {
        return;
    }

    let html = `<div class="img">
                    <img src="user.png" alt="user" width="50">
                </div>
                <p class="text"></p>`;


    let userChatBox = createChatBox(html, "user_chatbox");
    userChatBox.querySelector(".text").innerText = user_message;
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    prompt.value = "";
    
    btn.disabled = true;
    setTimeout(showLoading, 500);
}

btn.addEventListener("click", sendMessage);

prompt.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});