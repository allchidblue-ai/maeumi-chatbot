# 마음이 (Maeumi)

청소년의 일상적인 고민과 감정을 들어주는
공감형 AI 챗봇 프로젝트입니다.


## 1. 주요 기능
- Claude API 기반 AI 대화
- 친구 같은 공감형 페르소나
- 공감과 무조건 동조 구분
- 사용자 메시지 감정 분류
- 감정에 따른 펭귄 캐릭터 변경
- 비동기 요청 상태 관리, 오류 복구
- 모바일 화면 / 다크모드

## 2. 프로젝트 소개
마음이는 사용자의 감정을 먼저 이해하고, 친구처럼 자연스럽게
대화하도록 설계한 교육용 AI 챗봇 프로토타입입니다.

## 3. 프로젝트를 만든 이유
- 청소년들을 위로하고 공감해주기 위해 만들었다. 요즘 시대에 조언해주는 사람은 많다 조언해주는 ai는 많다. 현실적인 사람은 많고 현실적인 ai는 많다. 그래서 난 위로에, 특히 청소년 위로에 특화된 ai 챗봇을 만들었다.

## 4. 사용한 기술
- Frontend: HTML, CSS, JavaScript
- Backend: Python, FastAPI
- AI: Claude API

## 5. 프로젝트 구조
```
maeumi-chatbot/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .env              (공유하지 않음)
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── assets/images/    (감정별 펭귄 이미지)
├── docs/
│   └── study-01.md ~ study-08.md
├── README.md
└── .gitignore
```

## 6. 동작 과정
1. 사용자가 입력창에 메시지를 쓰고 보내면, 프론트엔드가 지금까지의 대화를 JSON으로 묶어 FastAPI 서버로 보냅니다.
2. 서버는 최근 대화 10개를 SYSTEM_PROMPT와 함께 Claude API에 보내고, Claude는 답변(reply)과 사용자의 감정(emotion)을 JSON으로 돌려줍니다.
3. 서버가 JSON에서 reply와 emotion을 꺼내 프론트엔드로 보내면, reply는 말풍선으로, emotion은 펭귄 표정으로 화면에 나타납니다.

## 7. emotion
- happy / sad / angry / anxious / neutral

## 8. 실행 방법
### backend
```
cd backend
.\.venv\Scripts\Activate.ps1
python -m uvicorn main:app --reload
```
※ 다른 컴퓨터에서 처음 실행하는 경우(가상환경이 없을 때):
```
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```
### frontend
frontend/index.html을 Live Server로 실행합니다.

## 9. 환경 변수
backend/.env 파일에 API Key가 필요합니다.
실제 API Key는 공개하지 않습니다. (.env.example 참고)

## 10. 테스트
- 기본 기능 / 페르소나 / 감정 분류 / 안전 시나리오 / 오류·엣지케이스 / 모바일·다크모드

## 11. 프로젝트의 한계
- 대화 저장 기능이 없어, 새로고침하면 대화가 사라집니다.
- 학업 같은 문제 자체를 해결해주지는 않습니다. 혼자 버티지 않도록 들어주는 것이 목적입니다.
- 감정은 다섯 가지 중 하나만 고르기 때문에, 여러 감정이 섞인 경우를 표현하지 못합니다.
- 최근 메시지 10개만 기억하므로, 대화가 길어지면 앞부분은 잊습니다.
- 위험 신호 판단을 AI에게 맡기기 때문에 놓칠 수 있습니다. 마음이는 전문 상담을 대신할 수 없습니다.
- 현재는 내 컴퓨터(127.0.0.1)에서만 실행됩니다.
- 감정을 5개 범주로 단순화했다.
- emotion은 심리 진단이 아닙니다

## 12. 앞으로 개선하고 싶은 것
- 대화 저장 기능을 추가해 새로고침해도 대화가 남게 하고 싶습니다.
- 대화를 시작하기 전에 마음이가 AI이고 전문가가 아니라는 안내 화면을 넣고 싶습니다.
- 여러 감정이 섞인 경우도 표현할 수 있도록 감정 분류를 확장하고 싶습니다.
- 대화 기록에 감정 정보도 함께 저장해, AI가 JSON 형식을 더 안정적으로 지키게 하고 싶습니다.
- 서버를 배포해 다른 사람도 사용해볼 수 있게 하고 싶습니다.

## 13. 학습한 내용
- 프론트엔드(HTML·CSS·JS)와 백엔드(FastAPI)가 API와 JSON으로 데이터를 주고받는 구조를 이해했습니다.
- SYSTEM_PROMPT로 AI의 역할과 말투를 정하고, 규칙이 충돌할 때의 우선순위를 설계했습니다.
- 감정을 인정하는 것과 판단에 동의하는 것은 다르다는 점을 설계에 반영했습니다.
- max_tokens는 답의 길이가 아니라 최대 출력량이라는 것을, 버그를 재현하고 측정하며 알게 됐습니다.
- isWaiting·finally로 중복 전송을 막고, AbortController·chatSessionId로 이전 대화의 답이 섞이지 않게 하는 방법을 배웠습니다.
- 문제가 생기면 바로 코드를 고치기보다 재현하고, 실제 결과를 확인한 뒤 원인을 판단하는 과정을 익혔습니다.

## Project Status

Educational prototype completed.
