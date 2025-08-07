# 시스템 아키텍처 & 인프라 구축
> 시스템을 설계하고 안정적인 개발 환경을 구축한 경험

- [Jenkins를 이용한 CI/CD 파이프라인 구축](#jenkins%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-cicd-%ED%8C%8C%EC%9D%B4%ED%94%84%EB%9D%BC%EC%9D%B8-%EA%B5%AC%EC%B6%95)

- [데이터 마이그레이션 시스템 설계](#데이터-마이그레이션-시스템-설계)

- [Springbatch를 이용한 Elasticsearch 데이터 증분 색인 처리](#springbatch%EB%A5%BC-%EC%9D%B4%EC%9A%A9%ED%95%9C-elasticsearch-%EB%8D%B0%EC%9D%B4%ED%84%B0-%EC%A6%9D%EB%B6%84-%EC%83%89%EC%9D%B8-%EC%B2%98%EB%A6%AC)

## Jenkins를 이용한 CI/CD 파이프라인 구축

### 1. 기존 통합,빌드,배포 과정
 a. local 환경에서 단일 branch 에 commit
 
 b. commit 된 소스를 local 환경에서 war 혹은 jar 로 build
 
 c. 빌드된 파일을 원격지 서버에 직접 업로드 하여 was 서버 수동 재시작

 ![](https://github.com/user-attachments/assets/aea8801b-40a6-45e0-89f5-4f2323a136de)
 
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

#### 구성도
![](https://github.com/user-attachments/assets/1e9c0261-33f4-4a8a-9153-82b6b0bb02f1)

#### 통합과정 전환

 [Git 기반 협업 체계 고도화](https://github.com/icemokacat/me/blob/release/public/md/exp2.md)

#### Jenkins Multibranch Pipeline 이용한 도서관별 배포

![multibranch pipeline](https://github.com/user-attachments/assets/8e09ef3b-78d0-4bfb-b2ee-ea9c7197eaae)

각 지역 도서관별로 분기된 branch 를 개별로 가져올 수 있게 `Multibranch Pipeline` 프로젝트로 생성하여

`release` prefix 가 붙은 branch 를 전부 불러와 해당 젠킨스 아이템 하위로 가져오게 한다.

이후 각 도서관별 젠킨스 item을 별도로 생성한다.

![build trigger](https://github.com/user-attachments/assets/10c5304d-8af1-423d-97f3-481fe87a69ba)

`build trigger` 를 이용하여 특정 branch 에 push 가 되면 해당 pipeline 을 가져와 빌드 후

원격지 서버에 배포 한다.

![jenkinsslack](https://github.com/user-attachments/assets/2e172981-3dd2-46af-abe5-a02af9a9e1d2)

배포결과를 모두가 알 수 있게, slack 채널에 notifty 한다.

### 5. 결과와 아쉬운 점

- ✅ 생산성 향상
    - 배포에 들어가는 시간 감소, 코어 개발에 집중 가능
    - multibranch pipe 로 인한 도서관별 version 추적 가능
    - 배포에 대한 관한 비대칭 대폭 감소
    
- ❌ CI/CD 과정 중 일부 과정 누락 
    - CI 이전, Deploy 이전 테스트 프로세스 누락
        - TDD 및 테스트 코드 작성에 관한 경험 부족으로, 기존 운영단에 반영하지 못함.
        - 초기에 Github action 을 연동하여, deploy 이전 chatgpt 코드리뷰를 연동하였으나 환경변경 등의 이유로 제외.
        
- ❌ rolling 혹은 Green/Blud 배포의 부재 
    - 이중화 관리를 하여 무중단 배포까지 구현했으면 더욱 안정적인 서비스를 할 수 있을것 같다.

## 레거시 시스템 전환 및 표준화

기존 SI사업 및 내부 서비스 운영 및 유지보수 중인 프로젝트는 

SpringFramework + JSP + Jquery 그리고 windows server 내 apache httpd 2.4 로 구성되어 있었습니다.

![](https://github.com/user-attachments/assets/b17ab985-2642-4de5-bed6-e0537e7af0c3)

해당 구성을 아래와 같이 변경 추진 하였습니다.

![](https://github.com/user-attachments/assets/4da603d0-9784-4ee4-9dec-e1a48d1050db)

### 추진 동기

- **기술 생태계 발전**: Spring Boot 생태계의 풍부한 리소스와 커뮤니티 활용
- **개발 표준화**: 컨테이너화 및 CI/CD 파이프라인 구축을 위한 기반 마련, API 요청/응답 체계 개선
- **인재 채용 경쟁력**: 레거시 아키텍쳐 청산으로 개발자 유치 및 유지 용이성

### 개선 사항

#### ⚡ Backend 와 front end 간 요청/응답 체계 표준화

> 기존 방식

Backend 예시
```java
@RequestMapping(value = "/books", method = RequestMethod.GET)
public Map<String, Object> getBooks(@RequestParam Map<String, Object> param, HttpServletRequest req) {
	Map<String, Object> retMap = JsonModel.resultSuccessMap();

	retMap = this.bookService.searchContentsbook(param,req);

	return retMap;
}
```

레거시한 에러처리
```xml
<!-- web.xml 또는 servlet 설정 -->
<error-page>
    <error-code>404</error-code>
    <location>/error/404.jsp</location>
</error-page>
<error-page>
    <error-code>500</error-code>
    <location>/error/500.jsp</location>
</error-page>
```

Frontend 예시
```javascript
$.ajax({
    url: '/books',
    type: 'GET',
    data: {
        // 검색 파라미터들
        title: '검색할 제목',
        author: '작가명',
        category: '카테고리',
        page: 1,
        size: 10
    },
    dataType: 'json',
    success: function(response) {
        console.log('성공:', response);
        // 응답 데이터 처리
        if(response.success) {
            // 책 목록 표시
            displayBooks(response.data);
        } else {
            alert('검색 실패: ' + response.message);
        }
    },
    error: function(xhr, status, error) {
        console.error('에러:', error);
        alert('서버 오류가 발생했습니다.');
    }
});
```

> 문제점

- 타입 안전성 결여: Map<String, Object> 사용으로 컴파일 타임 검증 불가
- 에러 처리 미흡: 표준화된 에러 응답 형식 없음 (servlet 내의 error-page redirect 설정으로만 처리)

> 변경사항

**🗃Backend**

Backend 에서의 `org.springframework.http.ResponseEntity` 를 확장한 `RestResponse` 객체 생성 
```java
public class RestResponse extends ResponseEntity<RestResponseBody<?>>
```

Body 부를 새로 만든 `RestResponseBody<T>` 로 지정하여 응답 인터페이스를 일치
```java
@Data
@Builder
public class RestResponseBody<T> {
	private String code;
	private String message;
	private Pagination pagination;
	private T result;
}
```

API 에러 핸들링 개선
```java
@Slf4j
@Order(GeneralRestControllerAdvice.ORDER+1)
@ControllerAdvice(annotations = Controller.class)
@RequiredArgsConstructor
public class GeneralPageControllerAdvice {
    // 전통적인 MVC 페이지 전용 에러 처리 로직
}
```
```java
@Slf4j
@Order(GeneralRestControllerAdvice.ORDER)
@RestControllerAdvice(annotations = RestController.class)
public class GeneralRestControllerAdvice {
    // REST API 전용 에러 처리 로직
    // 이때 에러에 대한 응답에서도 RestResponse 객체 재사용 하여 응답 표준화
}
```
- 기존에 존재하지 않던 API 에러처리에 대해 `GeneralRestControllerAdvice` 로 핸들링
- 관심사 분리
    - API 에러: JSON 응답으로 프론트엔드에서 처리
    - 페이지 에러: 사용자 친화적인 에러 페이지 표시


**📺Front end**

> 팀내 프론트엔드 개발자가 별도로 존재 하지 않고, 서비스와 화면을 모두 담당했어야 했습니다.

- Jquery 라이브러리 버전에 대한 의존도
- 라이브러리 버전에 따른 보안 이슈에 대한 업데이트 대응 (폐쇄망 등에 설치된 서비스에 대한 업데이트 대응의 어려움)

등의 이유와 현대적인 frontend 트렌드와 jquery는 맞지 않으며, ReactJS 를 바로 도입하기엔 일정 및 숙련도의 이슈가 있었기에

중간 단계로, 순수 javascript 를 통해 공통단 js 들을 작성하였음

Front end 단 API 담당 스크립트 개발 [apicommon.js gist](https://gist.github.com/icemokacat/fa9f4d215a98c61c75bff261e5e7d378)
```javascript
// jQuery 의존성 제거하고 fetch API 기반으로 구현
custom.api.request.post({
    url: '/books',
    data: { title: 'example' }
}, successCallback, errorCallback);
// 요청시 예시
(중략)
response = await fetch(url, option);
```

통합 에러 핸들링
```javascript
_defaultHttpErrorHandle: function (response, error, errorCallBack) {
    let errorMsg;
    
    // HTTP 상태 코드별 표준화된 에러 처리
    if (response.status === 400) {
        if(error['fieldErrors']) {
            errorMsg = custom.api._get400ErrorMsg(error['fieldErrors']);
        } else if(error.message) {
            errorMsg = error.message;
        } else {
            errorMsg = '잘못된 요청입니다.';
        }
    }
    // 401, 403, 500 등 다른 상태 코드들도 표준화된 처리
}
```

> 결과

- 코드 중복 제거: 공통 에러 처리 로직을 한 곳에서 관리
- 개발 표준화: 팀 내 일관된 API 통신 패턴 확립
- 표준 준수: Fetch API 등 웹 표준 기술 활용
- 타입 안전성: 백엔드 제네릭과 프론트엔드 타입 체크로 런타임 에러 감소
- 일관성: 모든 API가 동일한 패턴으로 요청/응답 처리

#### ⚡ SpringSecurity 를 통한 보안 설정

#### 기존 문제점

SpringSecurity 없이 filter 를 

- XSS 필터: 기본적인 크로스 사이트 스크립팅 방어만 존재
- CORS 필터: 단순한 교차 출처 리소스 공유 설정만 적용
- 인증/인가 부재: 사용자 인증 및 권한 관리 시스템 없음
- 세션 보안 미흡: 세션 고정 공격, 동시 세션 제어 등 미적용

#### 개선된 보안 체계

**계층별 보안 필터 체인 구성** : Spring Security의 다중 필터 체인 패턴을 적용하여 요청 유형별 맞춤형 보안 정책 구현:

A. 정적 리소스 보안 체인 (Order: 1)

```java
@Bean
@Order(1)
public SecurityFilterChain staticResourceSecurityFilterChain(HttpSecurity http) {
    // CSS, JS, 이미지 등 정적 리소스는 인증 없이 허용
    // 성능 최적화를 위해 최소한의 보안 설정만 적용
}
```


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
dummy data
dummy data
dummy datadummy datadummy datadummy datadummy datadummy data
