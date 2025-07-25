# Portfolio Website

Next.js와 TypeScript로 구축한 개인 포트폴리오 웹사이트입니다.

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **배포**: Vercel

## 기능

- 반응형 디자인
- 홈페이지 (메인 소개)
- 소개 페이지 (경력, 기술 스킬)
- 프로젝트 페이지 (포트폴리오 프로젝트들)
- 연락처 페이지 (연락처 정보 및 폼)

## 개발 환경 설정

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 `http://localhost:3000` 접속

## 배포

Vercel에 자동 배포됩니다.

```bash
npm run build
```

## 프로젝트 구조

```
src/
├── app/
│   ├── about/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── projects/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
└── ...
```