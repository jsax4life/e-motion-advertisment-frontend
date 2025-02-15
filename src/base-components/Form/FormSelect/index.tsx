import { useContext } from "react";
import { formInlineContext } from "../FormInline";
import { twMerge } from "tailwind-merge";
import { forwardRef } from "react"; // Import forwardRef

interface FormSelectProps extends React.ComponentPropsWithoutRef<"select"> {
  formSelectSize?: "sm" | "lg";

}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (props, ref) => {
  const formInline = useContext(formInlineContext);
  const { formSelectSize,  ...computedProps } = props;


  return (
    <select
      {...computedProps}
      ref={ref} // Forward the ref here
      className={twMerge([
        "disabled:bg-slate-200 disabled:cursor-not-allowed disabled:dark:bg-darkmode-800/50",
        "[&[readonly]]:bg-slate-200 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50",
        "transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-lg py-2 px-3 pr-8 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50",
        props.formSelectSize == "sm" && "text-xs py-1.5 pl-2 pr-8",
        props.formSelectSize == "lg" && "text-sm py-3.5 pl-2 pr-8 ",
        formInline && "flex-1",
        props.className,
      ])}
    >
      {props.children}
    </select>
  );
}
)

export default FormSelect;
