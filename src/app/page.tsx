import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Portfolio</h1>
            </div>
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                About
              </Link>
              <Link href="/projects" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Projects
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">안녕하세요!</span>
            <span className="block text-blue-600">개발자 포트폴리오입니다</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            웹 개발과 소프트웨어 엔지니어링에 열정을 가진 개발자입니다. 
            창의적인 솔루션과 사용자 경험을 중시합니다.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/projects"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                프로젝트 보기
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                href="/contact"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                연락하기
              </Link>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-16">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">기술 스택</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              다양한 기술을 활용하여 프로젝트를 개발합니다
            </p>
          </div>
          <div className="mt-10">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-medium text-gray-900">Frontend</h3>
                <p className="mt-2 text-sm text-gray-500">React, Next.js, TypeScript</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-medium text-gray-900">Backend</h3>
                <p className="mt-2 text-sm text-gray-500">Node.js, Python, Express</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-medium text-gray-900">Database</h3>
                <p className="mt-2 text-sm text-gray-500">PostgreSQL, MongoDB</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-lg font-medium text-gray-900">Tools</h3>
                <p className="mt-2 text-sm text-gray-500">Git, Docker, AWS</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}