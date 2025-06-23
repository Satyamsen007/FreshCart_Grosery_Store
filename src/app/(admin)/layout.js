import DashboardSideMenuBar from '@/components/custom-components/admin/DashboardSideMenuBar'
import DashboardTopNavbar from '@/components/custom-components/admin/DashboardTopNavbar'

const layout = ({ children }) => {
  return (
    <div className="flex">
      <DashboardSideMenuBar />
      <div className="flex-1 flex flex-col">
        <DashboardTopNavbar />
        <main className="">
          {children}
        </main>
      </div>
    </div>
  )
}

export default layout