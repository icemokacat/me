💡 혹시 해당 페이지가 잘 안보이거나, 디자인상 이상해 보이나요?
[링크](https://github.com/icemokacat/me/edit/release/public/md/exp3.md) github 에서 볼 수 있습니다.

# 개발 문화 개선 & 협업 체계 구축

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

#### ✅ branch 분기

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

## 사내 CS 플랫폼 개발 및 알림 시스템 구축

## Notion 기반 지식 공유 체계 구축

![](https://github.com/user-attachments/assets/edb0b761-ed30-405f-a383-b5db5421626e)

## API 명세서 자동화 시스템 구축


