import Link from 'next/link'

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "E-commerce Website",
      description: "Next.js와 TypeScript로 구축한 온라인 쇼핑몰. 사용자 인증, 결제 시스템, 관리자 패널을 포함합니다.",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "PostgreSQL"],
      githubUrl: "https://github.com/example/ecommerce",
      liveUrl: "https://ecommerce-demo.vercel.app",
      image: "/api/placeholder/400/250"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "React와 Node.js로 개발한 팀 협업 도구. 실시간 업데이트와 드래그 앤 드롭 기능을 지원합니다.",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      githubUrl: "https://github.com/example/task-manager",
      liveUrl: "https://task-manager-demo.vercel.app",
      image: "/api/placeholder/400/250"
    },
    {
      id: 3,
      title: "Weather Dashboard",
      description: "날씨 API를 활용한 대시보드 애플리케이션. 지역별 날씨 정보와 예보를 시각화합니다.",
      technologies: ["React", "Chart.js", "Weather API", "CSS3"],
      githubUrl: "https://github.com/example/weather-dashboard",
      liveUrl: "https://weather-dashboard-demo.vercel.app",
      image: "/api/placeholder/400/250"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">Portfolio</Link>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/projects" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Projects
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Projects Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Projects</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            다양한 기술을 활용하여 개발한 프로젝트들을 소개합니다
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-4xl mb-2">🚀</div>
                  <div className="text-sm opacity-75">Project Screenshot</div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">{project.description}</p>
                
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-md text-sm text-center hover:bg-gray-700 transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm text-center hover:bg-blue-700 transition-colors"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}