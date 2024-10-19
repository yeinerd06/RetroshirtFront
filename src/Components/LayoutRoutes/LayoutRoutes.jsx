import { LayoutProvider } from "@/context/LayoutContext"

const LayoutRoutes = ({ children }) => {
    return (
        <LayoutProvider>
            <div className="mb-4 grid grid-cols-1 gap-6 mt-6">

                <div className="bg-white w-full h-full">

                    {children}
                </div>
            </div>
        </LayoutProvider>
    )
}

export default LayoutRoutes
