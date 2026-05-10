export const metadata = {
  title: '주식 분석기',
  description: '실시간 단타 & 단기스윙 분석',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
