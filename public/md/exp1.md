# 실시간 채팅 서비스

## 📋 프로젝트 개요
- **기간**: 2022.06 - 2022.11 (5개월)
- **역할**: 풀스택 개발자 (백엔드 중심)
- **팀 구성**: 개발자 2명, 디자이너 1명

## 🎯 프로젝트 목표
WebSocket을 활용한 실시간 메시징 플랫폼 개발

## 🛠 사용 기술
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.io
- **Database**: MongoDB, Redis
- **Infrastructure**: Docker, AWS EC2
- **Frontend**: React.js (부분 기여)

## 🚀 주요 기능

### 1. 실시간 메시지 전송/수신
Socket.io를 활용하여 실시간 양방향 통신을 구현했습니다.

```javascript
// 서버사이드 Socket.io 구현
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  // 채팅방 입장
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });
  
  // 메시지 전송
  socket.on('send-message', (data) => {
    const { roomId, message, userId } = data;
    
    // 메시지 저장
    saveMessage(roomId, userId, message);
    
    // 룸의 모든 사용자에게 메시지 브로드캐스트
    socket.to(roomId).emit('receive-message', {
      userId,
      message,
      timestamp: new Date()
    });
  });
});
```

### 2. 파일 첨부 및 이미지 전송
- **이미지 업로드**: AWS S3를 활용한 이미지 저장
- **파일 크기 제한**: 최대 10MB
- **지원 형식**: JPG, PNG, GIF, PDF, TXT

```javascript
const multer = require('multer');
const AWS = require('aws-sdk');

const s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const params = {
    Bucket: 'chat-service-files',
    Key: `${Date.now()}-${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };
  
  const result = await s3.upload(params).promise();
  res.json({ fileUrl: result.Location });
});
```

### 3. 채팅방 생성 및 관리
- **개인 채팅**: 1:1 대화
- **그룹 채팅**: 최대 50명까지 참여 가능
- **채팅방 설정**: 이름 변경, 멤버 관리, 나가기

### 4. 사용자 온라인 상태 표시
Redis를 활용하여 사용자의 온라인/오프라인 상태를 실시간으로 관리했습니다.

```javascript
// 사용자 온라인 상태 관리
const redis = require('redis');
const client = redis.createClient();

// 사용자 접속 시
socket.on('user-online', (userId) => {
  client.setex(`user:${userId}:status`, 300, 'online'); // 5분 TTL
  socket.broadcast.emit('user-status-change', { userId, status: 'online' });
});

// 주기적으로 상태 갱신
setInterval(() => {
  socket.emit('ping');
}, 30000); // 30초마다
```

## 📈 성과 및 성능

### 성능 지표
- **동시 접속자**: 최대 1,000명
- **메시지 처리량**: 초당 500건
- **평균 응답 시간**: 50ms 이하
- **파일 업로드 성공률**: 99.8%

### 사용자 피드백
- **실시간성**: "메시지가 즉시 전달되어 매우 만족스럽다"
- **안정성**: "연결이 끊어지는 경우가 거의 없다"
- **사용성**: "직관적인 UI로 사용하기 편하다"

## 🛠 기술적 도전과 해결

### 문제 1: 메시지 순서 보장
**문제**: 네트워크 지연으로 인해 메시지 순서가 뒤바뀌는 현상 발생

**해결**:
```javascript
// 메시지에 순서 번호 추가
let messageSequence = 0;

socket.on('send-message', (data) => {
  const message = {
    ...data,
    sequence: ++messageSequence,
    timestamp: Date.now()
  };
  
  // 순서대로 정렬하여 처리
  processMessageInOrder(message);
});
```

### 문제 2: 연결 끊김 처리
**문제**: 네트워크 불안정으로 인한 연결 끊김 발생

**해결**:
- 자동 재연결 기능 구현
- 연결 끊김 시 메시지 큐에 임시 저장
- 재연결 시 누락된 메시지 동기화

### 문제 3: 메모리 누수
**문제**: 장시간 운영 시 메모리 사용량 증가

**해결**:
- Socket 연결 해제 시 이벤트 리스너 정리
- MongoDB TTL 인덱스를 활용한 오래된 메시지 자동 삭제
- Redis 메모리 정책 설정

## 🎓 배운 점

### 1. 실시간 통신의 복잡성
- WebSocket 연결 관리의 어려움
- 네트워크 불안정성에 대한 대비책 필요성
- 상태 동기화의 중요성

### 2. 확장성 고려사항
- 로드 밸런싱 시 Socket.io 세션 공유 문제
- 다중 서버 환경에서의 메시지 브로드캐스팅
- Redis Adapter 활용의 중요성

### 3. 사용자 경험 개선
- 연결 상태 시각적 표시
- 오프라인 메시지 처리
- 에러 상황에 대한 친화적 메시지

## 🔄 향후 개선 계획
1. **메시지 암호화**: End-to-End 암호화 적용
2. **음성/영상 채팅**: WebRTC를 활용한 음성/영상 통화 기능
3. **봇 기능**: 챗봇 연동을 통한 자동 응답 기능
4. **다국어 지원**: i18n을 활용한 다국어 지원

## 🔗 관련 링크
- [데모 사이트](https://chat-demo.example.com)
- [기술 블로그 포스트](https://blog.example.com/realtime-chat-development)