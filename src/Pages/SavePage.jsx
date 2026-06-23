import { Sidebar } from '../components/BlockComponent/Sidebar'
// import { Xpost } from '../components/BlockComponent/Xpost'
import SavePostPage from './SavePostPage'

export const SavePage = () => {
  return (
    <div className="flex w-full h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto lg:ml-64">
        <SavePostPage />
      </div>
    </div>
  )
}
