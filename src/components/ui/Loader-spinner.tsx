export function LoaderSpinner() {
    return ( 
        <div className="flex flex-col items-center justify-center min-h-screen text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mx-auto" />
        </div>
    )
}