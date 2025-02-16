import { Link } from "react-router-dom";

function PageNotFound()
{
    return (
        <>
        <div> 404 Not Found</div>
        <Link to = "/"> Back to Dashboard</Link>
        </>
    );
}

export default PageNotFound