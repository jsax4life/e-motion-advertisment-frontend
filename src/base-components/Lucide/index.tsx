import * as lucideIcons from "lucide-react";
import clsx from "clsx";

export const { ...icons } = lucideIcons;

type Icon = keyof typeof icons;

interface LucideProps extends React.ComponentPropsWithoutRef<"svg"> {
  icon: Icon;
  title?: string;
}

function Lucide(props: LucideProps) {
  const { icon, className, ...computedProps } = props;
  // const Component = lucideIcons[props.icon];
  const Component = icons[icon] as React.ElementType;

  return (
    <Component
      {...computedProps}
      className={clsx(["stroke-1.5", props.className])}
    />
  );
}

export default Lucide;
