import Link from "next/link";
import { Fragment } from "react";

export default function ChatbotIntegrationInstructions({ data = [] }) {
    return (
        <div className="space-y-4">
            {data?.map((instruction, index) => (
                <div key={index}>
                    <h3 className="text-lg font-semibold mb-3">
                        {instruction?.title}
                    </h3>
                    <ul className="space-y-2.5 mb-6">
                        {instruction.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-center gap-2.5">
                                <div className="bg-secondary/10 rounded-md size-8 flex items-center justify-center flex-shrink-0">
                                    {req.icon ?
                                        <req.icon className="text-secondary font-bold flex-shrink-0" /> :
                                        <Fragment>
                                            {idx + 1}
                                        </Fragment>
                                    }
                                </div>
                                <div className="text-light-text-secondary">
                                    {req?.link ? (
                                        <>
                                            {req.text.split(instruction.requirements[idx].link.label)[0]}
                                            <Link href={req.link.url} className="underline text-secondary">{req.link.label}</Link>
                                            {req.text.split(instruction.requirements[idx].link.label)[1]}
                                        </>
                                    ) : req.text}
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* <div className="bg-purple-100 px-4 py-3 rounded-md flex items-center space-x-3">
                        <span>{iconMap[content.help.icon]}</span>
                        <span className="text-gray-700">
                            {content.help.text.split(content.help.link.label)[0]}
                            <a href={content.help.link.url} className="underline text-gray-900">{content.help.link.label}</a>
                            {content.help.text.split(content.help.link.label)[1]}
                        </span>
                    </div> */}
                </div>
            ))}
        </div>
    )
}
