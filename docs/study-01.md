# 마음이 프로젝트 1회차 학습 기록

## 오늘 구현한 것

- 프로젝트 폴더를 만들었다.
- HMTL,CSS,JavaScript 파일을 만들었다.
- 시작 화면을 만들었다.
- 채팅 화면의 기본 구조를 만들었다.
- 시작 버튼을 누르면 화면이 전환되도록 만들었다.


## 오늘 새롭게 알게 된 개념

### 개념 1
이름: <section>

내가 이해한 뜻: 주제가 같은 내용을 하나의 구역으로 묶어주는 상자

우리 프로젝트에서 사용된 곳: 채팅화면, 시작화면 등 같은 주제를 묶어서 분류함
<section id="start-screen"></section>
<section id="chat-screen" class="hidden"></section>


### 개념 2
이름:id // # -> id를 부름

내가 이해한 뜻: <section>이 같은 주제를 묶는 상자라면 이것은 그 상자에 이름을 붙여줘서 CSS나 JS가 특정 요소 하나를 콕 집어 찾을 수 있게 해줌, 같은 id 이름은 한 페이지에서 한 번만 쓸 수 있음.

우리 프로젝트에서 사용된 곳: 여기가 채팅화면이고 여기가 시작화면이다 등을 알려주는 역할로 사용함.
ex id="start-screen"

### 개념 3
이름:class // . -> class를 부름

내가 이해한 뜻: id랑 기능적 요소는 같으나 여러개를 써도 됨. class로 쓰게 되면 여러가지 요소들을 한번에 가져와 쓸 수 있음.
이것또한 이름을 붙여준 것과 같음.

우리 프로젝트에서 사용된 곳: 
<p class="start-message">
을 붙여 CSS가 알아먹을 수 있게함,
<section id="chat-screen" class="hidden">
class로 hidden이라는 상태를 나타냈다, 상태는 계속 변하고, 같은 상태가 여러 요소에 붙을 수 있기 때문에 class로 입력함. 앞에 id는 이미 있기때문에 class로 붙인거이기도 함

### 개념 4
이름: display: none
내가 이해한 뜻: 코드에는 남아 있지만, 화면에서는 자리까지 아예 없애버림.
LLM이 말하길 visibility: hidden은 자리는 남겨둔단다.
우리 프로젝트에서 사용된 곳: 
.hidden {
    display: none !important;
}
class가 hidden인 곳에 들어가 화면을 숨기는 역할을 함



## 아직 궁금한 점
-display: none이랑 visibility: hidden은 실제로 화면에서 어떻게 다르게 보일까?
(아마 visibility: hidden은 그냥 빈공간이 남지 않을까...?)

## 다음에 구현하고 싶은 것
- 펭귄 프로필 나타내기, 펭귄 캐릭터가 화면에 나타나기..ㅎㅅㅎ
