## V-us (Vatech 통근버스) 앱
### 프로젝트 파일구조

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
