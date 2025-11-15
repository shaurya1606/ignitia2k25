import Navbar from '@/components/Navbar'

const RoutesLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
        <header>
            <Navbar />
        </header>
        <main>
            {children}
        </main>
    </div>
  )
}

export default RoutesLayout