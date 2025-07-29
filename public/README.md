# Portfolio Site

Astro와 Claude CLI를 활용해 만든 포트폴리오 웹사이트입니다.

## 기술 스택

- **Frontend**: Astro 5.12.3, NodeJS
- **언어**: TypeScript, HTML, CSS
- **스타일링**: GitHub Markdown CSS, Pretendard 폰트
- **개발 도구**: Claude CLI, VSCODE
- **배포**: Vercel, Github

## 주요 특징

- 🎨 **Modern Korean Design**: 한국적 감성의 현대적 디자인
- 📱 **반응형 디자인**: 모바일/데스크톱 최적화
- ⚡ **빠른 로딩**: Astro의 정적 사이트 생성
- 📄 **마크다운 지원**: 경험 상세 내용을 마크다운으로 관리
- 🎭 **모달 시스템**: 상세 내용을 모달로 표시

## 차별점

### 🚀 모달 기반 마크다운 뷰어

> 상세 경험을 마크다운으로 작성하고 모달로 표시하는 혁신적인 접근

**기존 포트폴리오 사이트의 문제점:**

- 🔥 **정적 콘텐츠의 한계**: HTML에 모든 내용을 하드코딩하면 유지보수가 어렵고 수정이 번거로움
- 🔥 **페이지 분산**: 상세 내용을 보려면 별도 페이지로 이동해야 하여 사용자 경험 저하
- 🔥 **개발 복잡도**: 포트폴리오 사이트 자체가 거대해져 내용 작성보다 개발에 시간 소모
- 🔥 **집중도 저하**: 외부 링크로 이동하면 원래 페이지에서 벗어나 맥락 손실

**이 프로젝트의 해결책:**

- 💡 **마크다운 기반 콘텐츠**: 개발자에게 친숙한 마크다운으로 상세 경험 작성
- 💡 **모달 시스템**: 페이지 이동 없이 상세 내용을 오버레이로 표시
- 💡 **GitHub 스타일링**: [github-markdown-css](https://github.com/sindresorhus/github-markdown-css)로 일관된 스타일 제공
- 💡 **실시간 업데이트**: 마크다운 파일만 수정하면 즉시 반영

## 프로젝트 구조

```
portfolio-site/
├── src/
│   ├── components/         # UI 컴포넌트
│   │   ├── Hero.astro     # 메인 소개 섹션
│   │   ├── Skills.astro   # 기술 스택
│   │   ├── Experience.astro # 프로젝트 경험
│   │   ├── Career.astro   # 경력 타임라인
│   │   └── Contact.astro  # 연락처
│   ├── layouts/
│   │   └── Layout.astro   # 기본 레이아웃
│   └── pages/
│       └── index.astro    # 메인 페이지
├── public/
│   ├── md/               # 마크다운 파일들
│   ├── custom.css        # 커스텀 스타일
│   └── robots.txt        # SEO 설정
└── package.json
```

## 시작하기

### 1. 프로젝트 복제

```bash
git clone <repository-url>
cd portfolio-site
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm run dev
```

### 4. 빌드

```bash
npm run build
```

## 커스터마이징

### 개인 정보 수정

1. `src/components/Hero.astro` - 메인 소개글
2. `src/components/Skills.astro` - 기술 스택
3. `src/components/Experience.astro` - 프로젝트 경험
4. `src/components/Career.astro` - 경력 정보
5. `src/components/Contact.astro` - 연락처

### 프로젝트 상세 내용 추가

`public/md/` 폴더에 마크다운 파일을 추가하고 `Experience.astro`에서 `detailUrl`을 설정하세요.

### 색상 테마 변경

CSS 커스텀 속성 `--accent-color: #f9c51d`를 수정하여 메인 컬러를 변경할 수 있습니다.

## Claude CLI를 활용한 개발 과정

이 프로젝트는 Claude CLI를 활용해 다음과 같은 과정으로 개발되었습니다:

1. **기본 구조 설정**: Astro 프로젝트 초기화
2. **컴포넌트 설계**: 섹션별 컴포넌트 분리
3. **반응형 레이아웃**: CSS Grid/Flexbox 활용
4. **모달 시스템**: JavaScript와 마크다운 렌더링 연동
5. **스타일링**: GitHub Markdown CSS와 Pretendard 폰트 적용
6. **최적화**: SEO 설정 및 성능 최적화

## 배포

[Vercel](https://vercel.com/)을 사용한 배포:

1. GitHub에 코드 푸시
2. Vercel과 연결
3. 자동 배포 설정

## 라이선스

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
