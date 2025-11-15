import { ArrowDown } from "lucide-react"

const ExploreButton = () => {
  return (
    <>
        <button type="button" id="explore-btn" className="mt-6 mx-auto block">
            EXPLORE EVENTS
            <ArrowDown className="inline-block ml-2 mb-1 animate-bounce" />
        </button>
    </>
  )
}

export default ExploreButton