import Link from 'next/link'

export default function About() {
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
              <Link href="/about" className="text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
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

      {/* About Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About Me</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">소개</h2>
              <p className="text-gray-600 mb-4">
                안녕하세요! 저는 웹 개발에 열정을 가진 풀스택 개발자입니다. 
                사용자 중심의 경험을 만들어내는 것을 좋아하며, 
                새로운 기술을 배우고 적용하는 것에 즐거움을 느낍니다.
              </p>
              <p className="text-gray-600 mb-4">
                현재는 React, Next.js, TypeScript를 주로 사용하여 
                프론트엔드 개발을 하고 있으며, 백엔드는 Node.js와 Python을 
                활용하고 있습니다.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">경험</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Frontend Developer</h3>
                  <p className="text-sm text-gray-500">2023 - Present</p>
                  <p className="text-gray-600 text-sm">
                    React와 TypeScript를 사용한 웹 애플리케이션 개발
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-800">Web Developer</h3>
                  <p className="text-sm text-gray-500">2022 - 2023</p>
                  <p className="text-gray-600 text-sm">
                    풀스택 웹 개발 및 데이터베이스 설계
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">기술 스킬</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                'React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML/CSS',
                'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'Git',
                'Docker', 'AWS'
              ].map((skill) => (
                <div key={skill} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg text-center">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}