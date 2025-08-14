💡 혹시 해당 페이지가 잘 안보이거나, 디자인상 이상해 보이나요?
[링크](https://github.com/icemokacat/me/blob/release/public/md/exp3.md) github 에서 볼 수 있습니다.

# 개발 문화 개선 & 협업 체계 구축

- [Git 기반 협업 체계 고도화](#git-%EA%B8%B0%EB%B0%98-%ED%98%91%EC%97%85-%EC%B2%B4%EA%B3%84-%EA%B3%A0%EB%8F%84%ED%99%94)

- [사내 CS 플랫폼 개발 및 알림 시스템 구축](#%EC%82%AC%EB%82%B4-cs-%ED%94%8C%EB%9E%AB%ED%8F%BC-%EA%B0%9C%EB%B0%9C-%EB%B0%8F-%EC%95%8C%EB%A6%BC-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B5%AC%EC%B6%95)

- [Notion 기반 지식 공유 체계 구축](#notion-%EA%B8%B0%EB%B0%98-%EC%A7%80%EC%8B%9D-%EA%B3%B5%EC%9C%A0-%EC%B2%B4%EA%B3%84-%EA%B5%AC%EC%B6%95)

- [API 명세서 자동화 시스템 구축](#api-%EB%AA%85%EC%84%B8%EC%84%9C-%EC%9E%90%EB%8F%99%ED%99%94-%EC%8B%9C%EC%8A%A4%ED%85%9C-%EA%B5%AC%EC%B6%95)

## Git 기반 협업 체계 고도화

![](https://github.com/user-attachments/assets/ab97de55-23a7-481c-b704-48ea27dc9082)

- 기존 시스템의 한계점
    - SVN 단일 브랜치 사용으로 인한 동시 개발 제약
    - 이슈 추적 체계 부재로 인한 개발 히스토리 관리 어려움
    - 코드 리뷰 프로세스 부재로 인한 코드 품질 관리 한계
    - 배포 과정의 수동화로 인한 휴먼 에러 발생 가능
 
- 주요 목표
    - 효율적인 협업 개발 환경 구축
    - 체계적인 이슈 관리 및 추적 시스템 도입
    - 코드 품질 향상을 위한 리뷰 프로세스 확립
    - 배포 프로세스 자동화 및 투명성 확보
 
💡 도입 당시 사내 git 서버가 존재하지 않았기에, 임시로 github 에서 진행 후 gitea 사내 서버로 이전 하였습니다.

### **branch 분기**

기존에는 하나의 branch 에서 (svn) 버전관리를 하였기에, 여러개로 나눌 필요가 있었고

많은 곳에서 사용하는 [Git flow](https://www.campingcoder.com/2018/04/how-to-use-git-flow/) 전략을 사용하고자 했으나

- 나를 포함한, 팀원 대부분이 git 자체를 처음 접하거나 숙련도가 낮은 상태였고 

- 신규 프로젝트에서 도입 하므로 너무나 많은 `Hotfix` , `Feature` branch 가 생성 되는 점.

- MSA 가 아닌 Springboot 단일 프로젝트에서 팀원 역할 분배는 단순히 `도메인` 분리만

등의 이유로 기본적으로 `팀원 이름` 으로 각각 branch 를 생성하고

- `feature` : 단순 API 개발이 아닌 외부 연동등 별도로 추가 될때만
- `develop` : 개발서버 반영 (merge)
- `release` : 운영서버 반영 (develop 에서 검증 후 release 로 merge)

이렇게 너무 세분화 시키지는 않았습니다.

### ISSUE Template 사용 및 가이드 라인 작성

예시

![](https://github.com/user-attachments/assets/eee64b04-8f18-41f9-bb43-0e3d32f2c9c8)

![](https://github.com/user-attachments/assets/2b910a85-7939-48e5-8415-19110d59bea7)

✅ 실제로는 개발자만 기능을 이용하므로 형식은 간소화되어 있습니다.

😕 기획팀 및 CS 팀과 소통할 수 있게 설득하여, 다 같이 사용하여 추적이 가능하게 되었으면 좋았겠지만

전문 기획팀이 아닌점 (신규 스토리보드 작성시에만 참여) 또한 CS 팀이 별도로 존재하지 않고 개발자가 담당하는 식여서

다소 제한적이였습니다.

### Pull Request & 코드리뷰 ###

- Pull Request 템플릿 작성 후
- 특정 branch push 시 chat gpt 를 통한 코드 리뷰

![](https://github.com/user-attachments/assets/114bda12-9133-4faa-9a82-3d8a19ccd66a)

```yaml
jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      (중략)

      - name: ChatGPT codeReviewer
        uses: anc95/ChatGPT-CodeReview@v1.0.13
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

          # Optional
          LANGUAGE: 'Korean'
          OPENAI_API_ENDPOINT: https://api.openai.com/v1
          MODEL: gpt-3.5-turbo
          PROMPT: 
```

![](https://github.com/user-attachments/assets/11330050-0689-40c4-ba94-79e267c7160d)

이후 jenkins 를 통해 자동 빌드 & Slack Notify 까지 CI 를 구현

### 개선점 & 아쉬운점

✅ 기존에는 svn 에서 update 후 commit 하는 방식으로만 관리 했기때문에 버전관리가 매우 어려웠으나

  개발, 운영 branch 분기 및 개인 branch 로 나뉨으로 개인별 버전 추적이 용이 했으며, svn 으로 git 으로 변경함에 따라

  CI/CD 의 기반을 다질 수 있었습니다.

✅ 기존에는 Issue 에 대한 history 가 전혀 관리되지 않고 사람에게만 의존했기 때문에, 유지보수의 어려움이 많았으나

각 issue 에 대해 기록을 해둠으로 다른 서비스에도 같은 문제 발생시 참고하거나 이력관리의 이점이 있었습니다.

❌ Chatgpt 를 통한 코드리뷰를 도입하였으나, 비즈니스 맥락 이해 부족, 과도한 리뷰 코멘트 생성 (사소한 스타일 이슈 등)

및 보안관련해서 이슈가 있을것 같아 테스트 단계에서만 사용하고, 사용하지 않았습니다.

#### 해결해야 할 점

이렇게 CI 과정 중 "자동 테스트 및 피드백" 단계를 구축하지 못하였는데, TDD 문화가 정착되지 않은 상황에서 

단위 테스트 커버리지가 낮아 자동화된 테스트의 신뢰성을 확보하기 어려웠습니다.

따라서 먼저 테스트 코드 작성 및 단위 테스트에 대한 숙련도를 향상할 필요가 있으며, 코드 품질 및 보안이슈 등에 관해서는

[Sonarqube](https://blackcat-dev.kr/article/117) 를 활용하는 등 다양한 기법이 필요할 것 같습니다.

## 사내 CS 플랫폼 개발 및 알림 시스템 구축

### 추진 동기

- 회사내 자금 사정으로 커뮤니티 유료 사용 불가 (공유 제한)
- 타부서 혹은 여러 도서관 과의 CS 처리 관한 history 부재
- 처리 현황 공유에 대한 불편함
- 공공 도서관에서의 외부 사이트 이용 불가 (구글 드라이브, 기타 커뮤니케이션 툴 등)

기존에는 회사내 커뮤니티 수단이 Google drive (엑셀) 와 카카오톡으로만 소통을 했기에

이슈처리는 엑셀에 이슈 작성 -> 메일로 리마인드 -> 카카오톡 확인 등 체계적이지 않고

정리하기 힘든 방식으로 진행되었고, 이슈마다 처리되었는지 아닌지 또한 해당 이슈에 대해서도

내역들을 써내려가면 엑셀 시트에서 보기가 힘들기에, 다른 방안이 필요했습니다.

또한 공공도서관에서는 일부 필수적인 사이트이외에 다른 사이트로의 접속을 차단하였기에 

구글드라이브 조차 사용할 수 없었기 때문에 메일 말고는 이슈관리가 되지 않았습니다.

### 그래서 이렇게 관리하기로

**프로세스 및 설계**

![](https://github.com/user-attachments/assets/5fd965f2-9c64-480e-80b2-278fd5c01c63)

이렇게 프로세스를 그리고 [whimsical](https://whimsical.com/) 을 이용하여 초기 화면을 기획하였습니다.

접수시 slack 으로 개발팀 채널에 링크가 공유되게 하고, "담당자"를 지정하고 "상태변경"을 하게 되면

"CS 요청자" 에게 메일이 가도록 하였습니다. 

(외부 업체는 slack 을 사용할 수 없기도 하며, 다른 팀은 slack 을 사용하길 꺼려하는 이유로)

**실제 화면 예시**

실제 사용 중인 CS 게시판을 참고로 **재구성**하여 그려 보았습니다.

---

![](https://github.com/user-attachments/assets/1ce6874b-dd90-446f-9dfe-0653e43d3e59)

- 등록된 문의 검색
- "로그인한 유저"에게 배정된 문의 보기
- "상태별 필터링" 기능

---

![](https://github.com/user-attachments/assets/a52e7148-f740-46a7-b89a-f6852d34a782)

- 참조인 변경 기능 (요청자, 개발팀 모두 가능)
- 담당자 변경 기능 (개발팀)
- 상태 변경 기능 (요청자, 개발팀)
- 댓글 작성 기능

---

![](https://github.com/user-attachments/assets/7a39ca5e-bb3b-473b-a201-5494b2e84d7f)

- Slack 전송

### 성과 & 아쉬운점

기존 이메일 & 구글드라이브 엑셀과 비교하여

✅ 직관적인 웹 인터페이스를 통한 이슈 등록
 
✅ 첨부파일 지원으로 정확한 이슈 파악

✅ 도서관별/팀별 계정 분리를 통한 접근 권한 관리

✅ 이슈 상태 notify 자동화

이를 통해 CS 관한 history 관리를 강화할 수 있었고, 관리자가 한눈에 이슈상태를 확인가능 하게 되었습니다.

**아쉬운 점**은 개발팀 내부에서는 gitea issue 탭을 통해 이슈 관리를 하고 있는데 이를 통합하여 관리할 수 없었단 점이 아쉬웠습니다.

물론 사업적인 측면의 내용과 용어가 다를 수 있기 때문에 혼용 할 수는 없지만, 태그를 거는 식으로 통합을 할 수 있으면 좋았을 것 같습니다.

다만, 이런 시간 비용보다는 회사내 자금이 충분한 경우 외부 커뮤니케이션 툴로 통합 하는 것이, 기회비용이 더 저렴할 것 같아 아쉬움이 있습니다.

## Notion 기반 지식 공유 체계 구축

### 추진 동기

기존 공유방식인 구글드라이브를 통한 기술문서 공유는 다음과 같은 불편함이 있었습니다.

- 문서 포맷 제약: Google Docs의 단일 문서 기반 구조로는 개발 문서에 필요한 복잡한 상호 참조를 효과적으로 표현하기 어려움

예시로 일반적으로 개발 문서를 작성할때 아래와 같은 모듈화가 어려웠습니다.
```markdown
├── API 명세서 → 인증 방법 참조
├── 설치 가이드 → 환경 설정 참조  
├── 트러블슈팅 → API 명세서 + 설치 가이드 참조
└── 예제 코드 → 모든 문서 참조
```

- 코드 문법 강조 부재: 프로그래밍 언어별 Syntax Highlighting 미지원으로 가독성 저하

- 혼재된 문서 분류: 기술 문서(API 명세, 설치 가이드)와 사업 문서(매뉴얼, 스토리보드)가 동일 저장소에 무분별 혼재

- 관심사 분리의 부재 : 모든 것을 구글드라이브를 통해야만 알 수 있었기 때문에 분류와 찾기가 어려움

`wiki js` 를 설치해보기도 하였으나 한국인에게 익숙치 않은 UI&UX 와 에디터 부족한 기능 때문에 `notion` 으로 결정하였습니다. 

### 이제 이렇게 관리

그래서 문서 관리를 아래와 같이 하기로 했습니다.

- 구글드라이브 : 서버 정보 등 민감한 문서 및 사업 진행에 관한 문서, 스토리 보드 관리
- Notion : 개발문서 (공통 이슈 및 각종 설치 관련 문서, 기술 공유 등), 주간보고, Task 관리
- Git repository readme : 해당 프로젝트에 대한 설치, 환경에 관한 문서

이후 다른 회사의 기술블로그 및 notion template 등을 참고 한 후 레이아웃을 구성하여 아래와 구성하였습니다.

---

**dashboard**

![](https://github.com/user-attachments/assets/d76ddfc9-5c3b-4dcb-91e8-384b1d0410e9)

- 문서들의 데이터베이스 화 및 그룹화

- 웹사이트와 유사하게 사이드 메뉴 구성

**task list**

![](https://github.com/user-attachments/assets/a329d791-8483-428f-9f3f-5a97d6fb65ce)

![](https://github.com/user-attachments/assets/9aa4a9f4-0873-4b84-89e4-3f44b77eacb1)

- task 작성시 notion template 을 이용하여 표준화
- Notion 동기화 기능을 통한 Git issue 연계 작성 가능

이후 해당 page 사용법과 가이드 라인을 팀원들에게 전파하였습니다.

### 성과 및 아쉬운점

✅ 지식 공유 문화 정착

✅ 온보딩 프로세스 개선 : 기존에는 아무것도 존재하지 않아 notion 페이지로 별도 구성

✅ 정보 접근성 개선으로 생산성 향상

🔥 하지만 여전히 주간보고, Git Issue 연계, Task 관리 등은 웹기반 관리 보다 작성이 불편했고

notion page 하나에서 하기엔, 지속적으로 template 고도화가 필요하였기 때문에 시간적 여유와

다른 코어 개발에 대한 기회비용 등으로 인해, 지속적인 운영은 되지 않았습니다.

다만, 기술문서는 지속적으로 작성 및 공유가 되어 최근까지 쓰였으나 요금제를 개인적으로 지불하다 보니

부담이 되어 이후에는 기술문서를 `gitea wiki` 로 옮겼습니다.


## API 명세서 자동화 시스템 구축

### 추진 동기

기존에는 excel 로 서비스 명세서를 작성하고 있었고, 테스트는 개별로 postman 으로 API 확인을 하였습니다.

엑셀로 작성시 `문서 일관성 부족` , `검색이나 참조의 불편함` 의 단점이 있었고, Postman 역시

이용에는 편리하나, 무료버전의 한계로 버전관리를 하기 힘들다는 점이 있었습니다.

또한 초기에는 swagger 를 도입하였으나, 제품 코드에 영향이 있으며 API 스펙 변경 시

swagger 코드를 수정해야 함으로 관리 포인트가 늘어난다는 점에서 불편한 점이 있었습니다.

### 그래서 어떤게 필요한가

- 회사 특성상 외부 업체 혹은 사내 다른 팀에게 API 문서를 전달해야 하는 일이 종종있다.
    - API 문서를 만들면 바로 반출해서 전달할 수 있는 기능이 필요
- 내가 만드는 API 명세가 모두가 명시적으로 알 수 있도록 인지를 할 수 있어야 한다.
    - 버전관리가 가능해야 한다.
- 제품코드에 영향을 주지 않으면서, 필요한 경우 바로 수정이 가능해야 한다.
    - API 명세 자체가 최대한 운영되는 application에 영향을 주지 않아야 한다.
- 회사내에서 다른 팀도 바로 해당 명세서를 볼 수 있을 것
    - 별도로 실행하거나 찾을 필요 없이 사이트로 구성
- 프로젝트별로 폴더화가 가능하고 UI&UX 적으로 구분이 쉬워야 할 것
    - 바로바로 postman 같이 테스트가 가능해야 할 것

💡 Rest Docs 도 고려 했으나 아직 팀이 TDD 에 대한 숙련도가 있지 않아서 우선 배제되었습니다.

그래서 post man 과 유사한 기능을 제공하는 [bruno](https://www.usebruno.com/) 를 API 도구로 활용하되

위의 요구사항을 충족할 수 있게 아래와 같이 만들기로 하였습니다.

### 구성도

![](https://github.com/user-attachments/assets/979708e8-f556-4c91-aa25-43c6fb3c30e2)

**bruno 간략소개**

![](https://github.com/user-attachments/assets/f0c44e92-58eb-4f78-9a99-fbc61bb6a3ce)

이런 폴더(콜렉션)을 생성하고 해당 폴더들을 `git` 으로 버전관리를 하게 됩니다. 

(해당 기능은 제공하지 않으므로 별도로 설정)

![](https://github.com/user-attachments/assets/4df98c17-c15f-4dc1-bfb6-7de974c01e9f)

이후 상세 문서를 작성 후 `docs` 탭에서 markdown 으로 작성하면 github의 readme 문서처럼 볼 수 있습니다.

### 데이터 흐름

그래서 사용흐름은 아래와 같습니다.

1. bruno client 에서 테스트 및 API 문서를 작성 후 `git` 으로 버전관리 및 CI/CD 를 통해 개발 서버로 전송

2. 전송된 `.bru` 파일을 Springboot 프로젝트에서 탐색 후 반환

3. node js 프로젝트에서 해당 markdown 을 parsing 하여 사용자에게 보여줌

![](https://github.com/user-attachments/assets/eb215934-d585-4e78-9155-945cb6ac72b6)

### 구축 결과 및 예시

백엔드 : Springboot + commonmark [icemokacat/bruno-viewer](https://github.com/icemokacat/bruno-viewer)

프론트엔드 : NodeJS & Express(v4.19.2) [icemokacat/markdown-page-viewer](https://github.com/icemokacat/markdown-page-viewer)

![구축 스크린샷](https://github.com/user-attachments/assets/fc5ce623-45b7-4561-a416-aa36f54b844f)

💡 PDF 다운로드는 [puppeteer](https://github.com/puppeteer/puppeteer) 를 이용하여 서버단에서 

`Headless Chrome` 을 이용하여 custom 한 `css` 를 적절히 적용하여 PDF 반출할 수 있게 만들었습니다.

### 성과 및 아쉬운점

- 문서화 효율성 향상
    - Excel 기반 수동 작성에서 마크다운 기반 자동화로 전환하여 문서 작성 시간 대폭 단축
    - Git 버전 관리를 통해 API 변경 이력 추적 및 협업 효율성 증대
    - 실시간 문서 동기화로 개발자 간 정보 공유 지연 최소화

- 운영 환경 안정성 확보
    - 기존 Swagger 대비 코드 침투성 없이 API 문서 관리 가능
    - 별도 인프라에서 운영되어 메인 서비스 성능에 무영향

- 사용자 경험 개선
    - 웹 기반 통합 인터페이스로 팀 내외 접근성 향상
    - PDF 다운로드 기능으로 외부 업체/타팀 전달 프로세스 간소화
    - Bruno의 Postman 유사 UI로 기존 사용자들의 학습 곡선 최소화
 
🔥 초기 구축 후 잘 사용했으나, 해당 프로그램 자체도 유지보수를 해야 함과

수시로 변경되는 프로젝트 기능 및 오류 수정에 대한 기한 마감의 문제

당시 framework 전환 및 커뮤니케이션 툴 전환 등 전환점이 많아

팀원들의 피로도가 올라가 있는 상태였기 때문에 끝까지 활성화 되지는 못하였습니다.

사실은 PostMan 유료버전이 지원되고 TDD 의 숙련도를 올려서 Rest Docs 와 함께 사용하는 것이 더 좋을 것 같습니다.




