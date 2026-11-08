// =======================
// 1. HTML 요소 가져오기
// =======================


const startScreen =
    document.querySelector("#start-screen");

const chatScreen =
    document.querySelector("#chat-screen");

const startButton =
    document.querySelector("#start-button");

const darkButton =
    document.querySelector("#dark-button");

const newChatButton =
    document.querySelector("#new-chat-button");

const messagesEl =
    document.querySelector("#messages");

const messageInput =
    document.querySelector("#message-input");

const sendButton =
    document.querySelector("#send-button");



// =======================
// 2. 대화기록
// =======================

// 지금까지의 대화를 저장할 배열
const messages = [];

let isWaiting = false;

let currentController = null;
let chatSessionId = 0;

// 스티커: 같은 감정 흐름에서는 한 번만
let lastEmotion = null;
let stickerShownInTopic = false;

function setWaiting(waiting) {
    isWaiting = waiting;
    sendButton.disabled = waiting;
    messageInput.disabled = waiting;
}

const emotionImages = {
    happy: "assets/images/penguin-happy.png",
    sad: "assets/images/penguin-sad.png",
    angry: "assets/images/penguin-angry.png",
    anxious: "assets/images/penguin-anxious.png",
    neutral: "assets/images/penguin-neutral.png"
};

// 말풍선 아래에 띄울 큰 펭귄 이모티콘
const stickerImages = {
    happy: "assets/images/sticker-happy.png",
    sad: "assets/images/sticker-sad.png",
    angry: "assets/images/sticker-angry.png",
    anxious: "assets/images/sticker-anxious.png",
    neutral: "assets/images/sticker-neutral.png"
};

function getImageForEmotion(emotion) {
    return emotionImages[emotion] || emotionImages.neutral; 
}


// =======================
// 3. 시작화면 + 채팅화면
// =======================

startButton.addEventListener("click", function () {

    startScreen.classList.add("hidden");

    chatScreen.classList.remove("hidden");

    messageInput.focus();

});



// =======================
// 4. DARK 버튼
// =======================

darkButton.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

});




// =======================
// 5. 보내기 버튼
// =======================

sendButton.addEventListener("click", function () {

    sendMessage();

});




// =======================
// 6. Enter 키로 전송
// =======================

messageInput.addEventListener("keydown", function (event) {

    // 한글 조합 중이면 무시 (마지막 글자 중복 전송 방지)
    if (event.isComposing) {
        return;
    }
    
    //Enter만 누르면 메시지 전송
    //shift + Enter는 줄바꿈
    if(
       event.key ==="Enter"
       &&
       !event.shiftKey
    ){

       event.preventDefault();

       sendMessage();

    }

});




// =======================
// 7. 메세지 보내기
// =======================

function sendMessage() {

    if (isWaiting) {
        return;
    }

    // 입력창의 내용을 가져오고
    // 앞뒤 공백을 제거한다.
    const text =
        messageInput.value.trim();


    // 내용이 없으면 아무 일도 하지 않는다.
    if (text === "") {
        return;
    }


    // 사용자 메시지를 배열에 저장한다.
    messages.push({
        role: "user",
        content: text
    });


    // 화면에 사용자 말풍선을 만든다.
    addMessage(
        "user",
        text
    );


    // 입력창을 비운다.
    messageInput.value = "";


    // 입력창에 다시 커서를 둔다.
    messageInput.focus();


    //서버에서 대답을 불러온다.
    requestAssistantReply();

}



// =======================
// 8. 말풍선 만들기
// =======================

function addMessage(role, text, emotion = "neutral", sticker = false) {

    // 한 줄 전체
    const row =
        document.createElement("div");
    

    // role에 따라 class를 저장한다.
    row.className = 
        "message-row " + role;
    


    // AI 메시지라면
    // 왼쪽에 펭귄 캐릭터를 만든다.
    if (role === "assistant") {
        const character =
            document.createElement("img");

        character.className =
            "message-character";

        character.src = getImageForEmotion(emotion);

        character.alt = "마음이 캐릭터";

        row.appendChild(character);

    }


    // 말풍선 + 스티커를 세로로 묶는 상자
    const content =
        document.createElement("div");

    content.className =
        "message-content";


    // 말풍선 생성
    const bubble = 
        document.createElement("div");

    bubble.className = 
        "message-bubble " + role;

    bubble.textContent =
        text;

    content.appendChild(bubble);


    // 스티커가 true면 말풍선 아래에 큰 펭귄 추가
    if (role === "assistant" && sticker) {

        const stickerImg =
            document.createElement("img");

        stickerImg.className =
            "message-sticker";

        stickerImg.src =
            stickerImages[emotion] || stickerImages.neutral;

        stickerImg.alt = "마음이 이모티콘";

        content.appendChild(stickerImg);

    }


    // 한 줄 안에 묶음 상자 넣기
    row.appendChild(content);


    // 메시지 영역에 추가
    messagesEl.appendChild(row);


    // 가장 아래쪽으로 이동
    scrollToBottom();

}



