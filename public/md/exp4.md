💡 혹시 해당 페이지가 잘 안보이거나, 디자인상 이상해 보이나요?
[링크](https://github.com/icemokacat/me/blob/release/public/md/exp4.md) github 에서 볼 수 있습니다.

- [CI/CD 폐쇄망 환경 대응 방안](#cicd-%ED%8F%90%EC%87%84%EB%A7%9D-%ED%99%98%EA%B2%BD-%EB%8C%80%EC%9D%91-%EB%B0%A9%EC%95%88)

- [Springbatch를 이용한 Elasticsearch 데이터 증분 색인 처리](#springbatch%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-elasticsearch-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A6%9D%EB%B6%84-%EC%83%89%EC%9D%B8-%EC%B2%98%EB%A6%AC)

# CI/CD 폐쇄망 환경 대응 방안

### 문제점

운영중인 서버는 폐쇄망으로 외부에서의 접근이 차단되어 있어 빌드한 jar 파일을

해당 서버로 전송할 수 없어 자동화가 불가.

jenkins 에서 빌드한 파일을 찾아서 jeus server에 deploy 해야 하는 불편함과

어떤 version 을 빌드하여 배포했는지 인지할 수 없어 문제 발생시 대응이 힘듬

<img width="809" height="469" alt="image" src="https://github.com/user-attachments/assets/5473b13d-c675-4999-852b-5a8ee38b76af" />

### 대응

#### 1. 빌드 파일 버전 관리 체계 구축

Commit Hash 기반 파일명: 빌드 시 Git commit hash를 JAR 파일명에 자동 포함

버전 추적 가능: 정확한 소스 코드 버전과 빌드 파일 매핑 관리

예시: application-{commit-hash}-{timestamp}.jar

#### 2. 웹 기반 빌드 파일 관리 시스템

**lighttpd 웹서버 구축**: 빌드 파일 저장소를 웹 인터페이스로 제공 (사내 CI/CD 서버내 위치)

💡 nginx 도 있었지만, CGI 설정을 해야 했고 파일 필터 및 정렬 기능이 다소 부족했습니다.

**Python 스크립트 개발**: 빌드 파일을 날짜순으로 자동 정렬하여 최신 버전을 상단에 표시

사용자 친화적 인터페이스: 개발팀이 쉽게 원하는 버전을 찾아 다운로드 가능

#### 3. 파일 생명주기 관리

**Shell Script 자동화**: 오래된 빌드 파일 자동 정리로 스토리지 효율성 확보

보관 정책 수립: 최신 N개 버전만 유지하는 자동 정리 시스템 구현

<img width="798" height="380" alt="image" src="https://github.com/user-attachments/assets/23d74bda-229b-4e1b-95cc-af922f1a248d" />

**구조**

nginx (프록시) → lighttpd (웹서버) → listing.py (CGI 스크립트)


**📃 nginx 설정 일부**

```conf
location / {
  proxy_pass http://lighttpd;  # 모든 요청을 lighttpd로 전달
}
location ~ ^/listing.py(/.*)?$ {
  proxy_pass http://lighttpd;  # listing.py 관련 요청도 lighttpd로
}
```

**📃 lighttpd.conf 설정**

```
server.document-root = "/var/www/build/download"
```

**📺 listing.py 간략 설명**

💡 파이썬 코드는 생성형 AI 도움을 받았습니다.

- 파일 필터링
```
allowed_extensions = ['.war','.zip','.jar','.tar','.log']
# 특정 확장자만 표시 (빌드 파일 중심)
```

- 필터 및 표기 변경
```py
# 디렉토리는 모두 표시하고, 파일은 특정 확장자만 표시
if S_ISDIR(info.st_mode) or any(entry.name.lower().endswith(ext) for ext in allowed_extensions):
 files.append((entry.name, info[ST_MTIME], size, mime_type, S_ISDIR(info.st_mode)))
```

- 최신순 정렬
```
files.sort(key=lambda x: x[1], reverse=True)  # mtime 기준 최신순
```

구축 예시

<img width="546" height="215" alt="image" src="https://github.com/user-attachments/assets/210d40ca-ce59-4450-a73b-87a8e633b0ae" />


# Springbatch를 이용한 Elasticsearch 데이터 증분 색인 처리

### 기존 방식과 문제점

- 운영중인 CMS 프로젝트에서 별도로 API 를 만들어서 localhost 에서 API 호출을 통해 수동 동기화

- 증분색인이 아닌 전체 삭제 후 재생성

- history 가 없어 아무도 알 수 없는 index 구조

- 오래된 elasticsearch version

해당 문제로 내부 동작 프로세스를 알지 못한 채 주마다 수동으로 동기화를 하고 있었기에

불필요한 소통과 (필요시 기획팀에서 요청) 불필요한 작업 및 구조를 알지 못하기에 유지보수의 어려움이 있었습니다.

### 설계 - 프로세스 및 서버

**기존**

- 유저단+ElasticSearch 검색 API

- CMS+색인 (API를 통한 수동색인)

**변경**

- Elasticsearch 검색용 boot 프로젝트 분리

- 색인용 SpringBatch 프로젝트

<img width="917" height="800" alt="image" src="https://github.com/user-attachments/assets/b48bab76-8698-4bfe-aa85-e8a5b53b50a4" />

별도 수집 table 을 생성하여, 변경마다 log 쌓음
 
 - kafka 나 logstash 도 고려 하였으나, 아직 elastic 자체에 대한 학습도 없기도 하며 일정상 새로운 것은 Springbatch 만 사용하기로 하였습니다.

검색용 도메인 및 서버 생성
 - 타팀 제공 및 검색만을 위한 API 제공을 편리하게 하기 위해 별도로 분리

### Springbatch 

**패키지 설계**

```
📁 src
├ 📁 main
│  ├─📂java
│  ├ ... (eco>elasticbatch)
│  │  │  ├─📂domain (RDB 관련 class)
│  │  │  │ ├──📂contents (RDB 기준 색인할 데이터 관련 패키지)
│  │  │  │ ├──📂stash (색인대상을 관리하는 테이블 관련 패키지)
│  │  │  ├─📂elastic (Elasticsearch 관련 class)
│  │  │  │ ├──📂document (각 인덱스의 document class)
│  │  │  │ ├──📂repository (spring-data 라이브러리 기반 repository)
│  │  │  │ ├──📃Indices.java (인덱스 명칭관리)
│  │  │  ├─📂global (공통 세팅 및 유틸 클래스 집합, servlet 관리 등)
│  │  │  │ ├──📂config
│  │  │  │ ├─────📂database (mybatis 설정)
│  │  │  │ ├─────📂elastic (Elasticsearch 설정)
│  │  │  │ ├─────📂interceptor (mybatis interceptor 설정)
│  │  │  │ ├─────📂model (yml 변수를 사용할 수 있게 해주는 class)
│  │  │  │ ├──📂utils
│  │  │  ├─📂job (배치 프로그램 관리)
│  │  │  │ ├──📂contents
│  │  │  │ ├──📂listener
│  │  │  │ ├──📂theme
│  │  │  │ ├──📄LifebooksJobs.java (Job name 관리 class)
│  │  │  ├─📂scheduler (스케줄러 관리)
│  │  │  │ ├──📂quartz_job (quartz job 관리)
│  │  │  │ ├──📄QuartzConfig.java (quartz job 등록 및 설정)
│  │  │  ├─📄BatchController.java (batch 관련 수동 작업시 사용하는 API)
│  │  │  ├─📄ElasticBatchApplication.java (boot 실행 main class)
│  │  │  ├─📄HomeController.java (batch health check 용 컨트롤러)
│  │  │  ├─📄JobRunnerConfig.java (로컬에서 1번 Job 실행시 사용하는 클래스)
│  ├─📂resources
│  │  ├─📂elastic (인덱스별 설정 json 파일)
│  │  ├─📂logback (운영환경별 로그 관리, 현재는 좀 이상해서 console만)
│  │  ├─📂mapper (mybatis sql xml 파일)
│  │  ├─📂META-INF
│  │  ├─📄application.yml (기존 spring의 환경설정 파일 역할, main 설정 파일, yml 파일 Grouping)
│  │  ├─📄application-global.yml (mybatis, thymeleaf 설정 등 서버 환경 공통, 환경설정)
│  │  ├─📄application-dev.yml (dev,prd,local 등 개발환경에 맞는 설정, PORT 및 DB 정보 설정)
│  │  ├─(...) 기타, 서버 환경별 환경설정
├ 📁 test
│  ...
📄 build.gradle.kts (기존 spring의 pom.xml 역할, 라이브러리 관리)
```

**batch flow**

- stash 테이블 JPA 로 가져올 (색인 대상) 데이터 리스트 조회(pk key 리스트만)

- MyBatis 에서 실제로 가져와야 하는 데이터 조회

- Elastic Document 로 변환

- `springframework.data.elasticsearch.repository` 를 통해 save
