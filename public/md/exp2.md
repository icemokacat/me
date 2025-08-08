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

# SNS 연동을 통한 사용자 인증

# 타사 제공 SSO 및 OTP 연동

# KMC, 이니시스 본인인증 API 연동

