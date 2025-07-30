# 시스템 아키텍처 & 인프라 구축
> 시스템을 설계하고 안정적인 개발 환경을 구축한 경험

- [Jenkins를 이용한 CI/CD 파이프라인 구축](#jenkins%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-cicd-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EA%B5%AC%EC%B6%95)

- [데이터 마이그레이션 시스템 설계](#데이터-마이그레이션-시스템-설계)

- [Springbatch를 이용한 Elasticsearch 데이터 증분 색인 처리](#springbatch%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-elasticsearch-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A6%9D%EB%B6%84-%EC%83%89%EC%9D%B8-%EC%B2%98%EB%A6%AC)

## Jenkins를 이용한 CI/CD 파이프라인 구축
---
### 1. 기존 통합,빌드,배포 과정
 a. local 환경에서 단일 branch 에 commit
 
 b. commit 된 소스를 local 환경에서 war 혹은 jar 로 build
 
 c. 빌드된 파일을 원격지 서버에 직접 업로드 하여 was 서버 수동 재시작
 
### 2. 문제점
a. Environment Inconsistency (환경 불일치)
  - 특정 개발자 환경에 의존하고, 빌드하는 개발자의 환경마다 build 오류가 발생할 수 있다.
 
b. Single Source of Truth 원칙 위배
    - Information Asymmetry(정보비대칭) : 배포한 개발자만 정확한 상태를 알고 있어, 다른 팀원들은 배포 version에 대해 추측만 가능하다.
    - 이로 인해 중복 배포의 위험이 있어, 일관된 서비스를 유지하기 어렵다.
 
c. Development Workflow Inefficiency (개발 워크플로우 비효율성)
  - 개발자가 빌드/배포 작업에 시간 소모
  - 코어 개발 업무 집중도 저하

d. Quality Gate Absence (품질 게이트 부재)
  - 자동화된 테스트 부족
  - 코드 품질 검증 프로세스 미흡

> 특히나, 자사 서비스(인생서가, 스쿨북스)는 도서관 마다 조금씩 요구사항이 다를 수 있다는 점 (단일 branch)
> 그리고, 클라우드 서비스형이 아닌 설치형인 경우 한번 설치를 하면 버전관리를 할 수 없는 점 (폐쇄망 등 환경의 차이)
> 해당 설치 서버 환경마다 매번 환경 설정을 확인 하고, 설치이력을 관리해야 한다는 점이 유지보수를 어렵게 했다.

### 3. 그래서 어떤 문제를 해결해야 하나

- 도서관(클라이언트)별로 branch 분기
    - 어떤 변경점과 차이점이 도서관마다 존재하는지 알 수 있어야 한다.

- "release" branch 로 push 된 version 이 production에 반영되도록 한다. 
    - 마지막으로 build 된 version (최종적으로 서버에 반영된)이 무엇인지 알아야 한다.
    - 팀원 모두가 이제 명시적으로 그 사실을 "동일하게 인지" 할 수 있게 한다.

- 이 과정을 모두 자동화 한다.
    - 테스트,빌드,배포 하는 과정 시간을 줄여 개발 집중도를 높인다.

### 4. 어떤 방식으로 구축하나

#### 통합과정 전환

 [Git 기반 협업 체계 고도화](https://github.com/icemokacat/me/blob/release/public/md/exp2.md)

#### Jenkins Multibranch Pipeline 이용한 도서관별 배포

![multibranch pipeline](https://github.com/user-attachments/assets/8e09ef3b-78d0-4bfb-b2ee-ea9c7197eaae)

각 지역 도서관별로 분기된 branch 를 개별로 가져올 수 있게 `Multibranch Pipeline` 프로젝트로 생성하여,
`release` prefix 가 붙은 branch 를 전부 불러와 해당 젠킨스 아이템 하위로 가져오게 한다.
이후 각 도서관별 젠킨스 item을 별도로 생성한다.

![build trigger](https://github.com/user-attachments/assets/10c5304d-8af1-423d-97f3-481fe87a69ba)

`build trigger` 를 이용하여 특정 branch 에 push 가 되면 해당 pipeline 을 가져와 빌드 후
원격지 서버에 배포 한다.

![jenkinsslack](https://github.com/user-attachments/assets/2e172981-3dd2-46af-abe5-a02af9a9e1d2)

배포결과를 모두가 알 수 있게, slack 채널에 notifty 한다.

## 데이터 마이그레이션 시스템 설계

dummy data
dummy data
dummy datadummy datadummy datadummy datadummy datadummy data
dummy data
dummy data
dummy datadummy datadummy datadummy datadummy datadummy data
dummy data
dummy data
dummy datadummy datadummy datadummy datadummy datadummy data

## Springbatch를 이용한 Elasticsearch 데이터 증분 색인 처리

dummy data
dummy data
dummy datadummy datadummy datadummy datadummy datadummy data
dummy data
dummy data
dummy datadummy datadummy datadummy datadummy datadummy data
dummy data
dummy data
dummy datadummy datadummy datadummy datadummy datadummy data
dummy data
dummy data
dummy datadummy datadummy datadummy datadummy datadummy data
