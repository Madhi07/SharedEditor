import clsx from "clsx";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

export default function StarRating({
    rating,
    containerClassName = "flex",
    iconClassName = "text-yellow-400"
}) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    // const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
        <div className={clsx(containerClassName)}>
            {[...Array(fullStars)].map((_, i) => (
                <FaStar key={i} className={clsx(iconClassName)} />
            ))}
            {hasHalfStar &&
                <FaStarHalfAlt className={iconClassName} />
            }
        </div>
    )
}
