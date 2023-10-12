import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  additionalClasses?: string;
  otherOpts?: Record<string, any>;
}

export const ContainerLayout = ({
  children,
  additionalClasses,
  otherOpts,
}: LayoutProps) => {
  return (
    <div
      {...otherOpts}
      className={cn(
        "container md:grid md:grid-cols-3 md:gap-4 lg:max-w-5xl lg:gap-8",
        additionalClasses,
      )}
    >
      {children}
    </div>
  );
};

export const LeftLayout = ({
  children,
  additionalClasses,
  otherOpts,
}: LayoutProps) => {
  return (
    <main
      className={cn("mt-8 md:col-span-2 md:mt-0", additionalClasses)}
      {...otherOpts}
    >
      {children}
    </main>
  );
};

export const RightLayout = ({
  children,
  additionalClasses,
  otherOpts,
}: LayoutProps) => {
  return (
    <div
      className={cn(
        "h-fit rounded-md border bg-white p-4 md:order-last md:col-span-1",
        additionalClasses,
      )}
      {...otherOpts}
    >
      {children}
    </div>
  );
};
