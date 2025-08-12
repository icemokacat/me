💡 혹시 해당 페이지가 잘 안보이거나, 디자인상 이상해 보이나요?
[링크](https://github.com/icemokacat/me/edit/release/public/md/exp3.md) github 에서 볼 수 있습니다.

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

## Notion 기반 지식 공유 체계 구축

![](https://github.com/user-attachments/assets/edb0b761-ed30-405f-a383-b5db5421626e)

## API 명세서 자동화 시스템 구축




