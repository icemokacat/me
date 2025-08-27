💡 혹시 해당 페이지가 잘 안보이거나, 디자인상 이상해 보이나요?
[링크](https://github.com/icemokacat/me/blob/release/public/md/exp2.md) github 에서 볼 수 있습니다.

- [Http Client 개선](#http-client-%EA%B0%9C%EC%84%A0)
- [SNS 연동을 통한 사용자 인증](#sns-%EC%97%B0%EB%8F%99%EC%9D%84-%ED%86%B5%ED%95%9C-%EC%82%AC%EC%9A%A9%EC%9E%90-%EC%9D%B8%EC%A6%9D)
- [타사 제공 SSO 연동](#%ED%83%80%EC%82%AC-%EC%A0%9C%EA%B3%B5-sso-%EC%97%B0%EB%8F%99)
- [KMC, 이니시스 본인인증 API 연동](#kmc-%EC%9D%B4%EB%8B%88%EC%8B%9C%EC%8A%A4-%EB%B3%B8%EC%9D%B8%EC%9D%B8%EC%A6%9D-api-%EC%97%B0%EB%8F%99)

# Http Client 개선

SNS 연동 및 본인인증 API 연동, 학술정보 검색, 장애인도서관 자료 검색 등

다양한 API 연동을 위해 먼저 Http Client 를 개선하였습니다.

### 기존 API 요청 방식

java 에서 기본적으로 제공되는 http client

```java
URL url = new URL("http://api.example.com/users");
HttpURLConnection connection = (HttpURLConnection) url.openConnection();
```

❌ 단점

- 낮은 추상화 수준
    - 요청/응답 헤더 수동 설정, 스트림 수동 처리 등 로우레벨 작업 필요
    - 예외 처리 및 리소스 해제가 번거로움 (InputStream, OutputStream close)
- 가독성과 유지보수성 저하
    - 코드가 장황하고 복잡하여 협업 및 리팩토링 시 불리
- 재사용성과 테스트 어려움
    - 재사용 가능한 구조로 만들기 힘들고, 테스트 시 Mock 구성도 번거로움
- 타임아웃/에러 처리 한계
    - 세분화된 예외 처리 및 설정이 어렵고 복잡함

### RestTemplate 기반 client 로 전환

💡 당시, 진행중인 프로젝트에서 Jeus was 를 사용해야 한다는 고객사의 요청이 있었으며,

`Jeus` 에서는 `webflux` 나 `Reactor Netty` 를 사용하지 못하여 `WebClient` 는 사용하지 못함

진행중인 프로젝트 springboot와 java 버전에 맞는 `org.springframework.web.client.RestTemplate` 을 wrapping 하여 사용

✅ 추후 다른 프로젝트에서는 `org.springframework.web.client.RestClient` 로 교체하였습니다. (현재 문서에서는 생략)

#### 구조예시

![](https://github.com/user-attachments/assets/04720a4d-262e-4857-b648-a953667f0ff8)

**SimpleAPI (순수 HTTP 통신 담당)**

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class SimpleAPI {

	private final RestTemplate restTemplate;
    public <T> ResponseEntity<T> call(HttpRequestParam requestParam, Class<T> responseType){
            // uri 검증 및 파라미터 체크, header 세팅 등 코드 생략
            HttpEntity<String> entity;
    
    		ResponseEntity<T> responseEntity = null;
    
    		if(HttpMethod.POST == requestParam.getMethod()){
    			String body;
    			try {
    				body = objectMapper.writeValueAsString(requestParam.getParams());
    			} catch (JsonProcessingException e) {
    				log.error("request body convert error", e);
    				throw new IllegalArgumentException("Not supported request body [ " + requestParam.getParams()+" ]");
    			}
    			entity = new HttpEntity<>(body, headers);
    		}else if(HttpMethod.GET == requestParam.getMethod()) {
    			entity = new HttpEntity<>(headers);
    		}else{
    			throw new IllegalArgumentException("Not supported http method [ " + requestParam.getMethod()+" ]");
    		}
    
    		// step1 call api to response string
    		responseEntity = restTemplate.exchange(
    			requestURI,
    			requestParam.getMethod(),
    			entity,
    			responseType
    		);
    
    		// step2 convert response string to response object
    		return responseEntity;
    }
}
```

- 다양한 응답 타입 지원을 위한 제네릭 설계

**AladinClient** (관심사 분리 - 알라딘 API 통신과 관련된 에러 핸들링 정의)

```java
@Slf4j
@Component
@RequiredArgsConstructor
public class AladinClient {

	private final SimpleAPI simpleAPI;

	public <T> ResponseEntity<T> callAPI(HttpRequestParam request, Class<T> responseType){
		// T result = null;
		ResponseEntity<T> response;
		try{
			response = simpleAPI.call(request, responseType);
			return response;
		} catch (IllegalArgumentException ie){
			// Request parsing 오류
			log.error("IllegalArgumentException error", ie);
			throw new BusinessException("ALAP01","알라딘 통신 중 오류가 발생했습니다. [ALAP01]");
		}
        // .. JsonProcessingException, BadWebClientRequestException 등 통신 관련 에러 핸들링
    }
```

**AladinService** (비즈니스 로직 및 특화 처리)

```java
@Slf4j
@Service
public class AladinService extends AladinClient {
	public AladinService(SimpleAPI simpleAPI) {
		super(simpleAPI);
	}

    // 도서 상세
    public AladinResponse getBookDetail(AladinDetailRequest request){
        // (중략)
        ResponseEntity<String> response = callAPI(param, String.class);
		String resultData = handleResponse(response);
		return parsingData(resultData, AladinResponse.class);
    }

    // 도서 리스트
    public AladinResponse getBookList(AladinListRequest request){
        // (중략)
        ResponseEntity<String> response = callAPI(param, String.class);
        // 알라딘 API 는 응답 형식 (json) 에 대한 일부 오류가 있어서 handle 이 먼저 필요하여 string 으로 먼저 응답 받음
		String resultData = handleResponse(response);
		return parsingData(resultData, AladinResponse.class);
    }

    private String handleResponse(ResponseEntity<String> response) {
        // response 결과 값에 대한 정리 (MediaType 확인 및 특수문자 처리 등)
    }

    private <T> T parsingData(String data, Class<T> responseType){
		// object mapper custom 설정 및 dto 변환
	}

}
```

**사용예시**

```java
// 1. 요청 DTO 생성
AladinDetailRequest request = AladinDetailRequest.builder()
    .itemId("123456")
    .itemIdType("ISBN")
    .build();

// 2. 서비스 호출 (복잡한 HTTP 통신 로직 숨겨짐)
AladinResponse response = aladinService.getBookDetail(request);

// 3. 비즈니스 로직에 집중
List<BookItem> books = response.getItem();
```

# SNS 연동을 통한 사용자 인증

1. 프론트엔드 로그인 요청 
(일부 코드 생략)
```javascript
// 다양한 SNS Type에 대응할 수 있게 enum 으로 지정한 sns type을 넘겨줌
snsTypeInput.value = 'NAVR';
// 사용자 환경 감지 및 파라미터 설정
const isMobileYn = cyberLogin.isMobile(userAgent) ? 'Y' : 'N';
const loginReferer = cyberLogin.state.referrer; // 로그인 후 돌아갈 페이지

// 모바일: 현재 창에서 이동, 데스크톱: 팝업창 사용
if('Y' === isMobileYn){
    location.href = naverPopURI;
} else {
    window.open(naverPopURI, targetName, popOptStr);
}
```

2. 백엔드 인증 요청 처리 (팝업 혹은 새페이지)
```java
// CSRF 공격 방지를 위한 상태 토큰 생성
String state = NaverApiUtil.createState();
session.setAttribute("state", state);

// 네이버 OAuth 인증 URL 생성
String naverCallURL = NaverApiUtil.getNaverAuthorizeURL(clientId, state, callBackURI);

// 네이버 로그인 페이지로 리다이렉트
response.sendRedirect(naverCallURL);
```

3. 사용자 동의 후 콜백 (토큰 발급 및 프로필 요청)
```java
// 1) CSRF 공격 방지를 위한 state 검증
String storedState = (String) request.getSession().getAttribute("state");
if (!state.equals(storedState)) {
    throw new UnauthorizedException();
}

// 2) 인증 코드로 액세스 토큰 요청
TokenRequest tokenRequest = new TokenRequest.Builder(
    NaverLoginGrant.AUTHORIZATION, clientId, clientSecret
).code(code).state(state).build();

TokenResponse tokenResponse = naverService.requestNewToken(tokenRequest);

// 3) 액세스 토큰으로 사용자 프로필 조회
NaverProfileResponse profileResponse = naverService.getProfile(clientId, clientSecret, accessToken);
```

4. 결과 처리 및 후속 작업
```javascript
function pageCallback(){
    if('Y' === isMobileYn) {
        // 모바일: 중간 페이지를 통해 파라미터 전달 후 최종 로그인 페이지로 이동
        const formJson = {
            snsUniqId: nid,
            snsType: 'NAVR',
            pageReturnUri: _pageReturnUri,
            returnReferer: _returnReferer,
            pageState: _pageState,
        }
        // POST 방식으로 중간 처리 페이지 호출
    } else {
        // 데스크톱: 부모창(원래 로그인 페이지)에 결과 전달 후 팝업 닫기
        window.opener.document.getElementById('snsUniqId').value = nid;
        window.opener.snsCallback();
        window.close();
    }
}
```

# 타사 제공 SSO 연동

SI 사업 중 기존 관리자 시스템은 JWT Token 과 SpringSecurity 를 이용하여 로그인 처리를 하고 있었으나

발주처의 요청으로 드림시큐리티사에서 제공하는 SSO 연동을 해야 했습니다.

이때 해당 솔루션이 JSP 형태로 제공되고 session 에 값을 넣어 주는 방식으로 로그인 처리를 하게끔되어 있어

아래의 문제가 발생했습니다.

- 현재 사용하고 있는 view engine은 Thymeleaf 이며, JSP는 호출 할 수 없음
- 기존 Springsecurity 에서는 `SecurityContext` 객체에 로그인 상태를 저장하기 때문에 기존 로그인과 호환이 되지 않음

#### Thymeleaf 와 JSP 혼용 사용가능 하게 설정 변경

```yml
spring:
  # thymeleaf 설정
  thymeleaf:
    prefix: classpath:/templates/
    suffix: .html
    view-names: thymeleaf/*
    check-template-location: true

  # view - jsp
  mvc:
    view:
      prefix: /WEB-INF/views/
      suffix: .jsp
```

반드시 기존 경로와 구분되게 `view-names` 를 설정

#### SpringSecurity 처리 변경

`JwtAuthorizationFilter` 코드 일부 추가 및 수정

💡 개발 중 화면과 서비스 분리에 대한 요구사항이 계속 변경되었고, 마지막은 한 프로젝트에서 관리하기로 되어

  JWT Token 과 Session 을 동시에 관리하는 조금 비효율 적인 구조로 security 가 설정되었습니다.

```java
if (TokenUtils.isValidToken(token)) {
	// 드림시큐리티사에서 제공한 session에 설정된 로그인 정보를 추가로 확인
	(코드생략)
	// SecurityContext 에 Authentication 객체를 저장
	SecurityContextHolder.getContext().setAuthentication(authentication);
}
```

# KMC, 이니시스 본인인증 API 연동

#### 개발시 API 문서를 참고하여 흐름도를 작성

일부 프로세스 예시.

<img width="1323" height="533" alt="image" src="https://github.com/user-attachments/assets/6027d2e3-3cbf-40ca-9d08-c3fb46665a3f" />

#### 공통 JS 작성 및 

회원가입, 아이디 찾기, 재인증 다양한 페이지에서 활용될 수 있도록 팝업 요청 스크립트를 분리 `authme.js`

<img width="855" height="646" alt="image" src="https://github.com/user-attachments/assets/a6fcfece-04ab-44fb-bbd1-bd1fcb366fda" />


