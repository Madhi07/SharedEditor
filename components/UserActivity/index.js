import { Fragment, useEffect } from "react";
import { sleepTimeIntervel, webdataencrypt, webdatadecrypt } from "@/utils";
import EventTracker from "./EventTracker"
import PageTracker from "./PageTracker"
import { visitorApiPath, visitApiPath, visitPageApiPath, visitPageActionApiPath } from "@/constants/apiPaths";
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "next/router"

const pagePath = {
    "/": "home",
    "/about": "about",
    "/contact": "contact",
    "/blog": "blog",
    "/pricing": "pricing",

    "/seo-checker": "features",
    "/ui-tester": "features",
    "/responsive-tester": "features",
    "/grammar-checker": "features",

    "/dashboard": "dashboard",
    "/seo": "dashboard",
    "/seo/[...params]": "dashboard",
    "/seo/report": "dashboard",
    "/responsive": "dashboard",
    "/ui/edit/": "dashboard",
    "/ui-ux/[...pro]": "dashboard",
    "/ui/edit/": "dashboard",
    "/grammar": "dashboard",
    "/grammar/[...params]": "dashboard",
    "/settings": "settings",

    "/profile": "profile",
    "/settings": "settings",
    "/other": "other",

}


export default function UserAnalytics() {
    const router = useRouter()

    useEffect(() => {
        userInfo()
    }, [])


    const getIpinfo = async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            return data
        } catch (er) {
            return false
        }
    }

    const nextApi = async (body, types) => {
        const response = await fetch('/api/handler', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: webdataencrypt(JSON.stringify(body)) })
            // body: JSON.stringify({ data: webdataencrypt(JSON.stringify(body)), type: types, viewData: body })
        });
        const data = await response.json();
        if (data?.response) {
            return JSON.parse(webdatadecrypt(data.response))
        }
        return data
    }
    const userInfo = async () => {

        // if session create api
        let sessionId = localStorage.getItem('session_id')
        let getvistId = localStorage.getItem('visit_id')
        let getuser = localStorage.getItem('user_id')
        let vistorId = localStorage.getItem('vistor_id')
        let visotrPageId = localStorage.getItem('vistor_page_id')

        const ipinfo = await getIpinfo()

        if (ipinfo) {

            if (!sessionId) {
                let createSessionId = uuidv4()
                let ipaddress = ipinfo.ip

                // let's check if ip is already in or not
                const checkipexitsorNot = await nextApi({ api: visitorApiPath + "?ip_address=" + ipaddress, method: "GET" }, 'check')

                if (checkipexitsorNot?.length) {
                    let sessionData = checkipexitsorNot[0]
                    localStorage.setItem('session_id', sessionData.session_id)
                    localStorage.setItem('visitor_id', sessionData.session_id)
                    visitApiInfo(ipinfo, false)
                } else {
                    let payload = { session_id: createSessionId, ip_address: ipaddress }

                    let user = localStorage.getItem('user_id')
                    if (user) {
                        payload.user = webdatadecrypt(user)
                    }
                    const userAgent = navigator.userAgent;
                    if (userAgent) {
                        payload['user_agent'] = userAgent
                    }

                    const createVistorResponse = await nextApi({ api: visitorApiPath, method: "POST", payload: payload }, 'visitor')
                    if (createVistorResponse.session_id) {
                        localStorage.setItem('session_id', createVistorResponse.session_id)
                        localStorage.setItem('visitor_id', createVistorResponse.session_id)
                        visitApiInfo(ipinfo, true)
                    }
                }

            } else {
                visitApiInfo(ipinfo, false)
            }
        }

    }

    const visitApiCreate = async (ipinfo) => {
        let sessionId = localStorage.getItem('session_id')

        let visitPayload = { "visitor": sessionId, ...ipinfo }
        let referrer = document.referrer;

        if (referrer) {
            visitPayload.referrer_url = referrer
        }

        let user = localStorage.getItem('user_id')
        if (user) {
            visitPayload.user = webdatadecrypt(user)
        }
        const userAgent = navigator.userAgent;
        if (userAgent) {
            visitPayload['user_agent'] = userAgent
        }

        const createvisitResponse = await nextApi({ api: visitApiPath, method: "POST", payload: visitPayload }, 'visit')
        if (createvisitResponse.id) {
            localStorage.setItem('visit_id', createvisitResponse.id)
            localStorage.setItem('visitCreateTime', new Date().toUTCString())
        }

    }

    const visitApiInfo = async (ipinfo, firstVisit) => {
        let visitId = localStorage.getItem("visit_id")
        let sessionId = localStorage.getItem('session_id')

        let visitCreateTime = localStorage.getItem('visitCreateTime')

        if (!visitId) {
            await visitApiCreate(ipinfo)
            // let visitPayload = { "visitor": sessionId, ...ipinfo }

            // if (referrer) {
            //     visitPayload.referrer_url = referrer
            // }

            // let user = localStorage.getItem('user_id')
            // if (user) {
            //     visitPayload.user = webdatadecrypt(user)
            // }

            // const createvisitResponse = await nextApi({ api: visitApiPath, method: "POST", payload: visitPayload }, 'visit')
            // if (createvisitResponse.id) {
            //     localStorage.setItem('visit_id', createvisitResponse.id)
            // }
        } else if (visitCreateTime) {
            const givenDate = new Date(visitCreateTime).getTime(); // Convert to timestamp (milliseconds)
            const currentDate = Date.now(); // Get current timestamp (milliseconds)

            const hoursPassed = (currentDate - givenDate) / (1000 * 60 * 60); // Convert milliseconds to hours

            if (hoursPassed >= 24) {
                await visitApiCreate(ipinfo)
            }
        }

        let currentPage = localStorage.getItem('currentPage')
        if (currentPage !== window.location.href && currentPage !== window.location.pathname) {
            createPageInfo(firstVisit)
        } else if (!localStorage.getItem("visit_page_id")) {
            createPageInfo(firstVisit)
        }

    }




    const sendPageData = async (eventData) => {
        let sessionId = localStorage.getItem('session_id')
        let visitId = localStorage.getItem("visit_id")
        let visitPageId = localStorage.getItem("visit_page_id")
        let visitPagePayload = {
            "visitor": sessionId,
            "visit": visitId,
            ...eventData,
        }
        let user = localStorage.getItem('user_id')
        if (user) {
            visitPagePayload.user = webdatadecrypt(user)
        }
        const visitPageResponse = await nextApi({ api: visitPageApiPath + visitPageId + "/", method: "PATCH", payload: visitPagePayload }, 'up-vi-page')
        if (visitPageResponse?.id) {
            localStorage.setItem("visit_page_id", visitPageResponse.id,)
        }
        await sleepTimeIntervel(1000)
        createPageInfo()
    }

    const createPageInfo = async (firstVisit = false) => {
        let sessionId = localStorage.getItem('session_id')
        let visitId = localStorage.getItem("visit_id")
        let user = localStorage.getItem('user_id')


        let visitPagePayload = {
            "visitor": sessionId,
            "visit": visitId,
            "url": window.location.href,
            "title": document.title,
            "category": pagePath?.[router.pathname] ?? "others",
            "page_path": router.pathname,
            is_first_visit: firstVisit ?? false
        }
        if (user) {
            visitPagePayload.user = webdatadecrypt(user)
        }
        const visitPageResponse = await nextApi({ api: visitPageApiPath, method: "POST", payload: visitPagePayload }, 'visit-page')
        if (visitPageResponse?.id) {
            localStorage.setItem("visit_page_id", visitPageResponse.id)
        }

    }

    const sendEventToBackend = async (eventData) => {
        let visitor = localStorage.getItem('session_id')
        let visit = localStorage.getItem("visit_id")
        let page = localStorage.getItem("visit_page_id")
        let user = localStorage.getItem('user_id')

        if (visitor && visit && page) {
            let pageActionPayload = {
                ...eventData,
                page,
                visitor,
                visit,
            }
            if (user) {
                pageActionPayload.user = webdatadecrypt(user)
            }
            const visitPageResponse = await nextApi({ api: visitPageActionApiPath, method: "POST", payload: pageActionPayload }, 'page-action')
            if (visitPageResponse?.id) {
                localStorage.setItem("visit_page_event_id", visitPageResponse.id)
            }
        }
    }
    return (
        <Fragment>
            <EventTracker sendEventToBackend={sendEventToBackend} />
            <PageTracker sendPageData={sendPageData} userId={null} />
        </Fragment>
    )
}