💡 혹시 해당 페이지가 잘 안보이거나, 디자인상 이상해 보이나요?
[링크](https://github.com/icemokacat/me/edit/release/public/md/exp2.md) github 에서 볼 수 있습니다.

# Http Client 개선

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
- 멀티파트, 인증, JSON 직렬화/역직렬화 작업 수동
    - JSON 변환, 파일 업로드 등에서 외부 라이브러리와 별도로 결합해야 함

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
        // response 결과 값에 대한 정리 (특수문자 처리 등)
    }

    private <T> T parsingData(String data, Class<T> responseType){
		ObjectMapper mapper = new ObjectMapper();
		T result = null;
		try {
			// https://stackoverflow.com/questions/31537153/jsonparseexception-illegal-unquoted-character-ctrl-char-code-10
			// 리턴 데이터 중 특수문자가 들어가는 경우가 있어서
			// 특수문자 허용
			mapper.configure(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS.mappedFeature(), true);
			// 백슬래시를 이용한 모든 문자의 이스케이프 처리 허용
			mapper.configure(JsonParser.Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER, true);
			result = mapper.readValue(data, responseType);
		} catch (JsonProcessingException e) {
			log.error("JsonProcessingException error", e);
		}
		return result;
	}

}
```



# SNS 연동을 통한 사용자 인증

# 타사 제공 SSO 및 OTP 연동

# KMC, 이니시스 본인인증 API 연동

