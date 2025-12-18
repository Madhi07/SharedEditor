import MainLayout from "@/components/MainLayout";
import { AgentZeeHead } from "@/components/SVG";
import { seoData } from "@/constants/seoData";
import { NextSeo } from "next-seo";
import Link from "next/link";
import { Fragment } from "react";
import { FaBell, FaCalendar, FaCloud, FaCogs, FaCopyright, FaCreditCard, FaDollarSign, FaEdit, FaEnvelope, FaExclamationTriangle, FaFileContract, FaGlobe, FaHandshake, FaInfoCircle, FaShieldAlt, FaTimesCircle, FaUndo, FaUserCheck } from "react-icons/fa";

export default function TermsOfServicesPage() {
    return (
        <Fragment>
            <NextSeo {...seoData.termsOfServicePage} />
            <MainLayout>
                <section id="privacy-policy" className="md:py-40 py-24 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-dark-bg-secondary to-dark-bg-primary z-0"></div>

                    <div className="relative">
                        <div className="absolute top-0 right-10 w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] animate-pulse-slow"></div>
                        <div className="absolute top-0 left-10 w-80 h-80 rounded-full bg-secondary/20 filter blur-[100px] animate-pulse-slow"></div>
                        <div className="container mx-auto px-4 md:px-8 relative z-10 mb-16">
                            <div className="text-center max-w-4xl mx-auto">
                                <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-6">
                                    <p className="text-sm font-medium flex items-center justify-center">
                                        <FaFileContract className=" text-primary mr-2" />
                                        Legal Agreement
                                    </p>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                                    Terms of <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Service</span>
                                </h1>

                                <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                                    Please read these terms carefully before using AgentZee.ai services. By accessing our platform, you agree to be bound by these terms.
                                </p>

                                <div className="text-sm text-gray-400">
                                    <p>Last updated: 20 June 2025</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container mx-auto px-4 md:px-8 relative z-10">
                        <div className="max-w-4xl mx-auto">

                            <div className="text-lg md:text-xl">
                                <div className="text-xl md:text-2xl  font-[700] text-start">Introduction</div>
                                <p className="my-4">
                                    Welcome to agentzee.ai the service provided by Episyche Technologies Pvt
                                    Ltd. As you have just clicked our Terms of Service, please pause, grab a
                                    cup of coffee and carefully read the following pages. It will take you
                                    approximately 20 minutes.
                                </p>
                                <p className="my-4 ">
                                    These Terms of Service (“Terms”, “Terms of Service”) govern your use of
                                    our web pages located at
                                    {" "}
                                    <Link
                                        target="_blank"
                                        href="https://agentzee.ai"
                                        className="text-secondary underline"
                                    >
                                        https://agentzee.ai
                                    </Link>
                                    {" "}
                                    operated by Episyche
                                    Technologies Pvt Ltd.
                                </p>
                                <p className="my-4">
                                    Your agreement with us includes these Terms (“Agreements”). You
                                    acknowledge that you have read and understood Agreements, and agree to be
                                    bound of them.
                                </p>
                                <p className="my-4">
                                    If you do not agree with (or cannot comply with) Agreements, then you may
                                    not use the Service, but please let us know by emailing at
                                    support@agentzee.ai so we can try to find a solution. These Terms apply to
                                    all visitors, users and others who wish to access or use Service.
                                </p>
                                <p className="my-4">Thank you for being responsible.</p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Communications
                                </div>
                                <p className="my-4">
                                    By creating an Account on our Service, you agree to subscribe to
                                    newsletters, marketing or promotional materials and other information we
                                    may send. However, you may opt out of receiving any, or all, of these
                                    communications from us by following the unsubscribe link or by emailing
                                    at.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Subscriptions
                                </div>
                                <p className="my-4">
                                    Some parts of Service are billed on a subscription basis
                                    (“Subscription(s)”). You will be billed in advance on a recurring and
                                    periodic basis (“Billing Cycle”). Billing cycles are set either on a
                                    monthly or annual basis, depending on the type of subscription plan you
                                    select when purchasing a Subscription.
                                </p>
                                <p className="my-4">
                                    At the end of each Billing Cycle, your Subscription will automatically
                                    renew under the exact same conditions unless you cancel it or Episyche
                                    Technologies Pvt Ltd cancels it. You may cancel your Subscription renewal
                                    either through your online account management page or by contacting
                                    Episyche Technologies Pvt Ltd customer support team.
                                </p>
                                <p className="my-4">
                                    A valid payment method, including credit card, is required to process the
                                    payment for your subscription. You shall provide Episyche Technologies Pvt
                                    Ltd with accurate and complete billing information including full name,
                                    address, state, zip code, telephone number, and a valid payment method
                                    information. By submitting such payment information, you automatically
                                    authorize Episyche Technologies Pvt Ltd to charge all Subscription fees
                                    incurred through your account to any such payment instruments.
                                </p>
                                <p className="my-4">
                                    Should automatic billing fail to occur for any reason, Episyche
                                    Technologies Pvt Ltd will issue an electronic invoice indicating that you
                                    must proceed manually, within a certain deadline date, with the full
                                    payment corresponding to the billing period as indicated on the invoice.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">Fee Changes</div>
                                <p className="my-4">
                                    Episyche Technologies Pvt Ltd, in its sole discretion and at any time, may
                                    modify Subscription fees for the Subscriptions. Any Subscription fee
                                    change will become effective at the end of the then-current Billing Cycle.
                                </p>
                                <p className="my-4">
                                    Episyche Technologies Pvt Ltd will provide you with a reasonable prior
                                    notice of any change in Subscription fees to give you an opportunity to
                                    terminate your Subscription before such change becomes effective.
                                </p>
                                <p className="my-4">
                                    Your continued use of Service after Subscription fee change comes into
                                    effect constitutes your agreement to pay the modified Subscription fee
                                    amount.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">Refunds</div>
                                <p className="my-4">
                                    We issue refunds for Contracts within fourteen (14) days of the original
                                    purchase of the Contract.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">Content</div>
                                <p className="my-4">
                                    Our Service allows you to post, link, store, share and otherwise make
                                    available certain information, text, graphics, videos, or other material
                                    (“Content”). You are responsible for Content that you post on or through
                                    Service, including its legality, reliability, and appropriateness.
                                </p>
                                <p className="my-4">
                                    By posting Content on or through Service, You represent and warrant that:
                                    Content is yours (you own it) and/or you have the right to use it and the
                                    right to grant us the rights and license as provided in these Terms solely
                                    for the purpose of providing the services to you as a Customer during the
                                    term you use the service
                                </p>
                                <p className="my-4">
                                    You retain any and all of your rights to any Content you submit, post or
                                    display on or through Service. However, by posting Content using the
                                    Service, you grant us a non-exclusive, royalty-free, revokable, worldwide
                                    license to host, copy, transmit, reproduce, distribute, and otherwise use
                                    and display the Content and perform all acts with respect to the Content
                                    as may be necessary for agentzee to provide the Services to you as a
                                    Customer during the term you use the service.
                                </p>
                                <p className="my-4">
                                    Episyche Technologies Pvt Ltd has the right but not the obligation to
                                    monitor and edit all Content provided by users.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    No Use By Minors
                                </div>
                                <p className="my-4">
                                    Service is intended only for access and use by individuals at least
                                    eighteen (18) years old. By accessing or using any of Company, you warrant
                                    and represent that you are at least eighteen (18) years of age and with
                                    the full authority, right, and capacity to enter into this agreement and
                                    abide by all of the terms and conditions of Terms. If you are not at least
                                    eighteen (18) years old, you are prohibited from both the access and usage
                                    of Service.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">Accounts</div>
                                <p className="my-4">
                                    When you create an account with us, you guarantee that you are above the
                                    age of 18, and that the information you provide us is accurate, complete,
                                    and current at all times. Inaccurate, incomplete, or obsolete information
                                    may result in the immediate termination of your account on Service.
                                </p>
                                <p className="my-4">
                                    You are responsible for maintaining the confidentiality of your account
                                    and password, including but not limited to the restriction of access to
                                    your computer and/or account. You agree to accept responsibility for any
                                    and all activities or actions that occur under your account and/or
                                    password, whether your password is with our Service or a third-party
                                    service. You must notify us immediately upon becoming aware of any breach
                                    of security or unauthorized use of your account.
                                </p>
                                <p className="my-4">
                                    You may not use as a username the name of another person or entity or that
                                    is not lawfully available for use, a name or trademark that is subject to
                                    any rights of another person or entity other than you, without appropriate
                                    authorization. You may not use as a username any name that is offensive,
                                    vulgar or obscene.
                                </p>
                                <p className="my-4">
                                    We reserve the right to refuse service, terminate accounts, remove or edit
                                    content, or cancel orders in our sole discretion.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Intellectual Property
                                </div>
                                <p className="my-4">
                                    Service and its original content (excluding Content provided by users),
                                    features and functionality are and will remain the exclusive property of
                                    Episyche Technologies Pvt Ltd and its licensors. Service is protected by
                                    copyright, trademark, and other laws of the United States. Our trademarks
                                    and trade dress may not be used in connection with any product or service
                                    without the prior written consent of Episyche Technologies Pvt Ltd.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Error Reporting and Feedback
                                </div>
                                <p className="my-4">
                                    You may provide us directly at support@agentzee.ai with information and
                                    feedback concerning errors, suggestions for improvements, ideas, problems,
                                    complaints, and other matters related to our Service (“Feedback”). You
                                    acknowledge and agree that: (i) you shall not retain, acquire or assert
                                    any intellectual property right or other right, title or interest in or to
                                    the Feedback; (ii) Company may have development ideas similar to the
                                    Feedback; (iii) Feedback does not contain confidential information or
                                    proprietary information from you or any third party; and (iv) Company is
                                    not under any obligation of confidentiality with respect to the Feedback.
                                    In the event the transfer of the ownership to the Feedback is not possible
                                    due to applicable mandatory laws, you grant Company and its affiliates an
                                    exclusive, transferable, irrevocable, free-of-charge, sub-licensable,
                                    unlimited and perpetual right to use (including copy, modify, create
                                    derivative works, publish, distribute and commercialize) Feedback in any
                                    manner and for any purpose.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Links To Other Web Sites
                                </div>
                                <p className="my-4">
                                    Our Service may contain links to third party web sites or services that
                                    are not owned or controlled by Episyche Technologies Pvt Ltd.
                                </p>
                                <p className="my-4">
                                    Episyche Technologies Pvt Ltd has no control over, and assumes no
                                    responsibility for the content, privacy policies, or practices of any
                                    third party web sites or services. We do not warrant the offerings of any
                                    of these entities/individuals or their websites.
                                </p>
                                <p className="my-4">
                                    YOU ACKNOWLEDGE AND AGREE THAT Episyche Technologies Pvt Ltd SHALL NOT BE
                                    RESPONSIBLE OR LIABLE, DIRECTLY OR INDIRECTLY, FOR ANY DAMAGE OR LOSS
                                    CAUSED OR ALLEGED TO BE CAUSED BY OR IN CONNECTION WITH USE OF OR RELIANCE
                                    ON ANY SUCH CONTENT, GOODS OR SERVICES AVAILABLE ON OR THROUGH ANY SUCH
                                    THIRD PARTY WEB SITES OR SERVICES.
                                </p>
                                <p className="my-4">
                                    WE STRONGLY ADVISE YOU TO READ THE TERMS OF SERVICE AND PRIVACY POLICIES
                                    OF ANY THIRD PARTY WEB SITES OR SERVICES THAT YOU VISIT.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Disclaimer Of Warranty
                                </div>
                                <p className="my-4">
                                    THESE SERVICES ARE PROVIDED BY COMPANY ON AN “AS IS” AND “AS AVAILABLE”
                                    BASIS. COMPANY MAKES NO REPRESENTATIONS OR WARRANTIES OF ANY KIND, EXPRESS
                                    OR IMPLIED, AS TO THE OPERATION OF THEIR SERVICES, OR THE INFORMATION,
                                    CONTENT OR MATERIALS INCLUDED THEREIN. YOU EXPRESSLY AGREE THAT YOUR USE
                                    OF THESE SERVICES, THEIR CONTENT, AND ANY SERVICES OR ITEMS OBTAINED FROM
                                    US IS AT YOUR SOLE RISK.
                                </p>
                                <p className="my-4">
                                    NEITHER COMPANY NOR ANY PERSON ASSOCIATED WITH COMPANY MAKES ANY WARRANTY
                                    OR REPRESENTATION WITH RESPECT TO THE COMPLETENESS, SECURITY, RELIABILITY,
                                    QUALITY, ACCURACY, OR AVAILABILITY OF THE SERVICES. WITHOUT LIMITING THE
                                    FOREGOING, NEITHER COMPANY NOR ANYONE ASSOCIATED WITH COMPANY REPRESENTS
                                    OR WARRANTS THAT THE SERVICES, THEIR CONTENT, OR ANY SERVICES OR ITEMS
                                    OBTAINED THROUGH THE SERVICES WILL BE ACCURATE, RELIABLE, ERROR-FREE, OR
                                    UNINTERRUPTED, THAT DEFECTS WILL BE CORRECTED, THAT THE SERVICES OR THE
                                    SERVER THAT MAKES IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL
                                    COMPONENTS OR THAT THE SERVICES OR ANY SERVICES OR ITEMS OBTAINED THROUGH
                                    THE SERVICES WILL OTHERWISE MEET YOUR NEEDS OR EXPECTATIONS.
                                </p>
                                <p className="my-4">
                                    COMPANY HEREBY DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR
                                    IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO ANY
                                    WARRANTIES OF MERCHANTABILITY, NON-INFRINGEMENT, AND FITNESS FOR
                                    PARTICULAR PURPOSE.
                                </p>
                                <p className="my-4">
                                    THE FOREGOING DOES NOT AFFECT ANY WARRANTIES WHICH CANNOT BE EXCLUDED OR
                                    LIMITED UNDER APPLICABLE LAW.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Limitation Of Liability
                                </div>
                                <p className="my-4">
                                    EXCEPT AS PROHIBITED BY LAW, YOU WILL HOLD US AND OUR OFFICERS, DIRECTORS,
                                    EMPLOYEES, AND AGENTS HARMLESS FOR ANY INDIRECT, PUNITIVE, SPECIAL,
                                    INCIDENTAL, OR CONSEQUENTIAL DAMAGE, HOWEVER IT ARISES (INCLUDING
                                    ATTORNEYS' FEES AND ALL RELATED COSTS AND EXPENSES OF LITIGATION AND
                                    ARBITRATION, OR AT TRIAL OR ON APPEAL, IF ANY, WHETHER OR NOT LITIGATION
                                    OR ARBITRATION IS INSTITUTED), WHETHER IN AN ACTION OF CONTRACT,
                                    NEGLIGENCE, OR OTHER TORTIOUS ACTION, OR ARISING OUT OF OR IN CONNECTION
                                    WITH THIS AGREEMENT, INCLUDING WITHOUT LIMITATION ANY CLAIM FOR PERSONAL
                                    INJURY OR PROPERTY DAMAGE, ARISING FROM THIS AGREEMENT AND ANY VIOLATION
                                    BY YOU OF ANY FEDERAL, STATE, OR LOCAL LAWS, STATUTES, RULES, OR
                                    REGULATIONS, EVEN IF COMPANY HAS BEEN PREVIOUSLY ADVISED OF THE
                                    POSSIBILITY OF SUCH DAMAGE. EXCEPT AS PROHIBITED BY LAW, IF THERE IS
                                    LIABILITY FOUND ON THE PART OF COMPANY, IT WILL BE LIMITED TO THE AMOUNT
                                    PAID FOR THE PRODUCTS AND/OR SERVICES, AND UNDER NO CIRCUMSTANCES WILL
                                    THERE BE CONSEQUENTIAL OR PUNITIVE DAMAGES. SOME STATES DO NOT ALLOW THE
                                    EXCLUSION OR LIMITATION OF PUNITIVE, INCIDENTAL OR CONSEQUENTIAL DAMAGES,
                                    SO THE PRIOR LIMITATION OR EXCLUSION MAY NOT APPLY TO YOU.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">Termination</div>
                                <p className="my-4">
                                    We may terminate or suspend your account and bar access to Service
                                    immediately, without prior notice or liability, under our sole discretion,
                                    for any reason whatsoever and without limitation, including but not
                                    limited to a breach of Terms.
                                </p>
                                <p className="my-4">
                                    If you wish to terminate your account, you may simply discontinue using
                                    Service.
                                </p>
                                <p className="my-4">
                                    All provisions of Terms which by their nature should survive termination
                                    shall survive termination, including, without limitation, ownership
                                    provisions, warranty disclaimers, indemnity and limitations of liability.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Governing Law
                                </div>
                                <p className="my-4">
                                    These Terms shall be governed and construed in accordance with the laws of
                                    State of California without regard to its conflict of law provisions.
                                </p>
                                <p className="my-4">
                                    Our failure to enforce any right or provision of these Terms will not be
                                    considered a waiver of those rights. If any provision of these Terms is
                                    held to be invalid or unenforceable by a court, the remaining provisions
                                    of these Terms will remain in effect. These Terms constitute the entire
                                    agreement between us regarding our Service and supersede and replace any
                                    prior agreements we might have had between us regarding Service.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Changes To Service
                                </div>
                                <p className="my-4">
                                    We reserve the right to withdraw or amend our Service, and any service or
                                    material we provide via Service, in our sole discretion without notice. We
                                    will not be liable if for any reason all or any part of Service is
                                    unavailable at any time or for any period. From time to time, we may
                                    restrict access to some parts of Service, or the entire Service, to users,
                                    including registered users.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Amendments To Terms
                                </div>
                                <p className="my-4">
                                    We may amend Terms at any time by posting the amended terms on this site.
                                    It is your responsibility to review these Terms periodically.
                                </p>
                                <p className="my-4">
                                    Your continued use of the Platform following the posting of revised Terms
                                    means that you accept and agree to the changes. You are expected to check
                                    this page frequently so you are aware of any changes, as they are binding
                                    on you.
                                </p>
                                <p className="my-4">
                                    By continuing to access or use our Service after any revisions become
                                    effective, you agree to be bound by the revised terms. If you do not agree
                                    to the new terms, you are no longer authorized to use Service.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">
                                    Waiver And Severability
                                </div>
                                <p className="my-4">
                                    No waiver by Company of any term or condition set forth in Terms shall be
                                    deemed a further or continuing waiver of such term or condition or a
                                    waiver of any other term or condition, and any failure of Company to
                                    assert a right or provision under Terms shall not constitute a waiver of
                                    such right or provision.
                                </p>
                                <p className="my-4">
                                    If any provision of Terms is held by a court or other tribunal of
                                    competent jurisdiction to be invalid, illegal or unenforceable for any
                                    reason, such provision shall be eliminated or limited to the minimum
                                    extent such that the remaining provisions of Terms will continue in full
                                    force and effect.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl font-[700] text-start">
                                    Acknowledgement
                                </div>
                                <p className="my-4">
                                    BY USING SERVICE OR OTHER SERVICES PROVIDED BY US, YOU ACKNOWLEDGE THAT
                                    YOU HAVE READ THESE TERMS OF SERVICE AND AGREE TO BE BOUND BY THEM.
                                </p>
                            </div>
                            <div className="text-lg md:text-xl">
                                <div className=" text-xl md:text-2xl   font-[700] text-start">Contact Us</div>
                                <p className="mt-4">
                                    Please send your feedback, comments, requests for technical support:
                                    {" "}
                                    <Link
                                        href="mailto:support@agentzee.ai"
                                        className="text-secondary underline"
                                    >
                                        support@agentzee.ai
                                    </Link>
                                    .
                                </p>
                            </div>
                            <div className="pt-2 ">
                                <p className="text-md  font-[600]">Episyche Technologies Pvt Ltd</p>
                                <p className="font-mediam text-md w-[260px] pt-1">
                                    Second Floor, No.135/1, Palanisamy Towers, Dharamraj Layout, Sowripalayam
                                    Cross Road, Ramanathapuram, Coimbatore-641045, Tamilnadu, India.
                                </p>
                            </div>


                        </div>
                    </div>
                </section>
            </MainLayout>
        </Fragment>
    )
}
