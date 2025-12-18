import { useRouter } from "next/router";
import { Fragment } from "react";
import WorkflowDashboard from "./WorkflowDashboard";
import ReactFlowApp from "./ReactFlowApp";
import WorkflowEditor from "./workflowEdit";

export default function Workflow() {
    const router = useRouter();

    const secondPath = `/${router?.query?.index?.[1]}`;
    const thirdPath = router?.query?.index?.[2] ?? null
    return (
        <Fragment>
            {thirdPath ?
                <WorkflowEditor />
                :
                <WorkflowDashboard />
            }
        </Fragment>
    )
}