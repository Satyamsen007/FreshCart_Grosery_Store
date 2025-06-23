import Footer from '@/components/custom-components/footer/Footer'
import BottomNav from '@/components/custom-components/navbar/BottomNavbar'
import Navbar from '@/components/custom-components/navbar/Navbar'

const layout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <BottomNav />

    </>
  )
}

export default layout