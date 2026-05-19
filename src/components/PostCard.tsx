import type { PostData } from "./startups/types";

interface Props {
  data: PostData;
}

export default function PostCard({ data }: Props) {
  // 1. Fallback to ID if slug is undefined. Ensure this matches your routing structure.
  const detailUrl = `/posts/${data.slug || data.id}`;

  // 2. Handle the union type for ogImage safely
  const imageUrl = typeof data.ogImage === "string" 
    ? data.ogImage 
    : data.ogImage?.src;

  // 3. Format the publish date
  const formattedDate = new Date(data.pubDatetime).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <a href={detailUrl} className="block min-w-0">
      <article className="flex flex-col w-full min-w-0 rounded border-2 border-stroke bg-black transition duration-150 ease-out hover:-translate-y-0.5">
        
        {/* Banner Image */}
        <div className="relative h-37.5 shrink-0 overflow-hidden -mb-5.75">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={data.title}
              loading="lazy"
              className="w-full h-full object-cover object-center block"
            />
          ) : (
            <div className="w-full h-full bg-stroke flex items-center justify-center text-secondary">
              No Image
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-b from-black/15 to-black/50"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-2.5 p-2.5 z-10 relative">
          <div className="flex flex-row gap-2.5 min-w-0 items-start justify-between">
            <div className="flex flex-col gap-2.5 min-w-0 flex-1">
              
              {/* Title */}
              <div className="px-2.5 min-w-0">
                <h3 className="m-0 font-display text-[21px] font-semibold leading-normal text-white whitespace-normal line-clamp-2 [text-shadow:-1.5px_-1.5px_0_#000,1.5px_-1.5px_0_#000,-1.5px_1.5px_0_#000,1.5px_1.5px_0_#000]">
                  {data.title}
                </h3>
              </div>
              
              {/* Tags Array Mapping */}
              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.25 capitalize px-2.5">
                  {data.tags.map((tag, index) => (
                    <span
                      key={`${data.id}-${tag}-${index}`}
                      className="inline-flex items-center justify-center py-1.25 px-2.5 rounded border text/20 text/15 font-inherit text-caption font-normal leading-normal whitespace-nowrap capitalize text"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {/* The Logo box from StartupListCard was removed here as authors typically don't have secondary square logos in this position. */}
          </div>
          
          {/* Description & Meta */}
          <div className="px-2.5 pb-2.5 flex flex-col gap-2">
            <p className="m-0 text-secondary font-body leading-normal line-clamp-2">
              {data.description}
            </p>
            <div className="flex items-center justify-between text-caption text-secondary mt-1">
              <span>{data.author}</span>
              <time dateTime={data.pubDatetime.toString()}>{formattedDate}</time>
            </div>
          </div>
          
        </div>
      </article>
    </a>
  );
}