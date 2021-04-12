# V-us (Vatech 통근버스) 앱
## I. Contributor
#### • 엄민식: FrontEnd
#### • 최영훈: BackEnd

## II. 프로젝트 개요
바텍 통근버스 웹 앱  
<strong>개발능력 증진</strong> 및 현재 <strong>통근버스의 불편한 신청,관리 구조의 변경</strong>

## III. 사용한 기술
![Badge](https://img.shields.io/badge/platform-web-yellow) ![Badge](https://img.shields.io/badge/library-React%2C%20Apollo-blue) ![Badge](https://img.shields.io/badge/library-react--hook--form-orange) ![Badge](https://img.shields.io/badge/library-Material--ui%2C%20Dayjs%2C%20react--swipeable--views-red) ![Badge](https://img.shields.io/badge/database-dynamoDB-brightgreen)

## IV. 페이지 개요
### 1. 관리자 페이지
> <strong>A. 로그인 페이지</strong>
>> - 일반적인 로그인 페이지로 관리자만 접근 가능.  
>> - 비밀번호 보기 기능을 구현.  
>> <details><summary><strong>실제 페이지 보기</strong></summary>
>> <div markdown="1">123</div></details>  


> <strong>B. 사용자 관리 페이지</strong>
>> - 사용자들 목록을 볼 수 있다.  
>> - 사용자(관리자, 버스기사, 유저) 회원가입 가능(아이디 중복확인, 비밀번호 보기).  
>> - 다중선택으로 사용자를 선별 삭제.  
>> - 검색 기능으로 유저를 찾음.  
>> - 엑셀 업로드 및 다운로드를 구현.  
>> <details><summary><strong>실제 페이지 보기</strong></summary></details>  
>> <div markdown="1">123</div></details>  

> <strong>C. 노선 관리 페이지</strong>
>> - 노선 생성, 수정, 삭제 가능.(이미지 등록 가능)  
>> - 각 노선별로 정류장을 생성, 수정, 삭제.
>> - 주소 검색기능으로 위치를 한번에 접근.  
>> - 마커로 정류장의 위치를 확인.  
>> <details><summary><strong>실제 페이지 보기</strong></summary></details>  
>> <div markdown="1">123</div></details>  

> <strong>D. 공지 관리 페이지</strong>
>> - 공지 생성 가능.  
>> - 개별 선택으로 공지를 수정.  
>> - 다중 선택으로 공지를 삭제.  
>> - 검색 기능으로 공지를 찾음.  
>> <details><summary><strong>실제 페이지 보기</strong></summary></details>  
>> <div markdown="1">123</div></details>  

> <strong>E. 탑승객 관리 페이지</strong>
>> - 전체, 당첨자, 미당첨자, 대기자, 취소자로 구분하여 탑승객을 구별.  
>> - 노선별로 월 선택하여 접근 가능.(월 추가 기능 구현)  
>> - 탑승객 전체 초기화 버튼으로 탑승객 정보를 모두 삭제 가능.  
>> - 탑승객 선별 버튼으로 해당 월 탑승객을 자동 선별. 
>> - 검색 기능으로 탑승객을 찾음.  
>> <details><summary><strong>실제 페이지 보기</strong></summary></details>  
>> <div markdown="1">123</div></details>  

### 2. 유저 페이지
### 3. 버스기사 페이지

## 프로젝트 파일 구조

    .
    ├── src                                 # Client folder
        ├── desktop                             # 관리자 페이지
            ├── images                          # 페이지에 들어갈 png 파일들
        
            ├── pages               
                ├── AdminHome.js                # 홈페이지
                ├── Admin.js                    # 관리자 페이지(default: User)
                ├── Boarder.js                  # 탑승객 관리 페이지
                ├── Notice.js                   # 공지 관리 페이지
                ├── CreateNotice.js             # 공지 생성 페이지
                ├── DetailNotice.js             # 공지 수정 페이지
                ├── User.js                     # 사용자 관리 페이지
                ├── Excel.js                    # 엑셀 업로드 페이지
                ├── Register.js                 # 사용자 등록 페이지
                ├── Route.js                    # 노선 관리 페이지
                ├── CreateRoute.js              # 노선 생성 페이지
                └── Error.js                    # 에러 페이지
            
            ├── styles              
                ├── AdminStyle.js               # 관리자 페이지 스타일
                ├── BoarderStyle.js             # 탑승객 관리 페이지 스타일
                ├── HeaderStyle.js              # 헤더 및 사이드 메뉴 스타일
                ├── HomeStyle.js                # 홈페이지 스타일
                ├── NoticeStyle.js              # 공지 관리 페이지 스타일
                ├── RegisterStyle.js            # 사용자 등록 페이지 스타일
                ├── RouteStyle.js               # 노선 관리 페이지 스타일
                ├── ExcelStyle.js               # 엑셀 업로드 페이지 스타일
                └── UserStyle.js                # 사용자 관리 페이지 스타일
            
            └── layout                          # 페이지에 들어갈 header, sidemenu 
        
        
        └── mobile                              # 사용자 페이지
            ├── images                          # 페이지에 들어갈 png 파일들
        
            ├── pages               
                ├── UserHome.js                 # 유저 홈페이지
                ├── DriverHome.js               # 버스기사 홈페이지
                ├── LogIn.js                    # 로그인 페이지
                ├── SignUp.js                   # 회원가입 페이지
                ├── Notice.js                   # 공지사항 페이지
                ├── RegisterBus.js              # 버스 등록/취소 페이지
                └── BusInfo.js                  # 버스 노선 페이지
            
            ├── styles              
                ├── HomeStyle.js                # 유저 홈페이지 스타일
                ├── DriverHomeStyle.js          # 버스기사 홈페이지 스타일
                ├── LogInStyle.js               # 로그인 페이지 스타일
                ├── SignUpStyle.js              # 회원가입 페이지 스타일
                ├── NoticeStyle.js              # 공지사항 페이지 스타일
                ├── RegisterStyle.js            # 버스 등록/취소 페이지 스타일
                └── BusInfoStyle.js             # 버스 노선 페이지 스타일
            
            └── layout                          # 페이지에 들어갈 header, footer 
        
<br>