async function requestAssistantReply() {

    // 이번 요청 전용 컨트롤러 만들기
    const controller = new AbortController();
    currentController = controller;

    // 이 요청이 어느 대화에서 보낸 건지 기억
    const requestSessionId = chatSessionId;

    setWaiting(true);

    showTyping();

    try {
        
        const response =
            await fetch(
                "http://127.0.0.1:8000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        messages: messages
                    }),

                    signal: controller.signal
                }
            );

        if (!response.ok) {
            throw new Error(
                "서버 응답 오류: "
                + response.status
            );
        }


        const data = 
            await response.json();


        if (requestSessionId !== chatSessionId) {
            return;
        }


        removeTyping();


        messages.push({
            role: "assistant",
            content: data.reply
        });


        // 감정이 바뀌면 새 주제로 보고 스티커 기회를 다시 준다
        if (data.emotion !== lastEmotion) {
            lastEmotion = data.emotion;
            stickerShownInTopic = false;
        }

        // 이번 주제에서 이미 스티커를 띄웠으면 막는다
        const showSticker = data.sticker && !stickerShownInTopic;

        if (showSticker) {
            stickerShownInTopic = true;
        }


        addMessage(
            "assistant",
            data.reply,
            data.emotion,
            showSticker
        );

    }

    catch (error) {

        if (error.name === "AbortError") {
            return;
        }

        if (requestSessionId !== chatSessionId) {
            return;
        }

        removeTyping();

        console.error(error);

        addMessage(
            "assistant",
            "지금 서버와 연결되지 않았어, 잠시 후 다시 시도해줘."
        );

    }

    finally {

        if (currentController === controller) {
            currentController = null;
            setWaiting(false);
            messageInput.focus();
        }

    }

}


// =======================
// 10. 생각 중 표시
// =======================

function showTyping() {

    // 이미 생각 중 표시가 있으면
    // 또 만들지 않는다.
    if (
        document.querySelector("#typing-row")
    ) {
        return;
    }


    const row = document.createElement("div");

    row.id = "typing-row";

    row.className = "typing-row";

    const character = document.createElement("img");

    character.className = "message-character";
    
    character.src = emotionImages.neutral;

    character.alt = "마음이 캐릭터"


    const bubble =
        document.createElement("div");

    bubble.className =
        "typing-bubble";

    bubble.textContent =
        "마음이가 생각 중...";

    
    row.appendChild(character);

    row.appendChild(bubble);

    messagesEl.appendChild(row);


    scrollToBottom();

}




// =======================
// 11. 생각 중 표시 제거
// =======================

function removeTyping() {

    const typingRow =
        document.querySelector("#typing-row");


    if (typingRow) {

        typingRow.remove();
        
    }

}




// ========================
// 12. 가장 최근 메시지로 이동
// ========================

function scrollToBottom() {

    messagesEl.scrollTop =
        messagesEl.scrollHeight;

}




// =======================
// 13. 새 대화 버튼
// =======================

newChatButton.addEventListener(
    "click",
    function () {

        const result =
            confirm(
                "새 대화를 시작할까요?"
            );


        //취소하면 아무것도 하지 않는다.
        if (!result) {
            return;
        }


        if (currentController) {
            currentController.abort();
            currentController = null;
        }

        chatSessionId = chatSessionId + 1;

        // 스티커 기록도 초기화
        lastEmotion = null;
        stickerShownInTopic = false;

        setWaiting(false);
        removeTyping();

        messages.length = 0;
        messagesEl.innerHTML = "";

        addMessage("assistant", "오늘은 어떤 하루였어?");

        messageInput.value = "";
        messageInput.focus();
    }
);