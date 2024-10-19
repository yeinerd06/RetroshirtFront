import { LayoutProvider } from "@/context/LayoutContext"

const LayoutRoutes = ({ children }) => {
    return (
        <LayoutProvider>
        <div className="mb-4 grid grid-cols-1 gap-6 mt-6 ">


            <div className="overflow-hidden h-[90vh] bg-white max-h-screen overflow-y-auto">

                {children}
            </div>
        </div>
        </LayoutProvider>
    )
}

export default LayoutRoutes