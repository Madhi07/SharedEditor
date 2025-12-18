import { Fragment } from "react";

import { MediaStateProvider } from "./MediaStateContext";
import { MediaHistoryProvider } from "./MediaHistoryContext";
import { MediaWorkflowProvider } from "./MediaWorkflowContext";

export default function MediaContextProvider({ children }) {
    return (
        <Fragment>
            <MediaStateProvider>
                <MediaHistoryProvider>
                    <MediaWorkflowProvider>
                            {children}
                    </MediaWorkflowProvider>
                </MediaHistoryProvider>
            </MediaStateProvider>
        </Fragment >
    )
}