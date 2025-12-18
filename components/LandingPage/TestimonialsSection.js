import Image from "next/image";
import { testimonials } from "./constants";
import StarRating from "../common/StarRating";

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-20 relative">
            <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-secondary/20 filter blur-[150px]"></div>

            <div className="container mx-auto px-4 md:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-white/10 mb-4">
                        <p className="text-sm font-medium">Success Stories</p>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Customers Say</h2>
                    <p className="text-xl text-gray-300">Join hundreds of businesses transforming their customer experience with AgentZee.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} id={testimonial.id} className="bg-gradient-to-br from-dark-bg-secondary to-dark-bg-primary border border-white/5 rounded-2xl p-8">
                            <div className="flex items-center mb-6">
                                <Image
                                    quality={100}
                                    width={1024}
                                    height={1024}
                                    src={testimonial.avatar || ""}
                                    className="w-12 h-12 rounded-full mr-4"
                                    alt="Customer"
                                />
                                <div>
                                    <h4 className="font-bold">{testimonial.customerName}</h4>
                                    <p className="text-sm text-gray-400">{testimonial.position}</p>
                                </div>
                            </div>
                            <p className="text-gray-300 mb-6">{testimonial.testimonial}</p>
                            <StarRating rating={testimonial.rating}/>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}


