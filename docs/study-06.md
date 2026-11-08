### [보강] JSON 형식 오류

#### 내가 발견한 문제
"학원왔어"라고 입력했을 때 Claude는 답변을 만든 것처럼 보였지만,
화면에는 "지금 답변 형식을 처리하지 못했어. 다시 말해줄래?"가 나타났다.

#### 처음 생각한 것
지난 max_tokens 문제와 비슷할 수도 있다고 생각했지만,
같은 원인이라고 바로 단정하지 않고 터미널을 확인했다.

#### 실제 측정값
- stop_reason: end_turn
- output_tokens: 102
- thinking_tokens:0
- TextBlock: 있음
- 실제 text: 있음

#### 판단
stop_reason이 end_turn이었고 TextBlock에 정상 답변이 있었다.
따라서 출력 길이 부족이 아니라, Claude가 JSON 대신 일반 문장을 반환한
'출력 형식 문제'라고 판단했다.

#### 기존 예외 처리
json.loads()가 실패하자 except가 실행되어 fallback이 떴다. (앱은 안 멈춤)

#### 수정
client.messages.create()에 Structured Output(JSON Schema)을 추가했다.
- 필수 key: reply, emotion
- emotion 허용 값: happy / sad / angry / anxious / neutral

#### 재테스트
- reply 정상: O
- emotion 정상: O
- JSON 파싱 오류 재발: X
- 펭귄 표정 정상: O

#### 알게 된 점
프롬프트로 "JSON으로 답해"라고 지시하는 것과, API에서 출력 구조 자체를
제한하는 것은 다르다. 화면에 비슷한 오류가 보여도 같은 원인이라 단정하지 않고
stop_reason, usage, content를 확인해야 한다.