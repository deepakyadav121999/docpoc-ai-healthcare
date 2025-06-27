import Link from "next/link";

interface BreadcrumbProps {
  pageName: string;
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
  const parts = pageName.split("/");
  const isNested = parts.length > 1;

  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {pageName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li>
            <Link className="font-medium" href="/">
              Dashboard /
            </Link>
          </li>
          {isNested ? (
            parts.map((part, index) => {
              const href = "/" + parts.slice(0, index + 1).join("/");
              return (
                <li key={index}>
                  {index < parts.length - 1 ? (
                    <>
                      <Link className="font-medium" href={href}>
                        {part} /
                      </Link>
                    </>
                  ) : (
                    <span className="font-medium text-primary">{part}</span>
                  )}
                </li>
              );
            })
          ) : (
            <li className="font-medium text-primary">{pageName}</li>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
