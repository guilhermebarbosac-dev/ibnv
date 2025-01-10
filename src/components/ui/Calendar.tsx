import * as React from 'react';
import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      className={cn(
        "flex flex-col justify-center items-center p-4 w-full",
        "rdp-day_selected:bg-black rdp-day_selected:text-white rdp-day_selected:hover:bg-black/90",
        "rdp-day_today:bg-accent rdp-day_today:text-accent-foreground",
        className
      )}
      classNames={{
        months: "grid grid-cols-1 sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "w-full space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium flex items-center space-x-2", // Adjusted to include space for buttons
        nav: "space-x-1 flex items-center",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        nav_button_previous: "text-black", // Removed absolute positioning
        nav_button_next: "text-black", // Removed absolute positioning
        table: "w-full border-collapse",
        head_row: "grid grid-cols-7 w-full",
        head_cell: "text-muted-foreground rounded-md font-normal text-[0.8rem] text-center",
        row: "grid grid-cols-7 w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md mx-auto",
        day_selected: "bg-black text-primary-foreground hover:bg-black hover:text-primary-foreground focus:bg-black focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      formatters={{
        formatWeekdayName: (weekday) => {
          const weekdays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
          return weekdays[weekday.getDay()];
        }
      }}
      {...props}
    />
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
} 